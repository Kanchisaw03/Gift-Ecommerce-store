const mongoose = require('mongoose');
const dotenv = require('dotenv');
const colors = require('colors');
const bcrypt = require('bcryptjs');

// Load env vars
dotenv.config();

// Load models
const User = require('../models/user.model');
const Category = require('../models/category.model');
const Product = require('../models/product.model');
const Order = require('../models/order.model');
const Review = require('../models/review.model');
const AuditLog = require('../models/auditLog.model');

// Connect to DB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Sample data
// Users
const users = [
  {
    name: 'Super Admin',
    email: 'superadmin@example.com',
    password: 'password123',
    role: 'super_admin',
    isVerified: true,
    isActive: true
  },
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'password123',
    role: 'admin',
    isVerified: true,
    isActive: true
  },
  {
    name: 'Luxury Seller',
    email: 'seller@example.com',
    password: 'password123',
    role: 'seller',
    isVerified: true,
    isActive: true,
    sellerInfo: {
      businessName: 'Luxury Gifts Co.',
      businessAddress: '123 Luxury Avenue, New York, NY 10001',
      businessDescription: 'We specialize in high-end luxury gifts for all occasions.',
      taxId: 'TAX123456789',
      paymentDetails: {
        accountHolder: 'Luxury Gifts Co.',
        accountNumber: '1234567890',
        bankName: 'Luxury Bank',
        swiftCode: 'LUXBANKXXX'
      },
      isApproved: true,
      rating: 4.8,
      totalSales: 156,
      totalRevenue: 24500
    }
  },
  {
    name: 'John Buyer',
    email: 'buyer@example.com',
    password: 'password123',
    role: 'buyer',
    isVerified: true,
    isActive: true,
    buyerInfo: {
      totalOrders: 5,
      totalSpent: 1250
    }
  }
];

// Categories
const categories = [
  {
    name: 'Jewelry',
    description: 'Luxury jewelry items including necklaces, rings, and bracelets',
    image: {
      public_id: 'categories/jewelry',
      url: 'https://res.cloudinary.com/demo/image/upload/v1612345678/categories/jewelry.jpg'
    },
    featured: true,
    showInMenu: true,
    order: 1
  },
  {
    name: 'Watches',
    description: 'Luxury watches from top brands',
    image: {
      public_id: 'categories/watches',
      url: 'https://res.cloudinary.com/demo/image/upload/v1612345678/categories/watches.jpg'
    },
    featured: true,
    showInMenu: true,
    order: 2
  },
  {
    name: 'Accessories',
    description: 'Luxury accessories including bags, wallets, and more',
    image: {
      public_id: 'categories/accessories',
      url: 'https://res.cloudinary.com/demo/image/upload/v1612345678/categories/accessories.jpg'
    },
    featured: true,
    showInMenu: true,
    order: 3
  },
  {
    name: 'Home Decor',
    description: 'Luxury home decor items',
    image: {
      public_id: 'categories/home-decor',
      url: 'https://res.cloudinary.com/demo/image/upload/v1612345678/categories/home-decor.jpg'
    },
    featured: false,
    showInMenu: true,
    order: 4
  },
  {
    name: 'Fragrances',
    description: 'Luxury fragrances and perfumes',
    image: {
      public_id: 'categories/fragrances',
      url: 'https://res.cloudinary.com/demo/image/upload/v1612345678/categories/fragrances.jpg'
    },
    featured: false,
    showInMenu: true,
    order: 5
  }
];

