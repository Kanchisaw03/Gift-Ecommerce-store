const express = require('express');
const router = express.Router();

// Import controllers
const {
  getCoupons,
  getCoupon,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  validateCoupon,
  applyCoupon
} = require('../controllers/coupon.controller');

// Import middleware
const { protect, authorize } = require('../middleware/auth');
const advancedResults = require('../middleware/advancedResults');
const Coupon = require('../models/coupon.model');

// Routes
router.route('/')
  .get(
    protect, 
    authorize('admin', 'super_admin', 'seller'), 
    advancedResults(Coupon, [
      { path: 'createdBy', select: 'name' },
      { path: 'updatedBy', select: 'name' }
    ]),
    getCoupons
  )
  .post(protect, authorize('admin', 'super_admin', 'seller'), createCoupon);

router.route('/validate')
  .post(protect, validateCoupon);

router.route('/apply')
  .post(protect, applyCoupon);

router.route('/:id')
  .get(protect, authorize('admin', 'super_admin', 'seller'), getCoupon)
  .put(protect, authorize('admin', 'super_admin', 'seller'), updateCoupon)
  .delete(protect, authorize('admin', 'super_admin', 'seller'), deleteCoupon);

module.exports = router;
