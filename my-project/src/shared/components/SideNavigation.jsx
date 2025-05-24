import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import { luxuryTheme } from '../../styles/luxuryTheme';

/**
 * Reusable side navigation component for dashboards
 * Displays navigation links based on user role
 */
const SideNavigation = ({ items, collapsed, toggleCollapse }) => {
  const { user } = useAuth();

  return (
    <motion.div 
      className={`h-full bg-neutral-900 border-r border-gold/20 ${
        collapsed ? 'w-16' : 'w-64'
      } transition-all duration-300 ease-in-out`}
      initial={{ x: 0 }}
      animate={{ x: 0 }}
      style={{ boxShadow: luxuryTheme.shadows.md }}
    >
      {/* Toggle button */}
      <div className="flex justify-end p-2">
        <button
          onClick={toggleCollapse}
          className="p-1 rounded-full text-gray-400 hover:text-gold hover:bg-black/20"
        >
          {collapsed ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          )}
        </button>
      </div>

      {/* User info */}
      <div className={`p-4 border-b border-gold/20 ${collapsed ? 'text-center' : ''}`}>
        <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center mx-auto mb-2">
          <span className="text-gold font-semibold">
            {user?.name?.charAt(0).toUpperCase()}
          </span>
        </div>
        {!collapsed && (
          <>
            <h3 
              className="text-sm font-medium text-white truncate"
              style={{ fontFamily: luxuryTheme.typography.fontFamily.heading }}
            >
              {user?.name}
            </h3>
            <p 
              className="text-xs text-gray-400 capitalize"
              style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
            >
              {user?.role}
            </p>
          </>
        )}
      </div>

      {/* Navigation items */}
      <nav className="mt-4">
        <ul className="space-y-1">
          {items.map((item, index) => (
            <li key={index}>
              <NavLink
                to={item.path}
                className={({ isActive }) => `
                  flex items-center px-4 py-3 text-sm transition-all duration-300
                  ${isActive 
                    ? 'bg-gold/10 text-gold border-l-2 border-gold' 
                    : 'text-gray-300 hover:bg-black/20 hover:text-gold'
                  }
                  ${collapsed ? 'justify-center' : ''}
                `}
                style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
              >
                <span className="w-5 h-5">{item.icon}</span>
                {!collapsed && <span className="ml-3">{item.label}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </motion.div>
  );
};

export default SideNavigation;
