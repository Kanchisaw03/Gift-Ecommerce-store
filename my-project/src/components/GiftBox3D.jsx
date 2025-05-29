import React, { useRef, useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import enhancedLuxuryTheme from '../styles/enhancedLuxuryTheme';
import { Link } from 'react-router-dom';

const GiftBox3D = ({ productImage, boxColor = '#121212', ribbonColor = '#D4AF37', delay = 0, productName = 'Luxury Gift', productPrice = '$999' }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const boxControls = useAnimation();
  const ribbonControls = useAnimation();
  const contentControls = useAnimation();
  const { ref, inView } = useInView({
    threshold: 0.2,
    triggerOnce: false
  });

  // Initialize animation when in view
  useEffect(() => {
    if (inView) {
      boxControls.start({
        y: [10, 0],
        opacity: 1,
        transition: {
          duration: 0.8,
          delay: delay,
          ease: 'easeOut'
        }
      });
      
      ribbonControls.start({
        opacity: 1,
        transition: {
          duration: 0.8,
          delay: delay + 0.2,
          ease: 'easeOut'
        }
      });
    }
  }, [inView, boxControls, ribbonControls, delay]);

  // Handle hover animations
  const handleHoverStart = () => {
    setIsHovered(true);
  };

  const handleHoverEnd = () => {
    setIsHovered(false);
    if (isOpen) {
      setIsOpen(false);
      contentControls.start({ opacity: 0, y: 20, scale: 0.8 });
    }
  };

  // Handle click to open box
  const handleClick = () => {
    setIsOpen(!isOpen);
    
    if (!isOpen) {
      contentControls.start({
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { delay: 0.5, duration: 0.5 }
      });
    } else {
      contentControls.start({ opacity: 0, y: 20, scale: 0.8 });
    }
  };

  return (
    <motion.div
      ref={ref}
      className="relative"
      style={{ 
        width: '100%', 
        height: '300px',
        perspective: '1000px',
        cursor: 'pointer'
      }}
      initial={{ opacity: 0, y: 30 }}
      animate={boxControls}
      onHoverStart={handleHoverStart}
      onHoverEnd={handleHoverEnd}
      onClick={handleClick}
    >
      {/* Main gift box */}
      <motion.div
        className="gift-box"
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          transformStyle: 'preserve-3d',
          transform: isHovered ? 'rotateY(10deg) rotateX(5deg)' : 'rotateY(0) rotateX(0)',
          transition: 'transform 0.5s ease-in-out',
        }}
      >
        {/* Box base */}
        <div
          style={{
            position: 'absolute',
            width: '100%',
            height: '80%',
            bottom: 0,
            borderRadius: '8px',
            background: boxColor,
            boxShadow: isHovered 
              ? `0 20px 30px rgba(0,0,0,0.4), 0 0 15px ${ribbonColor}40` 
              : '0 10px 20px rgba(0,0,0,0.3)',
            transition: 'all 0.5s ease-in-out',
            border: `1px solid ${ribbonColor}40`,
            overflow: 'hidden',
          }}
        >
          {/* Box texture/pattern */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23d4af37\' fill-opacity=\'0.05\' fill-rule=\'evenodd\'%3E%3Ccircle cx=\'3\' cy=\'3\' r=\'1\'/%3E%3C/g%3E%3C/svg%3E")',
              opacity: 0.8,
            }}
          />
          
          {/* Box content (product) */}
          <motion.div
            className="gift-box-content"
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '90%',
              height: '90%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: 0,
              background: 'rgba(18, 18, 18, 0.9)',
              borderRadius: '8px',
              padding: '1rem',
              boxShadow: '0 10px 20px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(212, 175, 55, 0.2)',
              backdropFilter: 'blur(5px)',
            }}
            animate={contentControls}
          >
            <div className="relative w-full h-3/5 mb-4 overflow-hidden rounded-md">
              <img 
                src={productImage || 'data:image/svg+xml;charset=UTF-8,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'200\' height=\'200\' viewBox=\'0 0 200 200\' preserveAspectRatio=\'none\'%3E%3Cg%3E%3Ctext style=\'font-family:Arial;font-size:20px;font-weight:bold;dominant-baseline:middle;text-anchor:middle;fill:rgba(212,175,55,0.8)\' x=\'50%25\' y=\'50%25\'%3ELuxury Gift%3C/text%3E%3C/g%3E%3C/svg%3E'} 
                alt={productName}
                className="w-full h-full object-cover rounded-md"
                style={{
                  filter: 'drop-shadow(0 5px 10px rgba(0,0,0,0.3))',
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
            
            <Link 
              to="/products"
              className="w-full btn-luxury btn-luxury-filled py-2 text-sm"
            >
              Add to Cart
            </Link>
          </motion.div>
        </div>
        
        {/* Box lid */}
        <motion.div
          className="gift-box-lid"
          animate={{
            rotateX: isOpen ? -110 : 0,
            transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
          }}
          style={{
            position: 'absolute',
            width: '110%',
            height: '25%',
            left: '-5%',
            top: '15%',
            borderRadius: '8px 8px 0 0',
            background: boxColor,
            boxShadow: '0 -5px 15px rgba(0,0,0,0.2)',
            transformOrigin: 'center bottom',
            border: `1px solid ${ribbonColor}40`,
            borderBottom: 'none',
            zIndex: 2,
          }}
        >
          {/* Lid texture/pattern */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23d4af37\' fill-opacity=\'0.05\' fill-rule=\'evenodd\'%3E%3Ccircle cx=\'3\' cy=\'3\' r=\'1\'/%3E%3C/g%3E%3C/svg%3E")',
              opacity: 0.8,
            }}
          />
        </motion.div>
        
        {/* Vertical ribbon */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={ribbonControls}
          style={{
            position: 'absolute',
            width: '10%',
            height: '110%',
            left: '45%',
            top: '-5%',
            background: ribbonColor,
            boxShadow: `0 0 10px ${ribbonColor}80`,
            zIndex: 3,
          }}
        >
          {/* Ribbon texture */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: `linear-gradient(135deg, ${ribbonColor} 0%, ${ribbonColor}80 50%, ${ribbonColor} 100%)`,
              backgroundSize: '200% 200%',
              animation: 'shine 3s infinite',
            }}
          />
        </motion.div>
        
        {/* Horizontal ribbon */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={ribbonControls}
          style={{
            position: 'absolute',
            width: '110%',
            height: '10%',
            left: '-5%',
            top: '45%',
            background: ribbonColor,
            boxShadow: `0 0 10px ${ribbonColor}80`,
            zIndex: 3,
          }}
        >
          {/* Ribbon texture */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: `linear-gradient(135deg, ${ribbonColor} 0%, ${ribbonColor}80 50%, ${ribbonColor} 100%)`,
              backgroundSize: '200% 200%',
              animation: 'shine 3s infinite',
            }}
          />
        </motion.div>
        
        {/* Ribbon knot */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={ribbonControls}
          style={{
            position: 'absolute',
            width: '20%',
            height: '20%',
            left: '40%',
            top: '40%',
            background: ribbonColor,
            borderRadius: '50%',
            boxShadow: `0 0 15px ${ribbonColor}80`,
            zIndex: 4,
          }}
        >
          {/* Knot highlight */}
          <div
            style={{
              position: 'absolute',
              top: '20%',
              left: '20%',
              width: '30%',
              height: '30%',
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.3)',
            }}
          />
        </motion.div>
        
        {/* Glow effect */}
        <div
          style={{
            position: 'absolute',
            top: '-10%',
            left: '-10%',
            width: '120%',
            height: '120%',
            borderRadius: '50%',
            background: `radial-gradient(circle, ${ribbonColor}20 0%, transparent 70%)`,
            opacity: isHovered ? 1 : 0,
            transition: 'opacity 0.5s ease-in-out',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />
      </motion.div>
      
      {/* Hover instruction */}
      <div
        style={{
          position: 'absolute',
          bottom: '-30px',
          left: '0',
          width: '100%',
          textAlign: 'center',
          fontSize: '0.8rem',
          color: enhancedLuxuryTheme.colors.text.muted,
          opacity: 0.7,
        }}
      >
        Hover & click to open
      </div>
    </motion.div>
  );
};

export default GiftBox3D;
