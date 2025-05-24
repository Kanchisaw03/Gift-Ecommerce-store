const express = require('express');
const router = express.Router();

// Import middleware
const { protect, authorize } = require('../middleware/auth');
const asyncHandler = require('../middleware/async');

// Import models
const Product = require('../models/product.model');
const Order = require('../models/order.model');
const User = require('../models/user.model');
const Review = require('../models/review.model');

// @desc    Get sales analytics
// @route   GET /api/analytics/sales
// @access  Private (Admin, Super Admin)
const getSalesAnalytics = asyncHandler(async (req, res, next) => {
  const { period, startDate, endDate } = req.query;
  let dateFilter = {};
  const now = new Date();

  // Set date filter based on period or custom date range
  if (startDate && endDate) {
    dateFilter = {
      createdAt: {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    };
  } else {
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
        // Default to last 30 days
        dateFilter = {
          createdAt: {
            $gte: new Date(now.setDate(now.getDate() - 30))
          }
        };
        break;
    }
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

  // Get daily sales data
  const dailySales = {};
  
  orders.forEach(order => {
    const date = order.createdAt.toISOString().split('T')[0];
    
    if (!dailySales[date]) {
      dailySales[date] = {
        revenue: order.total,
        orders: 1
      };
    } else {
      dailySales[date].revenue += order.total;
      dailySales[date].orders += 1;
    }
  });
  
  // Convert to array and sort by date
  const salesByDay = Object.entries(dailySales)
    .map(([date, data]) => ({
      date,
      ...data
    }))
    .sort((a, b) => new Date(a.date) - new Date(b.date));

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
    .slice(0, 10);
  
  // Get product details for top products
  const topProductsWithDetails = await Promise.all(
    topProducts.map(async product => {
      const productDetails = await Product.findById(product.productId)
        .select('name images category')
        .populate('category', 'name');
      
      return {
        ...product,
        name: productDetails ? productDetails.name : 'Unknown Product',
        image: productDetails && productDetails.images.length > 0 
          ? productDetails.images[0].url 
          : null,
        category: productDetails && productDetails.category 
          ? productDetails.category.name 
          : 'Uncategorized'
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
                revenue: item.price * item.quantity,
                orders: 1
              };
            } else {
              categorySales[categoryName].quantity += item.quantity;
              categorySales[categoryName].revenue += item.price * item.quantity;
              categorySales[categoryName].orders += 1;
            }
          }
        })
      );
    })
  );

  // Convert to array and sort by revenue
  const salesByCategory = Object.entries(categorySales)
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
      salesByDay,
      topProducts: topProductsWithDetails,
      salesByCategory
    }
  });
});

// @desc    Get user analytics
// @route   GET /api/analytics/users
// @access  Private (Admin, Super Admin)
const getUserAnalytics = asyncHandler(async (req, res, next) => {
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
      // Default to last 30 days
      dateFilter = {
        createdAt: {
          $gte: new Date(now.setDate(now.getDate() - 30))
        }
      };
      break;
  }

  // Get user counts by role
  const usersByRole = await User.aggregate([
    {
      $group: {
        _id: '$role',
        count: { $sum: 1 }
      }
    }
  ]);

  // Format user counts
  const userCounts = {
    total: 0,
    buyer: 0,
    seller: 0,
    admin: 0,
    super_admin: 0
  };

  usersByRole.forEach(role => {
    userCounts[role._id] = role.count;
    userCounts.total += role.count;
  });

  // Get new users in period
  const newUsers = await User.find(dateFilter).countDocuments();

  // Get user registration by day
  const userRegistrations = await User.aggregate([
    {
      $match: dateFilter
    },
    {
      $group: {
        _id: {
          $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
        },
        count: { $sum: 1 }
      }
    },
    {
      $sort: { _id: 1 }
    }
  ]);

  // Format user registrations
  const usersByDay = userRegistrations.map(item => ({
    date: item._id,
    count: item.count
  }));

  // Get top buyers by total spent
  const topBuyers = await User.find({ role: 'buyer' })
    .sort({ 'buyerInfo.totalSpent': -1 })
    .limit(10)
    .select('name email buyerInfo.totalSpent buyerInfo.totalOrders');

  // Get top sellers by total revenue
  const topSellers = await User.find({ role: 'seller' })
    .sort({ 'sellerInfo.totalRevenue': -1 })
    .limit(10)
    .select('name email sellerInfo.businessName sellerInfo.totalRevenue sellerInfo.totalSales');

  res.status(200).json({
    success: true,
    data: {
      userCounts,
      newUsers,
      usersByDay,
      topBuyers,
      topSellers
    }
  });
});

