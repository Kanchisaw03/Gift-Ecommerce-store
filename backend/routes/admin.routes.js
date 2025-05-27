const express = require('express');
const {
  getDashboardStats,
  getPendingProducts,
  getPendingReviews,
  getSellers,
  approveSeller,
  rejectSeller,
  getSalesAnalytics,
  getAllOrders,
  getOrderDetails,
  updateOrderStatus
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

// Debug route to check API accessibility
router.get('/debug', (req, res) => {
  console.log('Admin debug route accessed');
  res.status(200).json({
    success: true,
    message: 'Admin API is working'
  });
});

// Debug route to create a default category for testing
router.get('/debug/create-category', async (req, res) => {
  try {
    const Category = require('../models/category.model');
    
    // Check if default category already exists
    let category = await Category.findOne({ name: 'Default Category' });
    
    if (category) {
      console.log('Default category already exists:', category);
      return res.status(200).json({
        success: true,
        message: 'Default category already exists',
        data: category
      });
    }
    
    // Create a new default category
    category = await Category.create({
      name: 'Default Category',
      description: 'A default category for testing',
      slug: 'default-category',
      featured: true,
      showInMenu: true
    });
    
    console.log('Default category created:', category);
    
    res.status(201).json({
      success: true,
      message: 'Default category created successfully',
      data: category
    });
  } catch (error) {
    console.error('Error creating default category:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating default category',
      error: error.message
    });
  }
});

// Order management routes
router.route('/orders')
  .get(protect, authorize('admin', 'super_admin'), getAllOrders);

// Alternative route for orders (for compatibility)
router.route('/my-orders')
  .get(protect, authorize('admin', 'super_admin'), getAllOrders);

router.route('/orders/:id')
  .get(protect, authorize('admin', 'super_admin'), getOrderDetails);

router.route('/orders/:id/status')
  .put(protect, authorize('admin', 'super_admin'), updateOrderStatus);

module.exports = router;
