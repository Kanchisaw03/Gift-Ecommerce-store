const express = require('express');
const router = express.Router();

// Import controllers
const {
  stripeWebhook,
  paypalWebhook,
  cloudinaryWebhook
} = require('../controllers/webhook.controller');

// Import middleware
// Note: We don't use the regular JSON parser for webhooks
// because we need the raw body for signature verification
const rawBodyParser = express.raw({ type: 'application/json' });

// Routes
// For Stripe webhooks, we need the raw body for signature verification
router.route('/stripe')
  .post(rawBodyParser, stripeWebhook);

router.route('/paypal')
  .post(paypalWebhook);

router.route('/cloudinary')
  .post(cloudinaryWebhook);

module.exports = router;
