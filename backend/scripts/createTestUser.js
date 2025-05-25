const mongoose = require('mongoose');
const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Create test user
const createTestUser = async () => {
  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email: 'apoorva@gmail.com' });
    
    if (existingUser) {
      console.log('Test user already exists');
      process.exit(0);
    }
    
    // Create test user
    const user = await User.create({
      name: 'Apoorva',
      email: 'apoorva@gmail.com',
      username: 'apoorva',
      password: await bcrypt.hash('password123', 10),
      role: 'seller',
      isEmailVerified: true,
      sellerInfo: {
        businessName: 'Apoorva Shop',
        businessAddress: '123 Test Street',
        businessPhone: '555-1234',
        taxId: '12345678',
        isVerified: true
      }
    });
    
    console.log(`Test user created: ${user.email}`);
    process.exit(0);
  } catch (error) {
    console.error(`Error creating test user: ${error.message}`);
    process.exit(1);
  }
};

// Run the function
connectDB().then(() => {
  createTestUser();
});
