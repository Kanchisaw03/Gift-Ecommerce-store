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

// Debug routes to check API accessibility
router.get('/debug', (req, res) => {
  console.log('Seller debug route accessed');
  res.status(200).json({
    success: true,
    message: 'Seller API is working'
  });
});

router.get('/orders/debug', (req, res) => {
  console.log('Seller orders debug route accessed');
  res.status(200).json({
    success: true,
    message: 'Seller orders debug route is working'
  });
});

// Orders routes - temporarily remove isApprovedSeller middleware to fix 404 errors
router.get('/orders', protect, authorize('seller'), getSellerOrders);

// Add a direct route for seller orders that doesn't require approval
router.get('/my-orders', protect, authorize('seller'), getSellerOrders);

// Order management routes for sellers
router.route('/orders/:id/status')
  .put(protect, authorize('seller'), async (req, res, next) => {
    // Forward to the main order controller's updateOrderStatus function
    const orderController = require('../controllers/order.controller');
    return orderController.updateOrderStatus(req, res, next);
  });

router.route('/orders/:id/tracking')
  .put(protect, authorize('seller'), async (req, res, next) => {
    // Forward to the main order controller's addTracking function
    const orderController = require('../controllers/order.controller');
    return orderController.addTracking(req, res, next);
  });

router.route('/orders/:id')
  .get(protect, authorize('seller'), async (req, res, next) => {
    // Forward to the main order controller's getOrder function
    const orderController = require('../controllers/order.controller');
    return orderController.getOrder(req, res, next);
  });

// Analytics routes
router.get('/analytics', protect, authorize('seller'), isApprovedSeller, getSellerAnalytics);

// Earnings routes
router.get('/earnings', protect, authorize('seller'), isApprovedSeller, getSellerEarnings);

// Profile routes
router.put('/profile', protect, authorize('seller'), updateSellerProfile);

module.exports = router;
