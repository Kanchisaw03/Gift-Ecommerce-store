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
router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);
router.get('/me', protect, getMe);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:resettoken', resetPassword);
router.put('/updatedetails', protect, updateDetails);
router.put('/updatepassword', protect, updatePassword);
router.get('/verify-email/:verificationtoken', verifyEmail);
router.post('/refresh-token', refreshToken);

module.exports = router;