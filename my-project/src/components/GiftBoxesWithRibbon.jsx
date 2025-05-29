import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GiftBoxFallback from './GiftBoxFallback';
import enhancedLuxuryTheme from '../styles/enhancedLuxuryTheme';
import '../styles/premiumGiftBox.css';

// Import specific images for gift boxes
import luxuryWatch from '../assets/watch.jpeg';
import luxuryPerfume from '../assets/Valentino born in Rome perfume.jpeg';

// Animation variants for premium ribbon effects
const ribbonAnimations = {
  container: {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        when: 'beforeChildren',
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  },
  item: {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.19, 1.0, 0.22, 1.0] } }
  },
  ribbon: {
    initial: { opacity: 0, scale: 0.8 },
    animate: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        duration: 1.2, 
        ease: [0.19, 1.0, 0.22, 1.0],
        delay: 0.5
      }
    }
  },
  tagline: {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.8, 
        ease: [0.19, 1.0, 0.22, 1.0],
        delay: 0.3
      }
    }
  }
};

const GiftBoxesWithRibbon = () => {
  const containerRef = useRef(null);
  const ribbonRef = useRef(null);
  const dustParticlesRef = useRef([]);
  const [leftBoxOpen, setLeftBoxOpen] = useState(false);
  const [rightBoxOpen, setRightBoxOpen] = useState(false);
  

  
  // Enhanced gold dust particles with improved visual effects
  useEffect(() => {
    if (!containerRef.current || !ribbonRef.current) return;
    
    const container = containerRef.current;
    const ribbon = ribbonRef.current;
    
    // Create premium gold dust particles with enhanced visual effects
    const createPremiumGoldDust = () => {
      // Clear any existing particles
      dustParticlesRef.current.forEach(particle => {
        if (particle.parentNode) {
          particle.parentNode.removeChild(particle);
        }
      });
      dustParticlesRef.current = [];
      
      // Create new particles with more variety and premium appearance
      const numParticles = 30; // Increased number of particles
      for (let i = 0; i < numParticles; i++) {
        const particle = document.createElement('div');
        particle.className = 'absolute rounded-full pointer-events-none z-20';
        
        // More variety in size for a more natural look
        const size = 1 + Math.random() * 4;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        // Enhanced gold color with varying opacity and hue
        const goldHue = 40 + Math.random() * 10; // Slight variation in gold hue
        const opacity = 0.4 + Math.random() * 0.6;
        particle.style.background = `hsla(${goldHue}, 80%, 50%, ${opacity})`;
        
        // Enhanced glow effect
        const glowIntensity = 0.5 + Math.random() * 0.5;
        particle.style.boxShadow = `0 0 ${3 + Math.random() * 7}px rgba(255, 215, 0, ${glowIntensity})`;
        
        // Position along the ribbon with more spread
        const ribbonRect = ribbon.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        
        // Add some spread around the ribbon for a more magical effect
        const spread = 15;
        const ribbonX = ribbonRect.left + Math.random() * ribbonRect.width - containerRect.left + (Math.random() * spread * 2 - spread);
        const ribbonY = ribbonRect.top + Math.random() * ribbonRect.height - containerRect.top + (Math.random() * spread * 2 - spread);
        
        particle.style.left = `${ribbonX}px`;
        particle.style.top = `${ribbonY}px`;
        
        // More varied and smoother animation
        const delay = Math.random() * 3;
        const duration = 1.5 + Math.random() * 2.5;
        
        // Custom animation properties for more natural movement
        particle.style.opacity = '0';
        particle.style.transform = 'scale(0) translateY(0) rotate(0deg)';
        particle.style.transition = `opacity ${duration}s ease-out, transform ${duration}s ease-out`;
        
        // Start the animation after a delay
        setTimeout(() => {
          particle.style.opacity = opacity.toString();
          particle.style.transform = `scale(1) translateY(-${20 + Math.random() * 30}px) rotate(${Math.random() * 360}deg)`;
          
          // Fade out and remove at the end of animation
          setTimeout(() => {
            particle.style.opacity = '0';
            particle.style.transform = `scale(0) translateY(-${40 + Math.random() * 20}px) rotate(${Math.random() * 720}deg)`;
            
            // Remove the particle after animation completes
            setTimeout(() => {
              if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
                dustParticlesRef.current = dustParticlesRef.current.filter(p => p !== particle);
              }
            }, duration * 1000);
          }, duration * 500);
        }, delay * 1000);
        
        container.appendChild(particle);
        dustParticlesRef.current.push(particle);
      }
    };
    
    // Create initial particles with a slight delay for a more dramatic effect
    setTimeout(createPremiumGoldDust, 800);
    
    // Create new particles periodically with a more natural cadence
    const particleInterval = setInterval(createPremiumGoldDust, 2500);
    
    return () => {
      clearInterval(particleInterval);
      
      // Clean up particles
      dustParticlesRef.current.forEach(particle => {
        if (particle.parentNode) {
          particle.parentNode.removeChild(particle);
        }
      });
    };
  }, []);
  
  // Handle box interactions
  const handleLeftBoxClick = () => {
    setLeftBoxOpen(!leftBoxOpen);
  };
  
  const handleRightBoxClick = () => {
    setRightBoxOpen(!rightBoxOpen);
  };
  
  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      updateRibbonPosition();
    };
    
    window.addEventListener('resize', handleResize);
    // Initial size
    setTimeout(handleResize, 100);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  // Update ribbon position based on box positions
  const updateRibbonPosition = () => {
    if (!containerRef.current || !ribbonRef.current) return;
    
    const container = containerRef.current;
    const ribbon = ribbonRef.current;
    
    // Get the boxes
    const leftBoxElement = container.querySelector('.left-box');
    const rightBoxElement = container.querySelector('.right-box');
    
    if (!leftBoxElement || !rightBoxElement) return;
    
    const containerRect = container.getBoundingClientRect();
    const leftBoxRect = leftBoxElement.getBoundingClientRect();
    const rightBoxRect = rightBoxElement.getBoundingClientRect();
    
    // For desktop: horizontal ribbon between boxes
    if (window.innerWidth >= 768) {
      // Calculate center points of each box relative to the container
      const leftCenter = {
        x: leftBoxRect.left + leftBoxRect.width / 2 - containerRect.left,
        y: leftBoxRect.top + leftBoxRect.height / 2 - containerRect.top
      };
      
      const rightCenter = {
        x: rightBoxRect.left + rightBoxRect.width / 2 - containerRect.left,
        y: rightBoxRect.top + rightBoxRect.height / 2 - containerRect.top
      };
      
      // Set ribbon dimensions and position
      const ribbonWidth = rightCenter.x - leftCenter.x;
      ribbon.style.width = `${ribbonWidth}px`;
      ribbon.style.height = '8px';
      ribbon.style.left = `${leftCenter.x}px`;
      ribbon.style.top = `${leftCenter.y}px`;
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
  };
  
  return (
    <motion.div 
      ref={containerRef}
      className="premium-gift-boxes-container relative w-full py-16"
      style={{ minHeight: '550px' }}
      variants={ribbonAnimations.container}
      initial="hidden"
      animate="visible"
    >
      {/* Elegant tagline with enhanced animation */}
      <motion.div 
        className="text-center mb-12"
        variants={ribbonAnimations.tagline}
      >
        <h2 className="premium-gift-tagline">
          Unwrap Elegance
        </h2>
        <div className="premium-gift-tagline-underline" />
      </motion.div>
      
      {/* Enhanced connecting ribbon with 3D effects */}
      <motion.div 
        ref={ribbonRef} 
        className="premium-connecting-ribbon"
        variants={ribbonAnimations.ribbon}
        initial="initial"
        animate="animate"
      >
        {/* Ribbon shine effect */}
        <div className="premium-connecting-ribbon-shine" />
        
        {/* Gold dust particles are added dynamically in useEffect */}
      </motion.div>
      
      {/* Gift boxes container with improved layout */}
      <div className="premium-gift-boxes-wrapper">
        {/* Left gift box */}
        <motion.div 
          className="premium-gift-box-wrapper left-box"
          variants={ribbonAnimations.item}
          onClick={handleLeftBoxClick}
        >
          <GiftBoxFallback
            productImage={luxuryWatch}
            boxColor="#121212"
            ribbonColor="#D4AF37"
            productName="Luxury Watch"
            productPrice="$1,299"
          />
        </motion.div>
        
        {/* Right gift box */}
        <motion.div 
          className="premium-gift-box-wrapper right-box"
          variants={ribbonAnimations.item}
          onClick={handleRightBoxClick}
        >
          <GiftBoxFallback
            productImage={luxuryPerfume}
            boxColor="#1E1E1E"
            ribbonColor="#D4AF37"
            productName="Valentino Perfume"
            productPrice="$899"
          />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default GiftBoxesWithRibbon;
