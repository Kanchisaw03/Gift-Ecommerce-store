import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import DataTable from '../../shared/components/DataTable';
import { luxuryTheme } from '../../styles/luxuryTheme';
import axiosInstance from '../../services/api/axiosConfig';
import { toast } from 'react-toastify';


const ProductApproval = () => {
  const [pendingProducts, setPendingProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [isRejectionModalOpen, setIsRejectionModalOpen] = useState(false);

  // Fetch pending products from API
  useEffect(() => {
    const fetchPendingProducts = async () => {
      try {
        setIsLoading(true);
        // Call the real API to get pending products
        const response = await axiosInstance.get('/admin/products/pending');
        
        if (response && response.data) {
          setPendingProducts(response.data.data || response.data);
        } else {
          console.error('Unexpected API response format:', response);
          setPendingProducts([]);
          toast.error('Failed to load pending products');
        }
      } catch (error) {
        console.error('Error fetching pending products:', error);
        toast.error('Failed to load pending products. Please try again later.');
        setPendingProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPendingProducts();
  }, []);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  // Handle view product details
  const handleViewDetails = (product) => {
    setSelectedProduct(product);
    setIsDetailsModalOpen(true);
  };

  // Handle approve product
  const handleApproveProduct = async (productId) => {
    try {
      // Call the real API to approve product
      await axiosInstance.put(`/admin/products/${productId}/approve`, { status: 'approved' });
      
      // Update local state
      setPendingProducts(pendingProducts.filter(product => (product._id || product.id) !== productId));
      
      // Close modal if the approved product was being viewed
      if (selectedProduct && (selectedProduct._id || selectedProduct.id) === productId) {
        setIsDetailsModalOpen(false);
        setSelectedProduct(null);
      }
      
      // Show success message
      toast.success('Product approved successfully');
    } catch (error) {
      console.error('Error approving product:', error);
      toast.error('Failed to approve product');
    }
  };

  // Open rejection modal
  const openRejectionModal = (product) => {
    setSelectedProduct(product);
    setRejectionReason('');
    setIsRejectionModalOpen(true);
  };

  // Handle reject product
  const handleRejectProduct = async () => {
    if (!selectedProduct || !rejectionReason.trim()) return;
    
    try {
      // Call the real API to reject product
      await axiosInstance.put(
        `/admin/products/${selectedProduct._id || selectedProduct.id}/reject`, 
        { reason: rejectionReason.trim() }
      );
      
      // Update local state
      setPendingProducts(pendingProducts.filter(product => 
        (product._id || product.id) !== (selectedProduct._id || selectedProduct.id)
      ));
      
      // Close modals and reset state
      setIsRejectionModalOpen(false);
      setRejectionReason('');
      setSelectedProduct(null);
      
      // Show success message
      toast.success('Product rejected successfully');
    } catch (error) {
      console.error('Error rejecting product:', error);
      toast.error('Failed to reject product');
    }
  };

  // Table columns
  const columns = [
    {
      key: 'name',
      label: 'Product',
      render: (value, row) => (
        <div className="flex items-center">
          <div className="w-12 h-12 bg-black/30 border border-gold/20 overflow-hidden flex-shrink-0">
            <img 
              src={row.images[0]} 
              alt={value} 
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/48x48?text=Product";
              }}
            />
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-white">{value}</p>
            <p className="text-xs text-gray-400">{row.category}</p>
          </div>
        </div>
      )
    },
    {
      key: 'seller',
      label: 'Seller'
    },
    {
      key: 'price',
      label: 'Price',
      render: (value) => formatCurrency(value)
    },
    {
      key: 'date',
      label: 'Submitted'
    }
  ];

  // Table actions
  const actions = [
    {
      label: 'View Details',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      ),
      onClick: handleViewDetails
    },
    {
      label: 'Approve',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 13l4 4L19 7" />
        </svg>
      ),
      color: 'text-emerald-500 hover:bg-emerald-900/20',
      onClick: (row) => handleApproveProduct(row.id)
    },
    {
      label: 'Reject',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12" />
        </svg>
      ),
      color: 'text-red-500 hover:bg-red-900/20',
      onClick: (row) => openRejectionModal(row)
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
          Product Approval
        </h2>
        <p 
          className="text-gray-400"
          style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
        >
          Review and approve new products submitted by sellers
        </p>
      </div>
      
      {/* Pending Products Table */}
      {isLoading ? (
        <div className="animate-pulse bg-neutral-800 border border-gold/20 h-96 rounded-sm"></div>
      ) : pendingProducts.length > 0 ? (
        <DataTable
          columns={columns}
          data={pendingProducts}
          actions={actions}
          itemsPerPage={10}
          searchable={true}
          sortable={true}
        />
      ) : (
        <div className="bg-neutral-800 border border-gold/20 p-8 rounded-sm text-center">
          <svg className="w-12 h-12 text-gray-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 
            className="text-lg font-medium text-white mb-2"
            style={{ fontFamily: luxuryTheme.typography.fontFamily.heading }}
          >
            No Pending Products
          </h3>
          <p 
            className="text-gray-400"
            style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
          >
            All products have been reviewed. Check back later for new submissions.
          </p>
        </div>
      )}
      
      {/* Product Details Modal */}
      {isDetailsModalOpen && selectedProduct && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/70">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-neutral-900 border border-gold/30 shadow-xl rounded-sm p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
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
                onClick={() => setIsDetailsModalOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Product Content */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Product Image */}
              <div>
                <div className="bg-black/30 border border-gold/20 h-64 overflow-hidden">
                  <img 
                    src={selectedProduct.images[0]} 
                    alt={selectedProduct.name} 
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/400x300?text=Product";
                    }}
                  />
                </div>
              </div>
              
              {/* Product Info */}
              <div>
                <h4 
                  className="text-xl font-semibold text-white mb-2"
                  style={{ fontFamily: luxuryTheme.typography.fontFamily.heading }}
                >
                  {selectedProduct.name}
                </h4>
                
                <div className="mb-4">
                  <span 
                    className="text-gold text-lg font-medium"
                    style={{ fontFamily: luxuryTheme.typography.fontFamily.accent }}
                  >
                    {formatCurrency(selectedProduct.price)}
                  </span>
                </div>
                
                <div className="space-y-3 mb-4">
                  <div>
                    <span 
                      className="text-gray-400 text-sm"
                      style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
                    >
                      Category:
                    </span>
                    <span 
                      className="ml-2 text-white"
                      style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
                    >
                      {selectedProduct.category}
                    </span>
                  </div>
                  
                  <div>
                    <span 
                      className="text-gray-400 text-sm"
                      style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
                    >
                      Seller:
                    </span>
                    <span 
                      className="ml-2 text-white"
                      style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
                    >
                      {selectedProduct.seller} ({selectedProduct.sellerEmail})
                    </span>
                  </div>
                  
                  <div>
                    <span 
                      className="text-gray-400 text-sm"
                      style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
                    >
                      Submitted:
                    </span>
                    <span 
                      className="ml-2 text-white"
                      style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
                    >
                      {selectedProduct.date}
                    </span>
                  </div>
                </div>
                
                <div>
                  <h5 
                    className="text-gold text-sm font-medium mb-2"
                    style={{ fontFamily: luxuryTheme.typography.fontFamily.heading }}
                  >
                    Description
                  </h5>
                  <p 
                    className="text-gray-300"
                    style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
                  >
                    {selectedProduct.description}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Actions */}
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => handleApproveProduct(selectedProduct.id)}
                className="px-4 py-2 bg-emerald-600 text-white hover:bg-emerald-700 transition-all duration-300"
                style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
              >
                Approve Product
              </button>
              
              <button
                onClick={() => {
                  setIsDetailsModalOpen(false);
                  openRejectionModal(selectedProduct);
                }}
                className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 transition-all duration-300"
                style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
              >
                Reject Product
              </button>
              
              <button
                onClick={() => setIsDetailsModalOpen(false)}
                className="px-4 py-2 border border-gold/30 text-gold hover:bg-gold/10 transition-all duration-300"
                style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
      
      {/* Rejection Reason Modal */}
      {isRejectionModalOpen && selectedProduct && (
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
              Reject Product: {selectedProduct.name}
            </h3>
            
            <p 
              className="text-gray-300 mb-4"
              style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
            >
              Please provide a reason for rejecting this product. This will be sent to the seller.
            </p>
            
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Enter rejection reason..."
              className="w-full px-4 py-3 bg-black/20 border border-gold/30 focus:outline-none focus:border-gold text-white mb-6 h-32"
              style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
            ></textarea>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setIsRejectionModalOpen(false)}
                className="px-4 py-2 border border-gold/30 text-gold hover:bg-gold/10 transition-all duration-300"
                style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
              >
                Cancel
              </button>
              
              <button
                onClick={handleRejectProduct}
                disabled={!rejectionReason.trim()}
                className={`px-4 py-2 bg-red-600 text-white transition-all duration-300 ${
                  !rejectionReason.trim() ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-700'
                }`}
                style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
              >
                Reject Product
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ProductApproval;
