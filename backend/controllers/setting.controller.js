const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const Setting = require('../models/setting.model');

// @desc    Get all settings
// @route   GET /api/settings
// @access  Private/Admin
exports.getSettings = asyncHandler(async (req, res, next) => {
  const { group } = req.query;
  
  let query = {};
  
  // Filter by group if provided
  if (group) {
    query.group = group;
  }
  
  // If not admin or super_admin, only return public settings
  if (req.user.role !== 'admin' && req.user.role !== 'super_admin') {
    query.isPublic = true;
  }
  
  const settings = await Setting.find(query);
  
  res.status(200).json({
    success: true,
    count: settings.length,
    data: settings
  });
});

// @desc    Get public settings
// @route   GET /api/settings/public
// @access  Public
exports.getPublicSettings = asyncHandler(async (req, res, next) => {
  const { group } = req.query;
  
  let query = { isPublic: true };
  
  // Filter by group if provided
  if (group) {
    query.group = group;
  }
  
  const settings = await Setting.find(query);
  
  res.status(200).json({
    success: true,
    count: settings.length,
    data: settings
  });
});

// @desc    Get setting by key
// @route   GET /api/settings/:key
// @access  Private/Admin
exports.getSetting = asyncHandler(async (req, res, next) => {
  const setting = await Setting.findOne({ key: req.params.key });
  
  if (!setting) {
    return next(
      new ErrorResponse(`Setting not found with key of ${req.params.key}`, 404)
    );
  }
  
  // If not admin or super_admin, only return public settings
  if (req.user.role !== 'admin' && req.user.role !== 'super_admin' && !setting.isPublic) {
    return next(
      new ErrorResponse('Not authorized to access this setting', 403)
    );
  }
  
  res.status(200).json({
    success: true,
    data: setting
  });
});

// @desc    Create setting
// @route   POST /api/settings
// @access  Private/SuperAdmin
exports.createSetting = asyncHandler(async (req, res, next) => {
  // Add creator to req.body
  req.body.createdBy = req.user.id;
  req.body.updatedBy = req.user.id;
  
  // Check if setting key already exists
  const existingSetting = await Setting.findOne({ key: req.body.key });
  if (existingSetting) {
    return next(
      new ErrorResponse(`Setting with key ${req.body.key} already exists`, 400)
    );
  }
  
  const setting = await Setting.create(req.body);
  
  res.status(201).json({
    success: true,
    data: setting
  });
});

// @desc    Update setting
// @route   PUT /api/settings/:key
// @access  Private/SuperAdmin
exports.updateSetting = asyncHandler(async (req, res, next) => {
  // Add updater to req.body
  req.body.updatedBy = req.user.id;
  req.body.updatedAt = Date.now();
  
  let setting = await Setting.findOne({ key: req.params.key });
  
  if (!setting) {
    return next(
      new ErrorResponse(`Setting not found with key of ${req.params.key}`, 404)
    );
  }
  
  setting = await Setting.findOneAndUpdate(
    { key: req.params.key },
    req.body,
    {
      new: true,
      runValidators: true
    }
  );
  
  res.status(200).json({
    success: true,
    data: setting
  });
});

// @desc    Delete setting
// @route   DELETE /api/settings/:key
// @access  Private/SuperAdmin
exports.deleteSetting = asyncHandler(async (req, res, next) => {
  const setting = await Setting.findOne({ key: req.params.key });
  
  if (!setting) {
    return next(
      new ErrorResponse(`Setting not found with key of ${req.params.key}`, 404)
    );
  }
  
  await setting.remove();
  
  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Update multiple settings
// @route   PUT /api/settings
// @access  Private/SuperAdmin
exports.updateMultipleSettings = asyncHandler(async (req, res, next) => {
  const { settings } = req.body;
  
  if (!settings || !Array.isArray(settings)) {
    return next(
      new ErrorResponse('Please provide an array of settings to update', 400)
    );
  }
  
  const updatedSettings = [];
  
  // Update each setting
  for (const settingData of settings) {
    const { key, value } = settingData;
    
    if (!key) {
      return next(
        new ErrorResponse('Setting key is required for each setting', 400)
      );
    }
    
    // Find setting
    let setting = await Setting.findOne({ key });
    
    if (!setting) {
      return next(
        new ErrorResponse(`Setting not found with key of ${key}`, 404)
      );
    }
    
    // Update setting
    setting = await Setting.findOneAndUpdate(
      { key },
      {
        value,
        updatedBy: req.user.id,
        updatedAt: Date.now()
      },
      {
        new: true,
        runValidators: true
      }
    );
    
    updatedSettings.push(setting);
  }
  
  res.status(200).json({
    success: true,
    count: updatedSettings.length,
    data: updatedSettings
  });
});
