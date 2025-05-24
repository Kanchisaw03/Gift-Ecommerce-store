const express = require('express');
const router = express.Router();

// Import controllers
const {
  getDashboardStats,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getAllSellers,
  getSellerById,
  approveSeller,
  rejectSeller,
  getAllProducts,
  getProductById,
  approveProduct,
  rejectProduct,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  getAllReviews,
  getReviewById,
  approveReview,
  rejectReview
} = require('../controllers/admin.controller');

// Import middleware
const { protect, authorize } = require('../middleware/auth');

// Apply middleware to all routes
router.use(protect);
router.use(authorize('admin', 'super_admin'));

// Dashboard routes
router.get('/dashboard/stats', getDashboardStats);

// User management routes
router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

// Seller management routes
router.get('/sellers', getAllSellers);
router.get('/sellers/:id', getSellerById);
router.put('/sellers/:id/approve', approveSeller);
router.put('/sellers/:id/reject', rejectSeller);

// Product management routes
router.get('/products', getAllProducts);
router.get('/products/:id', getProductById);
router.put('/products/:id/approve', approveProduct);
router.put('/products/:id/reject', rejectProduct);

// Order management routes
router.get('/orders', getAllOrders);
router.get('/orders/:id', getOrderById);
router.put('/orders/:id/status', updateOrderStatus);

// Review management routes
router.get('/reviews', getAllReviews);
router.get('/reviews/:id', getReviewById);
router.put('/reviews/:id/approve', approveReview);
router.put('/reviews/:id/reject', rejectReview);

module.exports = router;