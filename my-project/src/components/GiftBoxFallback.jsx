import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import enhancedLuxuryTheme from '../styles/enhancedLuxuryTheme';
import '../styles/premiumGiftBox.css';

// Additional animations for premium gift box
const premiumGiftBoxAnimations = {
  lid: {
    closed: { rotateX: 0 },
    open: { rotateX: -110, transition: { duration: 0.8, ease: [0.175, 0.885, 0.32, 1.275] } }
  },
  content: {
    hidden: { opacity: 0, y: 10, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1, 
      transition: { 
        duration: 0.5, 
        delay: 0.3,
        staggerChildren: 0.1
      } 
    }
  },
  contentItem: {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.5 } 
    }
  },
  box: {
    rest: { scale: 1 },
    hover: { scale: 1.02, transition: { duration: 0.3, ease: 'easeOut' } }
  }
};

const GiftBoxFallback = ({ 
  productImage, 
  productName = 'Luxury Gift',
  productPrice = '$999',
  boxColor = '#121212', 
  ribbonColor = '#D4AF37' 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const boxRef = useRef(null);
  const sparklesRef = useRef([]);
  

  
  // Create sparkle elements
  useEffect(() => {
    if (!boxRef.current) return;
    
    // Create sparkles
    const createSparkles = () => {
      // Clear any existing sparkles
      sparklesRef.current.forEach(sparkle => {
        if (sparkle.parentNode) {
          sparkle.parentNode.removeChild(sparkle);
        }
      });
      sparklesRef.current = [];
      
      // Create new sparkles
      const numSparkles = 8;
      for (let i = 0; i < numSparkles; i++) {
        const sparkle = document.createElement('div');
        sparkle.className = 'absolute w-1.5 h-1.5 rounded-full bg-white';
        sparkle.style.boxShadow = '0 0 10px rgba(255,255,255,0.8), 0 0 20px rgba(255,255,255,0.4)';
        sparkle.style.zIndex = '30';
        sparkle.style.opacity = '0';
        sparkle.style.pointerEvents = 'none';
        
        // Random position around the box
        const angle = (i / numSparkles) * Math.PI * 2;
        const distance = 30 + Math.random() * 40;
        const delay = Math.random() * 0.5;
        
        sparkle.style.left = `calc(50% + ${Math.cos(angle) * distance}px)`;
        sparkle.style.top = `calc(50% + ${Math.sin(angle) * distance}px)`;
        sparkle.style.animation = `sparkle 1.5s ${delay}s ease-out forwards`;
        
        boxRef.current.appendChild(sparkle);
        sparklesRef.current.push(sparkle);
      }
    };
    
    // Add event listeners for hover/touch
    const handleMouseEnter = () => {
      setIsOpen(true);
      createSparkles();
    };
    
    const handleMouseLeave = () => {
      setIsOpen(false);
    };
    
    const handleTouchStart = () => {
      setIsOpen(!isOpen);
      if (!isOpen) {
        createSparkles();
      }
    };
    
    boxRef.current.addEventListener('mouseenter', handleMouseEnter);
    boxRef.current.addEventListener('mouseleave', handleMouseLeave);
    boxRef.current.addEventListener('touchstart', handleTouchStart);
    
    return () => {
      if (boxRef.current) {
        boxRef.current.removeEventListener('mouseenter', handleMouseEnter);
        boxRef.current.removeEventListener('mouseleave', handleMouseLeave);
        boxRef.current.removeEventListener('touchstart', handleTouchStart);
      }
      
      // Clean up sparkles
      sparklesRef.current.forEach(sparkle => {
        if (sparkle.parentNode) {
          sparkle.parentNode.removeChild(sparkle);
        }
      });
    };
  }, [isOpen]);
  
  return (
    <motion.div
      ref={boxRef}
      className="premium-gift-box-container"
      initial={{ opacity: 0, y: 20, scale: 1 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.19, 1.0, 0.22, 1.0] }}
      whileHover={{ scale: 1.02 }}
    >
      {/* Premium Gift Box */}
      <div className="premium-gift-box">
        {/* Box base with texture */}
        <div className="premium-gift-box-base" style={{
          background: `linear-gradient(145deg, ${boxColor} 0%, #1a1a1a 50%, ${boxColor} 100%)`
        }}>
          {/* Shine effect overlay */}
          <div className="premium-gift-box-shine" />
        </div>
        
        {/* Box lid with animation */}
        <motion.div 
          className="premium-gift-box-lid"
          variants={premiumGiftBoxAnimations.lid}
          animate={isOpen ? 'open' : 'closed'}
          style={{
            background: `linear-gradient(145deg, ${boxColor} 0%, #1a1a1a 50%, ${boxColor} 100%)`
          }}
        >
          {/* Horizontal ribbon */}
          <div className="premium-gift-ribbon-horizontal" style={{ 
            background: `linear-gradient(to bottom, ${ribbonColor} 0%, #FFD700 25%, ${ribbonColor} 50%, #FFD700 75%, ${ribbonColor} 100%)`
          }}>
            <div className="premium-gift-ribbon-shine" />
          </div>
          
          {/* Vertical ribbon */}
          <div className="premium-gift-ribbon-vertical" style={{ 
            background: `linear-gradient(to right, ${ribbonColor} 0%, #FFD700 25%, ${ribbonColor} 50%, #FFD700 75%, ${ribbonColor} 100%)`
          }}>
            <div className="premium-gift-ribbon-shine" />
          </div>
          
          {/* Ribbon knot */}
          <div className="premium-gift-ribbon-knot" style={{ 
            background: `radial-gradient(circle, #FFD700 0%, ${ribbonColor} 60%, #B8860B 100%)`
          }} />
        </motion.div>
        
        {/* Box content with staggered animation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div 
              className="premium-gift-box-content"
              variants={premiumGiftBoxAnimations.content}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              <motion.div 
                className="premium-gift-box-image-container"
                variants={premiumGiftBoxAnimations.contentItem}
              >
                <img 
                  src={productImage || 'data:image/svg+xml;charset=UTF-8,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'200\' height=\'200\' viewBox=\'0 0 200 200\' preserveAspectRatio=\'none\'%3E%3Cg%3E%3Ctext style=\'font-family:Arial;font-size:20px;font-weight:bold;dominant-baseline:middle;text-anchor:middle;fill:rgba(212,175,55,0.8)\' x=\'50%25\' y=\'50%25\'%3ELuxury Gift%3C/text%3E%3C/g%3E%3C/svg%3E'} 
                  alt={productName}
                  className="premium-gift-box-image"
                />
              </motion.div>
              <motion.h3 
                className="premium-gift-box-title"
                variants={premiumGiftBoxAnimations.contentItem}
                style={{ fontFamily: 'Playfair Display, serif' }}
              >
                {productName}
              </motion.h3>
              <motion.p 
                className="premium-gift-box-price"
                variants={premiumGiftBoxAnimations.contentItem}
                style={{ color: ribbonColor }}
              >
                {productPrice}
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Sparkle elements - created dynamically in useEffect */}
      {/* These will be added programmatically */}
      
      {/* Instruction text */}
      <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 text-white/70 text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30">
        {isOpen ? 'Hover to close' : 'Hover to open'}
      </div>
    </motion.div>
  );
};

export default GiftBoxFallback;
