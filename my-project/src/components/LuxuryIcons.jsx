import React from 'react';
import luxuryTheme from '../styles/luxuryTheme';

// Base luxury icon component with gold gradient styling
const LuxuryIconBase = ({ children, size = 24, className = '', ...props }) => {
  return (
    <div 
      className={`inline-flex items-center justify-center ${className}`}
      style={{ 
        width: size, 
        height: size,
        color: 'currentColor'
      }}
      {...props}
    >
      {children}
    </div>
  );
};

// Filter icon
export const LuxuryFilterIcon = ({ size = 24, className = '', ...props }) => (
  <LuxuryIconBase size={size} className={className} {...props}>
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
    </svg>
  </LuxuryIconBase>
);

// Search icon
export const LuxurySearchIcon = ({ size = 24, className = '', ...props }) => (
  <LuxuryIconBase size={size} className={className} {...props}>
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"></circle>
      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
  </LuxuryIconBase>
);

// Grid icon
export const LuxuryGridIcon = ({ size = 24, className = '', ...props }) => (
  <LuxuryIconBase size={size} className={className} {...props}>
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7"></rect>
      <rect x="14" y="3" width="7" height="7"></rect>
      <rect x="14" y="14" width="7" height="7"></rect>
      <rect x="3" y="14" width="7" height="7"></rect>
    </svg>
  </LuxuryIconBase>
);

// List icon
export const LuxuryListIcon = ({ size = 24, className = '', ...props }) => (
  <LuxuryIconBase size={size} className={className} {...props}>
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="8" y1="6" x2="21" y2="6"></line>
      <line x1="8" y1="12" x2="21" y2="12"></line>
      <line x1="8" y1="18" x2="21" y2="18"></line>
      <line x1="3" y1="6" x2="3.01" y2="6"></line>
      <line x1="3" y1="12" x2="3.01" y2="12"></line>
      <line x1="3" y1="18" x2="3.01" y2="18"></line>
    </svg>
  </LuxuryIconBase>
);

// Chevron Down icon
export const LuxuryChevronDownIcon = ({ size = 24, className = '', ...props }) => (
  <LuxuryIconBase size={size} className={className} {...props}>
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9"></polyline>
    </svg>
  </LuxuryIconBase>
);

// Chevron Up icon
export const LuxuryChevronUpIcon = ({ size = 24, className = '', ...props }) => (
  <LuxuryIconBase size={size} className={className} {...props}>
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="18 15 12 9 6 15"></polyline>
    </svg>
  </LuxuryIconBase>
);

// Star icon
export const LuxuryStarIcon = ({ size = 24, className = '', filled = false, ...props }) => (
  <LuxuryIconBase size={size} className={className} {...props}>
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
    </svg>
  </LuxuryIconBase>
);

// Heart icon
export const LuxuryHeartIcon = ({ size = 24, className = '', filled = false, ...props }) => (
  <LuxuryIconBase size={size} className={className} {...props}>
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
    </svg>
  </LuxuryIconBase>
);

// Shopping Bag icon
export const LuxuryShoppingBagIcon = ({ size = 24, className = '', ...props }) => (
  <LuxuryIconBase size={size} className={className} {...props}>
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
      <line x1="3" y1="6" x2="21" y2="6"></line>
      <path d="M16 10a4 4 0 0 1-8 0"></path>
    </svg>
  </LuxuryIconBase>
);

// Eye icon
export const LuxuryEyeIcon = ({ size = 24, className = '', ...props }) => (
  <LuxuryIconBase size={size} className={className} {...props}>
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
      <circle cx="12" cy="12" r="3"></circle>
    </svg>
  </LuxuryIconBase>
);

// X (close) icon
export const LuxuryCloseIcon = ({ size = 24, className = '', ...props }) => (
  <LuxuryIconBase size={size} className={className} {...props}>
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  </LuxuryIconBase>
);

// Award/Premium icon
export const LuxuryAwardIcon = ({ size = 24, className = '', ...props }) => (
  <LuxuryIconBase size={size} className={className} {...props}>
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="7"></circle>
      <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
    </svg>
  </LuxuryIconBase>
);

// Sliders icon
export const LuxurySlidersIcon = ({ size = 24, className = '', ...props }) => (
  <LuxuryIconBase size={size} className={className} {...props}>
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="4" y1="21" x2="4" y2="14"></line>
      <line x1="4" y1="10" x2="4" y2="3"></line>
      <line x1="12" y1="21" x2="12" y2="12"></line>
      <line x1="12" y1="8" x2="12" y2="3"></line>
      <line x1="20" y1="21" x2="20" y2="16"></line>
      <line x1="20" y1="12" x2="20" y2="3"></line>
      <line x1="1" y1="14" x2="7" y2="14"></line>
      <line x1="9" y1="8" x2="15" y2="8"></line>
      <line x1="17" y1="16" x2="23" y2="16"></line>
    </svg>
  </LuxuryIconBase>
);

export default {
  LuxuryFilterIcon,
  LuxurySearchIcon,
  LuxuryGridIcon,
  LuxuryListIcon,
  LuxuryChevronDownIcon,
  LuxuryChevronUpIcon,
  LuxuryStarIcon,
  LuxuryHeartIcon,
  LuxuryShoppingBagIcon,
  LuxuryEyeIcon,
  LuxuryCloseIcon,
  LuxuryAwardIcon,
  LuxurySlidersIcon
};
