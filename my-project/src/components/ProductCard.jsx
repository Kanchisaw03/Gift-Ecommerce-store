import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useAnimation } from "framer-motion";
import { FiShoppingBag, FiHeart, FiEye, FiAward, FiStar } from "react-icons/fi";
import { useCart } from "../hooks/useCart";
import { useWishlist } from "../context/WishlistContext";
import luxuryTheme from "../styles/luxuryTheme";

export default function ProductCard({ 
  product, 
  showPremiumTag = false, 
  showExclusiveTag = false, 
  showNewTag = false,
  showSaleTag = false 
}) {
  const { addToCart } = useCart() || { addToCart: () => {} };
  
  // Use the new WishlistContext
  const { addItem, removeItem, isInWishlist, toggleWishlistItem } = useWishlist();
  
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const controls = useAnimation();
  const cardRef = useRef(null);

  // Handle image loading error
  const handleImageError = (e) => {
    // Use a data URI instead of an external service
    e.target.src = "data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22300%22%20height%3D%22300%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20300%20300%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_text%20%7B%20fill%3A%23D4AF37%3Bfont-weight%3Abold%3Bfont-family%3AArial%2C%20Helvetica%2C%20Open%20Sans%2C%20sans-serif%3Bfont-size%3A15pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder%22%3E%3Crect%20width%3D%22300%22%20height%3D%22300%22%20fill%3D%22%23222222%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20id%3D%22holder_text%22%20x%3D%2250%22%20y%3D%22150%22%3EProduct%20Image%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E";
    setImageLoaded(true);
  };
  
  // Handle image load success
  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  // Shine effect animation
  const startShineAnimation = () => {
    setIsHovered(true);
    controls.start({
      opacity: 1,
      x: ['-100%', '100%'],
      transition: { duration: 1.5, ease: 'easeInOut' }
    });
  };

  const stopShineAnimation = () => {
    setIsHovered(false);
    controls.start({ opacity: 0, x: '-100%' });
  };
  
  // Toggle wishlist
  const toggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      const productId = product?._id || product?.id;
      if (!productId) {
        console.error('Cannot toggle wishlist: Product ID is undefined');
        return;
      }
      
      toggleWishlistItem(productId);
    } catch (error) {
      console.error('Error toggling wishlist:', error);
    }
  };
  
  // Format price with currency
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(price);
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -8, transition: { duration: 0.3, ease: 'easeOut' } }}
      className="relative overflow-hidden rounded-lg group"
      style={{
        background: 'rgba(0,0,0,0.7)',
        borderRadius: '0.5rem',
        boxShadow: `0 10px 30px -10px rgba(0,0,0,0.5), 0 0 10px 0 ${luxuryTheme.colors.primary.accent}`,
        border: `1px solid ${luxuryTheme.colors.primary.accent}30`,
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)'
      }}
      onMouseEnter={startShineAnimation}
      onMouseLeave={stopShineAnimation}
    >
      {/* Shine effect overlay */}
      <motion.div 
        className="absolute inset-0 z-10 pointer-events-none"
        style={{ 
          background: 'linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.25), transparent)',
          transform: 'skewX(-15deg)'
        }}
        initial={{ opacity: 0, x: '-100%' }}
        animate={controls}
      />
      
      {/* Gold corner accent */}
      <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden z-10 pointer-events-none">
        <div 
          className="absolute top-0 right-0 w-8 h-8 transform rotate-45 translate-x-4 -translate-y-4"
          style={{ 
            background: luxuryTheme.colors.gradients.gold,
            boxShadow: luxuryTheme.shadows.glow
          }}
        ></div>
      </div>

      {/* Product Image Container */}
      <div className="relative overflow-hidden aspect-square" style={{ background: 'rgba(0,0,0,0.5)' }}>
        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
            <div className="w-8 h-8 border-2 border-gold-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        <motion.img
          src={product.images?.[0]?.url || product.image || product.imageUrl || "https://placehold.co/300x300/222222/gold?text=Product+Image"}
          alt={product.name}
          className={`w-full h-full object-cover transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          onError={handleImageError}
          onLoad={handleImageLoad}
          animate={{ scale: isHovered ? 1.08 : 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
        
        {/* Product Tags */}
        <div className="absolute top-0 left-0 z-20 p-3 flex flex-col gap-2">
          {/* Premium Tag */}
          {showPremiumTag && (
            <div 
              className="mb-2 text-xs font-medium px-3 py-1 rounded-full flex items-center"
              style={{
                background: luxuryTheme.colors.gradients.gold,
                color: '#000',
                boxShadow: luxuryTheme.shadows.glow,
                letterSpacing: '0.05em'
              }}
            >
              <FiAward className="mr-1" size={12} />
              Premium
            </div>
          )}
          
          {/* Exclusive Tag */}
          {showExclusiveTag && (
            <div 
              className="mb-2 text-xs font-medium px-3 py-1 rounded-full"
              style={{
                background: 'linear-gradient(135deg, #9333ea, #6366f1)',
                color: 'white',
                boxShadow: '0 0 10px rgba(147, 51, 234, 0.5)',
                letterSpacing: '0.05em'
              }}
            >
              Exclusive
            </div>
          )}
          
          {/* New Tag */}
          {showNewTag && (
            <div 
              className="mb-2 text-xs font-medium px-3 py-1 rounded-full"
              style={{
                background: 'linear-gradient(135deg, #3b82f6, #2dd4bf)',
                color: 'white',
                boxShadow: '0 0 10px rgba(59, 130, 246, 0.5)',
                letterSpacing: '0.05em'
              }}
            >
              New Arrival
            </div>
          )}
          
          {/* Sale Tag */}
          {showSaleTag && (
            <div 
              className="mb-2 text-xs font-medium px-3 py-1 rounded-full"
              style={{
                background: 'linear-gradient(135deg, #ef4444, #f97316)',
                color: 'white',
                boxShadow: '0 0 10px rgba(239, 68, 68, 0.5)',
                letterSpacing: '0.05em'
              }}
            >
              Sale
            </div>
          )}
        </div>
        
        {/* Stock Badge */}
        {product.stock <= 5 && product.stock > 0 && (
          <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full z-20">
            Only {product.stock} left
          </div>
        )}
        
        {/* Action buttons */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={toggleWishlist}
            className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300"
            style={{
              background: 'rgba(0,0,0,0.7)',
              border: `1px solid ${luxuryTheme.colors.primary.accent}50`,
              color: isInWishlist(product?._id || product?.id) ? '#D4AF37' : luxuryTheme.colors.primary.light
            }}
            aria-label="Add to wishlist"
          >
            <FiHeart 
              size={16} 
              className={isInWishlist(product?._id || product?.id) ? 'fill-current' : ''}
            />
          </button>
          <Link
            to={`/product/${product._id || product.id}`}
            className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300"
            style={{
              background: 'rgba(0,0,0,0.7)',
              border: `1px solid ${luxuryTheme.colors.primary.accent}50`,
              color: luxuryTheme.colors.primary.light
            }}
            aria-label="View product details"
          >
            <FiEye size={16} />
          </Link>
        </div>
      </div>
      
      {/* Product Details */}
      <div className="p-5" style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}>
        <div className="flex justify-between items-start mb-2">
          <Link to={`/product/${product._id || product.id}`} className="block">
            <h3 
              className="text-lg font-medium transition-colors line-clamp-1"
              style={{ 
                color: 'white',
                fontFamily: luxuryTheme.typography.fontFamily.heading,
                letterSpacing: '0.03em'
              }}
            >
              {product.name}
            </h3>
          </Link>
          
          {/* Rating */}
          {product.rating > 0 && (
            <div 
              className="flex items-center px-2 py-1 rounded"
              style={{
                background: 'rgba(0,0,0,0.3)',
                border: `1px solid ${luxuryTheme.colors.primary.accent}30`
              }}
            >
              <span style={{ color: luxuryTheme.colors.primary.main }} className="mr-1">
                <FiStar size={14} className="fill-current" />
              </span>
              <span 
                className="text-sm font-medium"
                style={{ color: luxuryTheme.colors.primary.main }}
              >
                {product.rating}
              </span>
            </div>
          )}
        </div>
        
        {/* Category */}
        {product.category && typeof product.category === 'object' && product.category.name && (
          <div className="mb-2">
            <span 
              className="text-xs px-2 py-1 rounded-full"
              style={{
                background: 'rgba(0,0,0,0.3)',
                border: `1px solid ${luxuryTheme.colors.primary.accent}30`,
                color: luxuryTheme.colors.text.muted,
                letterSpacing: '0.05em'
              }}
            >
              {product.category.name}
            </span>
          </div>
        )}
        
        {/* Description */}
        <p 
          className="text-sm mb-3 line-clamp-2"
          style={{
            color: luxuryTheme.colors.text.secondary,
            letterSpacing: '0.02em',
            lineHeight: '1.6'
          }}
        >
          {product.description ? 
            (product.description.length > 60 ? 
              product.description.substring(0, 60) + '...' : 
              product.description) : 
            'No description available'}
        </p>
        
        {/* Price */}
        <div className="flex justify-between items-center">
          <div>
            {product.onSale && product.salePrice < product.price ? (
              <div className="flex items-baseline gap-2">
                <p 
                  className="font-semibold text-lg"
                  style={{
                    background: luxuryTheme.colors.gradients.gold,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    textShadow: luxuryTheme.shadows.textGlow
                  }}
                >
                  {formatPrice(product.salePrice)}
                </p>
                <p className="text-gray-500 line-through text-sm">
                  {formatPrice(product.price)}
                </p>
              </div>
            ) : (
              <p 
                className="font-semibold text-lg"
                style={{
                  background: luxuryTheme.colors.gradients.gold,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  textShadow: luxuryTheme.shadows.textGlow
                }}
              >
                {formatPrice(product.price)}
              </p>
            )}
          </div>
          
          <Link
            to={`/product/${product._id || product.id}`}
            className="text-sm font-medium transition-all duration-300 px-3 py-1 rounded-full"
            style={{
              background: 'rgba(0,0,0,0.3)',
              border: `1px solid ${luxuryTheme.colors.primary.accent}50`,
              color: luxuryTheme.colors.primary.light,
              letterSpacing: '0.05em'
            }}
          >
            View Details
          </Link>
        </div>
        
        {/* Tags */}
        {product.tags && product.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {product.tags.slice(0, 2).map((tag, index) => (
              <span 
                key={index} 
                className="text-xs px-2 py-1 rounded-full"
                style={{
                  background: 'rgba(0,0,0,0.3)',
                  border: `1px solid ${luxuryTheme.colors.primary.accent}50`,
                  color: luxuryTheme.colors.primary.light,
                  letterSpacing: '0.05em'
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
