const Order = require('../models/order.model');
const Product = require('../models/product.model');
const Cart = require('../models/cart.model');
const User = require('../models/user.model');
const OrderTimeline = require('../models/orderTimeline.model');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const sendEmail = require('../utils/sendEmail');

// Valid order statuses
const VALID_STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
exports.createOrder = asyncHandler(async (req, res, next) => {
  const {
    items,
    shippingAddress,
    billingAddress,
    paymentInfo,
    subtotal,
    tax,
    shippingCost,
    discount,
    couponCode,
    total,
    notes,
    isGift,
    giftMessage
  } = req.body;

  // Validate items
  if (!items || items.length === 0) {
    return next(new ErrorResponse('Please add items to your order', 400));
  }

  // Validate addresses
  if (!shippingAddress || !billingAddress) {
    return next(new ErrorResponse('Please provide shipping and billing addresses', 400));
  }

  // Validate payment info
  if (!paymentInfo || !paymentInfo.method) {
    return next(new ErrorResponse('Please provide payment information', 400));
  }

  // Create order
  const order = await Order.create({
    user: req.user.id,
    items,
    shippingAddress,
    billingAddress,
    paymentInfo,
    subtotal,
    tax,
    shippingCost,
    discount,
    couponCode,
    total,
    notes,
    isGift,
    giftMessage
  });

  // Create order timeline entry
  await OrderTimeline.create({
    order: order._id,
    status: 'pending',
    description: 'Order placed successfully',
    user: req.user.id
  });

  // Update product stock and sold count
  for (const item of items) {
    const product = await Product.findById(item.product);
    
    if (product) {
      product.stock -= item.quantity;
      product.sold += item.quantity;
      await product.save();
    }
  }

  // Update buyer stats
  const buyer = await User.findById(req.user.id);
  if (buyer) {
    buyer.buyerInfo.totalOrders = (buyer.buyerInfo.totalOrders || 0) + 1;
    buyer.buyerInfo.totalSpent = (buyer.buyerInfo.totalSpent || 0) + total;
    await buyer.save();
  }

  // Update seller stats
  const sellerMap = {};
  for (const item of items) {
    if (!sellerMap[item.seller]) {
      sellerMap[item.seller] = {
        totalSales: item.quantity,
        totalRevenue: item.price * item.quantity
      };
    } else {
      sellerMap[item.seller].totalSales += item.quantity;
      sellerMap[item.seller].totalRevenue += item.price * item.quantity;
    }
  }

  for (const sellerId in sellerMap) {
    const seller = await User.findById(sellerId);
    if (seller) {
      seller.sellerInfo.totalSales = (seller.sellerInfo.totalSales || 0) + sellerMap[sellerId].totalSales;
      seller.sellerInfo.totalRevenue = (seller.sellerInfo.totalRevenue || 0) + sellerMap[sellerId].totalRevenue;
      await seller.save();
    }
  }

  // Clear user's cart
  await Cart.findOneAndDelete({ user: req.user.id });

  // Get user details for notifications
  const user = await User.findById(req.user.id).select('name email phone');

  // Send order confirmation notification (email, SMS, and in-app)
  try {
    const { orderConfirmationTemplate } = require('../utils/emailTemplates');
    const emailTemplate = orderConfirmationTemplate(order, user);
    
    const notificationService = require('../utils/notificationService');
    await notificationService.sendOrderConfirmation(order, user, emailTemplate);
    
    console.log(`Order confirmation notifications sent to user ${user._id}`);
  } catch (err) {
    console.error('Error sending order confirmation notifications:', err);
  }

  res.status(201).json({
    success: true,
    data: order
  });
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private
exports.getOrders = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
exports.getOrder = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id)
    .populate({
      path: 'user',
      select: 'name email'
    })
    .populate({
      path: 'items.product',
      select: 'name images category'
    })
    .populate({
      path: 'items.seller',
      select: 'name sellerInfo.businessName'
    })
    .populate('timeline');

  if (!order) {
    return next(
      new ErrorResponse(`Order not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is order owner or admin/seller
  if (
    order.user._id.toString() !== req.user.id &&
    req.user.role !== 'admin' &&
    req.user.role !== 'super_admin' &&
    !order.items.some(item => item.seller._id.toString() === req.user.id)
  ) {
    return next(
      new ErrorResponse(
        `User with ID ${req.user.id} is not authorized to view this order`,
        403
      )
    );
  }

  res.status(200).json({
    success: true,
    data: order
  });
});

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private (Admin, Seller)
exports.updateOrderStatus = asyncHandler(async (req, res, next) => {
  const { status, notes } = req.body;

  if (!status) {
    return next(new ErrorResponse('Please provide a status', 400));
  }

  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(
      new ErrorResponse(`Order not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is admin or seller of items in the order
  if (
    req.user.role !== 'admin' &&
    req.user.role !== 'super_admin' &&
    !order.items.some(item => item.seller.toString() === req.user.id)
  ) {
    return next(
      new ErrorResponse(
        `User with ID ${req.user.id} is not authorized to update this order`,
        403
      )
    );
  }

  // Update order status
  order.status = status;

  // Update specific fields based on status
  switch (status) {
    case 'processing':
      // No additional fields to update
      break;
    case 'shipped':
      order.trackingNumber = req.body.trackingNumber;
      order.carrier = req.body.carrier;
      order.estimatedDelivery = req.body.estimatedDelivery;
      break;
    case 'delivered':
      order.deliveredAt = Date.now();
      break;
    case 'cancelled':
      order.cancelledAt = Date.now();
      order.cancellationReason = req.body.cancellationReason;
      
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
      order.refundAmount = req.body.refundAmount || order.total;
      break;
    default:
      break;
  }

  await order.save();

  // Create order timeline entry
  await OrderTimeline.create({
    order: order._id,
    status,
    description: notes || `Order status updated to ${status}`,
    user: req.user.id
  });

  // Get user details for notifications
  const user = await User.findById(order.user).select('name email phone');

  // Send order status update notification (email, SMS, and in-app)
  try {
    const { orderStatusUpdateTemplate } = require('../utils/emailTemplates');
    const emailTemplate = orderStatusUpdateTemplate(order, user, status);
    
    const notificationService = require('../utils/notificationService');
    await notificationService.sendOrderStatusUpdate(order, user, status, emailTemplate);
    
    console.log(`Order status update notifications sent to user ${user._id}`);
  } catch (err) {
    console.error('Error sending order status update notifications:', err);
  }

  res.status(200).json({
    success: true,
    data: order
  });
});

// @desc    Add tracking information
// @route   PUT /api/orders/:id/tracking
// @access  Private (Admin, Seller)
exports.addTracking = asyncHandler(async (req, res, next) => {
  const { trackingNumber, carrier, estimatedDelivery } = req.body;

  if (!trackingNumber || !carrier) {
    return next(new ErrorResponse('Please provide tracking number and carrier', 400));
  }

  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(
      new ErrorResponse(`Order not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is admin or seller of items in the order
  if (
    req.user.role !== 'admin' &&
    req.user.role !== 'super_admin' &&
    !order.items.some(item => item.seller.toString() === req.user.id)
  ) {
    return next(
      new ErrorResponse(
        `User with ID ${req.user.id} is not authorized to update this order`,
        403
      )
    );
  }

  // Update tracking info
  order.trackingNumber = trackingNumber;
  order.carrier = carrier;
  order.estimatedDelivery = estimatedDelivery;
  
  // If order is not already shipped, update status to shipped
  if (order.status === 'pending' || order.status === 'processing') {
    order.status = 'shipped';
  }

  await order.save();

  // Create order timeline entry
  await OrderTimeline.create({
    order: order._id,
    status: 'tracking_added',
    description: `Tracking information added: ${carrier} - ${trackingNumber}`,
    user: req.user.id
  });

  // Send email notification to customer
  try {
    await sendEmail({
      email: order.user.email,
      subject: `Order ${order.orderNumber} - Tracking Information`,
      message: `Your order has been shipped! Tracking number: ${trackingNumber} (${carrier}). Estimated delivery: ${new Date(estimatedDelivery).toDateString()}`
    });
  } catch (err) {
    console.log('Error sending tracking information email:', err);
  }

  res.status(200).json({
    success: true,
    data: order
  });
});

// @desc    Get my orders
// @route   GET /api/orders/my-orders OR /api/orders/user
// @access  Private
exports.getMyOrders = asyncHandler(async (req, res, next) => {
  console.log(`Fetching orders for user: ${req.user.id}, role: ${req.user.role}`);
  
  try {
    // Set up pagination if query params are provided
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    
    // Build filter options
    const filterOptions = { user: req.user.id };
    
    // Add status filter if provided
    if (req.query.status && VALID_STATUSES.includes(req.query.status)) {
      filterOptions.status = req.query.status;
    }
    
    // Get total count for pagination
    const total = await Order.countDocuments(filterOptions);
    
    // Execute query with pagination
    const orders = await Order.find(filterOptions)
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(limit)
      .populate({
        path: 'items.product',
        select: 'name images price'
      })
      .populate({
        path: 'items.seller',
        select: 'name sellerInfo.businessName'
      });
    
    console.log(`Found ${orders.length} orders for user ${req.user.id}`);
    
    // Pagination result
    const pagination = {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    };
    
    res.status(200).json({
      success: true,
      count: orders.length,
      pagination,
      data: orders
    });
  } catch (err) {
    console.error(`Error fetching orders for user ${req.user.id}:`, err);
    return next(new ErrorResponse('Error fetching orders', 500));
  }
});

// @desc    Get seller orders
// @route   GET /api/orders/seller-orders
// @access  Private (Seller)
exports.getSellerOrders = asyncHandler(async (req, res, next) => {
  // Find orders where the seller is in the items.seller field
  const orders = await Order.find({
    'items.seller': req.user.id
  })
    .sort({ createdAt: -1 })
    .populate({
      path: 'user',
      select: 'name email'
    })
    .populate({
      path: 'items.product',
      select: 'name images'
    });

  res.status(200).json({
    success: true,
    count: orders.length,
    data: orders
  });
});
