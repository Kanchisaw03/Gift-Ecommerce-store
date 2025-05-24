const User = require('../models/user.model');
const Product = require('../models/product.model');
const Order = require('../models/order.model');
const AuditLog = require('../models/auditLog.model');
const Category = require('../models/category.model');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const mongoose = require('mongoose');

// @desc    Get super admin dashboard stats
// @route   GET /api/super-admin/dashboard
// @access  Private (Super Admin)
exports.getDashboardStats = asyncHandler(async (req, res, next) => {
  // Get total users count by role
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

  // Get platform statistics
  const totalProducts = await Product.countDocuments();
  const totalOrders = await Order.countDocuments();
  const totalRevenue = await Order.aggregate([
    {
      $match: { 'paymentInfo.status': 'completed' }
    },
    {
      $group: {
        _id: null,
        total: { $sum: '$total' }
      }
    }
  ]);

  // Get system health (mock data for now)
  const systemHealth = {
    serverLoad: 42.3, // percentage
    diskUsage: 68.4, // percentage
    memoryUsage: 54.2, // percentage
    averageResponseTime: 187, // ms
    uptime: process.uptime(),
    lastBackup: new Date(Date.now() - 24 * 60 * 60 * 1000) // 24 hours ago
  };

  // Get recent audit logs
  const recentAuditLogs = await AuditLog.find()
    .sort({ createdAt: -1 })
    .limit(10)
    .populate({
      path: 'user',
      select: 'name email role'
    });

  res.status(200).json({
    success: true,
    data: {
      userCounts,
      totalProducts,
      totalOrders,
      totalRevenue: totalRevenue.length > 0 ? totalRevenue[0].total : 0,
      systemHealth,
      recentAuditLogs
    }
  });
});

// @desc    Get all admins
// @route   GET /api/super-admin/admins
// @access  Private (Super Admin)
exports.getAdmins = asyncHandler(async (req, res, next) => {
  const admins = await User.find({ 
    role: { $in: ['admin', 'super_admin'] } 
  }).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: admins.length,
    data: admins
  });
});

// @desc    Create admin
// @route   POST /api/super-admin/admins
// @access  Private (Super Admin)
exports.createAdmin = asyncHandler(async (req, res, next) => {
  // Set role to admin
  req.body.role = 'admin';

  // Create admin
  const admin = await User.create(req.body);

  // Log the action
  await AuditLog.create({
    user: req.user.id,
    action: 'create',
    resourceType: 'user',
    resourceId: admin._id,
    description: `Created new admin: ${admin.name} (${admin.email})`,
    newState: req.body,
    ipAddress: req.ip,
    userAgent: req.headers['user-agent']
  });

  res.status(201).json({
    success: true,
    data: admin
  });
});

// @desc    Update admin
// @route   PUT /api/super-admin/admins/:id
// @access  Private (Super Admin)
exports.updateAdmin = asyncHandler(async (req, res, next) => {
  // Get admin before update for audit log
  const prevAdmin = await User.findById(req.params.id);

  if (!prevAdmin) {
    return next(
      new ErrorResponse(`Admin not found with id of ${req.params.id}`, 404)
    );
  }

  // Ensure role remains admin or super_admin
  if (req.body.role && !['admin', 'super_admin'].includes(req.body.role)) {
    return next(
      new ErrorResponse('Cannot change role to non-admin role', 400)
    );
  }

  const admin = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  // Log the action
  await AuditLog.create({
    user: req.user.id,
    action: 'update',
    resourceType: 'user',
    resourceId: admin._id,
    description: `Updated admin: ${admin.name} (${admin.email})`,
    prevState: prevAdmin.toObject(),
    newState: admin.toObject(),
    ipAddress: req.ip,
    userAgent: req.headers['user-agent']
  });

  res.status(200).json({
    success: true,
    data: admin
  });
});

