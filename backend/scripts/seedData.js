const mongoose = require('mongoose');
const Product = require('../models/product.model');
const Category = require('../models/category.model');
const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const cloudinary = require('../utils/cloudinary');
const fs = require('fs');
const path = require('path');

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

// Import frontend hardcoded data
const importFrontendData = async () => {
  try {
    // Read the products.js file from frontend
    const productsPath = path.resolve(__dirname, '../../my-project/src/data/products.js');
    let productsContent = fs.readFileSync(productsPath, 'utf8');
    
    // Extract the products array using regex
    const productsMatch = productsContent.match(/const\s+products\s*=\s*(\[[\s\S]*?\]);/);
    const categoriesMatch = productsContent.match(/export\s+const\s+categories\s*=\s*(\[[\s\S]*?\]);/);
    
    if (!productsMatch || !categoriesMatch) {
      throw new Error('Could not parse products or categories from file');
    }
    
    // Convert the extracted strings to actual JavaScript objects
    const productsArray = eval(productsMatch[1]);
    const categoriesArray = eval(categoriesMatch[1]);
    
    return { products: productsArray, categories: categoriesArray };
  } catch (error) {
    console.error(`Error importing frontend data: ${error.message}`);
    process.exit(1);
  }
};

// Seed categories
const seedCategories = async (categoriesArray) => {
  try {
    // Clear existing categories
    await Category.deleteMany({});
    console.log('Categories cleared');
    
    // Create category map to store MongoDB IDs
    const categoryMap = new Map();
    
    // Create categories
    for (const category of categoriesArray) {
      if (category.id === 'all') continue; // Skip the "All Categories" option
      
      const newCategory = await Category.create({
        name: category.name,
        slug: category.name.toLowerCase().replace(/\s+/g, '-'),
        description: `Category for ${category.name} products`,
        featured: Math.random() > 0.5, // Randomly set featured status
        showInMenu: true,
        isActive: true
      });
      
      categoryMap.set(category.id, newCategory._id);
      console.log(`Created category: ${newCategory.name}`);
    }
    
    return categoryMap;
  } catch (error) {
    console.error(`Error seeding categories: ${error.message}`);
    process.exit(1);
  }
};

// Seed admin user
const seedUsers = async () => {
  try {
    // Check if users already exist
    const existingUsers = await User.find();
    if (existingUsers.length > 0) {
      console.log(`${existingUsers.length} users already exist, skipping user creation`);
      // Find a seller user to use for products
      const sellerUser = await User.findOne({ role: 'seller' });
      if (sellerUser) {
        console.log(`Using existing seller: ${sellerUser.email}`);
        return { sellerUser };
      }
      
      // If no seller exists, use the first user as seller
      console.log(`No seller found, using first user as seller`);
      return { sellerUser: existingUsers[0] };
    }
    
    // Clear existing users if needed
    await User.deleteMany({});
    console.log('Users cleared');
    
    // Create admin user
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      username: 'admin',
      password: await bcrypt.hash('password123', 10),
      role: 'admin',
      isEmailVerified: true
    });
    
    // Create seller user
    const sellerUser = await User.create({
      name: 'Seller User',
      email: 'seller@example.com',
      username: 'seller',
      password: await bcrypt.hash('password123', 10),
      role: 'seller',
      isEmailVerified: true,
      sellerInfo: {
        businessName: 'Test Seller Shop',
        businessAddress: '123 Seller Street',
        businessPhone: '555-1234',
        taxId: '12345678',
        isVerified: true
      }
    });
    
    // Create buyer user
    const buyerUser = await User.create({
      name: 'Buyer User',
      email: 'buyer@example.com',
      username: 'buyer',
      password: await bcrypt.hash('password123', 10),
      role: 'user',
      isEmailVerified: true
    });
    
    // Create super admin user
    const superAdminUser = await User.create({
      name: 'Super Admin',
      email: 'super@example.com',
      username: 'superadmin',
      password: await bcrypt.hash('password123', 10),
      role: 'super_admin',
      isEmailVerified: true
    });
    
    console.log('Users created successfully');
    return { adminUser, sellerUser, buyerUser, superAdminUser };
  } catch (error) {
    console.error(`Error seeding users: ${error.message}`);
    
    // If there's an error, try to find an existing seller
    try {
      const existingSeller = await User.findOne({ role: 'seller' });
      if (existingSeller) {
        console.log(`Using existing seller: ${existingSeller.email}`);
        return { sellerUser: existingSeller };
      }
      
      // If no seller exists, use any user
      const anyUser = await User.findOne();
      if (anyUser) {
        console.log(`No seller found, using user: ${anyUser.email}`);
        return { sellerUser: anyUser };
      }
    } catch (err) {
      console.error(`Failed to find fallback user: ${err.message}`);
    }
    
    process.exit(1);
  }
};

