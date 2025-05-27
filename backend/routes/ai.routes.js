const express = require('express');
const {
  processChat,
  getProductSuggestions,
  logChatInteraction
} = require('../controllers/ai.controller');

const router = express.Router();

// Import middleware
const { protect, authorize } = require('../middleware/auth');
const rateLimiter = require('../middleware/rateLimiter');

// Routes
// Apply rate limiting to chat endpoint to prevent abuse
router.post('/chat', rateLimiter({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 10, // 10 requests per minute
  message: 'Too many requests from this IP, please try again after a minute'
}), processChat);

router.post('/suggestions', getProductSuggestions);

// Admin-only route for logging chat interactions
router.post('/log', protect, authorize('admin', 'super_admin'), logChatInteraction);

module.exports = router;
