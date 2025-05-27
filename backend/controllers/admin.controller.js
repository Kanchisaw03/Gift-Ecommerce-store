const User = require('../models/user.model');
const Product = require('../models/product.model');
const Order = require('../models/order.model');
const Review = require('../models/review.model');
const AuditLog = require('../models/auditLog.model');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc    Get admin dashboard stats
// @route   GET /api/admin/dashboard
// @access  Private (Admin)
exports.getDashboardStats = asyncHandler(async (req, res, next) => {
  // Get total users count
  const totalUsers = await User.countDocuments({ role: 'buyer' });
  
  // Get total sellers count
  const totalSellers = await User.countDocuments({ role: 'seller' });
  
  // Get total products count
  const totalProducts = await Product.countDocuments();
  
  // Get pending products count
  const pendingProducts = await Product.countDocuments({ status: 'pending' });
  
  // Get total orders count
  const totalOrders = await Order.countDocuments();
  
  // Get total revenue
  const orders = await Order.find({ 'paymentInfo.status': 'completed' });
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  
  // Get pending reviews count
  const pendingReviews = await Review.countDocuments({ status: 'pending' });
  
  // Get recent users
  const recentUsers = await User.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .select('name email role createdAt');
  
  // Get recent orders
  const recentOrders = await Order.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .populate({
      path: 'user',
      select: 'name email'
    });
  
  // Get pending products
  const pendingProductsList = await Product.find({ status: 'pending' })
    .sort({ createdAt: -1 })
    .limit(5)
    .populate({
      path: 'seller',
      select: 'name email sellerInfo.businessName'
    });

  res.status(200).json({
    success: true,
    data: {
      totalUsers,
      totalSellers,
      totalProducts,
      pendingProducts,
      totalOrders,
      totalRevenue,
      pendingReviews,
      recentUsers,
      recentOrders,
      pendingProductsList
    }
  });
});

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private (Admin)
exports.getUsers = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc    Get single user
// @route   GET /api/admin/users/:id
// @access  Private (Admin)
exports.getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorResponse(`User not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc    Create user
// @route   POST /api/admin/users
// @access  Private (Admin)
exports.createUser = asyncHandler(async (req, res, next) => {
  const user = await User.create(req.body);

  // Log the action
  await AuditLog.create({
    user: req.user.id,
    action: 'create',
    resourceType: 'user',
    resourceId: user._id,
    description: `Created new user: ${user.name} (${user.email}) with role ${user.role}`,
    newState: req.body,
    ipAddress: req.ip,
    userAgent: req.headers['user-agent']
  });

  res.status(201).json({
    success: true,
    data: user
  });
});

// @desc    Update user
// @route   PUT /api/admin/users/:id
// @access  Private (Admin)
exports.updateUser = asyncHandler(async (req, res, next) => {
  // Get user before update for audit log
  const prevUser = await User.findById(req.params.id);

  if (!prevUser) {
    return next(
      new ErrorResponse(`User not found with id of ${req.params.id}`, 404)
    );
  }

  // Prevent admin from changing super_admin role unless they are super_admin
  if (
    prevUser.role === 'super_admin' && 
    req.body.role && 
    req.body.role !== 'super_admin' && 
    req.user.role !== 'super_admin'
  ) {
    return next(
      new ErrorResponse('Not authorized to change super admin role', 403)
    );
  }

  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  // Log the action
  await AuditLog.create({
    user: req.user.id,
    action: 'update',
    resourceType: 'user',
    resourceId: user._id,
    description: `Updated user: ${user.name} (${user.email})`,
    prevState: prevUser.toObject(),
    newState: user.toObject(),
    ipAddress: req.ip,
    userAgent: req.headers['user-agent']
  });

  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin)
exports.deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorResponse(`User not found with id of ${req.params.id}`, 404)
    );
  }

  // Prevent deleting super_admin unless you are super_admin
  if (user.role === 'super_admin' && req.user.role !== 'super_admin') {
    return next(
      new ErrorResponse('Not authorized to delete super admin', 403)
    );
  }

  await user.remove();

  // Log the action
  await AuditLog.create({
    user: req.user.id,
    action: 'delete',
    resourceType: 'user',
    resourceId: user._id,
    description: `Deleted user: ${user.name} (${user.email})`,
    prevState: user.toObject(),
    ipAddress: req.ip,
    userAgent: req.headers['user-agent']
  });

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Get pending products
// @route   GET /api/admin/products/pending
// @access  Private (Admin)
exports.getPendingProducts = asyncHandler(async (req, res, next) => {
  const products = await Product.find({ status: 'pending' })
    .sort({ createdAt: -1 })
    .populate({
      path: 'seller',
      select: 'name email sellerInfo.businessName'
    })
    .populate('category');

  res.status(200).json({
    success: true,
    count: products.length,
    data: products
  });
});

// @desc    Get pending reviews
// @route   GET /api/admin/reviews/pending
// @access  Private (Admin)
exports.getPendingReviews = asyncHandler(async (req, res, next) => {
  const reviews = await Review.find({ status: 'pending' })
    .sort({ createdAt: -1 })
    .populate({
      path: 'user',
      select: 'name email avatar'
    })
    .populate({
      path: 'product',
      select: 'name images'
    });

  res.status(200).json({
    success: true,
    count: reviews.length,
    data: reviews
  });
});

// @desc    Get all sellers
// @route   GET /api/admin/sellers
// @access  Private (Admin)
exports.getSellers = asyncHandler(async (req, res, next) => {
  const sellers = await User.find({ role: 'seller' })
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: sellers.length,
    data: sellers
  });
});

// @desc    Approve seller
// @route   PUT /api/admin/sellers/:id/approve
// @access  Private (Admin)
exports.approveSeller = asyncHandler(async (req, res, next) => {
  const seller = await User.findById(req.params.id);

  if (!seller) {
    return next(
      new ErrorResponse(`Seller not found with id of ${req.params.id}`, 404)
    );
  }

  if (seller.role !== 'seller') {
    return next(
      new ErrorResponse(`User with id ${req.params.id} is not a seller`, 400)
    );
  }

  // Update seller approval status
  seller.sellerInfo.isApproved = true;
  await seller.save();

  // Log the action
  await AuditLog.create({
    user: req.user.id,
    action: 'approve',
    resourceType: 'user',
    resourceId: seller._id,
    description: `Approved seller: ${seller.name} (${seller.email})`,
    prevState: { isApproved: false },
    newState: { isApproved: true },
    ipAddress: req.ip,
    userAgent: req.headers['user-agent']
  });

  res.status(200).json({
    success: true,
    data: seller
  });
});

// @desc    Reject seller
// @route   PUT /api/admin/sellers/:id/reject
// @access  Private (Admin)
exports.rejectSeller = asyncHandler(async (req, res, next) => {
  const seller = await User.findById(req.params.id);

  if (!seller) {
    return next(
      new ErrorResponse(`Seller not found with id of ${req.params.id}`, 404)
    );
  }

  if (seller.role !== 'seller') {
    return next(
      new ErrorResponse(`User with id ${req.params.id} is not a seller`, 400)
    );
  }

  // Update seller approval status
  seller.sellerInfo.isApproved = false;
  await seller.save();

  // Log the action
  await AuditLog.create({
    user: req.user.id,
    action: 'reject',
    resourceType: 'user',
    resourceId: seller._id,
    description: `Rejected seller: ${seller.name} (${seller.email})`,
    prevState: { isApproved: true },
    newState: { isApproved: false },
    ipAddress: req.ip,
    userAgent: req.headers['user-agent']
  });

  res.status(200).json({
    success: true,
    data: seller
  });
});

// @desc    Get all orders for admin
// @route   GET /api/admin/orders
// @access  Private (Admin)
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
  
  // Create pagination object
  const pagination = {
    page,
    limit,
    total,
    pages: totalPages
  };

  console.log('Sending admin orders response:', {
    success: true,
    count: orders.length,
    pagination,
    data: orders
  });
  
  res.status(200).json({
    success: true,
    count: orders.length,
    pagination,
    data: orders
  });
});

// @desc    Get order details for admin
// @route   GET /api/admin/orders/:id
// @access  Private (Admin)
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

// @desc    Update order status as admin
// @route   PUT /api/admin/orders/:id/status
// @access  Private (Admin)
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
  const OrderTimeline = require('../models/orderTimeline.model');
  await OrderTimeline.create({
    order: order._id,
    status,
    description: notes || `Order status updated to ${status} by admin`,
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

// @desc    Get sales analytics
// @route   GET /api/admin/analytics/sales
// @access  Private (Admin)
exports.getSalesAnalytics = asyncHandler(async (req, res, next) => {
  const { period } = req.query;
  let dateFilter = {};
  const now = new Date();

  // Set date filter based on period
  switch (period) {
    case 'week':
      dateFilter = {
        createdAt: {
          $gte: new Date(now.setDate(now.getDate() - 7))
        }
      };
      break;
    case 'month':
      dateFilter = {
        createdAt: {
          $gte: new Date(now.setMonth(now.getMonth() - 1))
        }
      };
      break;
    case 'year':
      dateFilter = {
        createdAt: {
          $gte: new Date(now.setFullYear(now.getFullYear() - 1))
        }
      };
      break;
    default:
      // No filter, get all-time data
      break;
  }

  // Get orders with completed payments
  const orders = await Order.find({
    ...dateFilter,
    'paymentInfo.status': 'completed'
  });

  // Calculate total revenue
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);

  // Calculate total orders
  const totalOrders = orders.length;

  // Calculate average order value
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  // Get top selling products
  const productSales = {};
  orders.forEach(order => {
    order.items.forEach(item => {
      if (!productSales[item.product]) {
        productSales[item.product] = {
          quantity: item.quantity,
          revenue: item.price * item.quantity
        };
      } else {
        productSales[item.product].quantity += item.quantity;
        productSales[item.product].revenue += item.price * item.quantity;
      }
    });
  });

  // Convert to array and sort by quantity
  const topProducts = Object.entries(productSales)
    .map(([productId, data]) => ({
      productId,
      ...data
    }))
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5);

  // Get product details for top products
  const topProductsWithDetails = await Promise.all(
    topProducts.map(async product => {
      const productDetails = await Product.findById(product.productId)
        .select('name images');
      
      return {
        ...product,
        name: productDetails ? productDetails.name : 'Unknown Product',
        image: productDetails && productDetails.images.length > 0 
          ? productDetails.images[0].url 
          : null
      };
    })
  );

  // Get sales by category
  const categorySales = {};
  await Promise.all(
    orders.map(async order => {
      await Promise.all(
        order.items.map(async item => {
          const product = await Product.findById(item.product)
            .populate('category', 'name');
          
          if (product && product.category) {
            const categoryName = product.category.name;
            
            if (!categorySales[categoryName]) {
              categorySales[categoryName] = {
                quantity: item.quantity,
                revenue: item.price * item.quantity
              };
            } else {
              categorySales[categoryName].quantity += item.quantity;
              categorySales[categoryName].revenue += item.price * item.quantity;
            }
          }
        })
      );
    })
  );

  // Convert to array and sort by revenue
  const topCategories = Object.entries(categorySales)
    .map(([category, data]) => ({
      category,
      ...data
    }))
    .sort((a, b) => b.revenue - a.revenue);

  res.status(200).json({
    success: true,
    data: {
      totalRevenue,
      totalOrders,
      averageOrderValue,
      topProducts: topProductsWithDetails,
      categorySales: topCategories
    }
  });
});
