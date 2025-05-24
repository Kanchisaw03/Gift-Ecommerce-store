const express = require('express');
const router = express.Router();

// Import controllers
const {
  getAdminStats,
  getSellerStats,
  getBuyerStats,
  getSuperAdminStats
} = require('../controllers/stats.controller');

// Import middleware
const { protect, authorize, isApprovedSeller } = require('../middleware/auth');

// Routes
router.route('/admin')
  .get(protect, authorize('admin'), getAdminStats);

router.route('/seller')
  .get(protect, authorize('seller'), isApprovedSeller, getSellerStats);

router.route('/buyer')
  .get(protect, authorize('buyer'), getBuyerStats);

router.route('/super-admin')
  .get(protect, authorize('super_admin'), getSuperAdminStats);

module.exports = router;
