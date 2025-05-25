const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

// Configuration
const API_URL = 'http://localhost:5000/api';
const TOKEN = 'YOUR_SELLER_TOKEN_HERE'; // Replace with a valid seller token

// Test product data
const testProduct = {
  name: 'Test Luxury Product',
  description: 'This is a test luxury product with a detailed description that meets the minimum length requirements.',
  price: 199.99,
  stock: 10,
  category: '64f5b3d5e85f95bd2f8a2c59', // Replace with a valid category ID from your database
  isOnSale: false,
  isFeatured: false
};

// Function to create a product
async function createProduct() {
  try {
    console.log('Creating test product...');
    
    // Create FormData instance
    const formData = new FormData();
    
    // Add product data to FormData
    Object.keys(testProduct).forEach(key => {
      formData.append(key, testProduct[key]);
    });
    
    // Add a test image if available
    const testImagePath = path.join(__dirname, 'test-image.jpg');
    if (fs.existsSync(testImagePath)) {
      formData.append('images', fs.createReadStream(testImagePath));
      console.log('Added test image to form data');
    } else {
      console.log('No test image found at', testImagePath);
    }
    
    // Log FormData contents
    console.log('FormData contents:');
    for (const [key, value] of Object.entries(formData.getHeaders())) {
      console.log(`${key}: ${value}`);
    }
    
    // Make API request
    const response = await axios.post(`${API_URL}/products`, formData, {
      headers: {
        ...formData.getHeaders(),
        'Authorization': `Bearer ${TOKEN}`
      }
    });
    
    console.log('Product created successfully!');
    console.log('Response:', JSON.stringify(response.data, null, 2));
    return response.data;
  } catch (error) {
    console.error('Error creating product:');
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
      console.error('Response headers:', error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error setting up request:', error.message);
    }
    throw error;
  }
}

// Function to test the product API
async function testProductAPI() {
  try {
    // Test creating a product
    const createdProduct = await createProduct();
    console.log('Test completed successfully!');
  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

// Run the test
testProductAPI();