// Products
const products = [
  {
    name: 'Luxury Gold Watch',
    description: 'Elegant gold watch with diamond accents. Perfect for special occasions.',
    price: 1299.99,
    category: null, // Will be set after categories are created
    tags: ['watch', 'gold', 'luxury', 'gift'],
    images: [
      {
        public_id: 'products/watch1',
        url: 'https://res.cloudinary.com/demo/image/upload/v1612345678/products/watch1.jpg'
      },
      {
        public_id: 'products/watch1-2',
        url: 'https://res.cloudinary.com/demo/image/upload/v1612345678/products/watch1-2.jpg'
      }
    ],
    stock: 15,
    seller: null, // Will be set after users are created
    rating: 4.8,
    numReviews: 24,
    featured: true,
    status: 'approved',
    shippingInfo: {
      weight: 0.5,
      dimensions: {
        length: 10,
        width: 10,
        height: 5
      },
      shippingTime: '3-5',
      freeShipping: true
    }
  },
  {
    name: 'Diamond Necklace',
    description: 'Stunning diamond necklace with 18k gold chain. A timeless piece for any collection.',
    price: 2499.99,
    category: null, // Will be set after categories are created
    tags: ['necklace', 'diamond', 'gold', 'luxury', 'gift'],
    images: [
      {
        public_id: 'products/necklace1',
        url: 'https://res.cloudinary.com/demo/image/upload/v1612345678/products/necklace1.jpg'
      },
      {
        public_id: 'products/necklace1-2',
        url: 'https://res.cloudinary.com/demo/image/upload/v1612345678/products/necklace1-2.jpg'
      }
    ],
    stock: 8,
    seller: null, // Will be set after users are created
    rating: 5.0,
    numReviews: 18,
    featured: true,
    status: 'approved',
    shippingInfo: {
      weight: 0.3,
      dimensions: {
        length: 8,
        width: 8,
        height: 3
      },
      shippingTime: '3-5',
      freeShipping: true
    }
  },
  {
    name: 'Leather Wallet',
    description: 'Premium leather wallet with multiple card slots and elegant design.',
    price: 199.99,
    category: null, // Will be set after categories are created
    tags: ['wallet', 'leather', 'accessory', 'gift'],
    images: [
      {
        public_id: 'products/wallet1',
        url: 'https://res.cloudinary.com/demo/image/upload/v1612345678/products/wallet1.jpg'
      }
    ],
    stock: 25,
    seller: null, // Will be set after users are created
    rating: 4.5,
    numReviews: 12,
    featured: false,
    status: 'approved',
    shippingInfo: {
      weight: 0.2,
      dimensions: {
        length: 12,
        width: 9,
        height: 2
      },
      shippingTime: '3-5',
      freeShipping: true
    }
  },
  {
    name: 'Crystal Decanter Set',
    description: 'Elegant crystal decanter set with 6 matching glasses. Perfect for entertaining.',
    price: 349.99,
    category: null, // Will be set after categories are created
    tags: ['decanter', 'crystal', 'home', 'gift'],
    images: [
      {
        public_id: 'products/decanter1',
        url: 'https://res.cloudinary.com/demo/image/upload/v1612345678/products/decanter1.jpg'
      }
    ],
    stock: 10,
    seller: null, // Will be set after users are created
    rating: 4.7,
    numReviews: 9,
    featured: false,
    status: 'approved',
    shippingInfo: {
      weight: 3.0,
      dimensions: {
        length: 40,
        width: 30,
        height: 20
      },
      shippingTime: '5-7',
      freeShipping: true
    }
  },
  {
    name: 'Luxury Perfume',
    description: 'Exquisite fragrance with notes of jasmine, rose, and sandalwood.',
    price: 129.99,
    category: null, // Will be set after categories are created
    tags: ['perfume', 'fragrance', 'luxury', 'gift'],
    images: [
      {
        public_id: 'products/perfume1',
        url: 'https://res.cloudinary.com/demo/image/upload/v1612345678/products/perfume1.jpg'
      }
    ],
    stock: 30,
    seller: null, // Will be set after users are created
    rating: 4.6,
    numReviews: 15,
    featured: true,
    status: 'approved',
    shippingInfo: {
      weight: 0.5,
      dimensions: {
        length: 15,
        width: 10,
        height: 10
      },
      shippingTime: '3-5',
      freeShipping: true
    }
  }
];

