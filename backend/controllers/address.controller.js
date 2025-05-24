const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const Address = require('../models/address.model');

// @desc    Get all addresses for a user
// @route   GET /api/addresses
// @access  Private
exports.getAddresses = asyncHandler(async (req, res, next) => {
  const addresses = await Address.find({ user: req.user.id });

  res.status(200).json({
    success: true,
    count: addresses.length,
    data: addresses
  });
});

// @desc    Get single address
// @route   GET /api/addresses/:id
// @access  Private
exports.getAddress = asyncHandler(async (req, res, next) => {
  const address = await Address.findById(req.params.id);

  if (!address) {
    return next(
      new ErrorResponse(`Address not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user owns address
  if (address.user.toString() !== req.user.id) {
    return next(
      new ErrorResponse(`User not authorized to access this address`, 401)
    );
  }

  res.status(200).json({
    success: true,
    data: address
  });
});

// @desc    Create new address
// @route   POST /api/addresses
// @access  Private
exports.createAddress = asyncHandler(async (req, res, next) => {
  // Add user to req.body
  req.body.user = req.user.id;

  // Check if this is the first address, make it default if so
  const addressCount = await Address.countDocuments({ user: req.user.id });
  if (addressCount === 0) {
    req.body.isDefault = true;
  }

  const address = await Address.create(req.body);

  // If this address is set as default, unset any other default addresses
  if (req.body.isDefault) {
    await Address.updateMany(
      { user: req.user.id, _id: { $ne: address._id } },
      { isDefault: false }
    );
  }

  res.status(201).json({
    success: true,
    data: address
  });
});

// @desc    Update address
// @route   PUT /api/addresses/:id
// @access  Private
exports.updateAddress = asyncHandler(async (req, res, next) => {
  let address = await Address.findById(req.params.id);

  if (!address) {
    return next(
      new ErrorResponse(`Address not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user owns address
  if (address.user.toString() !== req.user.id) {
    return next(
      new ErrorResponse(`User not authorized to update this address`, 401)
    );
  }

  address = await Address.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  // If this address is set as default, unset any other default addresses
  if (req.body.isDefault) {
    await Address.updateMany(
      { user: req.user.id, _id: { $ne: address._id } },
      { isDefault: false }
    );
  }

  res.status(200).json({
    success: true,
    data: address
  });
});

// @desc    Delete address
// @route   DELETE /api/addresses/:id
// @access  Private
exports.deleteAddress = asyncHandler(async (req, res, next) => {
  const address = await Address.findById(req.params.id);

  if (!address) {
    return next(
      new ErrorResponse(`Address not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user owns address
  if (address.user.toString() !== req.user.id) {
    return next(
      new ErrorResponse(`User not authorized to delete this address`, 401)
    );
  }

  // Check if this is a default address
  const isDefault = address.isDefault;

  await address.remove();

  // If this was a default address, set another address as default
  if (isDefault) {
    const nextAddress = await Address.findOne({ user: req.user.id });
    if (nextAddress) {
      nextAddress.isDefault = true;
      await nextAddress.save();
    }
  }

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Set address as default
// @route   PUT /api/addresses/:id/default
// @access  Private
exports.setDefaultAddress = asyncHandler(async (req, res, next) => {
  let address = await Address.findById(req.params.id);

  if (!address) {
    return next(
      new ErrorResponse(`Address not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user owns address
  if (address.user.toString() !== req.user.id) {
    return next(
      new ErrorResponse(`User not authorized to update this address`, 401)
    );
  }

  // Unset any other default addresses
  await Address.updateMany(
    { user: req.user.id },
    { isDefault: false }
  );

  // Set this address as default
  address = await Address.findByIdAndUpdate(
    req.params.id,
    { isDefault: true },
    {
      new: true,
      runValidators: true
    }
  );

  res.status(200).json({
    success: true,
    data: address
  });
});
