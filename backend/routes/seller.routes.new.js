const express = require('express');
const router = express.Router();

// Import middleware
const { protect, authorize, isApprovedSeller } = require('../middleware/auth');

// Import controller
const {
  getDashboardStats,
  getSellerProducts,
  getSellerOrders,
  getSellerAnalytics,
  getSellerEarnings,
  updateSellerProfile,
  getSellerInfo
} = require('../controllers/seller.controller');

// Base route
router.get('/', getSellerInfo);

// Dashboard stats
router.get('/dashboard', protect, authorize('seller'), isApprovedSeller, getDashboardStats);

// Products routes
router.get('/products', protect, authorize('seller'), getSellerProducts);

// Orders routes
router.get('/orders', protect, authorize('seller'), isApprovedSeller, getSellerOrders);

// Analytics routes
router.get('/analytics', protect, authorize('seller'), isApprovedSeller, getSellerAnalytics);

// Earnings routes
router.get('/earnings', protect, authorize('seller'), isApprovedSeller, getSellerEarnings);

// Profile routes
router.put('/profile', protect, authorize('seller'), updateSellerProfile);

module.exports = router;
