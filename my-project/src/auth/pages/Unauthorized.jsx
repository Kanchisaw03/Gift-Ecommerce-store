import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import { luxuryTheme } from '../../styles/luxuryTheme';

const Unauthorized = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Handle go back
  const handleGoBack = () => {
    navigate(-1);
  };

  // Get home path based on user role
  const getHomePath = () => {
    if (!user) return '/';
    
    switch (user.role) {
      case 'admin':
        return '/admin/dashboard';
      case 'seller':
        return '/seller/dashboard';
      case 'super_admin':
        return '/super-admin/dashboard';
      default:
        return '/';
    }
  };

  return (
    <motion.div 
      className="min-h-screen flex items-center justify-center bg-black px-4 sm:px-6 lg:px-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-md w-full text-center">
        {/* Icon */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex justify-center mb-6"
        >
          <div className="w-24 h-24 rounded-full bg-gold/10 flex items-center justify-center">
            <svg className="w-12 h-12 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
        </motion.div>
        
        {/* Heading */}
        <motion.h1
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-3xl font-extrabold text-white mb-2"
          style={{ fontFamily: luxuryTheme.typography.fontFamily.heading }}
        >
          Access Denied
        </motion.h1>
        
        {/* Message */}
        <motion.p
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-lg text-gray-300 mb-8"
          style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
        >
          You don't have permission to access this page.
        </motion.p>
        
        {/* Buttons */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="flex flex-col sm:flex-row justify-center gap-4"
        >
          <button
            onClick={handleGoBack}
            className="px-6 py-3 border border-gold/30 text-gold hover:bg-gold/10 transition-all duration-300"
            style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
          >
            Go Back
          </button>
          
          <Link
            to={getHomePath()}
            className="px-6 py-3 bg-gold text-black hover:bg-gold-light transition-all duration-300"
            style={{ 
              fontFamily: luxuryTheme.typography.fontFamily.body,
              boxShadow: luxuryTheme.shadows.md
            }}
          >
            Go to Dashboard
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Unauthorized;
