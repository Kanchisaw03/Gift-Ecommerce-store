const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const colors = require('colors');

// Load environment variables
dotenv.config();

// Load models
const User = require('../models/user.model');
const Product = require('../models/product.model');
const Category = require('../models/category.model');
const Order = require('../models/order.model');

// Connect to database
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Sample users data with all roles
const users = [
  {
    name: 'Super Admin User',
    email: 'superadmin@example.com',
    password: 'password123',
    role: 'super_admin',
    username: 'superadmin_user',
    isVerified: true,
    isActive: true,
    phone: '1234567890'
  },
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'password123',
    role: 'admin',
    username: 'admin_user',
    isVerified: true,
    isActive: true,
    phone: '1234567891'
  },
  {
    name: 'Approved Seller',
    email: 'seller@example.com',
    password: 'password123',
    role: 'seller',
    username: 'approved_seller',
    isVerified: true,
    isActive: true,
    phone: '1234567892',
    sellerInfo: {
      businessName: 'Luxury Goods Store',
      businessAddress: '123 Commerce St, Business City, BC 12345',
      businessDescription: 'High-end luxury products for discerning customers',
      taxId: 'TAX123456789',
      paymentDetails: {
        accountHolder: 'Luxury Goods LLC',
        accountNumber: '9876543210',
        bankName: 'Commerce Bank',
        swiftCode: 'CMBCUS123'
      },
      isApproved: true,
      rating: 4.8,
      totalSales: 250,
      totalRevenue: 45000,
      commission: 10
    }
  },
  {
    name: 'Pending Seller',
    email: 'pending@example.com',
    password: 'password123',
    role: 'seller',
    username: 'pending_seller',
    isVerified: true,
    isActive: true,
    phone: '1234567893',
    sellerInfo: {
      businessName: 'New Seller Shop',
      businessAddress: '456 Market St, Commerce City, CC 54321',
      businessDescription: 'Unique handcrafted items and gifts',
      taxId: 'TAX987654321',
      paymentDetails: {
        accountHolder: 'New Seller LLC',
        accountNumber: '1234567890',
        bankName: 'Market Bank',
        swiftCode: 'MKTBUS456'
      },
      isApproved: false,
      rating: 0,
      totalSales: 0,
      totalRevenue: 0,
      commission: 15
    }
  },
  {
    name: 'Regular Buyer',
    email: 'buyer@example.com',
    password: 'password123',
    role: 'buyer',
    username: 'regular_buyer',
    isVerified: true,
    isActive: true,
    phone: '1234567894'
  }
];

// Import users to database
const importUsers = async () => {
  try {
    // Clear existing users
    await User.deleteMany();
    console.log('Existing users deleted'.red.inverse);

    // Hash passwords and create users
    const createdUsers = [];
    for (const user of users) {
      // Hash password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
      
      // Create user
      const createdUser = await User.create(user);
      createdUsers.push(createdUser);
      console.log(`Created ${user.role} user: ${user.email}`.green);
    }

    console.log('Users imported successfully'.green.inverse);
    return createdUsers;
  } catch (error) {
    console.error(`Error: ${error.message}`.red.bold);
    process.exit(1);
  }
};

// Run the import
importUsers().then(() => {
  console.log('Database seeded with users!'.cyan.bold);
  mongoose.disconnect();
});
