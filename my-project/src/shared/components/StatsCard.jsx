import React from 'react';
import { motion } from 'framer-motion';
import { luxuryTheme } from '../../styles/luxuryTheme';

/**
 * Reusable stats card component for dashboards
 * Displays a statistic with title, value, icon, and optional trend indicator
 */
const StatsCard = ({ title, value, icon, trend, trendValue, trendLabel }) => {
  // Determine trend color and icon
  const getTrendColor = () => {
    if (!trend) return 'text-gray-400';
    return trend === 'up' ? 'text-emerald-400' : 'text-rose-400';
  };

  const getTrendIcon = () => {
    if (!trend) return null;
    return trend === 'up' ? (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 10l7-7m0 0l7 7m-7-7v18" />
      </svg>
    ) : (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
      </svg>
    );
  };

  return (
    <motion.div 
      className="bg-neutral-800 border border-gold/20 p-6 rounded-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      style={{ boxShadow: luxuryTheme.shadows.sm }}
      whileHover={{ 
        y: -5,
        boxShadow: luxuryTheme.shadows.lg,
        borderColor: 'rgba(212, 175, 55, 0.4)'
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 
          className="text-sm font-medium text-gray-300"
          style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
        >
          {title}
        </h3>
        <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center text-gold">
          {icon}
        </div>
      </div>
      
      <div className="mb-2">
        <p 
          className="text-2xl font-semibold text-white"
          style={{ fontFamily: luxuryTheme.typography.fontFamily.heading }}
        >
          {value}
        </p>
      </div>
      
      {trend && (
        <div className="flex items-center">
          <span className={`flex items-center ${getTrendColor()}`}>
            {getTrendIcon()}
            <span 
              className="ml-1 text-sm font-medium"
              style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
            >
              {trendValue}
            </span>
          </span>
          <span 
            className="ml-2 text-xs text-gray-400"
            style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
          >
            {trendLabel}
          </span>
        </div>
      )}
    </motion.div>
  );
};

export default StatsCard;
