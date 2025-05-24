const mongoose = require('mongoose');
const dotenv = require('dotenv');
const colors = require('colors');
const bcrypt = require('bcryptjs');

// Load env vars
dotenv.config();

// Import models
const User = require('../models/user.model');
const Setting = require('../models/setting.model');
const SettingService = require('../services/setting.service');

// Connect to DB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Create super admin user
const createSuperAdmin = async () => {
  try {
    // Check if super admin already exists
    const existingSuperAdmin = await User.findOne({ role: 'super_admin' });
    
    if (existingSuperAdmin) {
      console.log('Super admin already exists'.yellow);
      return existingSuperAdmin;
    }
    
    // Create super admin
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);
    
    const superAdmin = await User.create({
      name: 'Super Admin',
      email: 'superadmin@example.com',
      password: hashedPassword,
      role: 'super_admin',
      isVerified: true,
      isActive: true
    });
    
    console.log('Super admin created:'.green);
    console.log(`Email: ${superAdmin.email}`.green);
    console.log('Password: admin123'.green);
    
    return superAdmin;
  } catch (error) {
    console.error('Error creating super admin:'.red, error);
    process.exit(1);
  }
};

// Create test users for all roles
const createTestUsers = async () => {
  try {
    const roles = ['buyer', 'seller', 'admin'];
    const createdUsers = [];
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);
    
    for (const role of roles) {
      // Check if test user for this role already exists
      const existingUser = await User.findOne({ email: `${role}@example.com` });
      
      if (existingUser) {
        console.log(`Test ${role} already exists`.yellow);
        createdUsers.push(existingUser);
        continue;
      }
      
      // Create user with specific role
      const userData = {
        name: role.charAt(0).toUpperCase() + role.slice(1),
        email: `${role}@example.com`,
        password: hashedPassword,
        role,
        isVerified: true,
        isActive: true
      };
      
      // Add role-specific data
      if (role === 'seller') {
        userData.sellerInfo = {
          businessName: 'Test Luxury Store',
          businessAddress: '123 Luxury Avenue, New York, NY 10001',
          businessDescription: 'A luxury store for testing purposes',
          taxId: 'TAX123456789',
          isApproved: true,
          rating: 4.5,
          totalSales: 50,
          totalRevenue: 10000,
          commission: 10
        };
      } else if (role === 'buyer') {
        userData.buyerInfo = {
          totalOrders: 5,
          totalSpent: 2500
        };
        userData.wishlist = [];
      }
      
      const user = await User.create(userData);
      
      console.log(`Test ${role} created:`.green);
      console.log(`Email: ${user.email}`.green);
      console.log('Password: password123'.green);
      
      createdUsers.push(user);
    }
    
    return createdUsers;
  } catch (error) {
    console.error('Error creating test users:'.red, error);
    process.exit(1);
  }
};

// Initialize settings
const initializeSettings = async (userId) => {
  try {
    // Check if settings already exist
    const existingSettings = await Setting.countDocuments();
    
    if (existingSettings > 0) {
      console.log('Settings already initialized'.yellow);
      return;
    }
    
    // Initialize default settings
    const createdSettings = await SettingService.initializeDefaultSettings(userId);
    
    console.log(`${createdSettings.length} default settings created`.green);
  } catch (error) {
    console.error('Error initializing settings:'.red, error);
    process.exit(1);
  }
};

// Main function
const init = async () => {
  try {
    console.log('Initializing database...'.cyan);
    
    // Create super admin
    const superAdmin = await createSuperAdmin();
    
    // Create test users
    await createTestUsers();
    
    // Initialize settings
    await initializeSettings(superAdmin._id);
    
    console.log('Database initialization complete!'.green.bold);
    console.log('\nYou can now access the system with the following accounts:'.cyan);
    console.log('Super Admin: superadmin@example.com / admin123'.cyan);
    console.log('Admin: admin@example.com / password123'.cyan);
    console.log('Seller: seller@example.com / password123'.cyan);
    console.log('Buyer: buyer@example.com / password123'.cyan);
    console.log('\nNote: Authentication is currently disabled for development purposes.'.yellow);
    console.log('To enable authentication, set DISABLE_AUTH to false in middleware/auth.js'.yellow);
    
    process.exit(0);
  } catch (error) {
    console.error('Error during database initialization:'.red, error);
    process.exit(1);
  }
};

// Run initialization
init();
