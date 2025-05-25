const User = require('../models/user.model');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = asyncHandler(async (req, res, next) => {
  console.log('Registration request received:', { ...req.body, password: '***HIDDEN***' });
  
  const { name, email, password, role } = req.body;
  
  // Validate required fields
  if (!name || !email || !password) {
    return next(new ErrorResponse('Please provide name, email and password', 400));
  }

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new ErrorResponse('Email already in use', 400));
  }

  // Generate unique username from email
  const baseUsername = email.split('@')[0].replace(/[^a-zA-Z0-9]/g, '');
  const randomSuffix = Math.floor(Math.random() * 10000);
  const timestamp = Date.now().toString().slice(-4);
  const username = `${baseUsername}_${randomSuffix}${timestamp}`;

  try {
    // Create user with validated role
    const validRole = ['buyer', 'seller', 'admin', 'super_admin'].includes(role) ? role : 'buyer';
    
    // Create user with additional settings
    const userData = {
      name,
      email,
      password,
      username,
      role: validRole,
      // Auto-verify all users
      isVerified: true
    };
    
    // Auto-approve seller accounts
    if (validRole === 'seller') {
      userData.sellerInfo = {
        isApproved: true,
        businessName: req.body.businessName || `${name}'s Store`,
        businessDescription: req.body.businessDescription || 'Quality products at competitive prices',
        commission: 10 // Default commission rate
      };
    }
    
    const user = await User.create(userData);

    console.log('User created successfully:', { id: user._id, email: user.email, role: user.role });
    
    if (validRole === 'seller') {
      console.log('Seller account auto-approved:', { id: user._id, email: user.email });
    }
    
    // Send token response immediately (no email verification required)
    await sendTokenResponse(user, 201, res);
  } catch (err) {
    console.error('Registration error:', err);
    
    // Handle MongoDB duplicate key errors
    if (err.code === 11000) {
      const field = Object.keys(err.keyPattern)[0];
      return next(new ErrorResponse(`${field.charAt(0).toUpperCase() + field.slice(1)} is already in use`, 400));
    }
    
    // Handle validation errors
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(val => val.message);
      return next(new ErrorResponse(messages.join(', '), 400));
    }
    
    // Handle other errors
    return next(new ErrorResponse('Error creating user account: ' + (err.message || 'Unknown error'), 500));
  }
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res, next) => {
  console.log('Login attempt received:', { email: req.body.email });
  const { email, password } = req.body;

  // Validate email & password
  if (!email || !password) {
    console.log('Login failed: Missing email or password');
    return next(new ErrorResponse('Please provide an email and password', 400));
  }

  try {
    // Check for user
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      console.log(`Login failed: No user found with email ${email}`);
      return next(new ErrorResponse('Invalid credentials', 401));
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      console.log(`Login failed: Password mismatch for ${email}`);
      return next(new ErrorResponse('Invalid credentials', 401));
    }

    // Check if user is active
    if (!user.isActive) {
      console.log(`Login failed: Account deactivated for ${email}`);
      return next(new ErrorResponse('Your account has been deactivated. Please contact support.', 401));
    }

    console.log(`Login successful for user: ${user.email} (${user.role})`);
    
    // Send token in response
    await sendTokenResponse(user, 200, res);
  } catch (err) {
    console.error('Login error:', err);
    return next(new ErrorResponse('Error during login process', 500));
  }
});