// @desc    Get product analytics
// @route   GET /api/analytics/products
// @access  Private (Admin, Super Admin)
const getProductAnalytics = asyncHandler(async (req, res, next) => {
  // Get total products count
  const totalProducts = await Product.countDocuments();
  
  // Get products by status
  const productsByStatus = await Product.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);

  // Format products by status
  const statusCounts = {
    total: totalProducts,
    approved: 0,
    pending: 0,
    rejected: 0,
    draft: 0
  };

  productsByStatus.forEach(status => {
    statusCounts[status._id] = status.count;
  });

  // Get products by category
  const productsByCategory = await Product.aggregate([
    {
      $lookup: {
        from: 'categories',
        localField: 'category',
        foreignField: '_id',
        as: 'categoryData'
      }
    },
    {
      $unwind: '$categoryData'
    },
    {
      $group: {
        _id: '$categoryData.name',
        count: { $sum: 1 }
      }
    },
    {
      $sort: { count: -1 }
    }
  ]);

  // Get top rated products
  const topRatedProducts = await Product.find({ rating: { $gt: 0 } })
    .sort({ rating: -1 })
    .limit(10)
    .select('name images rating numReviews price')
    .populate('category', 'name');

  // Get most viewed products
  const mostViewedProducts = await Product.find({ views: { $gt: 0 } })
    .sort({ views: -1 })
    .limit(10)
    .select('name images views price')
    .populate('category', 'name');

  // Get products with low stock
  const lowStockProducts = await Product.find({ 
    stock: { $gt: 0, $lt: 10 },
    status: 'approved'
  })
    .sort({ stock: 1 })
    .limit(10)
    .select('name images stock price')
    .populate('seller', 'name sellerInfo.businessName');

  // Get out of stock products
  const outOfStockProducts = await Product.find({ 
    stock: 0,
    status: 'approved'
  })
    .limit(10)
    .select('name images price')
    .populate('seller', 'name sellerInfo.businessName');

  res.status(200).json({
    success: true,
    data: {
      statusCounts,
      productsByCategory,
      topRatedProducts,
      mostViewedProducts,
      lowStockProducts,
      outOfStockProducts
    }
  });
});

// @desc    Get review analytics
// @route   GET /api/analytics/reviews
// @access  Private (Admin, Super Admin)
const getReviewAnalytics = asyncHandler(async (req, res, next) => {
  // Get total reviews count
  const totalReviews = await Review.countDocuments();
  
  // Get reviews by status
  const reviewsByStatus = await Review.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);

  // Format reviews by status
  const statusCounts = {
    total: totalReviews,
    approved: 0,
    pending: 0,
    rejected: 0
  };

  reviewsByStatus.forEach(status => {
    statusCounts[status._id] = status.count;
  });

  // Get average rating
  const ratingData = await Review.aggregate([
    {
      $match: { status: 'approved' }
    },
    {
      $group: {
        _id: null,
        averageRating: { $avg: '$rating' },
        count: { $sum: 1 }
      }
    }
  ]);

  const averageRating = ratingData.length > 0 ? ratingData[0].averageRating : 0;

  // Get rating distribution
  const ratingDistribution = await Review.aggregate([
    {
      $match: { status: 'approved' }
    },
    {
      $group: {
        _id: '$rating',
        count: { $sum: 1 }
      }
    },
    {
      $sort: { _id: -1 }
    }
  ]);

  // Format rating distribution
  const ratingCounts = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0
  };

  ratingDistribution.forEach(rating => {
    ratingCounts[rating._id] = rating.count;
  });

  // Get recent reviews
  const recentReviews = await Review.find()
    .sort({ createdAt: -1 })
    .limit(10)
    .populate({
      path: 'user',
      select: 'name avatar'
    })
    .populate({
      path: 'product',
      select: 'name images'
    });

  res.status(200).json({
    success: true,
    data: {
      statusCounts,
      averageRating,
      ratingCounts,
      recentReviews
    }
  });
});

// Routes
router.route('/sales')
  .get(protect, authorize('admin', 'super_admin'), getSalesAnalytics);

router.route('/users')
  .get(protect, authorize('admin', 'super_admin'), getUserAnalytics);

router.route('/products')
  .get(protect, authorize('admin', 'super_admin'), getProductAnalytics);

router.route('/reviews')
  .get(protect, authorize('admin', 'super_admin'), getReviewAnalytics);

module.exports = router;
