import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import enhancedLuxuryTheme from '../styles/enhancedLuxuryTheme';
import '../styles/luxuryRibbon.css';

const ElegantGiftBox = ({
  productImage,
  productName = 'Luxury Gift',
  productPrice = '$999',
  position = 'left',
  delay = 0,
  onBoxClick
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { ref, inView } = useInView({
    threshold: 0.2,
    triggerOnce: true
  });

  const handleClick = () => {
    setIsOpen(!isOpen);
    if (onBoxClick) onBoxClick();
  };

  return (
    <motion.div
      ref={ref}
      className="relative w-full aspect-square cursor-pointer"
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.8, delay }}
      onClick={handleClick}
      whileHover={{ scale: 1.05 }}
      style={{ perspective: '1000px' }}
    >
      {/* Box base */}
      <div 
        className="absolute inset-0 rounded-lg shadow-xl"
        style={{ 
          background: 'linear-gradient(145deg, #1a1a1a, #121212)',
          border: `1px solid ${enhancedLuxuryTheme.colors.primary.accent}40`,
          boxShadow: `0 10px 30px rgba(0,0,0,0.3), 0 0 10px ${enhancedLuxuryTheme.colors.primary.accent}40`
        }}
      >
        {/* Product content (visible when open) */}
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: isOpen ? 1 : 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative w-3/4 h-3/5 mb-4 overflow-hidden rounded-md">
            <img
              src={productImage}
              alt={productName}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'data:image/svg+xml;charset=UTF-8,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'200\' height=\'200\' viewBox=\'0 0 200 200\' preserveAspectRatio=\'none\'%3E%3Cg%3E%3Ctext style=\'font-family:Arial;font-size:20px;font-weight:bold;dominant-baseline:middle;text-anchor:middle;fill:rgba(212,175,55,0.8)\' x=\'50%25\' y=\'50%25\'%3ELuxury Gift%3C/text%3E%3C/g%3E%3C/svg%3E';
              }}
            />
            
            {/* Premium badge */}
            <div 
              className="absolute top-2 right-2 px-2 py-1 text-xs font-semibold rounded"
              style={{ 
                background: enhancedLuxuryTheme.colors.gradients.gold,
                color: '#000',
              }}
            >
              PREMIUM
            </div>
          </div>
          
          <h3 
            className="text-white text-lg font-semibold mb-1 text-center"
            style={{ fontFamily: enhancedLuxuryTheme.typography.fontFamily.heading }}
          >
            {productName}
          </h3>
          
          <p className="text-gold mb-3 font-medium">{productPrice}</p>
          
          <button 
            className="w-full flex items-center justify-center gap-2 py-2 rounded transition-all duration-300"
            style={{
              background: enhancedLuxuryTheme.colors.gradients.gold,
              color: '#000',
              fontWeight: 600,
              letterSpacing: '0.05em',
            }}
          >
            Add to Cart
          </button>
        </motion.div>
      </div>
      
      {/* Box lid */}
      <motion.div
        className="absolute inset-0 rounded-lg overflow-hidden"
        style={{ 
          background: 'linear-gradient(145deg, #1a1a1a, #121212)',
          border: `1px solid ${enhancedLuxuryTheme.colors.primary.accent}40`,
          transformOrigin: position === 'left' ? 'right center' : 'left center',
          boxShadow: `0 5px 15px rgba(0,0,0,0.3), 0 0 5px ${enhancedLuxuryTheme.colors.primary.accent}30`
        }}
        animate={{
          rotateY: isOpen ? (position === 'left' ? 120 : -120) : 0,
          opacity: isOpen ? 0.7 : 1
        }}
        transition={{ type: 'spring', stiffness: 100, damping: 15 }}
      >
        {/* Ribbon horizontal */}
        <div 
          className="absolute top-1/2 left-0 right-0 h-4 transform -translate-y-1/2"
          style={{ background: enhancedLuxuryTheme.colors.primary.accent }}
        />
        
        {/* Ribbon vertical */}
        <div 
          className="absolute top-0 bottom-0 left-1/2 w-4 transform -translate-x-1/2"
          style={{ background: enhancedLuxuryTheme.colors.primary.accent }}
        />
        
        {/* Ribbon knot */}
        <div 
          className="absolute top-1/2 left-1/2 w-12 h-12 rounded-full transform -translate-x-1/2 -translate-y-1/2"
          style={{ 
            background: enhancedLuxuryTheme.colors.primary.accent,
            boxShadow: `0 0 10px ${enhancedLuxuryTheme.colors.primary.accent}80`
          }}
        >
          <div className="absolute inset-0 rounded-full" style={{ 
            background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 70%)'
          }} />
        </div>
      </motion.div>
      
      {/* Hover instruction */}
      {!isOpen && (
        <motion.div 
          className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white/70 text-xs bg-black/50 px-3 py-1 rounded-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: inView ? 1 : 0 }}
          transition={{ delay: 1 }}
        >
          Click to open
        </motion.div>
      )}
    </motion.div>
  );
};

const ElegantGiftBoxes = ({
  leftProductImage,
  rightProductImage,
  leftProductName = 'Luxury Watch',
  rightProductName = 'Luxury Perfume',
  leftProductPrice = '$1,299',
  rightProductPrice = '$899'
}) => {
  const [leftBoxOpen, setLeftBoxOpen] = useState(false);
  const [rightBoxOpen, setRightBoxOpen] = useState(false);
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  const handleLeftBoxClick = () => {
    setLeftBoxOpen(!leftBoxOpen);
  };

  const handleRightBoxClick = () => {
    setRightBoxOpen(!rightBoxOpen);
  };

  return (
    <motion.div
      ref={ref}
      className="relative w-full py-16 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.8 }}
      style={{ zIndex: 0 }}
    >
      {/* Simple solid gold ribbon */}
      <div className="luxury-ribbon-container">
        <div className="luxury-ribbon">
          {/* Single solid gold ribbon */}
          <div className="luxury-ribbon-simple"></div>
          
          {/* Decorative elements */}
          <div className="luxury-ribbon-decoration"></div>
          <div className="luxury-ribbon-decoration"></div>
          <div className="luxury-ribbon-decoration"></div>
        </div>
      </div>
      
      {/* Gift boxes */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-16 md:gap-32 px-8">
        {/* Left gift box */}
        <div className="w-full md:w-1/3 max-w-[280px]">
          <ElegantGiftBox 
            productImage={leftProductImage}
            productName={leftProductName}
            productPrice={leftProductPrice}
            position="left"
            delay={0}
            onBoxClick={handleLeftBoxClick}
          />
        </div>
        
        {/* Right gift box */}
        <div className="w-full md:w-1/3 max-w-[280px]">
          <ElegantGiftBox 
            productImage={rightProductImage}
            productName={rightProductName}
            productPrice={rightProductPrice}
            position="right"
            delay={0.2}
            onBoxClick={handleRightBoxClick}
          />
        </div>
      </div>
      
      {/* Instruction text */}
      <motion.div 
        className="text-center mt-8 text-white/70 text-sm"
        initial={{ opacity: 0, y: 10 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        Click on a gift box to reveal the luxury inside
      </motion.div>
    </motion.div>
  );
};

export default ElegantGiftBoxes;
