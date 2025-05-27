import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import DataTable from '../../shared/components/DataTable';
import { luxuryTheme } from '../../styles/luxuryTheme';
import { getProducts, deleteProduct } from '../../services/api/productService';
import { toast } from 'react-toastify';


const ProductsList = ({ onEdit, onDelete }) => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Fetch products from API
  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setIsLoading(true);
        // Use the real API service to get products
        const response = await getProducts({ seller: true });
        
        if (response && response.data && response.data.products) {
          setProducts(response.data.products);
        } else {
          console.error('Unexpected API response format:', response);
          setProducts([]);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        toast.error('Failed to load products. Please try again later.');
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProductData();
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
      // Call the real API to delete the product
      await deleteProduct(selectedProduct._id || selectedProduct.id);
      
      // Update the local state
      setProducts(products.filter(p => (p._id || p.id) !== (selectedProduct._id || selectedProduct.id)));
      
      // Close modal
      setIsDeleteModalOpen(false);
      setSelectedProduct(null);
      
      // Show success message
      toast.success('Product deleted successfully');
      
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
              e.target.src = "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48' preserveAspectRatio='none'%3E%3Cg%3E%3Ctext style='font-family:Arial;font-size:10px;font-weight:bold;dominant-baseline:middle;text-anchor:middle;fill:rgba(100,100,100,0.8)' x='50%25' y='50%25'%3EProduct%3C/text%3E%3C/g%3E%3C/svg%3E";
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
