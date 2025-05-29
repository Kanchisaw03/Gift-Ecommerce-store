import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import PremiumGiftBox from './PremiumGiftBox';
import '../styles/premiumGiftBox.css';

// Import elegant serif font for the title
import { Helmet } from 'react-helmet';

const PremiumGiftBoxesWithRibbon = ({
  leftProductImage,
  rightProductImage,
  leftProductName = 'Luxury Watch',
  rightProductName = 'Luxury Perfume',
  leftProductPrice = '$1,299',
  rightProductPrice = '$899',
  tagline = 'Unwrap Elegance'
}) => {
  const [leftBoxOpen, setLeftBoxOpen] = useState(false);
  const [rightBoxOpen, setRightBoxOpen] = useState(false);
  const containerRef = useRef(null);
  const ribbonRef = useRef(null);
  
  // Handle window resize to adjust ribbon position
  useEffect(() => {
    const handleResize = () => {
      updateRibbonPosition();
    };
    
    window.addEventListener('resize', handleResize);
    // Initial position
    setTimeout(updateRibbonPosition, 100);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  // Update ribbon position based on box positions
  const updateRibbonPosition = () => {
    if (!containerRef.current || !ribbonRef.current) return;
    
    const container = containerRef.current;
    const ribbon = ribbonRef.current;
    const containerRect = container.getBoundingClientRect();
    
    // Get the boxes
    const leftBoxElement = container.querySelector('.left-box');
    const rightBoxElement = container.querySelector('.right-box');
    
    if (!leftBoxElement || !rightBoxElement) return;
    
    const leftBoxRect = leftBoxElement.getBoundingClientRect();
    const rightBoxRect = rightBoxElement.getBoundingClientRect();
    
    // Calculate positions relative to container
    const leftBoxCenter = {
      x: leftBoxRect.left + leftBoxRect.width / 2 - containerRect.left,
      y: leftBoxRect.top + leftBoxRect.height / 2 - containerRect.top
    };
    
    const rightBoxCenter = {
      x: rightBoxRect.left + rightBoxRect.width / 2 - containerRect.left,
      y: rightBoxRect.top + rightBoxRect.height / 2 - containerRect.top
    };
    
    // For desktop: horizontal ribbon between boxes
    if (window.innerWidth >= 768) {
      const ribbonLength = rightBoxCenter.x - leftBoxCenter.x;
      ribbon.style.width = `${ribbonLength}px`;
      ribbon.style.height = '8px';
      ribbon.style.left = `${leftBoxCenter.x}px`;
      ribbon.style.top = `${leftBoxCenter.y}px`;
      ribbon.style.transform = 'translateY(-50%)';
    } 
    // For mobile: vertical ribbon below the first box
    else {
      const ribbonLength = 100; // Fixed length for mobile
      ribbon.style.width = '8px';
      ribbon.style.height = `${ribbonLength}px`;
      ribbon.style.left = '50%';
      ribbon.style.top = `${leftBoxRect.bottom - containerRect.top}px`;
      ribbon.style.transform = 'translateX(-50%)';
    }
    
    // Add wave animation to the ribbon
    ribbon.style.animation = 'ribbon-wave 4s infinite ease-in-out';
  };
  
  // Handle box click events
  const handleLeftBoxClick = () => {
    setLeftBoxOpen(!leftBoxOpen);
  };
  
  const handleRightBoxClick = () => {
    setRightBoxOpen(!rightBoxOpen);
  };
  
  return (
    <>
      {/* Import elegant serif font */}
      <Helmet>
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600&display=swap" rel="stylesheet" />
      </Helmet>
      
      <motion.div
        ref={containerRef}
        className="relative w-full py-16 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        {/* Elegant tagline */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <h2 
            style={{ 
              fontFamily: '"Playfair Display", serif',
              color: '#fff',
              fontSize: '2rem',
              fontWeight: 400,
              letterSpacing: '0.05em',
              textShadow: '0 2px 10px rgba(0,0,0,0.3)'
            }}
          >
            {tagline}
          </h2>
          <div 
            style={{ 
              width: '80px', 
              height: '2px', 
              background: 'linear-gradient(90deg, rgba(212,175,55,0) 0%, rgba(212,175,55,1) 50%, rgba(212,175,55,0) 100%)',
              margin: '0.5rem auto'
            }}
          />
        </motion.div>
        
        {/* Connecting ribbon */}
        <div 
          ref={ribbonRef} 
          className="premium-connecting-ribbon absolute"
        >
          <div className="premium-connecting-ribbon-shine"></div>
        </div>
        
        {/* Gift boxes container */}
        <div className="premium-gift-boxes-container flex justify-between items-center px-8 md:px-16 lg:px-24 flex-col md:flex-row">
          {/* Left gift box */}
          <motion.div 
            className="premium-gift-box-wrapper left-box w-full md:w-1/3 max-w-xs mb-16 md:mb-0"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <PremiumGiftBox
              productImage={leftProductImage}
              productName={leftProductName}
              productPrice={leftProductPrice}
              onClick={handleLeftBoxClick}
            />
          </motion.div>
          
          {/* Right gift box */}
          <motion.div 
            className="premium-gift-box-wrapper right-box w-full md:w-1/3 max-w-xs"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
          >
            <PremiumGiftBox
              productImage={rightProductImage}
              productName={rightProductName}
              productPrice={rightProductPrice}
              onClick={handleRightBoxClick}
            />
          </motion.div>
        </div>
      </motion.div>
    </>
  );
};

PremiumGiftBoxesWithRibbon.propTypes = {
  leftProductImage: PropTypes.string,
  rightProductImage: PropTypes.string,
  leftProductName: PropTypes.string,
  rightProductName: PropTypes.string,
  leftProductPrice: PropTypes.string,
  rightProductPrice: PropTypes.string,
  tagline: PropTypes.string
};

export default PremiumGiftBoxesWithRibbon;
