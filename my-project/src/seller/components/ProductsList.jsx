import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import DataTable from '../../shared/components/DataTable';
import { luxuryTheme } from '../../styles/luxuryTheme';

// Mock data for products
const mockProducts = [
  { 
    id: 1, 
    name: 'Luxury Watch', 
    price: 1200, 
    category: 'Watches', 
    stock: 15, 
    status: 'active',
    image: '/assets/products/watch.jpg'
  },
  { 
    id: 2, 
    name: 'Gold Bracelet', 
    price: 850, 
    category: 'Jewelry', 
    stock: 8, 
    status: 'active',
    image: '/assets/products/bracelet.jpg'
  },
  { 
    id: 3, 
    name: 'Diamond Earrings', 
    price: 1500, 
    category: 'Jewelry', 
    stock: 5, 
    status: 'active',
    image: '/assets/products/earrings.jpg'
  },
  { 
    id: 4, 
    name: 'Silk Scarf', 
    price: 120, 
    category: 'Accessories', 
    stock: 25, 
    status: 'active',
    image: '/assets/products/scarf.jpg'
  },
  { 
    id: 5, 
    name: 'Leather Wallet', 
    price: 180, 
    category: 'Leather Goods', 
    stock: 12, 
    status: 'active',
    image: '/assets/products/wallet.jpg'
  },
  { 
    id: 6, 
    name: 'Luxury Perfume', 
    price: 220, 
    category: 'Fragrances', 
    stock: 18, 
    status: 'active',
    image: '/assets/products/perfume.jpg'
  },
  { 
    id: 7, 
    name: 'Crystal Decanter', 
    price: 350, 
    category: 'Home Decor', 
    stock: 7, 
    status: 'active',
    image: '/assets/products/decanter.jpg'
  },
  { 
    id: 8, 
    name: 'Cashmere Scarf', 
    price: 160, 
    category: 'Accessories', 
    stock: 0, 
    status: 'out_of_stock',
    image: '/assets/products/cashmere.jpg'
  },
  { 
    id: 9, 
    name: 'Silver Cufflinks', 
    price: 90, 
    category: 'Accessories', 
    stock: 20, 
    status: 'active',
    image: '/assets/products/cufflinks.jpg'
  },
  { 
    id: 10, 
    name: 'Fountain Pen', 
    price: 75, 
    category: 'Accessories', 
    stock: 15, 
    status: 'active',
    image: '/assets/products/pen.jpg'
  }
];

const ProductsList = ({ onEdit, onDelete }) => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Simulate data fetching
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // In a real app, you would fetch data from your API here
        // const response = await fetch('/api/seller/products');
        // const data = await response.json();
        
        // For now, we'll use mock data
        setProducts(mockProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    // Simulate API delay
    const timer = setTimeout(() => {
      fetchProducts();
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

  // Handle edit product
  const handleEdit = (product) => {
    if (onEdit) {
      onEdit(product);
    }
  };

  // Handle delete confirmation
  const handleDeleteConfirmation = (product) => {
    setSelectedProduct(product);
    setIsDeleteModalOpen(true);
  };

  // Handle delete product
  const handleDelete = async () => {
    try {
      // In a real app, you would call your API here
      // await fetch(`/api/seller/products/${selectedProduct.id}`, {
      //   method: 'DELETE'
      // });
      
      // For now, we'll just update the local state
      setProducts(products.filter(p => p.id !== selectedProduct.id));
      
      // Close modal
      setIsDeleteModalOpen(false);
      setSelectedProduct(null);
      
      // Call the onDelete callback
      if (onDelete) {
        onDelete(selectedProduct);
      }
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  // Table columns
  const columns = [
    {
      key: 'image',
      label: 'Image',
      render: (value, row) => (
        <div className="w-12 h-12 bg-black/30 border border-gold/20 overflow-hidden">
          <img 
            src={row.image} 
            alt={row.name} 
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/48x48?text=Product";
            }}
          />
        </div>
      )
    },
    {
      key: 'name',
      label: 'Product Name'
    },
    {
      key: 'price',
      label: 'Price',
      render: (value) => formatCurrency(value)
    },
    {
      key: 'category',
      label: 'Category'
    },
    {
      key: 'stock',
      label: 'Stock',
      render: (value, row) => (
        <span className={value === 0 ? 'text-red-500' : 'text-white'}>
          {value}
        </span>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => (
        <span className={`px-2 py-1 rounded-sm text-xs uppercase ${
          value === 'active' ? 'bg-emerald-900/30 text-emerald-400' :
          value === 'out_of_stock' ? 'bg-red-900/30 text-red-400' :
          'bg-amber-900/30 text-amber-400'
        }`}>
          {value.replace('_', ' ')}
        </span>
      )
    }
  ];

  // Table actions
  const actions = [
    {
      label: 'Edit',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      ),
      onClick: handleEdit
    },
    {
      label: 'Delete',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      ),
      color: 'text-red-500 hover:bg-red-900/20',
      onClick: handleDeleteConfirmation
    }
  ];

  return (
    <div>
      {/* Header with Add Product button */}
      <div className="flex justify-between items-center mb-6">
        <h2 
          className="text-xl font-bold text-white"
          style={{ fontFamily: luxuryTheme.typography.fontFamily.heading }}
        >
          Your Products
        </h2>
        
        <Link
          to="/seller/products/add"
          className="px-4 py-2 bg-gold text-black hover:bg-gold-light transition-all duration-300 flex items-center"
          style={{ 
            fontFamily: luxuryTheme.typography.fontFamily.body,
            boxShadow: luxuryTheme.shadows.sm
          }}
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Product
        </Link>
      </div>
      
      {/* Products Table */}
      {isLoading ? (
        <div className="animate-pulse bg-neutral-800 border border-gold/20 h-96 rounded-sm"></div>
      ) : (
        <DataTable
          columns={columns}
          data={products}
          actions={actions}
          itemsPerPage={10}
          searchable={true}
          sortable={true}
        />
      )}
      
      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && selectedProduct && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/70">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-neutral-900 border border-gold/30 shadow-xl rounded-sm p-6 max-w-md w-full"
            style={{ boxShadow: luxuryTheme.shadows.lg }}
          >
            <h3 
              className="text-lg font-bold text-white mb-4"
              style={{ fontFamily: luxuryTheme.typography.fontFamily.heading }}
            >
              Confirm Deletion
            </h3>
            
            <p 
              className="text-gray-300 mb-6"
              style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
            >
              Are you sure you want to delete <span className="text-gold">{selectedProduct.name}</span>? This action cannot be undone.
            </p>
            
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 border border-gold/30 text-gold hover:bg-gold/10 transition-all duration-300"
                style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
              >
                Cancel
              </button>
              
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 transition-all duration-300"
                style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
              >
                Delete
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ProductsList;
