const express = require('express');
const router = express.Router();

// Import controllers
const {
  getCart,
  addItemToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
  applyCoupon,
  removeCoupon
} = require('../controllers/cart.controller');

// Import middleware
const { protect } = require('../middleware/auth');

// Apply middleware to all routes
router.use(protect);

// Cart routes
router.get('/', getCart);
router.post('/items', addItemToCart);
router.put('/items/:itemId', updateCartItem);
router.delete('/items/:itemId', removeCartItem);
router.delete('/', clearCart);

// Coupon routes
router.post('/coupon', applyCoupon);
router.delete('/coupon', removeCoupon);

module.exports = router;