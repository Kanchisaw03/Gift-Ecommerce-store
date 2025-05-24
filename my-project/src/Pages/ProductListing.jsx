import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { luxuryTheme } from '../styles/luxuryTheme';

// Mock product data for development
const mockProducts = [
  {
    id: 1,
    name: 'Luxury Gold Watch',
    price: 1299.99,
    discountedPrice: 999.99,
    images: ['https://example.com/watch1.jpg'],
    rating: 4.8,
    reviewCount: 124,
    category: 'Watches'
  },
  {
    id: 2,
    name: 'Diamond Pendant Necklace',
    price: 2499.99,
    discountedPrice: 2499.99,
    images: ['https://example.com/necklace1.jpg'],
    rating: 4.9,
    reviewCount: 86,
    category: 'Jewelry'
  },
  {
    id: 3,
    name: 'Italian Leather Handbag',
    price: 899.99,
    discountedPrice: 749.99,
    images: ['https://example.com/handbag1.jpg'],
    rating: 4.7,
    reviewCount: 152,
    category: 'Accessories'
  },
  {
    id: 4,
    name: 'Crystal Champagne Glasses (Set of 2)',
    price: 349.99,
    discountedPrice: 299.99,
    images: ['https://example.com/glasses1.jpg'],
    rating: 4.6,
    reviewCount: 78,
    category: 'Home'
  }
];

// Mock function to get products
const getProducts = async (filters = {}) => {
  // This would be replaced with an actual API call
  return Promise.resolve({
    products: mockProducts,
    totalCount: mockProducts.length,
    totalPages: 1
  });
};

const ProductListing = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    category: '',
    priceRange: [0, 10000],
    sortBy: 'featured'
  });
  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await getProducts(filters);
        setProducts(data.products);
        setError(null);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, [filters]);
  
  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gray-900 text-white"
    >
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-serif font-bold text-gold mb-2">Luxury Collection</h1>
          <div className="flex items-center text-sm text-gray-400">
            <Link to="/" className="hover:text-gold transition-colors">Home</Link>
            <span className="mx-2">›</span>
            <span className="text-gold">Products</span>
          </div>
        </div>
        
        {/* Filter and Sort Controls */}
        <div className="flex flex-col md:flex-row justify-between mb-8">
          <div className="mb-4 md:mb-0">
            {/* Category filter would go here */}
          </div>
          <div className="flex items-center">
            <label htmlFor="sort" className="mr-2 text-sm">Sort by:</label>
            <select
              id="sort"
              className="bg-gray-800 border border-gray-700 text-white rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-gold"
              value={filters.sortBy}
              onChange={(e) => handleFilterChange({ sortBy: e.target.value })}
            >
              <option value="featured">Featured</option>
              <option value="price-low-high">Price: Low to High</option>
              <option value="price-high-low">Price: High to Low</option>
              <option value="newest">Newest</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>
        
        {/* Product Grid */}
        {products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl">No products found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ProductListing;