import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { luxuryTheme } from '../../styles/luxuryTheme';
import DataTable from '../../shared/components/DataTable';
import ProductApproval from '../components/ProductApproval';

// Mock data for all products
const mockProducts = [
  { 
    id: 1, 
    name: 'Luxury Watch', 
    seller: 'Jane Smith', 
    category: 'Watches',
    price: 1200, 
    stock: 15,
    status: 'active',
    featured: true,
    createdAt: '2025-04-15'
  },
  { 
    id: 2, 
    name: 'Gold Bracelet', 
    seller: 'Emily Davis', 
    category: 'Jewelry',
    price: 850, 
    stock: 22,
    status: 'active',
    featured: false,
    createdAt: '2025-04-18'
  },
  { 
    id: 3, 
    name: 'Diamond Earrings', 
    seller: 'Jane Smith', 
    category: 'Jewelry',
    price: 1500, 
    stock: 8,
    status: 'active',
    featured: true,
    createdAt: '2025-04-20'
  },
  { 
    id: 4, 
    name: 'Silk Scarf', 
    seller: 'Emily Davis', 
    category: 'Accessories',
    price: 120, 
    stock: 45,
    status: 'active',
    featured: false,
    createdAt: '2025-04-22'
  },
  { 
    id: 5, 
    name: 'Leather Wallet', 
    seller: 'David Wilson', 
    category: 'Leather Goods',
    price: 180, 
    stock: 30,
    status: 'active',
    featured: false,
    createdAt: '2025-04-25'
  },
  { 
    id: 6, 
    name: 'Luxury Perfume', 
    seller: 'Sarah Johnson', 
    category: 'Fragrances',
    price: 220, 
    stock: 18,
    status: 'active',
    featured: true,
    createdAt: '2025-04-28'
  },
  { 
    id: 7, 
    name: 'Crystal Wine Glasses', 
    seller: 'Michael Brown', 
    category: 'Home Decor',
    price: 320, 
    stock: 12,
    status: 'active',
    featured: false,
    createdAt: '2025-05-01'
  },
  { 
    id: 8, 
    name: 'Cashmere Scarf', 
    seller: 'Emily Davis', 
    category: 'Accessories',
    price: 150, 
    stock: 25,
    status: 'inactive',
    featured: false,
    createdAt: '2025-05-05'
  },
  { 
    id: 9, 
    name: 'Designer Sunglasses', 
    seller: 'David Wilson', 
    category: 'Accessories',
    price: 280, 
    stock: 20,
    status: 'active',
    featured: true,
    createdAt: '2025-05-08'
  },
  { 
    id: 10, 
    name: 'Leather Belt', 
    seller: 'Michael Brown', 
    category: 'Leather Goods',
    price: 95, 
    stock: 35,
    status: 'active',
    featured: false,
    createdAt: '2025-05-10'
  }
];

// Mock data for categories
const mockCategories = [
  { id: 1, name: 'Watches', productCount: 24 },
  { id: 2, name: 'Jewelry', productCount: 36 },
  { id: 3, name: 'Accessories', productCount: 42 },
  { id: 4, name: 'Leather Goods', productCount: 18 },
  { id: 5, name: 'Fragrances', productCount: 15 },
  { id: 6, name: 'Home Decor', productCount: 28 }
];

const AdminProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: '' });

  // Simulate data fetching
  useEffect(() => {
    const fetchData = async () => {
      try {
        // In a real app, you would fetch data from your API here
        // const productsResponse = await fetch('/api/admin/products');
        // const productsData = await productsResponse.json();
        // const categoriesResponse = await fetch('/api/admin/categories');
        // const categoriesData = await categoriesResponse.json();
        
        // For now, we'll use mock data
        setProducts(mockProducts);
        setCategories(mockCategories);
      } catch (error) {
        console.error('Error fetching product data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    // Simulate API delay
    const timer = setTimeout(() => {
      fetchData();
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  // Handle toggle product status
  const handleToggleStatus = async (productId) => {
    try {
      // In a real app, you would call your API here
      // await fetch(`/api/admin/products/${productId}/toggle-status`, {
      //   method: 'PATCH'
      // });
      
      // For now, we'll just update the local state
      setProducts(products.map(product => {
        if (product.id === productId) {
          return {
            ...product,
            status: product.status === 'active' ? 'inactive' : 'active'
          };
        }
        return product;
      }));
    } catch (error) {
      console.error('Error toggling product status:', error);
    }
  };

  // Handle toggle featured status
  const handleToggleFeatured = async (productId) => {
    try {
      // In a real app, you would call your API here
      // await fetch(`/api/admin/products/${productId}/toggle-featured`, {
      //   method: 'PATCH'
      // });
      
      // For now, we'll just update the local state
      setProducts(products.map(product => {
        if (product.id === productId) {
          return {
            ...product,
            featured: !product.featured
          };
        }
        return product;
      }));
    } catch (error) {
      console.error('Error toggling featured status:', error);
    }
  };

  // Handle view product details
  const handleViewProduct = (product) => {
    setSelectedProduct(product);
    setIsProductModalOpen(true);
  };

  // Handle add category
  const handleAddCategory = async (e) => {
    e.preventDefault();
    
    if (!newCategory.name.trim()) {
      return;
    }
    
    try {
      // In a real app, you would call your API here
      // await fetch('/api/admin/categories', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(newCategory)
      // });
      
      // For now, we'll just update the local state
      const newCategoryWithId = {
        ...newCategory,
        id: categories.length + 1,
        productCount: 0
      };
      
      setCategories([...categories, newCategoryWithId]);
      setIsCategoryModalOpen(false);
      setNewCategory({ name: '' });
    } catch (error) {
      console.error('Error adding category:', error);
    }
  };

  // Product table columns
  const productColumns = [
    {
      key: 'name',
      label: 'Product'
    },
    {
      key: 'seller',
      label: 'Seller'
    },
    {
      key: 'category',
      label: 'Category'
    },
    {
      key: 'price',
      label: 'Price',
      render: (value) => formatCurrency(value)
    },
    {
      key: 'stock',
      label: 'Stock'
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => (
        <span 
          className={`px-2 py-1 text-xs rounded ${
            value === 'active' 
              ? 'bg-green-900/50 text-green-300 border border-green-700/50' 
              : 'bg-red-900/50 text-red-300 border border-red-700/50'
          }`}
        >
          {value === 'active' ? 'Active' : 'Inactive'}
        </span>
      )
    },
    {
      key: 'featured',
      label: 'Featured',
      render: (value) => (
        <span 
          className={`px-2 py-1 text-xs rounded ${
            value 
              ? 'bg-amber-900/50 text-amber-300 border border-amber-700/50' 
              : 'bg-gray-900/50 text-gray-300 border border-gray-700/50'
          }`}
        >
          {value ? 'Featured' : 'Standard'}
        </span>
      )
    }
  ];

  // Product table actions
  const productActions = [
    {
      label: 'View Details',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      ),
      onClick: handleViewProduct
    },
    {
      label: 'Toggle Status',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
        </svg>
      ),
      onClick: (row) => handleToggleStatus(row.id),
      color: 'text-amber-500 hover:bg-amber-900/20'
    },
    {
      label: 'Toggle Featured',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      ),
      onClick: (row) => handleToggleFeatured(row.id),
      color: 'text-gold hover:bg-gold/20'
    }
  ];

  // Category table columns
  const categoryColumns = [
    {
      key: 'name',
      label: 'Category Name'
    },
    {
      key: 'productCount',
      label: 'Products'
    }
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h2 
          className="text-xl font-bold text-white mb-2"
          style={{ fontFamily: luxuryTheme.typography.fontFamily.heading }}
        >
          Product Management
        </h2>
        <p 
          className="text-gray-400"
          style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
        >
          Manage products, categories, and approvals
        </p>
      </div>
      
      {/* Tabs */}
      <div className="flex border-b border-gold/30 mb-6">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 font-medium ${
            activeTab === 'all'
              ? 'text-gold border-b-2 border-gold'
              : 'text-gray-400 hover:text-white'
          }`}
          style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
        >
          All Products
        </button>
        
        <button
          onClick={() => setActiveTab('pending')}
          className={`px-4 py-2 font-medium ${
            activeTab === 'pending'
              ? 'text-gold border-b-2 border-gold'
              : 'text-gray-400 hover:text-white'
          }`}
          style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
        >
          Pending Approval
        </button>
        
        <button
          onClick={() => setActiveTab('categories')}
          className={`px-4 py-2 font-medium ${
            activeTab === 'categories'
              ? 'text-gold border-b-2 border-gold'
              : 'text-gray-400 hover:text-white'
          }`}
          style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
        >
          Categories
        </button>
      </div>
      
      {/* All Products Tab */}
      {activeTab === 'all' && (
        <div>
          {isLoading ? (
            <div className="animate-pulse bg-neutral-800 border border-gold/20 h-96 rounded-sm"></div>
          ) : (
            <DataTable
              columns={productColumns}
              data={products}
              actions={productActions}
              itemsPerPage={10}
              searchable={true}
              sortable={true}
            />
          )}
        </div>
      )}
      
      {/* Pending Approval Tab */}
      {activeTab === 'pending' && (
        <ProductApproval />
      )}
      
      {/* Categories Tab */}
      {activeTab === 'categories' && (
        <div>
          <div className="flex justify-end mb-4">
            <button
              onClick={() => setIsCategoryModalOpen(true)}
              className="px-4 py-2 bg-gold text-black hover:bg-gold/90 transition-all duration-300 flex items-center"
              style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Category
            </button>
          </div>
          
          {isLoading ? (
            <div className="animate-pulse bg-neutral-800 border border-gold/20 h-96 rounded-sm"></div>
          ) : (
            <div className="bg-neutral-800 border border-gold/20 rounded-sm overflow-hidden">
              <table className="min-w-full divide-y divide-gold/20">
                <thead className="bg-black/30">
                  <tr>
                    {categoryColumns.map((column) => (
                      <th
                        key={column.key}
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gold uppercase tracking-wider"
                        style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
                      >
                        {column.label}
                      </th>
                    ))}
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gold/20">
                  {categories.map((category) => (
                    <tr key={category.id} className="hover:bg-black/20">
                      <td 
                        className="px-6 py-4 whitespace-nowrap text-sm text-white"
                        style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
                      >
                        {category.name}
                      </td>
                      <td 
                        className="px-6 py-4 whitespace-nowrap text-sm text-white"
                        style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
                      >
                        {category.productCount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          className="text-gold hover:text-gold/80 mr-3"
                          style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
                        >
                          Edit
                        </button>
                        <button
                          className="text-red-500 hover:text-red-400"
                          style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
      
      {/* Product Details Modal */}
      {isProductModalOpen && selectedProduct && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/70">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-neutral-900 border border-gold/30 shadow-xl rounded-sm p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            style={{ boxShadow: luxuryTheme.shadows.lg }}
          >
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-6">
              <h3 
                className="text-lg font-bold text-white"
                style={{ fontFamily: luxuryTheme.typography.fontFamily.heading }}
              >
                Product Details
              </h3>
              
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Product Content */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span 
                    className="text-gray-400 text-sm"
                    style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
                  >
                    Product Name
                  </span>
                  <p 
                    className="text-white"
                    style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
                  >
                    {selectedProduct.name}
                  </p>
                </div>
                
                <div>
                  <span 
                    className="text-gray-400 text-sm"
                    style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
                  >
                    Price
                  </span>
                  <p 
                    className="text-gold"
                    style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
                  >
                    {formatCurrency(selectedProduct.price)}
                  </p>
                </div>
                
                <div>
                  <span 
                    className="text-gray-400 text-sm"
                    style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
                  >
                    Category
                  </span>
                  <p 
                    className="text-white"
                    style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
                  >
                    {selectedProduct.category}
                  </p>
                </div>
                
                <div>
                  <span 
                    className="text-gray-400 text-sm"
                    style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
                  >
                    Stock
                  </span>
                  <p 
                    className="text-white"
                    style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
                  >
                    {selectedProduct.stock} units
                  </p>
                </div>
                
                <div>
                  <span 
                    className="text-gray-400 text-sm"
                    style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
                  >
                    Seller
                  </span>
                  <p 
                    className="text-white"
                    style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
                  >
                    {selectedProduct.seller}
                  </p>
                </div>
                
                <div>
                  <span 
                    className="text-gray-400 text-sm"
                    style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
                  >
                    Created At
                  </span>
                  <p 
                    className="text-white"
                    style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
                  >
                    {selectedProduct.createdAt}
                  </p>
                </div>
                
                <div>
                  <span 
                    className="text-gray-400 text-sm"
                    style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
                  >
                    Status
                  </span>
                  <p>
                    <span 
                      className={`px-2 py-1 text-xs rounded ${
                        selectedProduct.status === 'active' 
                          ? 'bg-green-900/50 text-green-300 border border-green-700/50' 
                          : 'bg-red-900/50 text-red-300 border border-red-700/50'
                      }`}
                    >
                      {selectedProduct.status === 'active' ? 'Active' : 'Inactive'}
                    </span>
                  </p>
                </div>
                
                <div>
                  <span 
                    className="text-gray-400 text-sm"
                    style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
                  >
                    Featured
                  </span>
                  <p>
                    <span 
                      className={`px-2 py-1 text-xs rounded ${
                        selectedProduct.featured 
                          ? 'bg-amber-900/50 text-amber-300 border border-amber-700/50' 
                          : 'bg-gray-900/50 text-gray-300 border border-gray-700/50'
                      }`}
                    >
                      {selectedProduct.featured ? 'Featured' : 'Standard'}
                    </span>
                  </p>
                </div>
              </div>
            </div>
            
            {/* Actions */}
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => handleToggleStatus(selectedProduct.id)}
                className="px-4 py-2 border border-amber-500/50 text-amber-500 hover:bg-amber-900/20 transition-all duration-300"
                style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
              >
                {selectedProduct.status === 'active' ? 'Deactivate' : 'Activate'}
              </button>
              
              <button
                onClick={() => handleToggleFeatured(selectedProduct.id)}
                className="px-4 py-2 border border-gold/30 text-gold hover:bg-gold/10 transition-all duration-300"
                style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
              >
                {selectedProduct.featured ? 'Remove Featured' : 'Make Featured'}
              </button>
              
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="px-4 py-2 bg-neutral-800 text-white hover:bg-neutral-700 transition-all duration-300"
                style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
      
      {/* Add Category Modal */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/70">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-neutral-900 border border-gold/30 shadow-xl rounded-sm p-6 max-w-md w-full"
            style={{ boxShadow: luxuryTheme.shadows.lg }}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 
                className="text-lg font-bold text-white"
                style={{ fontFamily: luxuryTheme.typography.fontFamily.heading }}
              >
                Add Category
              </h3>
              
              <button
                onClick={() => setIsCategoryModalOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleAddCategory}>
              <div className="mb-6">
                <label 
                  htmlFor="categoryName" 
                  className="block text-sm font-medium text-gray-300 mb-2"
                  style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
                >
                  Category Name
                </label>
                <input
                  type="text"
                  id="categoryName"
                  name="name"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({ name: e.target.value })}
                  className="w-full px-4 py-2 bg-black/20 border border-gold/30 focus:outline-none focus:border-gold text-white"
                  style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
                  required
                />
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="px-4 py-2 border border-gold/30 text-gold hover:bg-gold/10 transition-all duration-300"
                  style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
                >
                  Cancel
                </button>
                
                <button
                  type="submit"
                  className="px-4 py-2 bg-gold text-black hover:bg-gold/90 transition-all duration-300"
                  style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
                >
                  Add Category
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminProductManagement;
