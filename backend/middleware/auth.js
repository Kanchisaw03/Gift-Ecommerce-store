const jwt = require('jsonwebtoken');
const asyncHandler = require('./async');
const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/user.model');

// Authentication is fully enabled - development mode is disabled
const DISABLE_AUTH = false; // Using real authentication with database users

// Mock users for different roles during development
const MOCK_USERS = {
  buyer: {
    _id: '000000000000000000000001',
    id: '000000000000000000000001',
    name: 'Mock Buyer',
    email: 'buyer@example.com',
    role: 'buyer',
    isActive: true,
    isVerified: true,
    buyerInfo: {
      totalOrders: 5,
      totalSpent: 1500
    },
    wishlist: []
  },
  seller: {
    _id: '000000000000000000000002',
    id: '000000000000000000000002',
    name: 'Mock Seller',
    email: 'seller@example.com',
    role: 'seller',
    isActive: true,
    isVerified: true,
    sellerInfo: {
      isApproved: true,
      businessName: 'Luxury Goods Co.',
      commission: 10
    }
  },
  admin: {
    _id: '000000000000000000000003',
    id: '000000000000000000000003',
    name: 'Mock Admin',
    email: 'admin@example.com',
    role: 'admin',
    isActive: true,
    isVerified: true
  },
  super_admin: {
    _id: '000000000000000000000004',
    id: '000000000000000000000004',
    name: 'Mock Super Admin',
    email: 'superadmin@example.com',
    role: 'super_admin',
    isActive: true,
    isVerified: true
  }
}

// Protect routes
exports.protect = asyncHandler(async (req, res, next) => {
  // TODO: Remove this development bypass before production deployment
  if (DISABLE_AUTH) {
    // In development mode, determine role from request or default to super_admin
    let role = 'super_admin';
    
    // Check if role is specified in headers, query, or body
    if (req.headers['x-user-role']) {
      role = req.headers['x-user-role'];
    } else if (req.query.role) {
      role = req.query.role;
    } else if (req.body.role) {
      role = req.body.role;
    } else if (req.cookies && req.cookies.userRole) {
      role = req.cookies.userRole;
    } else {
      // Get role from localStorage via the Authorization header if available
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        try {
          // Extract token
          const token = authHeader.split(' ')[1];
          // Verify token (simplified for development)
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          role = decoded.role || 'super_admin';
        } catch (err) {
          console.log('Token verification failed, using default role');
        }
      }
    }
    
    // Set mock user based on role
    req.user = {
      _id: '000000000000000000000001',
      id: '000000000000000000000001',
      name: `Development ${role.charAt(0).toUpperCase() + role.slice(1)}`,
      email: `${role}@example.com`,
      role: role,
      isActive: true,
      isVerified: true
    };
    
    // Add role-specific properties
    if (role === 'buyer') {
      req.user.buyerInfo = { totalOrders: 5, totalSpent: 1500 };
      req.user.wishlist = [];
    } else if (role === 'seller') {
      req.user.sellerInfo = { isApproved: true, businessName: 'Dev Business', commission: 10 };
    }
    
    console.log(`Development mode: Using mock ${role} user`);
    return next();
  }

  let token;

  // Get token from header or cookies
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // Set token from Bearer token in header
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies && req.cookies.token) {
    // Set token from cookie
    token = req.cookies.token;
  }

  // Make sure token exists
  if (!token) {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'luxuryecommercesecret123');
    console.log('Token verified successfully');
    
    // Get user from the token
    req.user = await User.findById(decoded.id);

    // Check if user exists
    if (!req.user) {
      console.log('User not found with id:', decoded.id);
      return next(new ErrorResponse('User not found or deleted', 401));
    }

    // Check if user is active
    if (!req.user.isActive) {
      console.log('User account is deactivated:', decoded.id);
      return next(new ErrorResponse('Your account has been deactivated. Please contact support.', 401));
    }
    
    // Check if user is verified (optional, can be removed if email verification is not required)
    if (!req.user.isVerified && process.env.REQUIRE_EMAIL_VERIFICATION === 'true') {
      console.log('User account is not verified:', decoded.id);
      return next(new ErrorResponse('Please verify your email address before accessing this resource', 403));
    }
    
    console.log(`User authenticated: ${req.user.email} (${req.user.role})`);
    next();
  } catch (err) {
    console.error('Token verification failed:', err.message);
    
    // Provide more specific error messages based on the error type
    if (err.name === 'TokenExpiredError') {
      return next(new ErrorResponse('Your session has expired. Please log in again.', 401));
    } else if (err.name === 'JsonWebTokenError') {
      return next(new ErrorResponse('Invalid authentication token. Please log in again.', 401));
    } else {
      return next(new ErrorResponse('Not authorized to access this route', 401));
    }
  }
});

// Grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    // TODO: Remove this development bypass before production deployment
    if (DISABLE_AUTH) {
      console.log(`Development mode: Bypassing role authorization for ${roles.join(', ')}`);
      return next();
    }

    if (!req.user) {
      return next(new ErrorResponse('User not found', 404));
    }

    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorResponse(
          `User role ${req.user.role} is not authorized to access this route`,
          403
        )
      );
    }
    next();
  };
};

// Check if user is a seller (no approval required)
exports.isApprovedSeller = asyncHandler(async (req, res, next) => {
  // Only check if the user is a seller, no approval required
  if (req.user.role !== 'seller') {
    return next(
      new ErrorResponse('Only sellers can access this route', 403)
    );
  }
  
  // Auto-approve all sellers
  next();
});

// Optional auth - doesn't require authentication but will use it if provided
exports.optionalAuth = asyncHandler(async (req, res, next) => {
  // TODO: Remove this development bypass before production deployment
  if (DISABLE_AUTH) {
    // In development mode, set a mock user with super_admin role
    req.user = {
      _id: '000000000000000000000000',
      id: '000000000000000000000000',
      name: 'Development User',
      email: 'dev@example.com',
      role: 'super_admin',
      isActive: true,
      isVerified: true,
      sellerInfo: {
        isApproved: true,
        businessName: 'Dev Business',
        commission: 10
      },
      buyerInfo: {
        totalOrders: 0,
        totalSpent: 0
      },
      wishlist: []
    };
    return next();
  }

  let token;

  // Get token from header or cookies
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // Set token from Bearer token in header
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies && req.cookies.token) {
    // Set token from cookie
    token = req.cookies.token;
  }

  // If no token, continue without setting user
  if (!token) {
    return next();
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from the token
    req.user = await User.findById(decoded.id);

    // If user is not active, treat as not authenticated
    if (!req.user || !req.user.isActive) {
      req.user = null;
    }

    next();
  } catch (err) {
    // If token is invalid, continue without setting user
    req.user = null;
    next();
  }
});
