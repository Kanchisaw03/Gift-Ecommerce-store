import React, { useState } from 'react';
import { motion } from 'framer-motion';

const SuperAdminFeaturedProducts = () => {
  // Mock data for products
  const [allProducts, setAllProducts] = useState([
    {
      id: 1,
      name: 'Luxury Gold Watch',
      price: 1499.99,
      image: 'gold-watch.jpg',
      category: 'Jewelry & Watches',
      seller: 'Premium Timepieces',
      rating: 4.8,
      featured: true,
      featuredPosition: 1,
      featuredIn: ['homepage', 'category']
    },
    {
      id: 2,
      name: 'Crystal Champagne Flutes (Set of 2)',
      price: 129.99,
      image: 'champagne-flutes.jpg',
      category: 'Glassware & Bar',
      seller: 'Luxury Tableware Co.',
      rating: 4.7,
      featured: true,
      featuredPosition: 2,
      featuredIn: ['homepage']
    },
    {
      id: 3,
      name: 'Cashmere Throw Blanket',
      price: 249.99,
      image: 'cashmere-blanket.jpg',
      category: 'Textiles & Bedding',
      seller: 'Soft Luxuries',
      rating: 4.9,
      featured: true,
      featuredPosition: 3,
      featuredIn: ['homepage', 'category']
    },
    {
      id: 4,
      name: 'Marble Cheese Board',
      price: 89.99,
      image: 'marble-cheese-board.jpg',
      category: 'Home Decor',
      seller: 'Elegant Home',
      rating: 4.6,
      featured: true,
      featuredPosition: 4,
      featuredIn: ['category']
    },
    {
      id: 5,
      name: 'Leather Journal',
      price: 59.99,
      image: 'leather-journal.jpg',
      category: 'Stationery & Desk',
      seller: 'Artisan Papers',
      rating: 4.5,
      featured: false,
      featuredPosition: null,
      featuredIn: []
    },
    {
      id: 6,
      name: 'Scented Candle Set',
      price: 79.99,
      image: 'candle-set.jpg',
      category: 'Home Decor',
      seller: 'Aromatic Luxuries',
      rating: 4.7,
      featured: false,
      featuredPosition: null,
      featuredIn: []
    },
    {
      id: 7,
      name: 'Silk Pillowcase',
      price: 69.99,
      image: 'silk-pillowcase.jpg',
      category: 'Textiles & Bedding',
      seller: 'Soft Luxuries',
      rating: 4.8,
      featured: false,
      featuredPosition: null,
      featuredIn: []
    },
    {
      id: 8,
      name: 'Diamond Pendant Necklace',
      price: 2499.99,
      image: 'diamond-necklace.jpg',
      category: 'Jewelry & Watches',
      seller: 'Exquisite Gems',
      rating: 4.9,
      featured: false,
      featuredPosition: null,
      featuredIn: []
    },
    {
      id: 9,
      name: 'Crystal Decanter',
      price: 199.99,
      image: 'crystal-decanter.jpg',
      category: 'Glassware & Bar',
      seller: 'Luxury Tableware Co.',
      rating: 4.7,
      featured: false,
      featuredPosition: null,
      featuredIn: []
    },
    {
      id: 10,
      name: 'Porcelain Vase',
      price: 149.99,
      image: 'porcelain-vase.jpg',
      category: 'Home Decor',
      seller: 'Elegant Home',
      rating: 4.6,
      featured: false,
      featuredPosition: null,
      featuredIn: []
    }
  ]);

  const [filter, setFilter] = useState({
    search: '',
    category: '',
    featured: 'all'
  });

  const [featuredSection, setFeaturedSection] = useState('homepage');
  const [draggedProduct, setDraggedProduct] = useState(null);

  // Filter products
  const filteredProducts = allProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(filter.search.toLowerCase());
    const matchesCategory = !filter.category || product.category === filter.category;
    const matchesFeatured = filter.featured === 'all' || 
      (filter.featured === 'featured' && product.featured) || 
      (filter.featured === 'not-featured' && !product.featured);
    
    return matchesSearch && matchesCategory && matchesFeatured;
  });

  // Get featured products for the selected section
  const featuredProducts = allProducts
    .filter(product => product.featured && product.featuredIn.includes(featuredSection))
    .sort((a, b) => a.featuredPosition - b.featuredPosition);

  // Get unique categories
  const categories = [...new Set(allProducts.map(product => product.category))];

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter({
      ...filter,
      [name]: value
    });
  };

  const handleToggleFeatured = (product) => {
    const updatedProducts = allProducts.map(p => {
      if (p.id === product.id) {
        if (p.featured) {
          // Remove from featured
          return {
            ...p,
            featured: false,
            featuredPosition: null,
            featuredIn: []
          };
        } else {
          // Add to featured
          const maxPosition = Math.max(0, ...featuredProducts.map(fp => fp.featuredPosition));
          return {
            ...p,
            featured: true,
            featuredPosition: maxPosition + 1,
            featuredIn: [featuredSection]
          };
        }
      }
      return p;
    });
    
    setAllProducts(updatedProducts);
  };

  const handleAddToSection = (product) => {
    const updatedProducts = allProducts.map(p => {
      if (p.id === product.id) {
        const updatedFeaturedIn = [...p.featuredIn];
        
        if (!updatedFeaturedIn.includes(featuredSection)) {
          updatedFeaturedIn.push(featuredSection);
        }
        
        return {
          ...p,
          featuredIn: updatedFeaturedIn
        };
      }
      return p;
    });
    
    setAllProducts(updatedProducts);
  };

  const handleRemoveFromSection = (product) => {
    const updatedProducts = allProducts.map(p => {
      if (p.id === product.id) {
        const updatedFeaturedIn = p.featuredIn.filter(section => section !== featuredSection);
        
        return {
          ...p,
          featuredIn: updatedFeaturedIn,
          // If not featured anywhere, remove featured status
          featured: updatedFeaturedIn.length > 0,
          featuredPosition: updatedFeaturedIn.length > 0 ? p.featuredPosition : null
        };
      }
      return p;
    });
    
    setAllProducts(updatedProducts);
  };

  const handleDragStart = (product) => {
    setDraggedProduct(product);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (targetPosition) => {
    if (!draggedProduct) return;
    
    const updatedProducts = allProducts.map(p => {
      if (p.id === draggedProduct.id) {
        return {
          ...p,
          featuredPosition: targetPosition
        };
      } else if (p.featured && p.featuredIn.includes(featuredSection)) {
        // Adjust other positions
        if (p.featuredPosition === targetPosition) {
          // This is the position being replaced
          return {
            ...p,
            featuredPosition: draggedProduct.featuredPosition
          };
        }
      }
      return p;
    });
    
    setAllProducts(updatedProducts);
    setDraggedProduct(null);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.3 }
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen bg-[#0A0A0A] text-white p-6"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-playfair font-bold text-white">Featured Products</h1>
            <p className="text-gray-400 mt-1">Manage featured products across the platform</p>
          </div>
          <div className="mt-4 md:mt-0">
            <select
              value={featuredSection}
              onChange={(e) => setFeaturedSection(e.target.value)}
              className="bg-[#1E1E1E] border border-gray-700 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] text-white"
            >
              <option value="homepage">Homepage</option>
              <option value="category">Category Pages</option>
              <option value="collection">Collections</option>
              <option value="seasonal">Seasonal Promotions</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Featured Products Section */}
          <motion.div 
            variants={itemVariants}
            className="lg:col-span-2 bg-[#121212] rounded-lg shadow-lg p-6 border border-gray-800"
          >
            <h3 className="text-xl font-playfair font-semibold mb-4 text-white">
              Featured Products - {featuredSection.charAt(0).toUpperCase() + featuredSection.slice(1)}
            </h3>
            
            {featuredProducts.length === 0 ? (
              <div className="bg-[#1A1A1A] rounded-lg p-8 text-center">
                <p className="text-gray-400">No products featured in this section yet</p>
                <p className="text-gray-500 text-sm mt-2">Drag products here or use the "Add to Featured" button</p>
              </div>
            ) : (
              <div className="space-y-4">
                {featuredProducts.map((product) => (
                  <div 
                    key={product.id}
                    className="bg-[#1A1A1A] rounded-lg p-4 flex items-center justify-between"
                    draggable
                    onDragStart={() => handleDragStart(product)}
                    onDragOver={handleDragOver}
                    onDrop={() => handleDrop(product.featuredPosition)}
                  >
                    <div className="flex items-center">
                      <div className="mr-3 text-[#D4AF37] font-semibold">
                        {product.featuredPosition}
                      </div>
                      <div className="w-12 h-12 bg-[#2A2A2A] rounded-md mr-4 flex items-center justify-center text-xs text-gray-400">
                        {product.image ? 'Image' : 'No Image'}
                      </div>
                      <div>
                        <h4 className="font-medium text-white">{product.name}</h4>
                        <p className="text-sm text-gray-400">${product.price.toFixed(2)} • {product.category}</p>
                      </div>
                    </div>
                    <div>
                      <button
                        onClick={() => handleRemoveFromSection(product)}
                        className="px-2 py-1 bg-red-900 text-red-300 rounded hover:bg-red-800 transition-colors text-xs"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Product Filters and List */}
          <motion.div variants={itemVariants} className="bg-[#121212] rounded-lg shadow-lg p-6 border border-gray-800">
            <h3 className="text-xl font-playfair font-semibold mb-4 text-white">All Products</h3>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Search
                </label>
                <input
                  type="text"
                  name="search"
                  value={filter.search}
                  onChange={handleFilterChange}
                  placeholder="Search products..."
                  className="w-full bg-[#1E1E1E] border border-gray-700 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Category
                </label>
                <select
                  name="category"
                  value={filter.category}
                  onChange={handleFilterChange}
                  className="w-full bg-[#1E1E1E] border border-gray-700 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                >
                  <option value="">All Categories</option>
                  {categories.map((category, index) => (
                    <option key={index} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Featured Status
                </label>
                <select
                  name="featured"
                  value={filter.featured}
                  onChange={handleFilterChange}
                  className="w-full bg-[#1E1E1E] border border-gray-700 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                >
                  <option value="all">All Products</option>
                  <option value="featured">Featured Only</option>
                  <option value="not-featured">Not Featured</option>
                </select>
              </div>
            </div>
            
            <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
              {filteredProducts.map((product) => (
                <div 
                  key={product.id}
                  className="bg-[#1A1A1A] rounded-lg p-3 flex flex-col"
                  draggable={product.featured}
                  onDragStart={() => handleDragStart(product)}
                >
                  <div className="flex items-center mb-2">
                    <div className="w-10 h-10 bg-[#2A2A2A] rounded-md mr-3 flex items-center justify-center text-xs text-gray-400">
                      {product.image ? 'Image' : 'No Image'}
                    </div>
                    <div>
                      <h4 className="font-medium text-white text-sm">{product.name}</h4>
                      <p className="text-xs text-gray-400">${product.price.toFixed(2)}</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex space-x-1">
                      {product.featured && (
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-[#D4AF37] text-black">
                          Featured
                        </span>
                      )}
                      {product.featuredIn && product.featuredIn.includes(featuredSection) && (
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-green-900 text-green-300">
                          In This Section
                        </span>
                      )}
                    </div>
                    <div className="flex space-x-1">
                      {product.featured ? (
                        <>
                          {!product.featuredIn.includes(featuredSection) && (
                            <button
                              onClick={() => handleAddToSection(product)}
                              className="px-2 py-0.5 bg-[#1E1E1E] text-white rounded hover:bg-gray-800 transition-colors text-xs"
                            >
                              Add Here
                            </button>
                          )}
                          <button
                            onClick={() => handleToggleFeatured(product)}
                            className="px-2 py-0.5 bg-gray-700 text-gray-300 rounded hover:bg-gray-600 transition-colors text-xs"
                          >
                            Unfeature
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => handleToggleFeatured(product)}
                          className="px-2 py-0.5 bg-[#D4AF37] text-black rounded hover:bg-[#B8860B] transition-colors text-xs"
                        >
                          Feature
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              {filteredProducts.length === 0 && (
                <div className="py-8 text-center text-gray-400">
                  No products match your filters
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Instructions */}
        <motion.div 
          variants={itemVariants}
          className="mt-8 bg-[#121212] rounded-lg shadow-lg p-6 border border-gray-800"
        >
          <h3 className="text-xl font-playfair font-semibold mb-4 text-white">How to Manage Featured Products</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#1A1A1A] p-4 rounded-lg">
              <div className="text-[#D4AF37] font-medium mb-2">1. Feature Products</div>
              <p className="text-sm text-gray-300">Use the "Feature" button to mark products as featured. Featured products can be displayed in multiple sections.</p>
            </div>
            <div className="bg-[#1A1A1A] p-4 rounded-lg">
              <div className="text-[#D4AF37] font-medium mb-2">2. Add to Sections</div>
              <p className="text-sm text-gray-300">Select a section from the dropdown and add featured products to that specific section.</p>
            </div>
            <div className="bg-[#1A1A1A] p-4 rounded-lg">
              <div className="text-[#D4AF37] font-medium mb-2">3. Arrange Products</div>
              <p className="text-sm text-gray-300">Drag and drop featured products to change their display order within each section.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default SuperAdminFeaturedProducts;
