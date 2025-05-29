import React, { useState } from 'react';
import PropTypes from 'prop-types';
import enhancedLuxuryTheme from "../styles/enhancedLuxuryTheme";

/**
 * Reusable component for displaying product images with proper fallbacks and loading states
 * 
 * @param {Object} props - Component props
 * @param {Object} props.product - Product object containing image information
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.alt - Alt text for the image
 * @param {Object} props.style - Additional inline styles
 * @param {boolean} props.showPlaceholder - Whether to show a placeholder while loading
 * @param {string} props.aspectRatio - Aspect ratio for the image container (e.g., "1/1", "4/3")
 * @param {string} props.fallbackImage - URL for fallback image if product image is not available
 * @param {function} props.onLoad - Callback function when image loads successfully
 * @param {function} props.onError - Callback function when image fails to load
 */
const ProductImage = ({
  product,
  className = '',
  alt = '',
  style = {},
  showPlaceholder = true,
  aspectRatio = '1/1',
  fallbackImage = '/assets/watch.jpeg',
  onLoad,
  onError
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  // Get image URL with proper fallbacks
  const getImageUrl = () => {
    // Try to get image from Cloudinary URL in product.images array
    if (product?.images && Array.isArray(product.images) && product.images.length > 0) {
      const firstImage = product.images[0];
      if (typeof firstImage === 'object' && firstImage?.url) {
        return firstImage.url;
      }
    }
    
    // Fallback to product.image if it exists
    if (product?.image) {
      return product.image;
    }
    
    // Fallback to product.imageUrl if it exists
    if (product?.imageUrl) {
      return product.imageUrl;
    }
    
    // Final fallback to default image
    return fallbackImage;
  };
  
  const handleImageLoad = (e) => {
    setImageLoaded(true);
    if (onLoad) onLoad(e);
  };
  
  const handleImageError = (e) => {
    setImageError(true);
    if (onError) onError(e);
    
    // Set fallback image on error
    e.target.src = fallbackImage;
  };
  
  const imageUrl = getImageUrl();
  const imageAlt = alt || product?.name || 'Product Image';
  
  return (
    <div 
      className={`relative overflow-hidden ${className}`}
      style={{ 
        aspectRatio,
        background: 'rgba(18,18,18,0.8)',
        ...style
      }}
    >
      {/* Loading placeholder */}
      {showPlaceholder && !imageLoaded && !imageError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800 animate-pulse">
          <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      
      {/* Actual image */}
      <img
        src={imageUrl}
        alt={imageAlt}
        className={`w-full h-full object-cover transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
        onLoad={handleImageLoad}
        onError={handleImageError}
        loading="lazy"
      />
      
      {/* Luxury overlay effect */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.05) 0%, rgba(0, 0, 0, 0) 50%)',
          boxShadow: `inset 0 0 20px rgba(${enhancedLuxuryTheme.colors.primary.accent}, 0.1)`
        }}
      />
    </div>
  );
};

ProductImage.propTypes = {
  product: PropTypes.object.isRequired,
  className: PropTypes.string,
  alt: PropTypes.string,
  style: PropTypes.object,
  showPlaceholder: PropTypes.bool,
  aspectRatio: PropTypes.string,
  fallbackImage: PropTypes.string,
  onLoad: PropTypes.func,
  onError: PropTypes.func
};

export default ProductImage;
