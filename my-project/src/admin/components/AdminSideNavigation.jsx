import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import { luxuryTheme } from '../../styles/luxuryTheme';

const AdminSideNavigation = ({ isCollapsed, toggleCollapse }) => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [showConfirmLogout, setShowConfirmLogout] = useState(false);

  // Navigation items with icons
  const navItems = [
    {
      label: 'Dashboard',
      path: '/admin',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    },
    {
      label: 'Products',
      path: '/admin/products',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      )
    },
    {
      label: 'Users',
      path: '/admin/users',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      )
    },
    {
      label: 'Settings',
      path: '/admin/settings',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    }
  ];

  // Add Super Admin option if user has the role
  if (user && user.role === 'SuperAdmin') {
    navItems.push({
      label: 'Super Admin',
      path: '/admin/super',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      )
    });
  }

  // Handle logout
  const handleLogout = () => {
    setShowConfirmLogout(true);
  };

  const confirmLogout = () => {
    logout();
    setShowConfirmLogout(false);
  };

  const cancelLogout = () => {
    setShowConfirmLogout(false);
  };

  return (
    <div 
      className={`bg-neutral-900 border-r border-gold/20 h-full transition-all duration-300 ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
      style={{ boxShadow: luxuryTheme.shadows.md }}
    >
      {/* Logo and collapse button */}
      <div className="flex items-center justify-between p-4 border-b border-gold/20">
        {!isCollapsed && (
          <div 
            className="text-gold font-bold text-lg"
            style={{ fontFamily: luxuryTheme.typography.fontFamily.heading }}
          >
            Luxe Haven
          </div>
        )}
        <button
          onClick={toggleCollapse}
          className="text-gray-400 hover:text-gold transition-colors duration-200"
        >
          {isCollapsed ? (
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

      {/* Navigation items */}
      <nav className="mt-6 px-2">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center p-3 rounded-sm transition-all duration-200 ${
                    isActive
                      ? 'bg-gold/20 text-gold'
                      : 'text-gray-400 hover:bg-black/30 hover:text-white'
                  }`}
                >
                  <span className="flex-shrink-0">{item.icon}</span>
                  
                  {!isCollapsed && (
                    <span 
                      className="ml-3 font-medium"
                      style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
                    >
                      {item.label}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User info and logout */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gold/20">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center text-gold">
            {user && user.name ? user.name.charAt(0).toUpperCase() : 'A'}
          </div>
          
          {!isCollapsed && (
            <div className="ml-3 overflow-hidden">
              <p 
                className="text-sm font-medium text-white truncate"
                style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
              >
                {user ? user.name : 'Admin User'}
              </p>
              <p 
                className="text-xs text-gray-400 truncate"
                style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
              >
                {user ? user.role : 'Admin'}
              </p>
            </div>
          )}
          
          <button
            onClick={handleLogout}
            className="ml-auto text-gray-400 hover:text-red-500 transition-colors duration-200"
            title="Logout"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </div>

      {/* Logout confirmation modal */}
      {showConfirmLogout && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/70">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-neutral-900 border border-gold/30 shadow-xl rounded-sm p-6 max-w-sm w-full"
            style={{ boxShadow: luxuryTheme.shadows.lg }}
          >
            <h3 
              className="text-lg font-bold text-white mb-4"
              style={{ fontFamily: luxuryTheme.typography.fontFamily.heading }}
            >
              Confirm Logout
            </h3>
            
            <p 
              className="text-gray-300 mb-6"
              style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
            >
              Are you sure you want to logout? Any unsaved changes will be lost.
            </p>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={cancelLogout}
                className="px-4 py-2 border border-gold/30 text-gold hover:bg-gold/10 transition-all duration-300"
                style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
              >
                Cancel
              </button>
              
              <button
                onClick={confirmLogout}
                className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 transition-all duration-300"
                style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
              >
                Logout
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminSideNavigation;