// @desc    Log user out / clear cookie
// @route   GET /api/auth/logout
// @access  Private
exports.logout = asyncHandler(async (req, res, next) => {
  console.log('Logout request received');
  
  try {
    // Clear refresh token in database if user is authenticated
    if (req.user) {
      console.log(`Clearing refresh token for user: ${req.user.id}`);
      const user = await User.findById(req.user.id);
      if (user) {
        user.refreshToken = undefined;
        await user.save({ validateBeforeSave: false });
      }
    }

    // Get cookie options for clearing
    const cookieOptions = {
      httpOnly: true,
      path: '/'
    };

    // Add secure flag in production
    if (process.env.NODE_ENV === 'production') {
      cookieOptions.secure = true;
      cookieOptions.sameSite = 'none';
    }

    // Clear both access and refresh token cookies
    // Set expiry to past date to ensure immediate deletion
    res.cookie('token', 'logged-out', {
      ...cookieOptions,
      expires: new Date(Date.now() - 10000)
    });
    
    res.cookie('refreshToken', 'logged-out', {
      ...cookieOptions,
      path: '/api/auth/refresh-token',
      expires: new Date(Date.now() - 10000)
    });

    console.log('Logout successful - cookies cleared');
    
    res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (err) {
    console.error('Logout error:', err);
    return next(new ErrorResponse('Error during logout process', 500));
  }
});

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = asyncHandler(async (req, res, next) => {
  // user is already available in req due to the protect middleware
  const user = await User.findById(req.user.id)
    .populate('addresses')
    .populate({
      path: 'buyerInfo.wishlist',
      select: 'name price images rating'
    });

  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc    Update user details
// @route   PUT /api/auth/updatedetails
// @access  Private
exports.updateDetails = asyncHandler(async (req, res, next) => {
  const fieldsToUpdate = {
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone
  };

  // Remove undefined fields
  Object.keys(fieldsToUpdate).forEach(key => 
    fieldsToUpdate[key] === undefined && delete fieldsToUpdate[key]
  );

  const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc    Update password
// @route   PUT /api/auth/updatepassword
// @access  Private
exports.updatePassword = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password');

  // Check current password
  if (!(await user.matchPassword(req.body.currentPassword))) {
    return next(new ErrorResponse('Password is incorrect', 401));
  }

  user.password = req.body.newPassword;
  await user.save();

  sendTokenResponse(user, 200, res);
});

// @desc    Forgot password
// @route   POST /api/auth/forgotpassword
// @access  Public
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorResponse('There is no user with that email', 404));
  }

  // Get reset token
  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  // Create reset url
  const resetUrl = `${req.protocol}://${req.get(
    'host'
  )}/api/auth/resetpassword/${resetToken}`;

  const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please click the link to reset your password: \n\n ${resetUrl}`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Password Reset Token',
      message
    });

    res.status(200).json({ success: true, data: 'Email sent' });
  } catch (err) {
    console.log(err);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new ErrorResponse('Email could not be sent', 500));
  }
});

// @desc    Refresh access token using refresh token
// @route   POST /api/auth/refresh-token
// @access  Public
exports.refreshToken = asyncHandler(async (req, res, next) => {
  console.log('Token refresh request received');
  
  try {
    // Get refresh token from cookie or request body
    const refreshToken = req.cookies.refreshToken || req.body.refreshToken;
    
    if (!refreshToken) {
      console.log('Refresh token missing');
      return next(new ErrorResponse('Authentication invalid - no refresh token', 401));
    }
    
    // Hash the refresh token to compare with stored hash
    const refreshTokenHash = crypto
      .createHash('sha256')
      .update(refreshToken)
      .digest('hex');
    
    // Find user with this refresh token
    const user = await User.findOne({ refreshToken: refreshTokenHash });
    
    if (!user) {
      console.log('No user found with the provided refresh token');
      return next(new ErrorResponse('Invalid refresh token', 401));
    }
    
    // Verify the refresh token
    try {
      jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || 'luxuryecommercerefreshsecret456');
    } catch (err) {
      console.log('Refresh token verification failed:', err.message);
      
      // Clear the invalid refresh token
      user.refreshToken = undefined;
      await user.save({ validateBeforeSave: false });
      
      // Clear cookies
      res.cookie('refreshToken', 'expired', {
        httpOnly: true,
        expires: new Date(Date.now() - 10000),
        path: '/api/auth/refresh-token'
      });
      
      return next(new ErrorResponse('Refresh token expired or invalid', 401));
    }
    
    // Generate new tokens
    console.log(`Generating new tokens for user: ${user.email}`);
    
    // Create new access token
    const accessToken = user.getSignedJwtToken();
    
    // Create new refresh token
    const newRefreshToken = user.getRefreshToken();
    
    // Save the new refresh token
    await user.save({ validateBeforeSave: false });
    
    // Set cookie expiry times
    const accessTokenExpiry = parseInt(process.env.JWT_COOKIE_EXPIRE || 1) * 24 * 60 * 60 * 1000;
    const refreshTokenExpiry = parseInt(process.env.JWT_REFRESH_COOKIE_EXPIRE || 7) * 24 * 60 * 60 * 1000;
    
    // Cookie options
    const accessTokenCookieOptions = {
      expires: new Date(Date.now() + accessTokenExpiry),
      httpOnly: true,
      path: '/'
    };
    
    const refreshTokenCookieOptions = {
      expires: new Date(Date.now() + refreshTokenExpiry),
      httpOnly: true,
      path: '/api/auth/refresh-token'
    };
    
    // Add secure flag in production
    if (process.env.NODE_ENV === 'production') {
      accessTokenCookieOptions.secure = true;
      refreshTokenCookieOptions.secure = true;
      accessTokenCookieOptions.sameSite = 'none';
      refreshTokenCookieOptions.sameSite = 'none';
    }
    
    // Send response with new tokens
    res.cookie('token', accessToken, accessTokenCookieOptions)
       .cookie('refreshToken', newRefreshToken, refreshTokenCookieOptions)
       .status(200)
       .json({
         success: true,
         token: accessToken,
         user: {
           id: user._id,
           name: user.name,
           email: user.email,
           role: user.role,
           avatar: user.avatar,
           isVerified: user.isVerified
         }
       });
  } catch (err) {
    console.error('Error in refresh token process:', err);
    return next(new ErrorResponse('Failed to refresh authentication', 500));
  }
});

// @desc    Reset password
// @route   PUT /api/auth/resetpassword/:resettoken
// @access  Public
exports.resetPassword = asyncHandler(async (req, res, next) => {
  // Get hashed token
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.resettoken)
    .digest('hex');

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() }
  });

  if (!user) {
    return next(new ErrorResponse('Invalid token', 400));
  }

  // Set new password
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  sendTokenResponse(user, 200, res);
});

// @desc    Verify email
// @route   GET /api/auth/verify-email/:verificationtoken
// @access  Public
exports.verifyEmail = asyncHandler(async (req, res, next) => {
  // Get hashed token
  const emailVerificationToken = crypto
    .createHash('sha256')
    .update(req.params.verificationtoken)
    .digest('hex');

  const user = await User.findOne({
    emailVerificationToken,
    emailVerificationExpire: { $gt: Date.now() }
  });

  if (!user) {
    return next(new ErrorResponse('Invalid token', 400));
  }

  // Set user as verified
  user.isVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationExpire = undefined;
  await user.save();

  res.status(200).json({
    success: true,
    message: 'Email verified successfully'
  });
});

// @desc    Refresh token
// @route   POST /api/auth/refresh-token
// @access  Public
exports.refreshToken = asyncHandler(async (req, res, next) => {
  // Get refresh token from cookie or request body
  const refreshToken = req.cookies.refreshToken || req.body.refreshToken;
  
  console.log('Refresh token attempt received');
  console.log('Cookie refresh token:', req.cookies.refreshToken);
  console.log('Body refresh token:', req.body.refreshToken);
  console.log('All cookies:', req.cookies);

  if (!refreshToken) {
    return next(new ErrorResponse('No refresh token provided', 400));
  }

  try {
    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    console.log('Refresh token decoded:', decoded);

    // Find user by ID
    const user = await User.findById(decoded.id);

    if (!user) {
      console.log('User not found with ID:', decoded.id);
      return next(new ErrorResponse('Invalid refresh token - user not found', 401));
    }
    
    // Verify the stored hashed refresh token
    const isValidToken = await user.matchRefreshToken(refreshToken);
    
    if (!isValidToken) {
      console.log('Refresh token does not match stored token');
      return next(new ErrorResponse('Invalid refresh token - token mismatch', 401));
    }
    
    console.log('Refresh token valid, generating new tokens for user:', user.email);

    // Generate new tokens
    sendTokenResponse(user, 200, res);
  } catch (err) {
    console.error('Refresh token verification failed:', err.message);
    return next(new ErrorResponse(`Invalid refresh token: ${err.message}`, 401));
  }
});

// Helper function to get token from model, create cookie and send response
const sendTokenResponse = async (user, statusCode, res) => {
  console.log(`Generating tokens for user: ${user.email}`);
  
  try {
    // Create access token with short expiry
    const token = user.getSignedJwtToken();
    
    // Create refresh token with longer expiry
    const refreshToken = user.getRefreshToken();
    
    // Save refresh token to database
    try {
      await user.save({ validateBeforeSave: false });
      console.log('Refresh token saved to database');
    } catch (saveErr) {
      console.error('Error saving refresh token:', saveErr);
      return res.status(500).json({
        success: false,
        error: 'Failed to save authentication state. Please try again.'
      });
    }

    // Get cookie expiry times from environment or use defaults
    const accessTokenExpiry = parseInt(process.env.JWT_COOKIE_EXPIRE || 1) * 24 * 60 * 60 * 1000; // Default 1 day
    const refreshTokenExpiry = parseInt(process.env.JWT_REFRESH_COOKIE_EXPIRE || 7) * 24 * 60 * 60 * 1000; // Default 7 days

    // Production-ready cookie options for access token
    const accessTokenCookieOptions = {
      expires: new Date(Date.now() + accessTokenExpiry),
      httpOnly: true,
      path: '/',
      sameSite: 'lax' // Balances security and usability
    };

    // Production-ready cookie options for refresh token (longer expiry)
    const refreshTokenCookieOptions = {
      expires: new Date(Date.now() + refreshTokenExpiry),
      httpOnly: true,
      path: '/', // Allow access from all API endpoints
      sameSite: 'lax'
    };

    // Add secure flag in production
    if (process.env.NODE_ENV === 'production') {
      accessTokenCookieOptions.secure = true;
      refreshTokenCookieOptions.secure = true;
      // Use 'none' for cross-site in production with HTTPS
      accessTokenCookieOptions.sameSite = 'none';
      refreshTokenCookieOptions.sameSite = 'none';
    }

    // Get frontend origin for CORS
    const origin = process.env.FRONTEND_URL || 'http://localhost:5173';
    
    console.log('Sending token response with secure cookies');
    
    // Log cookie settings for debugging
    console.log('Access token cookie options:', accessTokenCookieOptions);
    console.log('Refresh token cookie options:', refreshTokenCookieOptions);
    
    // Set both cookies and send tokens in response body
    res.status(statusCode)
      .cookie('token', token, accessTokenCookieOptions)
      .cookie('refreshToken', refreshToken, refreshTokenCookieOptions)
      .json({
        success: true,
        token, // Include in body for non-cookie clients
        refreshToken, // Include refresh token in body for frontend storage
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          isVerified: user.isVerified,
          createdAt: user.createdAt
        }
      });
  } catch (err) {
    console.error('Error in sendTokenResponse:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to generate authentication tokens'
    });
  }
};
