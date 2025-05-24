const User = require('../models/user.model');
const Product = require('../models/product.model');
const Order = require('../models/order.model');
const Review = require('../models/review.model');
const Category = require('../models/category.model');

/**
 * Statistics Service
 * This service provides methods to generate statistics for dashboards
 */
class StatsService {
  /**
   * Get admin dashboard statistics
   * @param {Object} options - Options
   * @param {string} options.period - Time period (day, week, month, year)
   * @returns {Promise<Object>} Dashboard statistics
   */
  static async getAdminStats({ period = 'week' }) {
    try {
      // Set date filter based on period
      const dateFilter = this.getDateFilter(period);

      // Get user stats
      const [
        totalUsers,
        newUsers,
        usersByRole
      ] = await Promise.all([
        User.countDocuments(),
        User.countDocuments(dateFilter),
        User.aggregate([
          {
            $group: {
              _id: '$role',
              count: { $sum: 1 }
            }
          }
        ])
      ]);

      // Format user counts
      const userCounts = {
        total: totalUsers,
        new: newUsers,
        buyer: 0,
        seller: 0,
        admin: 0,
        super_admin: 0
      };

      usersByRole.forEach(role => {
        userCounts[role._id] = role.count;
      });

      // Get product stats
      const [
        totalProducts,
        newProducts,
        productsByStatus
      ] = await Promise.all([
        Product.countDocuments(),
        Product.countDocuments(dateFilter),
        Product.aggregate([
          {
            $group: {
              _id: '$status',
              count: { $sum: 1 }
            }
          }
        ])
      ]);

      // Format product counts
      const productCounts = {
        total: totalProducts,
        new: newProducts,
        approved: 0,
        pending: 0,
        rejected: 0,
        draft: 0
      };

      productsByStatus.forEach(status => {
        productCounts[status._id] = status.count;
      });

      // Get order stats
      const [
        totalOrders,
        newOrders,
        ordersByStatus,
        totalRevenue,
        periodRevenue
      ] = await Promise.all([
        Order.countDocuments(),
        Order.countDocuments(dateFilter),
        Order.aggregate([
          {
            $group: {
              _id: '$status',
              count: { $sum: 1 }
            }
          }
        ]),
        Order.aggregate([
          {
            $match: {
              'paymentInfo.status': 'completed'
            }
          },
          {
            $group: {
              _id: null,
              total: { $sum: '$total' }
            }
          }
        ]),
        Order.aggregate([
          {
            $match: {
              ...dateFilter,
              'paymentInfo.status': 'completed'
            }
          },
          {
            $group: {
              _id: null,
              total: { $sum: '$total' }
            }
          }
        ])
      ]);

      // Format order counts
      const orderCounts = {
        total: totalOrders,
        new: newOrders,
        pending: 0,
        processing: 0,
        shipped: 0,
        delivered: 0,
        cancelled: 0
      };

      ordersByStatus.forEach(status => {
        orderCounts[status._id] = status.count;
      });

      // Get revenue
      const revenue = {
        total: totalRevenue.length > 0 ? totalRevenue[0].total : 0,
        period: periodRevenue.length > 0 ? periodRevenue[0].total : 0
      };

      // Get top selling products
      const topProducts = await Order.aggregate([
        {
          $match: {
            'paymentInfo.status': 'completed'
          }
        },
        {
          $unwind: '$items'
        },
        {
          $group: {
            _id: '$items.product',
            name: { $first: '$items.name' },
            totalSold: { $sum: '$items.quantity' },
            totalRevenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } }
          }
        },
        {
          $sort: { totalSold: -1 }
        },
        {
          $limit: 5
        },
        {
          $lookup: {
            from: 'products',
            localField: '_id',
            foreignField: '_id',
            as: 'productDetails'
          }
        },
        {
          $unwind: {
            path: '$productDetails',
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $project: {
            _id: 1,
            name: 1,
            totalSold: 1,
            totalRevenue: 1,
            image: {
              $cond: {
                if: { $gt: [{ $size: '$productDetails.images' }, 0] },
                then: { $arrayElemAt: ['$productDetails.images.url', 0] },
                else: null
              }
            }
          }
        }
      ]);

      // Get top categories
      const topCategories = await Order.aggregate([
        {
          $match: {
            'paymentInfo.status': 'completed'
          }
        },
        {
          $unwind: '$items'
        },
        {
          $lookup: {
            from: 'products',
            localField: 'items.product',
            foreignField: '_id',
            as: 'product'
          }
        },
        {
          $unwind: {
            path: '$product',
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $group: {
            _id: '$product.category',
            totalSold: { $sum: '$items.quantity' },
            totalRevenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } }
          }
        },
        {
          $lookup: {
            from: 'categories',
            localField: '_id',
            foreignField: '_id',
            as: 'category'
          }
        },
        {
          $unwind: {
            path: '$category',
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $project: {
            _id: 1,
            name: '$category.name',
            totalSold: 1,
            totalRevenue: 1
          }
        },
        {
          $sort: { totalRevenue: -1 }
        },
        {
          $limit: 5
        }
      ]);

      // Get recent orders
      const recentOrders = await Order.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .populate({
          path: 'user',
          select: 'name email'
        });

      // Get sales by day for the period
      const salesByDay = await Order.aggregate([
        {
          $match: {
            ...dateFilter,
            'paymentInfo.status': 'completed'
          }
        },
        {
          $group: {
            _id: {
              $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
            },
            orders: { $sum: 1 },
            revenue: { $sum: '$total' }
          }
        },
        {
          $sort: { _id: 1 }
        }
      ]);

      return {
        users: userCounts,
        products: productCounts,
        orders: orderCounts,
        revenue,
        topProducts,
        topCategories,
        recentOrders,
        salesByDay
      };
    } catch (error) {
      console.error('Error getting admin stats:', error);
      throw error;
    }
  }

  /**
   * Get seller dashboard statistics
   * @param {Object} options - Options
   * @param {string} options.sellerId - Seller ID
   * @param {string} options.period - Time period (day, week, month, year)
   * @returns {Promise<Object>} Dashboard statistics
   */
  static async getSellerStats({ sellerId, period = 'week' }) {
    try {
      // Set date filter based on period
      const dateFilter = this.getDateFilter(period);

      // Get product stats
      const [
        totalProducts,
        newProducts,
        productsByStatus
      ] = await Promise.all([
        Product.countDocuments({ seller: sellerId }),
        Product.countDocuments({ ...dateFilter, seller: sellerId }),
        Product.aggregate([
          {
            $match: { seller: sellerId }
          },
          {
            $group: {
              _id: '$status',
              count: { $sum: 1 }
            }
          }
        ])
      ]);

      // Format product counts
      const productCounts = {
        total: totalProducts,
        new: newProducts,
        approved: 0,
        pending: 0,
        rejected: 0,
        draft: 0
      };

      productsByStatus.forEach(status => {
        productCounts[status._id] = status.count;
      });

      // Get order stats for seller's products
      const [
        totalOrders,
        newOrders,
        ordersByStatus,
        totalRevenue,
        periodRevenue
      ] = await Promise.all([
        Order.countDocuments({ 'items.seller': sellerId }),
        Order.countDocuments({ ...dateFilter, 'items.seller': sellerId }),
        Order.aggregate([
          {
            $match: { 'items.seller': sellerId }
          },
          {
            $group: {
              _id: '$status',
              count: { $sum: 1 }
            }
          }
        ]),
        Order.aggregate([
          {
            $match: {
              'items.seller': sellerId,
              'paymentInfo.status': 'completed'
            }
          },
          {
            $unwind: '$items'
          },
          {
            $match: {
              'items.seller': sellerId
            }
          },
          {
            $group: {
              _id: null,
              total: { $sum: { $multiply: ['$items.price', '$items.quantity'] } }
            }
          }
        ]),
        Order.aggregate([
          {
            $match: {
              ...dateFilter,
              'items.seller': sellerId,
              'paymentInfo.status': 'completed'
            }
          },
          {
            $unwind: '$items'
          },
          {
            $match: {
              'items.seller': sellerId
            }
          },
          {
            $group: {
              _id: null,
              total: { $sum: { $multiply: ['$items.price', '$items.quantity'] } }
            }
          }
        ])
      ]);

      // Format order counts
      const orderCounts = {
        total: totalOrders,
        new: newOrders,
        pending: 0,
        processing: 0,
        shipped: 0,
        delivered: 0,
        cancelled: 0
      };

      ordersByStatus.forEach(status => {
        orderCounts[status._id] = status.count;
      });

      // Get revenue
      const revenue = {
        total: totalRevenue.length > 0 ? totalRevenue[0].total : 0,
        period: periodRevenue.length > 0 ? periodRevenue[0].total : 0
      };

      // Get top selling products for this seller
      const topProducts = await Order.aggregate([
        {
          $match: {
            'items.seller': sellerId,
            'paymentInfo.status': 'completed'
          }
        },
        {
          $unwind: '$items'
        },
        {
          $match: {
            'items.seller': sellerId
          }
        },
        {
          $group: {
            _id: '$items.product',
            name: { $first: '$items.name' },
            totalSold: { $sum: '$items.quantity' },
            totalRevenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } }
          }
        },
        {
          $sort: { totalSold: -1 }
        },
        {
          $limit: 5
        },
        {
          $lookup: {
            from: 'products',
            localField: '_id',
            foreignField: '_id',
            as: 'productDetails'
          }
        },
        {
          $unwind: {
            path: '$productDetails',
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $project: {
            _id: 1,
            name: 1,
            totalSold: 1,
            totalRevenue: 1,
            image: {
              $cond: {
                if: { $gt: [{ $size: '$productDetails.images' }, 0] },
                then: { $arrayElemAt: ['$productDetails.images.url', 0] },
                else: null
              }
            }
          }
        }
      ]);

      // Get recent orders for this seller
      const recentOrders = await Order.find({ 'items.seller': sellerId })
        .sort({ createdAt: -1 })
        .limit(5)
        .populate({
          path: 'user',
          select: 'name email'
        });

      // Get sales by day for the period
      const salesByDay = await Order.aggregate([
        {
          $match: {
            ...dateFilter,
            'items.seller': sellerId,
            'paymentInfo.status': 'completed'
          }
        },
        {
          $unwind: '$items'
        },
        {
          $match: {
            'items.seller': sellerId
          }
        },
        {
          $group: {
            _id: {
              $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
            },
            orders: { $sum: 1 },
            revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } }
          }
        },
        {
          $sort: { _id: 1 }
        }
      ]);

      // Get review stats
      const reviews = await Review.find({
        product: { $in: await Product.find({ seller: sellerId }).distinct('_id') }
      });

      const reviewStats = {
        total: reviews.length,
        average: reviews.length > 0 ? 
          reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length : 0,
        distribution: {
          1: reviews.filter(review => review.rating === 1).length,
          2: reviews.filter(review => review.rating === 2).length,
          3: reviews.filter(review => review.rating === 3).length,
          4: reviews.filter(review => review.rating === 4).length,
          5: reviews.filter(review => review.rating === 5).length
        }
      };

      return {
        products: productCounts,
        orders: orderCounts,
        revenue,
        topProducts,
        recentOrders,
        salesByDay,
        reviews: reviewStats
      };
    } catch (error) {
      console.error('Error getting seller stats:', error);
      throw error;
    }
  }

  /**
   * Get buyer dashboard statistics
   * @param {Object} options - Options
   * @param {string} options.buyerId - Buyer ID
   * @returns {Promise<Object>} Dashboard statistics
   */
  static async getBuyerStats({ buyerId }) {
    try {
      // Get order stats
      const [
        totalOrders,
        ordersByStatus,
        totalSpent
      ] = await Promise.all([
        Order.countDocuments({ user: buyerId }),
        Order.aggregate([
          {
            $match: { user: buyerId }
          },
          {
            $group: {
              _id: '$status',
              count: { $sum: 1 }
            }
          }
        ]),
        Order.aggregate([
          {
            $match: {
              user: buyerId,
              'paymentInfo.status': 'completed'
            }
          },
          {
            $group: {
              _id: null,
              total: { $sum: '$total' }
            }
          }
        ])
      ]);

      // Format order counts
      const orderCounts = {
        total: totalOrders,
        pending: 0,
        processing: 0,
        shipped: 0,
        delivered: 0,
        cancelled: 0
      };

      ordersByStatus.forEach(status => {
        orderCounts[status._id] = status.count;
      });

      // Get recent orders
      const recentOrders = await Order.find({ user: buyerId })
        .sort({ createdAt: -1 })
        .limit(5);

      // Get wishlist count
      const user = await User.findById(buyerId).select('wishlist');
      const wishlistCount = user.wishlist ? user.wishlist.length : 0;

      // Get review count
      const reviewCount = await Review.countDocuments({ user: buyerId });

      return {
        orders: orderCounts,
        totalSpent: totalSpent.length > 0 ? totalSpent[0].total : 0,
        recentOrders,
        wishlistCount,
        reviewCount
      };
    } catch (error) {
      console.error('Error getting buyer stats:', error);
      throw error;
    }
  }

  /**
   * Get super admin dashboard statistics
   * @param {Object} options - Options
   * @param {string} options.period - Time period (day, week, month, year)
   * @returns {Promise<Object>} Dashboard statistics
   */
  static async getSuperAdminStats({ period = 'week' }) {
    try {
      // Get admin stats first
      const adminStats = await this.getAdminStats({ period });

      // Additional super admin specific stats
      const [
        totalCategories,
        totalReviews,
        reviewsByRating
      ] = await Promise.all([
        Category.countDocuments(),
        Review.countDocuments(),
        Review.aggregate([
          {
            $group: {
              _id: '$rating',
              count: { $sum: 1 }
            }
          }
        ])
      ]);

      // Format review counts
      const reviewCounts = {
        total: totalReviews,
        average: 0,
        distribution: {
          1: 0,
          2: 0,
          3: 0,
          4: 0,
          5: 0
        }
      };

      let totalRating = 0;
      reviewsByRating.forEach(rating => {
        reviewCounts.distribution[rating._id] = rating.count;
        totalRating += rating._id * rating.count;
      });

      reviewCounts.average = totalReviews > 0 ? totalRating / totalReviews : 0;

      // Get monthly revenue for the past year
      const monthlyRevenue = await Order.aggregate([
        {
          $match: {
            'paymentInfo.status': 'completed',
            createdAt: {
              $gte: new Date(new Date().setFullYear(new Date().getFullYear() - 1))
            }
          }
        },
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' }
            },
            revenue: { $sum: '$total' },
            orders: { $sum: 1 }
          }
        },
        {
          $sort: { '_id.year': 1, '_id.month': 1 }
        }
      ]);

      // Format monthly revenue
      const formattedMonthlyRevenue = monthlyRevenue.map(item => ({
        year: item._id.year,
        month: item._id.month,
        revenue: item.revenue,
        orders: item.orders
      }));

      // Get top sellers
      const topSellers = await Order.aggregate([
        {
          $match: {
            'paymentInfo.status': 'completed'
          }
        },
        {
          $unwind: '$items'
        },
        {
          $group: {
            _id: '$items.seller',
            totalSales: { $sum: '$items.quantity' },
            totalRevenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } }
          }
        },
        {
          $sort: { totalRevenue: -1 }
        },
        {
          $limit: 5
        },
        {
          $lookup: {
            from: 'users',
            localField: '_id',
            foreignField: '_id',
            as: 'sellerDetails'
          }
        },
        {
          $unwind: {
            path: '$sellerDetails',
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $project: {
            _id: 1,
            name: '$sellerDetails.name',
            businessName: '$sellerDetails.sellerInfo.businessName',
            totalSales: 1,
            totalRevenue: 1
          }
        }
      ]);

      return {
        ...adminStats,
        categories: {
          total: totalCategories
        },
        reviews: reviewCounts,
        monthlyRevenue: formattedMonthlyRevenue,
        topSellers
      };
    } catch (error) {
      console.error('Error getting super admin stats:', error);
      throw error;
    }
  }

  /**
   * Get date filter based on period
   * @param {string} period - Time period (day, week, month, year)
   * @returns {Object} Date filter
   */
  static getDateFilter(period) {
    const now = new Date();
    let dateFilter = {};

    switch (period) {
      case 'day':
        dateFilter = {
          createdAt: {
            $gte: new Date(now.setHours(0, 0, 0, 0))
          }
        };
        break;
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
        // Default to week
        dateFilter = {
          createdAt: {
            $gte: new Date(now.setDate(now.getDate() - 7))
          }
        };
    }

    return dateFilter;
  }
}

module.exports = StatsService;
