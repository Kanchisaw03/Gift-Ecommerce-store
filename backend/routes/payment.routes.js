const express = require('express');
const {
  createPaymentIntent,
  processWebhook,
  getPaymentStatus,
  createRefund
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

module.exports = router;