// Upload image to cloudinary or use placeholder
const uploadProductImage = async (imagePath) => {
  try {
    // Check if image path is from frontend assets
    if (imagePath && imagePath.startsWith('src/assets/')) {
      const localPath = path.resolve(__dirname, '../../my-project/', imagePath);
      
      // Check if file exists
      if (fs.existsSync(localPath)) {
        const result = await cloudinary.uploader.upload(localPath, {
          folder: 'products',
          transformation: [
            { width: 800, height: 800, crop: 'limit' },
            { quality: 'auto:good' }
          ]
        });
        
        return {
          public_id: result.public_id,
          url: result.secure_url
        };
      }
    }
    
    // Return placeholder image if original image not found
    return {
      public_id: 'products/placeholder',
      url: '/assets/images/product-placeholder.jpg'
    };
  } catch (error) {
    console.error(`Error uploading image: ${error.message}`);
    return {
      public_id: 'products/placeholder',
      url: '/assets/images/product-placeholder.jpg'
    };
  }
};

// Seed products
const seedProducts = async (productsArray, categoryMap, sellerUser) => {
  try {
    // Check if products already exist
    const existingProducts = await Product.countDocuments();
    if (existingProducts > 0) {
      console.log(`${existingProducts} products already exist in the database. Skipping product creation.`);
      return;
    }
    
    // Clear existing products
    await Product.deleteMany({});
    console.log('Products cleared');
    
    // Create products
    const createdProducts = [];
    
    for (const product of productsArray) {
      try {
        // Get category ID from map or use default
        let categoryId;
        if (product.category && categoryMap.has(product.category)) {
          categoryId = categoryMap.get(product.category);
        } else {
          // Get the first category as default
          categoryId = Array.from(categoryMap.values())[0];
        }
        
        // Upload or get placeholder image
        const imageData = await uploadProductImage(product.image);
        
        // Create product
        const newProduct = await Product.create({
          name: product.name,
          slug: product.name.toLowerCase().replace(/\s+/g, '-'),
          description: product.description,
          price: product.price,
          salePrice: product.salePrice || 0,
          onSale: product.salePrice ? true : false,
          category: categoryId,
          tags: product.tags || [],
          images: [imageData],
          stock: product.stock || 10,
          sold: 0,
          seller: sellerUser._id,
          rating: product.rating || 0,
          numReviews: 0,
          featured: product.featured || false,
          status: 'approved' // Auto-approve products for demo
        });
        
        createdProducts.push(newProduct);
        console.log(`Created product: ${newProduct.name}`);
      } catch (productError) {
        console.error(`Error creating product ${product.name}: ${productError.message}`);
        // Continue with next product instead of exiting
      }
    }
    
    console.log(`Products seeded successfully: ${createdProducts.length} products created`);
  } catch (error) {
    console.error(`Error seeding products: ${error.message}`);
    // Don't exit the process, allow it to continue with other operations
  }
};

// Main seed function
const seedDatabase = async () => {
  try {
    // Connect to database
    await connectDB();
    
    // Import frontend data
    const { products, categories } = await importFrontendData();
    console.log(`Imported ${products.length} products and ${categories.length} categories from frontend`);
    
    // Seed users
    const { sellerUser } = await seedUsers();
    
    // Seed categories
    const categoryMap = await seedCategories(categories);
    
    // Seed products
    await seedProducts(products, categoryMap, sellerUser);
    
    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error(`Error seeding database: ${error.message}`);
    process.exit(1);
  }
};

// Run the seed function
seedDatabase();
