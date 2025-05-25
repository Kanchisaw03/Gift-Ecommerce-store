const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Get MongoDB URI from environment
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error('MONGO_URI environment variable is not defined in the .env file');
  console.log('Please make sure your .env file contains a valid MONGO_URI');
  process.exit(1);
}

console.log('Connecting to MongoDB at:', MONGO_URI);

// Connect to MongoDB
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB Connected'))
.catch(err => {
  console.error('MongoDB Connection Error:', err);
  process.exit(1);
});

// Import models
const Product = require('../models/product.model');
const Category = require('../models/category.model');
const User = require('../models/user.model');

// Read the products.js file content
const productsJsPath = path.join(__dirname, '../../my-project/src/data/products.js');
const productsJsContent = fs.readFileSync(productsJsPath, 'utf8');

// Extract products array using regex (safer than eval)
const productsMatch = productsJsContent.match(/const\s+products\s*=\s*\[([\s\S]*?)\];/);
const categoriesMatch = productsJsContent.match(/export\s+const\s+categories\s*=\s*\[([\s\S]*?)\];/);

if (!productsMatch || !categoriesMatch) {
  console.error('Could not parse products or categories from file');
  process.exit(1);
}

// Parse the categories
const categoriesString = categoriesMatch[1];
const categoriesArray = [];

// Extract each category object
const categoryRegex = /{\s*id:\s*['"]([^'"]+)['"]\s*,\s*name:\s*['"]([^'"]+)['"]\s*}/g;
let categoryMatch;

while ((categoryMatch = categoryRegex.exec(categoriesString)) !== null) {
  if (categoryMatch[1] !== 'all') { // Skip the "all" category as it's just for UI filtering
    categoriesArray.push({
      name: categoryMatch[2],
      slug: categoryMatch[1].toLowerCase(),
      description: `${categoryMatch[2]} category for gift products`,
      showInMenu: true,
      isActive: true
    });
  }
}

// Parse the products
const productsString = productsMatch[1];
const productsArray = [];

// Extract each product object
const productRegex = /{\s*id:\s*['"]([^'"]+)['"]\s*,\s*name:\s*['"]([^'"]+)['"]\s*,\s*category:\s*['"]([^'"]+)['"]\s*,\s*image:\s*['"]([^'"]+)['"]\s*,\s*price:\s*([^,]+)\s*,\s*description:\s*['"]([^'"]+)['"]\s*,\s*tags:\s*\[(.*?)\]\s*,\s*rating:\s*([^,]+)\s*,\s*stock:\s*([^,]+)\s*,\s*featured:\s*([^}]+)\s*}/g;
let productMatch;

while ((productMatch = productRegex.exec(productsString)) !== null) {
  // Extract tags
  const tagsString = productMatch[7];
  const tags = tagsString.split(',').map(tag => 
    tag.trim().replace(/['"]/g, '')
  );

  productsArray.push({
    id: productMatch[1],
    name: productMatch[2],
    categorySlug: productMatch[3],
    image: productMatch[4],
    price: parseFloat(productMatch[5]),
    description: productMatch[6],
    tags: tags,
    rating: parseFloat(productMatch[8]),
    stock: parseInt(productMatch[9]),
    featured: productMatch[10].trim() === 'true'
  });
}

// Import function
const importData = async () => {
  try {
    // Find a seller user to assign as the product seller
    const seller = await User.findOne({ role: 'seller' });
    
    if (!seller) {
      console.error('No seller user found. Please create a seller user first.');
      process.exit(1);
    }

    console.log(`Found seller: ${seller.name} (${seller.email})`);
    
    // Import categories first
    console.log('Importing categories...');
    
    const categoryMap = {};
    
    for (const category of categoriesArray) {
      // Check if category already exists
      let existingCategory = await Category.findOne({ 
        $or: [
          { name: category.name },
          { slug: category.slug }
        ]
      });
      
      if (!existingCategory) {
        existingCategory = await Category.create(category);
        console.log(`Created new category: ${existingCategory.name}`);
      } else {
        console.log(`Category already exists: ${existingCategory.name}`);
      }
      
      // Store category id by slug for product import
      categoryMap[category.slug.toLowerCase()] = existingCategory._id;
    }
    
    // Import products
    console.log('Importing products...');
    
    let created = 0;
    let skipped = 0;
    
    for (const product of productsArray) {
      // Check if product already exists by name
      const existingProduct = await Product.findOne({ name: product.name });
      
      if (existingProduct) {
        console.log(`Product already exists: ${product.name}`);
        skipped++;
        continue;
      }
      
      // Find category ID
      const categoryId = categoryMap[product.categorySlug.toLowerCase()];
      
      if (!categoryId) {
        console.log(`Category not found for product: ${product.name}, category: ${product.categorySlug}`);
        skipped++;
        continue;
      }
      
      // Create a placeholder image URL if the original is a relative path
      let imageUrl = product.image;
      if (imageUrl.startsWith('src/assets/')) {
        // For demo purposes, use a placeholder image service
        const imageName = path.basename(product.image).replace(/\.[^/.]+$/, ""); // Remove extension
        imageUrl = `https://source.unsplash.com/featured/?${encodeURIComponent(product.name.split(' ')[0])}`;
      }
      
      // Create product
      const newProduct = await Product.create({
        name: product.name,
        description: product.description,
        price: product.price,
        category: categoryId,
        tags: product.tags,
        stock: product.stock,
        featured: product.featured,
        seller: seller._id,
        status: 'approved', // Auto-approve imported products
        images: [{
          public_id: `products/${Date.now()}`,
          url: imageUrl
        }],
        rating: product.rating,
        numReviews: Math.floor(Math.random() * 50) + 5 // Random number of reviews between 5-55
      });
      
      console.log(`Created product: ${newProduct.name}`);
      created++;
    }
    
    console.log(`Import complete! Created ${created} products, skipped ${skipped} existing products.`);
    process.exit();
  } catch (error) {
    console.error('Error importing data:', error);
    process.exit(1);
  }
};

// Run the import
importData();