// @desc    Delete admin
// @route   DELETE /api/super-admin/admins/:id
// @access  Private (Super Admin)
exports.deleteAdmin = asyncHandler(async (req, res, next) => {
  const admin = await User.findById(req.params.id);

  if (!admin) {
    return next(
      new ErrorResponse(`Admin not found with id of ${req.params.id}`, 404)
    );
  }

  // Prevent deleting self
  if (admin._id.toString() === req.user.id) {
    return next(
      new ErrorResponse('Cannot delete your own account', 400)
    );
  }

  await admin.remove();

  // Log the action
  await AuditLog.create({
    user: req.user.id,
    action: 'delete',
    resourceType: 'user',
    resourceId: admin._id,
    description: `Deleted admin: ${admin.name} (${admin.email})`,
    prevState: admin.toObject(),
    ipAddress: req.ip,
    userAgent: req.headers['user-agent']
  });

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Get all audit logs
// @route   GET /api/super-admin/audit-logs
// @access  Private (Super Admin)
exports.getAuditLogs = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc    Get platform settings
// @route   GET /api/super-admin/settings
// @access  Private (Super Admin)
exports.getPlatformSettings = asyncHandler(async (req, res, next) => {
  // In a real application, this would fetch from a Settings model
  // For now, we'll return mock settings
  const settings = {
    general: {
      siteName: 'Luxury E-Commerce',
      siteDescription: 'Premium luxury gifts and products',
      logo: 'https://example.com/logo.png',
      favicon: 'https://example.com/favicon.ico',
      contactEmail: 'contact@luxuryecommerce.com',
      supportEmail: 'support@luxuryecommerce.com',
      phoneNumber: '+1 (555) 123-4567',
      address: '123 Luxury Avenue, New York, NY 10001',
      socialLinks: {
        facebook: 'https://facebook.com/luxuryecommerce',
        twitter: 'https://twitter.com/luxuryecommerce',
        instagram: 'https://instagram.com/luxuryecommerce'
      }
    },
    payment: {
      currency: 'USD',
      currencySymbol: '$',
      paymentMethods: ['credit_card', 'paypal', 'stripe'],
      sellerCommissionRate: 5, // percentage
      taxRate: 7.5, // percentage
      freeShippingThreshold: 50
    },
    email: {
      emailProvider: 'smtp',
      smtpHost: 'smtp.example.com',
      smtpPort: 587,
      smtpUsername: 'smtp_username',
      emailTemplates: {
        welcome: true,
        orderConfirmation: true,
        orderShipped: true,
        orderDelivered: true,
        passwordReset: true
      }
    },
    security: {
      passwordMinLength: 8,
      requireEmailVerification: true,
      twoFactorAuthEnabled: false,
      loginAttempts: 5,
      lockoutDuration: 30, // minutes
      sessionTimeout: 60 // minutes
    },
    system: {
      maintenanceMode: false,
      debugMode: false,
      backupFrequency: 'daily',
      logRetention: 30, // days
      apiRateLimit: 100 // requests per minute
    }
  };

  res.status(200).json({
    success: true,
    data: settings
  });
});

// @desc    Update platform settings
// @route   PUT /api/super-admin/settings
// @access  Private (Super Admin)
exports.updatePlatformSettings = asyncHandler(async (req, res, next) => {
  // In a real application, this would update a Settings model
  // For now, we'll just log the action and return success

  // Log the action
  await AuditLog.create({
    user: req.user.id,
    action: 'settings_update',
    resourceType: 'setting',
    description: 'Updated platform settings',
    prevState: {}, // Would contain previous settings
    newState: req.body,
    ipAddress: req.ip,
    userAgent: req.headers['user-agent']
  });

  res.status(200).json({
    success: true,
    message: 'Settings updated successfully',
    data: req.body
  });
});

// @desc    Get user roles and permissions
// @route   GET /api/super-admin/user-roles
// @access  Private (Super Admin)
exports.getUserRoles = asyncHandler(async (req, res, next) => {
  // In a real application, this would fetch from a Roles model
  // For now, we'll return predefined roles and permissions
  const roles = [
    {
      name: 'buyer',
      displayName: 'Buyer',
      description: 'Regular customer who can purchase products',
      permissions: [
        'view_products',
        'add_to_cart',
        'checkout',
        'view_orders',
        'write_reviews',
        'manage_profile'
      ]
    },
    {
      name: 'seller',
      displayName: 'Seller',
      description: 'Vendor who can sell products on the platform',
      permissions: [
        'view_products',
        'add_to_cart',
        'checkout',
        'view_orders',
        'write_reviews',
        'manage_profile',
        'manage_products',
        'view_seller_orders',
        'view_seller_analytics',
        'manage_seller_settings'
      ]
    },
    {
      name: 'admin',
      displayName: 'Admin',
      description: 'Administrator who can manage the platform',
      permissions: [
        'view_products',
        'add_to_cart',
        'checkout',
        'view_orders',
        'write_reviews',
        'manage_profile',
        'manage_products',
        'manage_categories',
        'manage_users',
        'manage_sellers',
        'manage_orders',
        'moderate_reviews',
        'view_admin_analytics'
      ]
    },
    {
      name: 'super_admin',
      displayName: 'Super Admin',
      description: 'Super administrator with full control over the platform',
      permissions: [
        'view_products',
        'add_to_cart',
        'checkout',
        'view_orders',
        'write_reviews',
        'manage_profile',
        'manage_products',
        'manage_categories',
        'manage_users',
        'manage_sellers',
        'manage_orders',
        'moderate_reviews',
        'view_admin_analytics',
        'manage_admins',
        'manage_platform_settings',
        'view_audit_logs',
        'manage_user_roles'
      ]
    }
  ];

  res.status(200).json({
    success: true,
    data: roles
  });
});

// @desc    Get featured products
// @route   GET /api/super-admin/featured-products
// @access  Private (Super Admin)
exports.getFeaturedProducts = asyncHandler(async (req, res, next) => {
  const featuredProducts = await Product.find({ featured: true })
    .populate({
      path: 'seller',
      select: 'name email sellerInfo.businessName'
    })
    .populate('category');

  res.status(200).json({
    success: true,
    count: featuredProducts.length,
    data: featuredProducts
  });
});

// @desc    Update featured products
// @route   PUT /api/super-admin/featured-products
// @access  Private (Super Admin)
exports.updateFeaturedProducts = asyncHandler(async (req, res, next) => {
  const { productIds } = req.body;

  if (!productIds || !Array.isArray(productIds)) {
    return next(
      new ErrorResponse('Please provide an array of product IDs', 400)
    );
  }

  // Reset all featured products
  await Product.updateMany(
    { featured: true },
    { featured: false }
  );

  // Set new featured products
  await Product.updateMany(
    { _id: { $in: productIds } },
    { featured: true }
  );

  // Log the action
  await AuditLog.create({
    user: req.user.id,
    action: 'update',
    resourceType: 'product',
    description: `Updated featured products`,
    newState: { featuredProductIds: productIds },
    ipAddress: req.ip,
    userAgent: req.headers['user-agent']
  });

  const featuredProducts = await Product.find({ featured: true })
    .populate({
      path: 'seller',
      select: 'name email sellerInfo.businessName'
    })
    .populate('category');

  res.status(200).json({
    success: true,
    count: featuredProducts.length,
    data: featuredProducts
  });
});

// @desc    Perform system backup
// @route   POST /api/super-admin/system/backup
// @access  Private (Super Admin)
exports.performBackup = asyncHandler(async (req, res, next) => {
  // In a real application, this would trigger a database backup
  // For now, we'll just log the action and return success

  // Log the action
  await AuditLog.create({
    user: req.user.id,
    action: 'system_backup',
    resourceType: 'system',
    description: 'Performed system backup',
    ipAddress: req.ip,
    userAgent: req.headers['user-agent']
  });

  res.status(200).json({
    success: true,
    message: 'System backup initiated successfully',
    data: {
      backupId: mongoose.Types.ObjectId(),
      timestamp: new Date(),
      status: 'completed',
      size: '42.5 MB'
    }
  });
});
