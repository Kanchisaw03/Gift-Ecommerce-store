const User = require('../models/user.model');
const Product = require('../models/product.model');
const Order = require('../models/order.model');
const AuditLog = require('../models/auditLog.model');
const OrderTimeline = require('../models/orderTimeline.model');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const mongoose = require('mongoose');

// @desc    Get all orders for super admin
// @route   GET /api/super-admin/orders
// @access  Private (Super Admin)
exports.getAllOrders = asyncHandler(async (req, res, next) => {
  // Pagination parameters
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;
  
  // Filter parameters
  const filterOptions = {};
  
  // Add status filter if provided
  if (req.query.status && ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'].includes(req.query.status)) {
    filterOptions.status = req.query.status;
  }
  
  // Add date range filter if provided
  if (req.query.startDate && req.query.endDate) {
    filterOptions.createdAt = {
      $gte: new Date(req.query.startDate),
      $lte: new Date(req.query.endDate)
    };
  }
  
  // Add seller filter if provided
  if (req.query.seller) {
    filterOptions['items.seller'] = mongoose.Types.ObjectId(req.query.seller);
  }
  
  // Add search filter if provided (search by order number or customer name/email)
  if (req.query.search) {
    const searchRegex = new RegExp(req.query.search, 'i');
    
    // First, find users matching the search term
    const users = await User.find({
      $or: [
        { name: searchRegex },
        { email: searchRegex }
      ]
    }).select('_id');
    
    const userIds = users.map(user => user._id);
    
    // Then, add the filter for orderNumber or matching users
    filterOptions.$or = [
      { orderNumber: searchRegex },
      { user: { $in: userIds } }
    ];
  }
  
  // Execute query with pagination
  const orders = await Order.find(filterOptions)
    .sort({ createdAt: -1 })
    .skip(startIndex)
    .limit(limit)
    .populate({
      path: 'user',
      select: 'name email'
    })
    .populate({
      path: 'items.product',
      select: 'name images price'
    })
    .populate({
      path: 'items.seller',
      select: 'name sellerInfo.businessName'
    });
  
  // Get total count for pagination
  const total = await Order.countDocuments(filterOptions);
  
  // Calculate total pages
  const totalPages = Math.ceil(total / limit);
  
  res.status(200).json({
    success: true,
    count: orders.length,
    pagination: {
      page,
      limit,
      total,
      totalPages
    },
    data: orders
  });
});

// @desc    Get order details for super admin
// @route   GET /api/super-admin/orders/:id
// @access  Private (Super Admin)
exports.getOrderDetails = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id)
    .populate({
      path: 'user',
      select: 'name email phone'
    })
    .populate({
      path: 'items.product',
      select: 'name images price description'
    })
    .populate({
      path: 'items.seller',
      select: 'name email sellerInfo.businessName'
    })
    .populate('timeline');
  
  if (!order) {
    return next(
      new ErrorResponse(`Order not found with id of ${req.params.id}`, 404)
    );
  }
  
  res.status(200).json({
    success: true,
    data: order
  });
});

// @desc    Update order status as super admin
// @route   PUT /api/super-admin/orders/:id/status
// @access  Private (Super Admin)
exports.updateOrderStatus = asyncHandler(async (req, res, next) => {
  const { status, notes } = req.body;
  
  if (!status || !['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'].includes(status)) {
    return next(new ErrorResponse('Please provide a valid status', 400));
  }
  
  const order = await Order.findById(req.params.id);
  
  if (!order) {
    return next(
      new ErrorResponse(`Order not found with id of ${req.params.id}`, 404)
    );
  }
  
  // Update order status
  order.status = status;
  
  // Update specific fields based on status
  switch (status) {
    case 'shipped':
      if (req.body.trackingNumber) order.trackingNumber = req.body.trackingNumber;
      if (req.body.carrier) order.carrier = req.body.carrier;
      if (req.body.estimatedDelivery) order.estimatedDelivery = req.body.estimatedDelivery;
      break;
    case 'delivered':
      order.deliveredAt = Date.now();
      break;
    case 'cancelled':
      order.cancelledAt = Date.now();
      if (req.body.cancellationReason) order.cancellationReason = req.body.cancellationReason;
      
      // Restore product stock
      for (const item of order.items) {
        const product = await Product.findById(item.product);
        if (product) {
          product.stock += item.quantity;
          product.sold -= item.quantity;
          await product.save();
        }
      }
      break;
    case 'refunded':
      order.refundedAt = Date.now();
      if (req.body.refundAmount) order.refundAmount = req.body.refundAmount;
      break;
  }
  
  await order.save();
  
  // Create order timeline entry
  await OrderTimeline.create({
    order: order._id,
    status,
    description: notes || `Order status updated to ${status} by super admin`,
    user: req.user.id
  });
  
  // Send notification to customer
  try {
    const user = await User.findById(order.user).select('name email phone');
    
    if (user) {
      const { orderStatusUpdateTemplate } = require('../utils/emailTemplates');
      const emailTemplate = orderStatusUpdateTemplate(order, user, status);
      
      const notificationService = require('../utils/notificationService');
      await notificationService.sendOrderStatusUpdate(order, user, status, emailTemplate);
    }
  } catch (err) {
    console.error('Error sending order status update notification:', err);
  }
  
  // Log the action
  await AuditLog.create({
    user: req.user.id,
    action: 'update',
    resourceType: 'order',
    resourceId: order._id,
    description: `Updated order status to ${status}: Order #${order.orderNumber || order._id}`,
    prevState: { status: order.status },
    newState: { status },
    ipAddress: req.ip,
    userAgent: req.headers['user-agent']
  });
  
  res.status(200).json({
    success: true,
    data: order
  });
});
