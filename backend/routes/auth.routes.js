const express = require('express');
const {
  register,
  login,
  logout,
  getMe,
  forgotPassword,
  resetPassword,
  updateDetails,
  updatePassword,
  verifyEmail,
  refreshToken
} = require('../controllers/auth.controller');

const router = express.Router();

// Import middleware
const { protect } = require('../middleware/auth');

// Routes
// Base route for /api/auth
router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Auth API is working',
    endpoints: [
      { method: 'POST', path: '/register', description: 'Register a new user' },
      { method: 'POST', path: '/login', description: 'Login a user' },
      { method: 'GET', path: '/logout', description: 'Logout a user' },
      { method: 'GET', path: '/me', description: 'Get current user profile' },
      { method: 'POST', path: '/forgotpassword', description: 'Request password reset' },
      { method: 'PUT', path: '/resetpassword/:resettoken', description: 'Reset password with token' },
      { method: 'PUT', path: '/updatedetails', description: 'Update user details' },
      { method: 'PUT', path: '/updatepassword', description: 'Update user password' },
      { method: 'GET', path: '/verify-email/:verificationtoken', description: 'Verify email address' },
      { method: 'POST', path: '/refresh-token', description: 'Refresh access token' }
    ]
  });
});
router.post('/register', register);
router.post('/login', login);
// Support both GET and POST for logout to ensure compatibility
router.get('/logout', logout);
router.post('/logout', logout);
router.get('/me', protect, getMe);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:resettoken', resetPassword);
router.put('/updatedetails', protect, updateDetails);
router.put('/updatepassword', protect, updatePassword);
router.get('/verify-email/:verificationtoken', verifyEmail);
router.post('/refresh-token', refreshToken);

module.exports = router;
