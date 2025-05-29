import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import enhancedLuxuryTheme from '../styles/enhancedLuxuryTheme';
import '../styles/luxuryRibbon.css';

// Import the existing ThreeJSGiftBox component
import ThreeJSGiftBox from './ThreeJSGiftBox';

// Import fallback component for devices that can't display ThreeJS properly
import GiftBox3D from './GiftBox3D';

const PremiumGiftBoxes = ({
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
    threshold: 0.2,
    triggerOnce: true
  });

  // Handle box click events
  const handleLeftBoxClick = () => {
    setLeftBoxOpen(!leftBoxOpen);
  };

  const handleRightBoxClick = () => {
    setRightBoxOpen(!rightBoxOpen);
  };

  const [useThreeJS, setUseThreeJS] = useState(true);
  
  // Check if ThreeJS is working properly
  useEffect(() => {
    // Try to create a simple ThreeJS scene to test if it works
    try {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('webgl');
      if (!context) {
        console.warn('WebGL not supported, falling back to CSS 3D');
        setUseThreeJS(false);
      }
    } catch (error) {
      console.warn('Error initializing WebGL, falling back to CSS 3D', error);
      setUseThreeJS(false);
    }
  }, []);

  return (
    <motion.div
      ref={ref}
      className="relative w-full h-[500px] overflow-hidden"
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      {/* CSS Luxury Ribbon */}
      <div className="luxury-ribbon-container">
        <div className="luxury-ribbon">
          <div className="luxury-ribbon-body">
            <div className="luxury-ribbon-shine"></div>
          </div>
          <div className="luxury-ribbon-end left"></div>
          <div className="luxury-ribbon-end right"></div>
          <div className="luxury-ribbon-decoration"></div>
          <div className="luxury-ribbon-decoration"></div>
          <div className="luxury-ribbon-decoration"></div>
        </div>
      </div>
      
      {/* Gift boxes */}
      <div className="absolute inset-0 z-10 flex items-center justify-between px-8 md:px-16 lg:px-24">
        {/* Left gift box */}
        <div className="w-1/3 max-w-[300px]">
          {useThreeJS ? (
            <ThreeJSGiftBox 
              productImage={typeof leftProductImage === 'string' ? leftProductImage : undefined} 
              boxColor="#121212" 
              ribbonColor={enhancedLuxuryTheme.colors.primary.accent}
              position={[-5, 0, 0]}
              onBoxClick={handleLeftBoxClick}
            />
          ) : (
            <GiftBox3D
              productImage={leftProductImage}
              boxColor="#121212"
              ribbonColor={enhancedLuxuryTheme.colors.primary.accent}
              delay={0}
              productName={leftProductName}
              productPrice={leftProductPrice}
            />
          )}
          
          {/* Product info (appears when box is open) */}
          {leftBoxOpen && (
            <motion.div 
              className="mt-4 text-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-white text-lg font-semibold">{leftProductName}</h3>
              <p className="text-gold">{leftProductPrice}</p>
            </motion.div>
          )}
        </div>
        
        {/* Right gift box */}
        <div className="w-1/3 max-w-[300px]">
          {useThreeJS ? (
            <ThreeJSGiftBox 
              productImage={typeof rightProductImage === 'string' ? rightProductImage : undefined} 
              boxColor="#1E1E1E" 
              ribbonColor={enhancedLuxuryTheme.colors.primary.accent}
              position={[5, 0, 0]}
              onBoxClick={handleRightBoxClick}
            />
          ) : (
            <GiftBox3D
              productImage={rightProductImage}
              boxColor="#1E1E1E"
              ribbonColor={enhancedLuxuryTheme.colors.primary.accent}
              delay={0.3}
              productName={rightProductName}
              productPrice={rightProductPrice}
            />
          )}
          
          {/* Product info (appears when box is open) */}
          {rightBoxOpen && (
            <motion.div 
              className="mt-4 text-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-white text-lg font-semibold">{rightProductName}</h3>
              <p className="text-gold">{rightProductPrice}</p>
            </motion.div>
          )}
        </div>
      </div>
      
      {/* Instruction text */}
      <motion.div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/70 text-sm"
        initial={{ opacity: 0, y: 10 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        Click on a gift box to reveal the luxury inside
      </motion.div>
    </motion.div>
  );
};

export default PremiumGiftBoxes;
