const express = require('express');
const router = express.Router();

// Simple test endpoint
router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is working correctly',
    timestamp: new Date().toISOString()
  });
});

// Test products endpoint that returns minimal data
router.get('/products', (req, res) => {
  res.status(200).json({
    success: true,
    count: 2,
    data: [
      {
        _id: '1',
        name: 'Test Product 1',
        price: 99.99,
        description: 'This is a test product'
      },
      {
        _id: '2',
        name: 'Test Product 2',
        price: 149.99,
        description: 'This is another test product'
      }
    ]
  });
});

module.exports = router;