// Import data into DB
const importData = async () => {
  try {
    // Clear existing data
    await User.deleteMany();
    await Category.deleteMany();
    await Product.deleteMany();
    await Order.deleteMany();
    await Review.deleteMany();
    await AuditLog.deleteMany();

    console.log('Data cleared...'.red.inverse);

    // Create users with hashed passwords
    const createdUsers = await Promise.all(
      users.map(async user => {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        return user;
      })
    );
    
    const userDocs = await User.insertMany(createdUsers);
    
    console.log('Users imported...'.green.inverse);

    // Map user IDs
    const superAdminUser = userDocs.find(user => user.role === 'super_admin');
    const sellerUser = userDocs.find(user => user.role === 'seller');
    const buyerUser = userDocs.find(user => user.role === 'buyer');

    // Create categories
    const categoryDocs = await Category.insertMany(
      categories.map(category => ({
        ...category,
        createdBy: superAdminUser._id,
        updatedBy: superAdminUser._id
      }))
    );
    
    console.log('Categories imported...'.green.inverse);

    // Map category IDs
    const jewelryCategory = categoryDocs.find(cat => cat.name === 'Jewelry');
    const watchesCategory = categoryDocs.find(cat => cat.name === 'Watches');
    const accessoriesCategory = categoryDocs.find(cat => cat.name === 'Accessories');
    const homeDecorCategory = categoryDocs.find(cat => cat.name === 'Home Decor');
    const fragrancesCategory = categoryDocs.find(cat => cat.name === 'Fragrances');

    // Create products with mapped IDs
    const mappedProducts = products.map(product => {
      let category;
      
      // Assign categories based on product name/tags
      if (product.name.includes('Watch')) {
        category = watchesCategory._id;
      } else if (product.name.includes('Necklace') || product.name.includes('Diamond')) {
        category = jewelryCategory._id;
      } else if (product.name.includes('Wallet')) {
        category = accessoriesCategory._id;
      } else if (product.name.includes('Decanter') || product.name.includes('Home')) {
        category = homeDecorCategory._id;
      } else if (product.name.includes('Perfume') || product.name.includes('Fragrance')) {
        category = fragrancesCategory._id;
      } else {
        category = accessoriesCategory._id; // Default
      }
      
      return {
        ...product,
        category,
        seller: sellerUser._id
      };
    });
    
    const productDocs = await Product.insertMany(mappedProducts);
    
    console.log('Products imported...'.green.inverse);

    // Create sample reviews
    const reviews = [
      {
        user: buyerUser._id,
        product: productDocs[0]._id, // Luxury Gold Watch
        rating: 5,
        title: 'Absolutely stunning!',
        content: 'This watch exceeded my expectations. The craftsmanship is impeccable and it looks even better in person. Highly recommended!',
        status: 'approved',
        isVerifiedPurchase: true,
        helpfulVotes: 12
      },
      {
        user: buyerUser._id,
        product: productDocs[1]._id, // Diamond Necklace
        rating: 5,
        title: 'A perfect gift',
        content: 'I purchased this necklace as an anniversary gift for my wife and she absolutely loves it. The diamonds sparkle beautifully and the gold chain is substantial.',
        status: 'approved',
        isVerifiedPurchase: true,
        helpfulVotes: 8
      }
    ];
    
    await Review.insertMany(reviews);
    
    console.log('Reviews imported...'.green.inverse);

    // Create sample order
    const order = {
      user: buyerUser._id,
      items: [
        {
          product: productDocs[0]._id,
          name: productDocs[0].name,
          image: productDocs[0].images[0].url,
          price: productDocs[0].price,
          quantity: 1,
          seller: sellerUser._id
        },
        {
          product: productDocs[2]._id,
          name: productDocs[2].name,
          image: productDocs[2].images[0].url,
          price: productDocs[2].price,
          quantity: 1,
          seller: sellerUser._id
        }
      ],
      shippingAddress: {
        firstName: 'John',
        lastName: 'Buyer',
        address: '123 Main St',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'United States',
        phone: '555-123-4567'
      },
      billingAddress: {
        firstName: 'John',
        lastName: 'Buyer',
        address: '123 Main St',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'United States',
        phone: '555-123-4567'
      },
      paymentInfo: {
        id: 'pi_mock_123456789',
        method: 'credit_card',
        status: 'completed',
        paidAt: Date.now()
      },
      subtotal: productDocs[0].price + productDocs[2].price,
      tax: (productDocs[0].price + productDocs[2].price) * 0.08,
      shippingCost: 0,
      total: (productDocs[0].price + productDocs[2].price) * 1.08,
      status: 'delivered',
      deliveredAt: Date.now()
    };
    
    await Order.create(order);
    
    console.log('Orders imported...'.green.inverse);

    // Create sample audit logs
    const auditLogs = [
      {
        user: superAdminUser._id,
        action: 'create',
        resourceType: 'user',
        resourceId: sellerUser._id,
        description: `Created new seller: ${sellerUser.name} (${sellerUser.email})`,
        ipAddress: '127.0.0.1',
        userAgent: 'Seeder Script'
      },
      {
        user: superAdminUser._id,
        action: 'approve',
        resourceType: 'user',
        resourceId: sellerUser._id,
        description: `Approved seller: ${sellerUser.name} (${sellerUser.email})`,
        ipAddress: '127.0.0.1',
        userAgent: 'Seeder Script'
      },
      {
        user: superAdminUser._id,
        action: 'create',
        resourceType: 'category',
        resourceId: jewelryCategory._id,
        description: `Created new category: ${jewelryCategory.name}`,
        ipAddress: '127.0.0.1',
        userAgent: 'Seeder Script'
      }
    ];
    
    await AuditLog.insertMany(auditLogs);
    
    console.log('Audit logs imported...'.green.inverse);

    console.log('Data Import Complete!'.green.inverse);
    process.exit();
  } catch (err) {
    console.error(`${err}`.red.inverse);
    process.exit(1);
  }
};

// Delete all data from DB
const destroyData = async () => {
  try {
    await User.deleteMany();
    await Category.deleteMany();
    await Product.deleteMany();
    await Order.deleteMany();
    await Review.deleteMany();
    await AuditLog.deleteMany();

    console.log('Data Destroyed!'.red.inverse);
    process.exit();
  } catch (err) {
    console.error(`${err}`.red.inverse);
    process.exit(1);
  }
};

// Determine which function to run based on command line args
if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
