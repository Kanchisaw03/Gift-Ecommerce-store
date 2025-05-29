import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { FiEdit2, FiTrash2, FiEye } from 'react-icons/fi';
import ProductImage from '../ProductImage';
import enhancedLuxuryTheme from '../../styles/enhancedLuxuryTheme';

const SellerProductCard = ({ 
  product, 
  onView,
  onEdit, 
  onDelete 
}) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'text-green-500';
      case 'rejected':
        return 'text-red-500';
      case 'pending':
        return 'text-yellow-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-gray-900 rounded-lg overflow-hidden shadow-lg border border-gray-800"
    >
      {/* Product Image */}
      <div className="aspect-square relative">
        <ProductImage
          product={product}
          className="w-full h-full"
          aspectRatio="1/1"
        />
        
        {/* Status Badge */}
        <div className="absolute top-2 right-2">
          <span className={`px-3 py-1 rounded-full text-sm font-medium bg-gray-900/80 backdrop-blur-sm ${getStatusColor(product.status)}`}>
            {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
          </span>
        </div>

        {/* Featured Badge */}
        {product.featured && (
          <div className="absolute top-2 left-2">
            <span className="px-3 py-1 rounded-full text-sm font-medium bg-gold-400/90 text-black backdrop-blur-sm">
              Featured
            </span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4 space-y-3">
        <h3 className="text-lg font-semibold text-gold-400 truncate">
          {product.name}
        </h3>
        
        <div className="flex justify-between items-center">
          <span className="text-gray-300">${product.price}</span>
          <span className="text-gray-400 text-sm">Stock: {product.stock}</span>
        </div>

        <div className="text-sm text-gray-400">
          Views: {product.views || 0}
        </div>

        {/* Rejection Reason */}
        {product.status === 'rejected' && product.rejectionReason && (
          <div className="text-sm text-red-400">
            Reason: {product.rejectionReason}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2 pt-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onView(product)}
            className="flex-1 px-3 py-2 bg-gray-700 text-white rounded-md flex items-center justify-center gap-2 hover:bg-gray-600 transition-colors"
          >
            <FiEye className="w-4 h-4" />
            View
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onEdit(product)}
            className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-md flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors"
          >
            <FiEdit2 className="w-4 h-4" />
            Edit
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onDelete(product._id)}
            className="flex-1 px-3 py-2 bg-red-600 text-white rounded-md flex items-center justify-center gap-2 hover:bg-red-700 transition-colors"
          >
            <FiTrash2 className="w-4 h-4" />
            Delete
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

SellerProductCard.propTypes = {
  product: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    stock: PropTypes.number.isRequired,
    status: PropTypes.string.isRequired,
    featured: PropTypes.bool,
    views: PropTypes.number,
    rejectionReason: PropTypes.string,
    images: PropTypes.arrayOf(
      PropTypes.shape({
        url: PropTypes.string.isRequired
      })
    )
  }).isRequired,
  onView: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired
};

export default SellerProductCard;
