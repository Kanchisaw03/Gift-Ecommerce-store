import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { getProducts } from '../services/api/productService';
import { getCategories } from '../services/api/categoryService';
import luxuryTheme from '../styles/luxuryTheme';
import { LuxurySearchIcon } from '../components/LuxuryIcons';

const ProductListing = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const searchInputRef = useRef(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0
  });

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories();
        if (response && response.data) {
          setCategories(response.data);
        } else if (Array.isArray(response)) {
          setCategories(response);
        } else {
          // Fallback to mock categories if API fails
          setCategories([
            { _id: 'watches', name: 'Watches' },
            { _id: 'jewelry', name: 'Jewelry' },
            { _id: 'accessories', name: 'Accessories' },
            { _id: 'home', name: 'Home Decor' },
            { _id: 'fashion', name: 'Fashion' }
          ]);
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
        // Fallback to mock categories
        setCategories([
          { _id: 'watches', name: 'Watches' },
          { _id: 'jewelry', name: 'Jewelry' },
          { _id: 'accessories', name: 'Accessories' },
          { _id: 'home', name: 'Home Decor' },
          { _id: 'fashion', name: 'Fashion' }
        ]);
      }
    };
    
    fetchCategories();
  }, []);

  // Fetch products when search term or category changes
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // API call with search and category filters
        const queryParams = {
          page: pagination.page,
          limit: pagination.limit
        };
        
        // Add search term if present
        if (searchTerm) {
          queryParams.search = searchTerm;
        }
        
        // Add category if selected
        if (selectedCategory) {
          queryParams.category = selectedCategory;
        }
        
        const response = await getProducts(queryParams);
        
        console.log('API response:', response);
        
        // Handle API response
        if (response) {
          let productsArray = [];
          
          // Handle different response formats
          if (response.success && response.data) {
            if (Array.isArray(response.data)) {
              productsArray = response.data;
            } else if (response.data.products && Array.isArray(response.data.products)) {
              productsArray = response.data.products;
            }
          } else if (Array.isArray(response)) {
            productsArray = response;
          }
          
          setProducts(productsArray);
          
          // Set pagination info if available
          if (response.pagination) {
            setPagination({
              page: response.pagination.currentPage || 1,
              limit: response.pagination.limit || 12,
              total: response.pagination.total || productsArray.length,
              totalPages: response.pagination.totalPages || Math.ceil(productsArray.length / 12)
            });
          } else {
            setPagination(prev => ({
              ...prev,
              total: productsArray.length,
              totalPages: Math.ceil(productsArray.length / 12)
            }));
          }
        }
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products. Please try again later.');
        toast.error('Failed to load products');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, [pagination.page, searchTerm, selectedCategory]);

  // Handle pagination
  const handlePageChange = (newPage) => {
    setPagination(prev => ({
      ...prev,
      page: newPage
    }));
  };
  
  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    setSearchTerm(searchInputRef.current.value);
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to page 1 when searching
  };
  
  // Handle category selection
  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId === selectedCategory ? '' : categoryId);
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to page 1 when changing category
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen"
      style={{
        backgroundColor: luxuryTheme.colors.neutral.darkest,
        color: luxuryTheme.colors.text.primary,
        fontFamily: luxuryTheme.typography.fontFamily.body
      }}
    >
      {/* Luxury Collection Header */}
      <div className="py-16 container mx-auto px-4">
        <div className="text-center mb-12">
          <div 
            className="inline-block mb-3 px-4 py-1 rounded-full" 
            style={{ 
              background: luxuryTheme.colors.gradients.goldLight,
              boxShadow: luxuryTheme.shadows.subtle
            }}
          >
            <span className="text-black text-sm font-medium tracking-wider uppercase">
              Curated Collection
            </span>
          </div>
          <h1 
            className="text-4xl md:text-5xl font-medium mb-4"
            style={{ 
              fontFamily: luxuryTheme.typography.fontFamily.heading,
              letterSpacing: '0.05em',
              background: luxuryTheme.colors.gradients.gold,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            LUXURY GIFT COLLECTION
          </h1>
          <p 
            className="text-gray-300 max-w-2xl mx-auto text-lg"
            style={{ 
              fontFamily: luxuryTheme.typography.fontFamily.body,
              letterSpacing: '0.03em',
              lineHeight: '1.6'
            }}
          >
            Discover our exquisite selection of premium gifts, meticulously crafted for those who appreciate the extraordinary
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 pb-16">
        {/* Search and Categories Section */}
        <div className="mb-10">
          {/* Search Form */}
          <form 
            onSubmit={handleSearch}
            className="relative max-w-md mx-auto mb-10"
          >
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search luxury gifts..."
              className="w-full px-5 py-3 rounded-full bg-black/30 border text-white focus:outline-none"
              style={{
                borderColor: luxuryTheme.colors.primary.accent,
                boxShadow: luxuryTheme.shadows.subtle,
                fontFamily: luxuryTheme.typography.fontFamily.body,
                letterSpacing: '0.03em'
              }}
              defaultValue={searchTerm}
            />
            <button
              type="submit"
              className="absolute right-0 top-0 h-full px-5 rounded-r-full transition-all duration-300"
              style={{
                background: luxuryTheme.colors.gradients.gold,
                color: '#000',
                boxShadow: luxuryTheme.shadows.subtle
              }}
            >
              <LuxurySearchIcon className="w-5 h-5" />
            </button>
          </form>
          
          {/* Category Bubbles */}
          <div className="overflow-x-auto pb-4 mb-8">
            <div className="flex space-x-4 min-w-max justify-center">
              <button
                onClick={() => handleCategorySelect('')}
                className={`px-6 py-3 rounded-full transition-all duration-300 ${selectedCategory === '' ? 'text-black font-medium' : 'text-white hover:text-gold-400'}`}
                style={{
                  background: selectedCategory === '' ? luxuryTheme.colors.gradients.gold : 'rgba(0,0,0,0.3)',
                  border: `1px solid ${selectedCategory === '' ? 'transparent' : luxuryTheme.colors.primary.accent}`,
                  boxShadow: selectedCategory === '' ? luxuryTheme.shadows.glow : 'none',
                  fontFamily: luxuryTheme.typography.fontFamily.body,
                  letterSpacing: '0.05em'
                }}
              >
                All Collections
              </button>

              {categories.map(category => (
                <button
                  key={category._id || category.id}
                  onClick={() => handleCategorySelect(category._id || category.id)}
                  className={`px-6 py-3 rounded-full transition-all duration-300 ${selectedCategory === (category._id || category.id) ? 'text-black font-medium' : 'text-white hover:text-gold-400'}`}
                  style={{
                    background: selectedCategory === (category._id || category.id) ? luxuryTheme.colors.gradients.gold : 'rgba(0,0,0,0.3)',
                    border: `1px solid ${selectedCategory === (category._id || category.id) ? 'transparent' : luxuryTheme.colors.primary.accent}`,
                    boxShadow: selectedCategory === (category._id || category.id) ? luxuryTheme.shadows.glow : 'none',
                    fontFamily: luxuryTheme.typography.fontFamily.body,
                    letterSpacing: '0.05em'
                  }}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Breadcrumb */}
        <div className="mb-8">
          <div className="flex items-center text-sm" style={{ color: luxuryTheme.colors.text.muted }}>
            <Link to="/" className="hover:text-gold-400 transition-colors">Home</Link>
            <span className="mx-2">›</span>
            <span style={{ color: luxuryTheme.colors.text.accent }}>Collection</span>
            {selectedCategory && (
              <>
                <span className="mx-2">›</span>
                <span style={{ color: luxuryTheme.colors.text.accent }}>
                  {categories.find(c => (c._id || c.id) === selectedCategory)?.name || 'Category'}
                </span>
              </>
            )}
            {searchTerm && (
              <>
                <span className="mx-2">›</span>
                <span style={{ color: luxuryTheme.colors.text.accent }}>Search: "{searchTerm}"</span>
              </>
            )}
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <LoadingSpinner size={40} color={luxuryTheme.colors.primary.main} />
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <p className="text-xl text-red-400 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 rounded-md"
              style={{
                background: luxuryTheme.colors.gradients.gold,
                color: '#000',
                fontFamily: luxuryTheme.typography.fontFamily.body
              }}
            >
              Try Again
            </button>
          </div>
        ) : (
          <>
            {/* Results Count */}
            <div className="mb-8 flex justify-between items-center">
              <p className="text-gray-300" style={{ fontFamily: luxuryTheme.typography.fontFamily.body, letterSpacing: '0.03em' }}>
                Showing <span className="text-white font-medium" style={{ color: luxuryTheme.colors.primary.light }}>{products.length}</span> of <span className="text-white font-medium" style={{ color: luxuryTheme.colors.primary.light }}>{pagination.total || products.length}</span> products
              </p>
            </div>
            
            {/* Product Grid */}
            {products.length === 0 ? (
              <div 
                className="text-center py-20 rounded-md border"
                style={{
                  backgroundColor: 'rgba(0,0,0,0.3)',
                  borderColor: luxuryTheme.colors.primary.accent,
                  boxShadow: luxuryTheme.shadows.glow,
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)'
                }}
              >
                <h3 
                  className="text-2xl font-medium mb-3"
                  style={{ 
                    fontFamily: luxuryTheme.typography.fontFamily.heading,
                    letterSpacing: '0.05em'
                  }}
                >
                  No Products Found
                </h3>
                <p className="text-gray-300 mb-8" style={{ letterSpacing: '0.03em', fontSize: '1.05rem' }}>We're adding new products soon</p>
                <button
                  onClick={() => window.location.reload()}
                  style={{
                    background: luxuryTheme.colors.gradients.gold,
                    boxShadow: luxuryTheme.shadows.glow,
                    fontFamily: luxuryTheme.typography.fontFamily.body,
                    fontWeight: luxuryTheme.typography.fontWeight.medium,
                    letterSpacing: '0.1em',
                    transition: 'all 0.3s ease'
                  }}
                  className="text-black px-8 py-3 rounded-md uppercase tracking-wider hover:opacity-90"
                >
                  Refresh
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-10">
                {/* Display products from API */}
                {products.map(product => (
                  <ProductCard 
                    key={product._id || product.id} 
                    product={product} 
                    showPremiumTag={product.featured || product.isFeatured} 
                    showExclusiveTag={product.isLimited || product.isExclusive} 
                    showNewTag={product.isNew || (product.createdAt && new Date(product.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))}
                    showSaleTag={product.onSale || (product.salePrice && product.salePrice < product.price)}
                  />
                ))}
              </div>
            )}
            
            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center mt-10">
                <nav className="flex items-center space-x-3">
                  <button
                    onClick={() => handlePageChange(Math.max(1, pagination.page - 1))}
                    disabled={pagination.page === 1}
                    className="px-4 py-2 rounded-md border border-gold/30 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:border-gold/60"
                    style={{
                      background: 'rgba(0,0,0,0.3)',
                      fontFamily: luxuryTheme.typography.fontFamily.body,
                      letterSpacing: '0.05em'
                    }}
                  >
                    Previous
                  </button>
                  
                  {[...Array(pagination.totalPages).keys()].map(page => (
                    <button
                      key={page + 1}
                      onClick={() => handlePageChange(page + 1)}
                      className="w-10 h-10 rounded-md flex items-center justify-center transition-all duration-300"
                      style={{
                        background: pagination.page === page + 1 ? luxuryTheme.colors.gradients.gold : 'rgba(0,0,0,0.3)',
                        color: pagination.page === page + 1 ? '#000' : '#fff',
                        border: `1px solid ${pagination.page === page + 1 ? 'transparent' : 'rgba(212, 175, 55, 0.3)'}`,
                        fontWeight: pagination.page === page + 1 ? 'medium' : 'normal',
                        boxShadow: pagination.page === page + 1 ? luxuryTheme.shadows.subtle : 'none'
                      }}
                    >
                      {page + 1}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => handlePageChange(Math.min(pagination.totalPages, pagination.page + 1))}
                    disabled={pagination.page === pagination.totalPages}
                    className="px-4 py-2 rounded-md border border-gold/30 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:border-gold/60"
                    style={{
                      background: 'rgba(0,0,0,0.3)',
                      fontFamily: luxuryTheme.typography.fontFamily.body,
                      letterSpacing: '0.05em'
                    }}
                  >
                    Next
                  </button>
                </nav>
              </div>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
};

export default ProductListing;