import React from 'react';
import { motion } from 'framer-motion';

const LoadingSpinner = () => {
  return (
    <div className="flex justify-center items-center h-full w-full py-10">
      <motion.div
        className="w-16 h-16 border-4 border-t-[#D4AF37] border-opacity-50 rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
};

export default LoadingSpinner;
