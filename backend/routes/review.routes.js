const express = require('express');
const {
  getReviews,
  getProductReviews,
  getReview,
  createReview,
  updateReview,
  deleteReview,
  approveReview,
  rejectReview,
  addSellerResponse,
  getMyReviews
} = require('../controllers/review.controller');

const router = express.Router({ mergeParams: true });

// Import middleware
const { protect, authorize } = require('../middleware/auth');
const advancedResults = require('../middleware/advancedResults');
const Review = require('../models/review.model');

// Routes
router.route('/')
  .get(
    advancedResults(
      Review,
      [
        { path: 'user', select: 'name avatar' },
        { path: 'product', select: 'name images' }
      ]
    ),
    getReviews
  )
  .post(protect, createReview);

router.route('/my-reviews')
  .get(protect, getMyReviews);

router.route('/:id')
  .get(getReview)
  .put(protect, updateReview)
  .delete(protect, deleteReview);

router.route('/:id/approve')
  .put(protect, authorize('admin', 'super_admin'), approveReview);

router.route('/:id/reject')
  .put(protect, authorize('admin', 'super_admin'), rejectReview);

router.route('/:id/seller-response')
  .put(protect, authorize('seller', 'admin', 'super_admin'), addSellerResponse);

// Special route for getting product reviews
// This will be accessed via /api/products/:productId/reviews
// due to the mergeParams option
router.route('/')
  .get(getProductReviews);

module.exports = router;
