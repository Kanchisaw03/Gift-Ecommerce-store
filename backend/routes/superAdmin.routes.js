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

// Import order management functions
const superAdminOrderController = require('../controllers/superAdminOrder.controller');

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

// Debug route to check API accessibility
router.get('/debug', (req, res) => {
  console.log('Super admin debug route accessed');
  res.status(200).json({
    success: true,
    message: 'Super admin API is working'
  });
});

// Order management routes
router.route('/orders')
  .get(protect, authorize('super_admin'), superAdminOrderController.getAllOrders);

// Alternative route for orders (for compatibility)
router.route('/my-orders')
  .get(protect, authorize('super_admin'), superAdminOrderController.getAllOrders);

router.route('/orders/:id')
  .get(protect, authorize('super_admin'), superAdminOrderController.getOrderDetails);

router.route('/orders/:id/status')
  .put(protect, authorize('super_admin'), superAdminOrderController.updateOrderStatus);

module.exports = router;
