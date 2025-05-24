const express = require('express');
const router = express.Router({ mergeParams: true });

// Import controllers
// We'll create a simplified version of the address controller inline here
const Address = require('../models/address.model');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// Import middleware
const { protect } = require('../middleware/auth');

// @desc    Get all addresses for a user
// @route   GET /api/users/:userId/addresses
// @route   GET /api/addresses
// @access  Private
const getAddresses = asyncHandler(async (req, res, next) => {
  let query;

  if (req.params.userId) {
    // If accessing via user routes
    // Check if user is the same as logged in user or is admin
    if (req.params.userId !== req.user.id && req.user.role !== 'admin' && req.user.role !== 'super_admin') {
      return next(
        new ErrorResponse('Not authorized to access this resource', 403)
      );
    }
    
    query = Address.find({ user: req.params.userId });
  } else {
    // If accessing directly via address routes
    query = Address.find({ user: req.user.id });
  }

  const addresses = await query;

  res.status(200).json({
    success: true,
    count: addresses.length,
    data: addresses
  });
});

// @desc    Get single address
// @route   GET /api/addresses/:id
// @access  Private
const getAddress = asyncHandler(async (req, res, next) => {
  const address = await Address.findById(req.params.id);

  if (!address) {
    return next(
      new ErrorResponse(`Address not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user owns address or is admin
  if (address.user.toString() !== req.user.id && req.user.role !== 'admin' && req.user.role !== 'super_admin') {
    return next(
      new ErrorResponse('Not authorized to access this address', 403)
    );
  }

  res.status(200).json({
    success: true,
    data: address
  });
});

// @desc    Create address
// @route   POST /api/addresses
// @access  Private
const createAddress = asyncHandler(async (req, res, next) => {
  // Add user to req.body
  req.body.user = req.user.id;

  // If setting as default, unset any other default addresses of the same type
  if (req.body.isDefault) {
    await Address.updateMany(
      { 
        user: req.user.id, 
        $or: [
          { addressType: req.body.addressType },
          { addressType: 'both' }
        ]
      },
      { isDefault: false }
    );
  }

  const address = await Address.create(req.body);

  res.status(201).json({
    success: true,
    data: address
  });
});

// @desc    Update address
// @route   PUT /api/addresses/:id
// @access  Private
const updateAddress = asyncHandler(async (req, res, next) => {
  let address = await Address.findById(req.params.id);

  if (!address) {
    return next(
      new ErrorResponse(`Address not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user owns address
  if (address.user.toString() !== req.user.id) {
    return next(
      new ErrorResponse('Not authorized to update this address', 403)
    );
  }

  // If setting as default, unset any other default addresses of the same type
  if (req.body.isDefault) {
    await Address.updateMany(
      { 
        user: req.user.id, 
        _id: { $ne: req.params.id },
        $or: [
          { addressType: req.body.addressType || address.addressType },
          { addressType: 'both' }
        ]
      },
      { isDefault: false }
    );
  }

  address = await Address.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: address
  });
});

// @desc    Delete address
// @route   DELETE /api/addresses/:id
// @access  Private
const deleteAddress = asyncHandler(async (req, res, next) => {
  const address = await Address.findById(req.params.id);

  if (!address) {
    return next(
      new ErrorResponse(`Address not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user owns address
  if (address.user.toString() !== req.user.id) {
    return next(
      new ErrorResponse('Not authorized to delete this address', 403)
    );
  }

  await address.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// Routes
router.route('/')
  .get(protect, getAddresses)
  .post(protect, createAddress);

router.route('/:id')
  .get(protect, getAddress)
  .put(protect, updateAddress)
  .delete(protect, deleteAddress);

module.exports = router;
