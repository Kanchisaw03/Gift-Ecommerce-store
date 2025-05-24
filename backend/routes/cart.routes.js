const express = require('express');
const {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
  applyCoupon,
  removeCoupon
} = require('../controllers/cart.controller');

const router = express.Router();

// Import middleware
const { protect } = require('../middleware/auth');

// Routes
router.route('/')
  .get(protect, getCart)
  .post(protect, addToCart)
  .delete(protect, clearCart);

router.route('/:itemId')
  .put(protect, updateCartItem)
  .delete(protect, removeCartItem);

router.route('/apply-coupon')
  .post(protect, applyCoupon);

router.route('/remove-coupon')
  .delete(protect, removeCoupon);

module.exports = router;
