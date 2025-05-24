import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { luxuryTheme } from '../../styles/luxuryTheme';
import DashboardLayout from '../../shared/components/DashboardLayout';

const SellerProducts = () => {
  // Mock data for products
  const [products, setProducts] = useState([
    {
      id: 'PROD-001',
      name: 'Handcrafted Gold Watch',
      price: 750.00,
      stock: 12,
      category: 'Accessories',
      image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      status: 'active',
      featured: true,
      createdAt: '2025-04-10',
      sales: 24
    },
    {
      id: 'PROD-002',
      name: 'Premium Leather Wallet',
      price: 200.00,
      stock: 30,
      category: 'Accessories',
      image: 'https://images.unsplash.com/photo-1517254797898-07c73c117e6f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      status: 'active',
      featured: false,
      createdAt: '2025-04-15',
      sales: 18
    },
    {
      id: 'PROD-003',
      name: 'Crystal Whiskey Decanter Set',
      price: 350.00,
      stock: 8,
      category: 'Home',
      image: 'https://images.unsplash.com/photo-1569529465841-dfecdab7503b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      status: 'active',
      featured: true,
      createdAt: '2025-04-22',
      sales: 15
    },
    {
      id: 'PROD-004',
      name: 'Silk Cashmere Scarf',
      price: 180.00,
      stock: 25,
      category: 'Accessories',
      image: 'https://images.unsplash.com/photo-1584736286279-75260e512fa8?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      status: 'active',
      featured: false,
      createdAt: '2025-05-01',
      sales: 10
    },
    {
      id: 'PROD-005',
      name: 'Artisanal Fountain Pen',
      price: 120.00,
      stock: 15,
      category: 'Stationery',
      image: 'https://images.unsplash.com/photo-1585336261022-680e295ce3fe?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      status: 'active',
      featured: false,
      createdAt: '2025-05-05',
      sales: 7
    },
    {
      id: 'PROD-006',
      name: 'Vintage Leather Journal',
      price: 85.00,
      stock: 0,
      category: 'Stationery',
      image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      status: 'out_of_stock',
      featured: false,
      createdAt: '2025-03-20',
      sales: 32
    }
  ]);

  const [filter, setFilter] = useState({
    category: 'all',
    status: 'all',
    search: '',
    sort: 'newest'
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter({
      ...filter,
      [name]: value
    });
  };

  const handleDeleteProduct = (id) => {
    // In a real app, this would be an API call
    setProducts(products.filter(product => product.id !== id));
  };

  const handleToggleStatus = (id) => {
    // In a real app, this would be an API call
    setProducts(products.map(product => {
      if (product.id === id) {
        const newStatus = product.status === 'active' ? 'inactive' : 'active';
        return { ...product, status: newStatus };
      }
      return product;
    }));
  };

  const handleToggleFeatured = (id) => {
    // In a real app, this would be an API call
    setProducts(products.map(product => {
      if (product.id === id) {
        return { ...product, featured: !product.featured };
      }
      return product;
    }));
  };

  // Apply filters and sorting
  const filteredProducts = products.filter(product => {
    // Category filter
    if (filter.category !== 'all' && product.category !== filter.category) {
      return false;
    }
    
    // Status filter
    if (filter.status !== 'all' && product.status !== filter.status) {
      return false;
    }
    
    // Search filter
    if (filter.search && !product.name.toLowerCase().includes(filter.search.toLowerCase())) {
      return false;
    }
    
    return true;
  }).sort((a, b) => {
    // Sorting
    switch (filter.sort) {
      case 'newest':
        return new Date(b.createdAt) - new Date(a.createdAt);
      case 'oldest':
        return new Date(a.createdAt) - new Date(b.createdAt);
      case 'price_high':
        return b.price - a.price;
      case 'price_low':
        return a.price - b.price;
      case 'bestselling':
        return b.sales - a.sales;
      default:
        return 0;
    }
  });

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-900 text-green-300';
      case 'inactive':
        return 'bg-gray-800 text-gray-300';
      case 'out_of_stock':
        return 'bg-red-900 text-red-300';
      default:
        return 'bg-gray-800 text-gray-300';
    }
  };

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  return (
    <DashboardLayout>
      <motion.div
        initial="initial"
        animate="in"
        exit="exit"
        variants={pageVariants}
        transition={{ duration: 0.5 }}
        className="w-full"
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <h1 className="text-3xl font-playfair font-bold">My Products</h1>
          <Link
            to="/seller/products/add"
            className="mt-4 md:mt-0 px-6 py-2 bg-[#D4AF37] text-black font-medium rounded-md hover:bg-[#C4A137] transition-colors"
          >
            Add New Product
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-[#121212] rounded-lg shadow-xl p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Category</label>
              <select
                name="category"
                value={filter.category}
                onChange={handleFilterChange}
                className="w-full bg-[#1E1E1E] border border-gray-700 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              >
                <option value="all">All Categories</option>
                <option value="Accessories">Accessories</option>
                <option value="Home">Home</option>
                <option value="Stationery">Stationery</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Status</label>
              <select
                name="status"
                value={filter.status}
                onChange={handleFilterChange}
                className="w-full bg-[#1E1E1E] border border-gray-700 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="out_of_stock">Out of Stock</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Sort By</label>
              <select
                name="sort"
                value={filter.sort}
                onChange={handleFilterChange}
                className="w-full bg-[#1E1E1E] border border-gray-700 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="price_high">Price: High to Low</option>
                <option value="price_low">Price: Low to High</option>
                <option value="bestselling">Best Selling</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Search</label>
              <input
                type="text"
                name="search"
                value={filter.search}
                onChange={handleFilterChange}
                placeholder="Search products..."
                className="w-full bg-[#1E1E1E] border border-gray-700 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              />
            </div>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-[#121212] rounded-lg shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#1E1E1E] border-b border-gray-700">
                <tr>
                  <th className="py-4 px-6 text-left text-sm font-semibold text-[#D4AF37]">Product</th>
                  <th className="py-4 px-6 text-left text-sm font-semibold text-[#D4AF37]">Price</th>
                  <th className="py-4 px-6 text-left text-sm font-semibold text-[#D4AF37]">Stock</th>
                  <th className="py-4 px-6 text-left text-sm font-semibold text-[#D4AF37]">Category</th>
                  <th className="py-4 px-6 text-left text-sm font-semibold text-[#D4AF37]">Status</th>
                  <th className="py-4 px-6 text-left text-sm font-semibold text-[#D4AF37]">Sales</th>
                  <th className="py-4 px-6 text-left text-sm font-semibold text-[#D4AF37]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-[#1A1A1A] transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center">
                        <div className="w-12 h-12 rounded-md overflow-hidden flex-shrink-0">
                          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="ml-4">
                          <p className="font-medium">{product.name}</p>
                          <p className="text-xs text-gray-400">ID: {product.id}</p>
                          {product.featured && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-[#D4AF37] text-black mt-1">
                              Featured
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm font-medium">${product.price.toFixed(2)}</td>
                    <td className="py-4 px-6 text-sm">
                      {product.stock > 0 ? product.stock : (
                        <span className="text-red-400">Out of stock</span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-sm">{product.category}</td>
                    <td className="py-4 px-6 text-sm">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(product.status)}`}>
                        {product.status === 'active' ? 'Active' : product.status === 'inactive' ? 'Inactive' : 'Out of Stock'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-sm">{product.sales}</td>
                    <td className="py-4 px-6 text-sm">
                      <div className="flex space-x-2">
                        <Link
                          to={`/seller/products/edit/${product.id}`}
                          className="px-2 py-1 bg-gray-800 text-white rounded hover:bg-gray-700 transition-colors"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleToggleStatus(product.id)}
                          className={`px-2 py-1 rounded ${product.status === 'active' ? 'bg-yellow-900 text-yellow-300 hover:bg-yellow-800' : 'bg-green-900 text-green-300 hover:bg-green-800'} transition-colors`}
                        >
                          {product.status === 'active' ? 'Deactivate' : 'Activate'}
                        </button>
                        <button
                          onClick={() => handleToggleFeatured(product.id)}
                          className={`px-2 py-1 rounded ${product.featured ? 'bg-purple-900 text-purple-300 hover:bg-purple-800' : 'bg-blue-900 text-blue-300 hover:bg-blue-800'} transition-colors`}
                        >
                          {product.featured ? 'Unfeature' : 'Feature'}
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="px-2 py-1 bg-red-900 text-red-300 rounded hover:bg-red-800 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredProducts.length === 0 && (
            <div className="p-8 text-center">
              <p className="text-gray-400">No products found matching your filters.</p>
            </div>
          )}
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default SellerProducts;
