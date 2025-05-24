const express = require('express');
const router = express.Router();

// Import controllers
const {
  getSettings,
  getPublicSettings,
  getSetting,
  createSetting,
  updateSetting,
  deleteSetting,
  updateMultipleSettings
} = require('../controllers/setting.controller');

// Import middleware
const { protect, authorize } = require('../middleware/auth');

// Public routes
router.route('/public')
  .get(getPublicSettings);

// Protected routes
router.route('/')
  .get(protect, getSettings)
  .post(protect, authorize('super_admin'), createSetting)
  .put(protect, authorize('super_admin'), updateMultipleSettings);

router.route('/:key')
  .get(protect, getSetting)
  .put(protect, authorize('super_admin'), updateSetting)
  .delete(protect, authorize('super_admin'), deleteSetting);

module.exports = router;
