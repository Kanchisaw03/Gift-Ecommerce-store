const express = require('express');
const {
  createPaymentIntent,
  processWebhook,
  getPaymentStatus,
  createRefund,
  createRazorpayOrder,
  verifyRazorpayPayment,
  getRazorpayPayment,
  getPaymentHistory
} = require('../controllers/payment.controller');

const router = express.Router();

// Import middleware
const { protect, authorize } = require('../middleware/auth');

// Routes
router.route('/create-payment-intent')
  .post(protect, createPaymentIntent);

router.route('/webhook')
  .post(processWebhook);

router.route('/:paymentId/status')
  .get(protect, getPaymentStatus);

router.route('/:paymentId/refund')
  .post(protect, authorize('admin', 'super_admin', 'seller'), createRefund);

// Razorpay routes
router.route('/create-order')
  .post(protect, createRazorpayOrder);

router.route('/verify')
  .post(protect, verifyRazorpayPayment);

router.route('/history')
  .get(protect, getPaymentHistory);

router.route('/:paymentId')
  .get(protect, getRazorpayPayment);

module.exports = router;
