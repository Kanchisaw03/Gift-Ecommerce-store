const express = require('express');
const router = express.Router();

// Import controllers
const {
  getSellerDashboard,
  getSellerProfile,
  updateSellerProfile,
  getSellerProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getSellerOrders,
  getSellerOrderById,
  updateOrderStatus,
  getSellerAnalytics,
  getSellerEarnings,
  requestPayout,
  getPayoutHistory
} = require('../controllers/seller.controller');

// Import middleware
const { protect, authorize } = require('../middleware/auth');

// Apply middleware to all routes
router.use(protect);
router.use(authorize('seller'));

// Dashboard routes
router.get('/dashboard', getSellerDashboard);

// Profile routes
router.get('/profile', getSellerProfile);
router.put('/profile', updateSellerProfile);

// Product routes
router.get('/products', getSellerProducts);
router.post('/products', createProduct);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);

// Order routes
router.get('/orders', getSellerOrders);
router.get('/orders/:id', getSellerOrderById);
router.put('/orders/:id/status', updateOrderStatus);

// Analytics routes
router.get('/analytics', getSellerAnalytics);

// Earnings routes
router.get('/earnings', getSellerEarnings);
router.post('/earnings/payout', requestPayout);
router.get('/earnings/payouts', getPayoutHistory);

module.exports = router;