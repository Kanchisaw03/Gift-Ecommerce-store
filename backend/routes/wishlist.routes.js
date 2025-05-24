const express = require('express');
const router = express.Router();

// Import controllers
const {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
  moveToCart
} = require('../controllers/wishlist.controller');

// Import middleware
const { protect } = require('../middleware/auth');

// Routes
router.route('/')
  .get(protect, getWishlist)
  .delete(protect, clearWishlist);

router.route('/:productId')
  .post(protect, addToWishlist)
  .delete(protect, removeFromWishlist);

router.route('/:productId/move-to-cart')
  .post(protect, moveToCart);

module.exports = router;
