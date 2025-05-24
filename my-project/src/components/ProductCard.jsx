import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useAnimation } from "framer-motion";
import { useCart } from "../hooks/useCart";
import { luxuryTheme } from "../styles/luxuryTheme";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const [isHovered, setIsHovered] = useState(false);
  const controls = useAnimation();
  const cardRef = useRef(null);

  // Handle image loading error
  const handleImageError = (e) => {
    e.target.src = "https://via.placeholder.com/300x300?text=Gift+Image";
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

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -8, transition: { duration: 0.3, ease: 'easeOut' } }}
      className="card-luxury relative overflow-hidden"
      style={{
        backgroundColor: luxuryTheme.colors.neutral.dark,
        borderRadius: '4px',
        boxShadow: isHovered ? luxuryTheme.shadows.lg + ', ' + luxuryTheme.shadows.goldInset : luxuryTheme.shadows.md
      }}
      onMouseEnter={startShineAnimation}
      onMouseLeave={stopShineAnimation}
    >
      {/* Shine effect overlay */}
      <motion.div 
        className="absolute inset-0 z-10 pointer-events-none"
        style={{ 
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)',
          transform: 'skewX(-15deg)'
        }}
        initial={{ opacity: 0, x: '-100%' }}
        animate={controls}
      />

      <div className="relative overflow-hidden aspect-square">
        <motion.img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
          onError={handleImageError}
          animate={{ scale: isHovered ? 1.08 : 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
        
        {/* Featured badge */}
        {product.featured && (
          <div className="badge-luxury absolute top-3 left-3 z-10 shadow-gold">
            Exclusive
          </div>
        )}

        {/* Stock badge */}
        {product.stock <= 5 && product.stock > 0 && (
          <div className="badge-luxury badge-exclusive absolute top-3 right-3 z-10">
            Only {product.stock} left
          </div>
        )}
        
        {/* Quick add button */}
        <motion.div 
          className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4 z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 20 }}
          transition={{ duration: 0.3 }}
        >
          <button
            onClick={() => addToCart(product)}
            className="btn-luxury w-full"
            aria-label={`Add ${product.name} to cart`}
          >
            Add to Cart
          </button>
        </motion.div>
      </div>
      
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <Link to={`/product/${product.id}`} className="block">
            <h3 
              className="text-lg font-medium text-white hover:text-gold transition-colors line-clamp-1"
              style={{ fontFamily: luxuryTheme.typography.fontFamily.heading }}
            >
              {product.name}
            </h3>
          </Link>
          
          {/* Rating */}
          <div className="flex items-center">
            <span className="text-gold mr-1">
              ★
            </span>
            <span className="text-sm text-gold/80">{product.rating}</span>
          </div>
        </div>
        
        <p className="text-gray-400 text-sm mb-3 line-clamp-2"
           style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}>
          {product.description ? product.description.substring(0, 60) + '...' : 'No description available'}
        </p>
        
        <div className="flex justify-between items-center">
          <p 
            className="text-gradient-gold font-semibold"
            style={{ 
              fontFamily: luxuryTheme.typography.fontFamily.accent,
              fontSize: '1.25rem' 
            }}
          >
            ${product.price.toFixed(2)}
          </p>
          <Link
            to={`/product/${product.id}`}
            className="text-sm text-white hover:text-gold font-medium transition-colors gold-underline"
          >
            View Details
          </Link>
        </div>
        
        {/* Tags */}
        {product.tags && (
          <div className="mt-4 flex flex-wrap gap-2">
            {product.tags.slice(0, 2).map((tag) => (
              <span 
                key={tag} 
                className="text-xs border border-gold/30 text-gold/80 px-2 py-1 rounded-sm"
                style={{ backgroundColor: 'rgba(212, 175, 55, 0.05)' }}
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
