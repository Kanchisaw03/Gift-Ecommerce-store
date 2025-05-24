const express = require('express');
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser
} = require('../controllers/admin.controller');

const {
  getUserProfile,
  updateUserProfile,
  getUserOrders,
  getUserReviews,
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  getUserDashboard,
  changePassword,
  deleteAccount
} = require('../controllers/user.controller');

// Include address router
const addressRouter = require('./address.routes');

const router = express.Router();

// Import middleware
const { protect, authorize } = require('../middleware/auth');
const advancedResults = require('../middleware/advancedResults');
const User = require('../models/user.model');

// Re-route into other resource routers
router.use('/:userId/addresses', addressRouter);

// User profile routes
router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

router.route('/orders')
  .get(protect, getUserOrders);

router.route('/reviews')
  .get(protect, getUserReviews);

router.route('/wishlist')
  .get(protect, getWishlist);

router.route('/wishlist/:productId')
  .post(protect, addToWishlist)
  .delete(protect, removeFromWishlist);

router.route('/dashboard')
  .get(protect, getUserDashboard);

router.route('/password')
  .put(protect, changePassword);

router.route('/account')
  .delete(protect, deleteAccount);

// Admin routes
router.route('/')
  .get(
    protect, 
    authorize('admin', 'super_admin'), 
    advancedResults(User), 
    getUsers
  )
  .post(protect, authorize('admin', 'super_admin'), createUser);

router.route('/:id')
  .get(protect, authorize('admin', 'super_admin'), getUser)
  .put(protect, authorize('admin', 'super_admin'), updateUser)
  .delete(protect, authorize('admin', 'super_admin'), deleteUser);

module.exports = router;
