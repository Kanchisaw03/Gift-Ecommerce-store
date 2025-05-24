const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

// Create a simple Express app for testing
const app = express();

// Enable CORS for all origins
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept']
}));

// Parse JSON request body
app.use(bodyParser.json());

// Root route for testing
app.get('/', (req, res) => {
  res.json({ message: 'API test server is running!' });
});

// Test auth routes
app.post('/api/auth/login', (req, res) => {
  console.log('Login request received:', req.body);
  
  // Simple validation
  if (!req.body.email || !req.body.password) {
    return res.status(400).json({ 
      success: false, 
      error: 'Please provide email and password' 
    });
  }
  
  // Return mock user data
  res.json({
    success: true,
    token: 'test-token-123',
    refreshToken: 'test-refresh-token-123',
    user: {
      id: '123456789',
      name: 'Test User',
      email: req.body.email,
      role: 'buyer',
      avatar: 'default-avatar.jpg',
      isVerified: true,
      createdAt: new Date()
    }
  });
});

app.post('/api/auth/register', (req, res) => {
  console.log('Register request received:', req.body);
  
  // Simple validation
  if (!req.body.name || !req.body.email || !req.body.password) {
    return res.status(400).json({ 
      success: false, 
      error: 'Please provide name, email and password' 
    });
  }
  
  // Return mock user data
  res.json({
    success: true,
    token: 'test-token-123',
    refreshToken: 'test-refresh-token-123',
    user: {
      id: '123456789',
      name: req.body.name,
      email: req.body.email,
      role: req.body.role || 'buyer',
      avatar: 'default-avatar.jpg',
      isVerified: true,
      createdAt: new Date()
    }
  });
});

// Start server on a different port to avoid conflicts
const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Test API server running on port ${PORT}`);
  console.log(`Available endpoints:`);
  console.log(`- GET  http://localhost:${PORT}/`);
  console.log(`- POST http://localhost:${PORT}/api/auth/login`);
  console.log(`- POST http://localhost:${PORT}/api/auth/register`);
});
