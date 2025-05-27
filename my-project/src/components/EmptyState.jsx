import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { luxuryTheme } from '../styles/luxuryTheme';

const EmptyState = ({ 
  icon, 
  title, 
  message, 
  actionText, 
  actionLink,
  secondaryActionText,
  secondaryActionLink,
  onAction
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center py-12 px-4 text-center"
    >
      <div className="bg-[#111111] border border-gold/20 rounded-lg p-8 max-w-md mx-auto w-full">
        <div className="mb-6 flex justify-center">
          <div className="w-16 h-16 rounded-full flex items-center justify-center bg-gold/10 border border-gold/30">
            {icon}
          </div>
        </div>
        
        <h2 
          className="text-2xl font-bold mb-3 text-white"
          style={{ fontFamily: luxuryTheme.typography.fontFamily.heading }}
        >
          {title}
        </h2>
        
        <p 
          className="text-gray-400 mb-8"
          style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
        >
          {message}
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          {actionLink ? (
            <Link
              to={actionLink}
              className="px-6 py-3 bg-gradient-to-r from-amber-600 to-yellow-500 text-black font-medium rounded-md transition-all duration-300 hover:shadow-gold"
              style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
            >
              {actionText}
            </Link>
          ) : onAction ? (
            <button
              onClick={onAction}
              className="px-6 py-3 bg-gradient-to-r from-amber-600 to-yellow-500 text-black font-medium rounded-md transition-all duration-300 hover:shadow-gold"
              style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
            >
              {actionText}
            </button>
          ) : null}
          
          {secondaryActionLink && (
            <Link
              to={secondaryActionLink}
              className="px-6 py-3 bg-transparent border border-gold/30 text-gold font-medium rounded-md transition-all duration-300 hover:bg-gold/10"
              style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
            >
              {secondaryActionText}
            </Link>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default EmptyState;
