import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import GiftBoxFallback from './GiftBoxFallback';
import enhancedLuxuryTheme from '../styles/enhancedLuxuryTheme';

// Lazy load the Three.js components to improve initial load performance
const ThreeJSGiftBoxesWithRibbon = React.lazy(() => 
  import('./ThreeJSGiftBoxesWithRibbon')
);

const LuxuryGiftBoxes = ({
  leftProductImage,
  rightProductImage,
  leftProductName = 'Luxury Watch',
  rightProductName = 'Luxury Perfume',
  leftProductPrice = '$1,299',
  rightProductPrice = '$899'
}) => {
  const [supportsWebGL, setSupportsWebGL] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  // Check device capabilities
  useEffect(() => {
    // Check for WebGL support
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    const hasWebGL = !!gl;
    gl?.getExtension('WEBGL_lose_context')?.loseContext();
    
    // Check if device is mobile
    const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    // Check if device has enough memory and CPU (simplified check)
    const isLowEndDevice = navigator.deviceMemory && navigator.deviceMemory < 4;
    
    setSupportsWebGL(hasWebGL && !isLowEndDevice);
    setIsMobile(isMobileDevice);
  }, []);

  return (
    <motion.div
      ref={ref}
      className="w-full py-12"
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      {supportsWebGL ? (
        <React.Suspense fallback={
          <div className="w-full h-[500px] flex items-center justify-center">
            <div className="w-12 h-12 border-2 border-gold border-t-transparent rounded-full animate-spin"></div>
          </div>
        }>
          <ThreeJSGiftBoxesWithRibbon 
            leftProductImage={leftProductImage}
            rightProductImage={rightProductImage}
            leftProductName={leftProductName}
            rightProductName={rightProductName}
            leftProductPrice={leftProductPrice}
            rightProductPrice={rightProductPrice}
          />
        </React.Suspense>
      ) : (
        <div className="w-full py-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">
              Luxury Gifts Await
            </h2>
            <p className="text-gray-400">
              Discover our exclusive collection of premium products
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 max-w-4xl mx-auto px-4">
            <div className="w-full md:w-1/2 max-w-[300px]">
              <GiftBoxFallback 
                productImage={leftProductImage}
                productName={leftProductName}
                productPrice={leftProductPrice}
                boxColor="#121212"
                ribbonColor={enhancedLuxuryTheme.colors.primary.accent}
              />
            </div>
            
            <div className="w-full md:w-1/2 max-w-[300px]">
              <GiftBoxFallback 
                productImage={rightProductImage}
                productName={rightProductName}
                productPrice={rightProductPrice}
                boxColor="#1E1E1E"
                ribbonColor={enhancedLuxuryTheme.colors.primary.accent}
              />
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default LuxuryGiftBoxes;
