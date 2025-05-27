const express = require('express');
const {
  createOrder,
  getOrders,
  getOrder,
  updateOrderStatus,
  addTracking,
  getMyOrders,
  getSellerOrders
} = require('../controllers/order.controller');

const router = express.Router();

// Import middleware
const { protect, authorize, isApprovedSeller } = require('../middleware/auth');
const advancedResults = require('../middleware/advancedResults');
const Order = require('../models/order.model');

// Routes
router.route('/')
  .get(
    protect, 
    authorize('admin', 'super_admin'), 
    advancedResults(
      Order,
      [
        { path: 'user', select: 'name email' },
        { path: 'items.product', select: 'name images' },
        { path: 'items.seller', select: 'name sellerInfo.businessName' }
      ]
    ), 
    getOrders
  )
  .post(protect, createOrder);

// Debug route to check if the API is accessible
router.route('/debug')
  .get((req, res) => {
    console.log('Order debug route accessed');
    res.status(200).json({
      success: true,
      message: 'Order API is working'
    });
  });

// Routes for buyers to access their orders (both endpoints supported for compatibility)
router.route('/user')
  .get(protect, getMyOrders);

router.route('/my-orders')
  .get(protect, getMyOrders);

router.route('/seller-orders')
  .get(protect, authorize('seller'), isApprovedSeller, getSellerOrders);

router.route('/:id')
  .get(protect, getOrder);

router.route('/:id/status')
  .put(protect, authorize('admin', 'super_admin', 'seller'), updateOrderStatus);

router.route('/:id/tracking')
  .put(protect, authorize('admin', 'super_admin', 'seller'), addTracking);

module.exports = router;
