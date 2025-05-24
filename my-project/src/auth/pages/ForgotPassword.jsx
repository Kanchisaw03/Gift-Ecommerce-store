import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import { luxuryTheme } from '../../styles/luxuryTheme';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const { requestPasswordReset } = useAuth();

  // Handle input change
  const handleChange = (e) => {
    setEmail(e.target.value);
    setError('');
  };

  // Validate email
  const validateEmail = () => {
    if (!email) {
      setError('Email is required');
      return false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Email is invalid');
      return false;
    }
    return true;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Clear previous messages
    setError('');
    setSuccessMessage('');
    
    // Validate email
    if (!validateEmail()) return;
    
    try {
      setIsSubmitting(true);
      
      // Call password reset function from auth context
      await requestPasswordReset(email);
      
      // Show success message
      setSuccessMessage('Password reset instructions have been sent to your email.');
    } catch (err) {
      setError('Failed to request password reset. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div 
      className="min-h-screen flex items-center justify-center bg-black px-4 sm:px-6 lg:px-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-md w-full">
        {/* Logo and heading */}
        <div className="text-center mb-10">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="flex justify-center mb-6"
          >
            <div className="w-16 h-16 rounded-full bg-gold/20 flex items-center justify-center">
              <span className="text-gold text-2xl font-bold">L</span>
            </div>
          </motion.div>
          
          <motion.h2
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-3xl font-extrabold text-white"
            style={{ fontFamily: luxuryTheme.typography.fontFamily.heading }}
          >
            Reset your password
          </motion.h2>
          
          <motion.p
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="mt-2 text-sm text-gray-400"
            style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
          >
            Enter your email address and we'll send you a link to reset your password.
          </motion.p>
        </div>
        
        {/* Forgot password form */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="bg-neutral-900 border border-gold/30 shadow-xl rounded-sm px-8 pt-8 pb-8 mb-4"
          style={{ boxShadow: luxuryTheme.shadows.lg + ', ' + luxuryTheme.shadows.goldInset }}
        >
          {/* Error message */}
          {error && (
            <div className="mb-4 p-3 bg-red-900/30 border border-red-500/50 text-red-200 text-sm rounded-sm">
              {error}
            </div>
          )}
          
          {/* Success message */}
          {successMessage && (
            <div className="mb-4 p-3 bg-emerald-900/30 border border-emerald-500/50 text-emerald-200 text-sm rounded-sm">
              {successMessage}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            {/* Email field */}
            <div className="mb-6">
              <label 
                htmlFor="email" 
                className="block text-sm font-medium text-gray-300 mb-2"
                style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-black/20 border border-gold/30 focus:outline-none focus:border-gold text-white"
                style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
              />
            </div>
            
            {/* Submit button */}
            <div className="mb-6">
              <motion.button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center py-3 px-4 bg-gold text-black hover:bg-gold-light focus:outline-none transition-all duration-300"
                style={{ 
                  fontFamily: luxuryTheme.typography.fontFamily.body,
                  letterSpacing: '1px',
                  boxShadow: luxuryTheme.shadows.md
                }}
                whileTap={{ scale: 0.98 }}
              >
                {isSubmitting ? (
                  <svg className="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  'SEND RESET LINK'
                )}
              </motion.button>
            </div>
            
            {/* Back to login */}
            <div className="text-center mt-4">
              <Link 
                to="/login" 
                className="text-gold hover:text-gold-light text-sm"
                style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
              >
                Back to login
              </Link>
            </div>
          </form>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ForgotPassword;
