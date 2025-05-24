const express = require('express');
const cors = require('cors');

// Create Express app
const app = express();

// Enable CORS for all routes
app.use(cors({ origin: '*' }));

// Parse JSON request body
app.use(express.json());

// Simple test route
app.get('/', (req, res) => {
  res.json({ message: 'Test server is running!' });
});

// Auth routes
app.post('/api/auth/login', (req, res) => {
  console.log('Login request received:', req.body);
  res.json({
    success: true,
    token: 'test-token',
    refreshToken: 'test-refresh-token',
    user: {
      id: '123456',
      name: 'Test User',
      email: req.body.email || 'test@example.com',
      role: 'buyer',
      avatar: 'default-avatar.jpg',
      isVerified: true,
      createdAt: new Date()
    }
  });
});

app.post('/api/auth/register', (req, res) => {
  console.log('Register request received:', req.body);
  res.json({
    success: true,
    token: 'test-token',
    refreshToken: 'test-refresh-token',
    user: {
      id: '123456',
      name: req.body.name || 'Test User',
      email: req.body.email || 'test@example.com',
      role: req.body.role || 'buyer',
      avatar: 'default-avatar.jpg',
      isVerified: true,
      createdAt: new Date()
    }
  });
});

// Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Test server running on port ${PORT}`);
  console.log(`API endpoints:`);
  console.log(`- POST http://localhost:${PORT}/api/auth/login`);
  console.log(`- POST http://localhost:${PORT}/api/auth/register`);
});
