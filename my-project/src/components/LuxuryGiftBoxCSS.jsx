import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import enhancedLuxuryTheme from '../styles/enhancedLuxuryTheme';
import '../styles/luxuryStyles.css';

const LuxuryGiftBox = ({ 
  productImage, 
  productName = 'Luxury Gift',
  productPrice = '$999',
  boxColor = '#121212', 
  ribbonColor = '#D4AF37',
  position = 'left',
  delay = 0
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { ref, inView } = useInView({
    threshold: 0.2,
    triggerOnce: true
  });

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  return (
    <motion.div
      ref={ref}
      className={`luxury-gift-box ${isOpen ? 'open' : ''}`}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.8, delay }}
      onClick={handleClick}
      style={{ 
        '--box-color': boxColor,
        '--ribbon-color': ribbonColor
      }}
    >
      {/* Box */}
      <div className="gift-box-container">
        {/* Box base */}
        <div className="gift-box-base">
          {/* Product image (visible when box is open) */}
          <motion.div 
            className="gift-box-content"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isOpen ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.5 }}
          >
            <div className="gift-product-image">
              <img 
                src={productImage} 
                alt={productName} 
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'data:image/svg+xml;charset=UTF-8,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'200\' height=\'200\' viewBox=\'0 0 200 200\' preserveAspectRatio=\'none\'%3E%3Cg%3E%3Ctext style=\'font-family:Arial;font-size:20px;font-weight:bold;dominant-baseline:middle;text-anchor:middle;fill:rgba(212,175,55,0.8)\' x=\'50%25\' y=\'50%25\'%3ELuxury Gift%3C/text%3E%3C/g%3E%3C/svg%3E';
                }}
              />
              <div className="premium-badge">PREMIUM</div>
            </div>
            <h3 className="gift-product-name">{productName}</h3>
            <p className="gift-product-price">{productPrice}</p>
          </motion.div>
        </div>
        
        {/* Box lid */}
        <motion.div 
          className="gift-box-lid"
          animate={isOpen ? { 
            rotateX: 100, 
            y: '-50%',
            opacity: 0.8
          } : { 
            rotateX: 0, 
            y: '0%',
            opacity: 1
          }}
          transition={{ type: 'spring', stiffness: 100, damping: 15 }}
        >
          {/* Ribbon horizontal */}
          <div className="gift-ribbon-horizontal"></div>
          
          {/* Ribbon vertical */}
          <div className="gift-ribbon-vertical"></div>
          
          {/* Ribbon knot */}
          <div className="gift-ribbon-knot">
            <div className="gift-ribbon-loop gift-ribbon-loop-1"></div>
            <div className="gift-ribbon-loop gift-ribbon-loop-2"></div>
          </div>
        </motion.div>
      </div>
      
      {/* Instruction */}
      <motion.div 
        className="gift-box-instruction"
        initial={{ opacity: 0 }}
        animate={inView && !isOpen ? { opacity: 1 } : { opacity: 0 }}
        transition={{ delay: 1 }}
      >
        Click to open
      </motion.div>
    </motion.div>
  );
};

const LuxuryGiftBoxesWithRibbon = ({
  leftProductImage,
  rightProductImage,
  leftProductName = 'Luxury Watch',
  rightProductName = 'Luxury Perfume',
  leftProductPrice = '$1,299',
  rightProductPrice = '$899'
}) => {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  return (
    <motion.div
      ref={ref}
      className="luxury-gift-boxes-container"
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      {/* Connecting ribbon */}
      <div className="connecting-ribbon">
        <div className="ribbon-body">
          <div className="ribbon-shine"></div>
        </div>
      </div>
      
      {/* Left gift box */}
      <div className="gift-box-wrapper left-box">
        <LuxuryGiftBox 
          productImage={leftProductImage}
          productName={leftProductName}
          productPrice={leftProductPrice}
          boxColor="#121212"
          ribbonColor={enhancedLuxuryTheme.colors.primary.accent}
          position="left"
          delay={0}
        />
      </div>
      
      {/* Right gift box */}
      <div className="gift-box-wrapper right-box">
        <LuxuryGiftBox 
          productImage={rightProductImage}
          productName={rightProductName}
          productPrice={rightProductPrice}
          boxColor="#1E1E1E"
          ribbonColor={enhancedLuxuryTheme.colors.primary.accent}
          position="right"
          delay={0.2}
        />
      </div>
    </motion.div>
  );
};

export default LuxuryGiftBoxesWithRibbon;
