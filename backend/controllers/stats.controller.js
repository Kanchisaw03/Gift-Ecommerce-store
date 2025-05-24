const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const StatsService = require('../services/stats.service');

// @desc    Get admin dashboard statistics
// @route   GET /api/stats/admin
// @access  Private/Admin
exports.getAdminStats = asyncHandler(async (req, res, next) => {
  const { period = 'week' } = req.query;
  
  const stats = await StatsService.getAdminStats({ period });
  
  res.status(200).json({
    success: true,
    data: stats
  });
});

// @desc    Get seller dashboard statistics
// @route   GET /api/stats/seller
// @access  Private/Seller
exports.getSellerStats = asyncHandler(async (req, res, next) => {
  const { period = 'week' } = req.query;
  const sellerId = req.user.id;
  
  const stats = await StatsService.getSellerStats({ sellerId, period });
  
  res.status(200).json({
    success: true,
    data: stats
  });
});

// @desc    Get buyer dashboard statistics
// @route   GET /api/stats/buyer
// @access  Private/Buyer
exports.getBuyerStats = asyncHandler(async (req, res, next) => {
  const buyerId = req.user.id;
  
  const stats = await StatsService.getBuyerStats({ buyerId });
  
  res.status(200).json({
    success: true,
    data: stats
  });
});

// @desc    Get super admin dashboard statistics
// @route   GET /api/stats/super-admin
// @access  Private/SuperAdmin
exports.getSuperAdminStats = asyncHandler(async (req, res, next) => {
  const { period = 'week' } = req.query;
  
  const stats = await StatsService.getSuperAdminStats({ period });
  
  res.status(200).json({
    success: true,
    data: stats
  });
});
