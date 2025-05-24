const express = require('express');
const {
  getDashboardStats,
  getPendingProducts,
  getPendingReviews,
  getSellers,
  approveSeller,
  rejectSeller,
  getSalesAnalytics
} = require('../controllers/admin.controller');

const router = express.Router();

// Import middleware
const { protect, authorize } = require('../middleware/auth');

// Routes
router.route('/dashboard')
  .get(protect, authorize('admin', 'super_admin'), getDashboardStats);

router.route('/products/pending')
  .get(protect, authorize('admin', 'super_admin'), getPendingProducts);

router.route('/reviews/pending')
  .get(protect, authorize('admin', 'super_admin'), getPendingReviews);

router.route('/sellers')
  .get(protect, authorize('admin', 'super_admin'), getSellers);

router.route('/sellers/:id/approve')
  .put(protect, authorize('admin', 'super_admin'), approveSeller);

router.route('/sellers/:id/reject')
  .put(protect, authorize('admin', 'super_admin'), rejectSeller);

router.route('/analytics/sales')
  .get(protect, authorize('admin', 'super_admin'), getSalesAnalytics);

module.exports = router;
