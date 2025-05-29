import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useAnimation } from "framer-motion";
import { FiShoppingBag, FiHeart, FiEye } from "react-icons/fi";
import { useCart } from "../hooks/useCart";
import { useWishlist } from "../context/WishlistContext";
import enhancedLuxuryTheme from "../styles/enhancedLuxuryTheme";
import ProductImage from "./ProductImage";

export default function ProductCard({ 
  product, 
  showAddToCart = true,
  showQuickView = true,
  showAddToWishlist = true,
  className = "",
  style = {},
  onAddToCart,
  onAddToWishlist,
  onQuickView
}) {
  const { addToCart } = useCart() || { addToCart: () => {} };
  const { toggleWishlistItem, isInWishlist } = useWishlist() || { 
    toggleWishlistItem: () => {}, 
    isInWishlist: () => false 
  };
  
  const [imageLoaded, setImageLoaded] = useState(false);
  const controls = useAnimation();
  const cardRef = useRef(null);
  
  // Handle image loading
  const handleImageLoad = () => setImageLoaded(true);
  const handleImageError = () => setImageLoaded(true);
  
  // Shine effect animation
  const startShineAnimation = () => {
    controls.start({
      opacity: 1,
      x: ['-100%', '100%'],
      transition: { duration: 1.5, ease: 'easeInOut' }
    });
  };

  const stopShineAnimation = () => {
    controls.start({ opacity: 0, x: '-100%' });
  };
  
  // Handle cart and wishlist actions
  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onAddToCart) {
      onAddToCart(product);
    } else {
      addToCart(product);
    }
  };
  
  const handleToggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const productId = product?._id || product?.id;
    if (productId) {
      if (onAddToWishlist) {
        onAddToWishlist(product);
      } else {
        toggleWishlistItem(productId);
      }
    }
  };
  
  const handleQuickView = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onQuickView) onQuickView(product);
  };
  
  // Format price with currency
  const formatPrice = (price) => {
    if (!price && price !== 0) return '$0.00';
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
      className={`relative group overflow-hidden ${className}`}
      style={{
        background: 'rgba(18,18,18,0.95)',
        borderBottom: `1px solid ${enhancedLuxuryTheme.colors.primary.accent}40`,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        maxWidth: '320px', // Wider, more elegant width
        margin: '0 auto', // Center the card
        boxShadow: '0 10px 30px -10px rgba(0,0,0,0.3)',
        ...style
      }}
      onMouseEnter={startShineAnimation}
      onMouseLeave={stopShineAnimation}
    >
      {/* Shine effect overlay */}
      <motion.div
        className="absolute inset-0 z-10 bg-gradient-to-r from-transparent via-white to-transparent opacity-0"
        style={{ mixBlendMode: 'overlay' }}
        initial={{ opacity: 0, x: '-100%' }}
        animate={controls}
      />

      {/* Product Image Container */}
      <div className="relative overflow-hidden" style={{ aspectRatio: '4/5', height: '380px' }}>
        {/* Loading Spinner */}
        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900 z-10">
            <div className="w-8 h-8 border-2 border-gold-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        
        {/* Product Image */}
        <ProductImage 
          product={product}
          className="absolute inset-0"
          alt={product.name}
          onLoad={handleImageLoad}
          onError={handleImageError}
          showPlaceholder={!imageLoaded}
        />
        
        {/* Luxury overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        {/* Product Tags */}
        <div className="absolute top-4 left-0 z-20 flex flex-col gap-2">
          {product.featured && (
            <div className="py-1 px-3 uppercase text-xs tracking-widest font-medium" style={{ letterSpacing: '0.15em', backgroundColor: '#f9c0bb', color: '#4a3635' }}>
              Limited Edition
            </div>
          )}
          {product.onSale && (
            <div className="bg-black text-gold-400 py-1 px-3 uppercase text-xs tracking-widest font-medium" style={{ letterSpacing: '0.15em' }}>
              Private Sale
            </div>
          )}
        </div>
        
        {/* Top Right Buttons - Wishlist and Quick View */}
        <div className="absolute top-4 right-4 z-30 flex gap-2">
          {showAddToWishlist && (
            <button
              onClick={handleToggleWishlist}
              className="flex items-center justify-center h-8 w-8 rounded-full transition-colors"
              style={{ backgroundColor: '#D4AF37', color: '#000' }}
              aria-label="Add to wishlist"
            >
              <FiHeart size={16} />
            </button>
          )}
          
          {showQuickView && (
            <button
              onClick={handleQuickView}
              className="flex items-center justify-center h-8 w-8 rounded-full transition-colors"
              style={{ backgroundColor: '#D4AF37', color: '#000' }}
              aria-label="Quick view"
            >
              <FiEye size={16} />
            </button>
          )}
        </div>
        
        {/* Add to Cart Button - Appears at Bottom of Image on Hover */}
        {showAddToCart && (
          <div className="absolute bottom-0 left-0 right-0 z-20 p-4 flex justify-center items-center">
            <button
              onClick={handleAddToCart}
              className="uppercase text-xs tracking-widest py-2.5 px-4 text-black transition-all duration-300 w-full opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 shadow-lg"
              style={{ letterSpacing: '0.15em', backgroundColor: '#D4AF37' }}
              aria-label="Add to cart"
            >
              <span className="flex items-center justify-center gap-2">
                <FiShoppingBag size={14} />
                <span>Add to Bag</span>
              </span>
            </button>
          </div>
        )}
      </div>
      
      {/* Product Details */}
      <div className="py-3 px-4 flex flex-col flex-grow">
        {/* Brand Name - Luxury brands often show their name above product name */}
        <div className="mb-0.5">
          <span className="uppercase text-xs tracking-widest text-gray-400" style={{ letterSpacing: '0.2em' }}>
            {product.brand || 'MAISON LUXE'}
          </span>
        </div>
        
        {/* Product Title */}
        <Link 
          to={`/product/${product._id || product.id}`}
          className="block mb-2"
        >
          <h3 
            className="text-lg font-light hover:text-gold-400 transition-colors uppercase tracking-wide"
            style={{
              color: '#fff',
              letterSpacing: '0.1em',
              lineHeight: '1.3'
            }}
          >
            {product.name}
          </h3>
        </Link>
        
        {/* Product Description - Short elegant description */}
        {product.description && (
          <p className="text-sm text-gray-300 mb-4 line-clamp-2 font-light" style={{ lineHeight: '1.6' }}>
            {product.description}
          </p>
        )}
        
        {/* Category - Subtle and elegant */}
        {product.category && (
          <div className="mb-3">
            <span 
              className="uppercase text-xs tracking-widest text-gray-400"
              style={{ letterSpacing: '0.15em' }}
            >
              {typeof product.category === 'object' ? product.category.name : product.category}
            </span>
          </div>
        )}
        
        {/* Price - Elegant and minimal */}
        <div className="mt-auto flex flex-col">
          {product.onSale && product.salePrice < product.price ? (
            <div className="flex flex-col">
              <p className="text-gray-400 line-through text-sm mb-1">
                {formatPrice(product.price)}
              </p>
              <p 
                className="font-light text-lg"
                style={{
                  color: '#fff'
                }}
              >
                {formatPrice(product.salePrice)}
              </p>
            </div>
          ) : (
            <p 
              className="font-light text-lg"
              style={{
                color: '#fff'
              }}
            >
              {formatPrice(product.price)}
            </p>
          )}
          
          {/* No Discover More link as requested */}
        </div>
      </div>
    </motion.div>
  );
}
