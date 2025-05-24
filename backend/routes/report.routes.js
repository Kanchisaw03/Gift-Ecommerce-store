const express = require('express');
const router = express.Router();

// Import controllers
const {
  getReports,
  getReport,
  createReport,
  deleteReport,
  downloadReport
} = require('../controllers/report.controller');

// Import middleware
const { protect, authorize } = require('../middleware/auth');

// All routes require authentication and admin/super_admin role
router.use(protect);
router.use(authorize('admin', 'super_admin'));

// Routes
router.route('/')
  .get(getReports)
  .post(createReport);

router.route('/:id')
  .get(getReport)
  .delete(deleteReport);

router.route('/:id/download')
  .get(downloadReport);

module.exports = router;
