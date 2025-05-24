const express = require('express');
const {
  getDashboardStats,
  getAdmins,
  createAdmin,
  updateAdmin,
  deleteAdmin,
  getAuditLogs,
  getPlatformSettings,
  updatePlatformSettings,
  getUserRoles,
  getFeaturedProducts,
  updateFeaturedProducts,
  performBackup
} = require('../controllers/superAdmin.controller');

const router = express.Router();

// Import middleware
const { protect, authorize } = require('../middleware/auth');
const advancedResults = require('../middleware/advancedResults');
const AuditLog = require('../models/auditLog.model');

// Routes
router.route('/dashboard')
  .get(protect, authorize('super_admin'), getDashboardStats);

router.route('/admins')
  .get(protect, authorize('super_admin'), getAdmins)
  .post(protect, authorize('super_admin'), createAdmin);

router.route('/admins/:id')
  .put(protect, authorize('super_admin'), updateAdmin)
  .delete(protect, authorize('super_admin'), deleteAdmin);

router.route('/audit-logs')
  .get(
    protect, 
    authorize('super_admin'), 
    advancedResults(
      AuditLog,
      { path: 'user', select: 'name email role' }
    ), 
    getAuditLogs
  );

router.route('/settings')
  .get(protect, authorize('super_admin'), getPlatformSettings)
  .put(protect, authorize('super_admin'), updatePlatformSettings);

router.route('/user-roles')
  .get(protect, authorize('super_admin'), getUserRoles);

router.route('/featured-products')
  .get(protect, authorize('super_admin'), getFeaturedProducts)
  .put(protect, authorize('super_admin'), updateFeaturedProducts);

router.route('/system/backup')
  .post(protect, authorize('super_admin'), performBackup);

module.exports = router;
