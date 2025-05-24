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
