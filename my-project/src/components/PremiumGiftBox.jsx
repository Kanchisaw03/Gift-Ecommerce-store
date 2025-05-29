import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import '../styles/premiumGiftBox.css';

const PremiumGiftBox = ({ 
  productImage, 
  productName = 'Luxury Gift',
  productPrice = '$999',
  boxColor = '#121212', 
  ribbonColor = '#D4AF37',
  onClick
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const boxRef = useRef(null);
  const sparklesRef = useRef([]);
  
  // Create sparkle elements
  useEffect(() => {
    if (!boxRef.current) return;
    
    // Clear any existing sparkles
    sparklesRef.current = [];
    
    // Create new sparkles
    const numSparkles = 12;
    for (let i = 0; i < numSparkles; i++) {
      const sparkle = document.createElement('div');
      sparkle.className = 'premium-sparkle';
      
      // Random position around the box
      const angle = (i / numSparkles) * Math.PI * 2;
      const distance = 50 + Math.random() * 50;
      const delay = Math.random() * 1;
      
      sparkle.style.left = `calc(50% + ${Math.cos(angle) * distance}px)`;
      sparkle.style.top = `calc(50% + ${Math.sin(angle) * distance}px)`;
      sparkle.style.animationDelay = `${delay}s`;
      
      boxRef.current.appendChild(sparkle);
      sparklesRef.current.push(sparkle);
    }
    
    return () => {
      // Clean up sparkles on unmount
      sparklesRef.current.forEach(sparkle => {
        if (sparkle.parentNode) {
          sparkle.parentNode.removeChild(sparkle);
        }
      });
    };
  }, []);
  
  const handleClick = () => {
    setIsOpen(!isOpen);
    if (onClick) onClick();
  };
  
  return (
    <div className="premium-gift-box-container" onClick={handleClick}>
      <div ref={boxRef} className={`premium-gift-box ${isOpen ? 'open' : ''}`}>
        {/* Box base */}
        <div className="premium-gift-box-base">
          {/* Shine effect */}
          <div className="premium-gift-box-shine"></div>
          
          {/* Box content */}
          <div className="premium-gift-box-content">
            <img 
              src={productImage || 'data:image/svg+xml;charset=UTF-8,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'200\' height=\'200\' viewBox=\'0 0 200 200\' preserveAspectRatio=\'none\'%3E%3Cg%3E%3Ctext style=\'font-family:Arial;font-size:20px;font-weight:bold;dominant-baseline:middle;text-anchor:middle;fill:rgba(212,175,55,0.8)\' x=\'50%25\' y=\'50%25\'%3ELuxury Gift%3C/text%3E%3C/g%3E%3C/svg%3E'} 
              alt={productName}
              className="premium-gift-box-image"
            />
            <h3 className="premium-gift-box-title">{productName}</h3>
            <p className="premium-gift-box-price">{productPrice}</p>
          </div>
        </div>
        
        {/* Box lid */}
        <div className="premium-gift-box-lid">
          {/* Shine effect */}
          <div className="premium-gift-box-shine"></div>
          
          {/* Ribbons */}
          <div className="premium-gift-ribbon-horizontal">
            <div className="premium-gift-ribbon-shine"></div>
          </div>
          <div className="premium-gift-ribbon-vertical">
            <div className="premium-gift-ribbon-shine"></div>
          </div>
          <div className="premium-gift-ribbon-knot"></div>
        </div>
        
        {/* Instruction for touch devices */}
        <div className="premium-gift-box-instruction">Tap to open</div>
      </div>
    </div>
  );
};

PremiumGiftBox.propTypes = {
  productImage: PropTypes.string,
  productName: PropTypes.string,
  productPrice: PropTypes.string,
  boxColor: PropTypes.string,
  ribbonColor: PropTypes.string,
  onClick: PropTypes.func
};

export default PremiumGiftBox;
