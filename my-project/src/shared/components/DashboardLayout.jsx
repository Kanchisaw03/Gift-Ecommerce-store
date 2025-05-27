import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ROLES } from '../../context/AuthContext';
import { luxuryTheme } from '../../styles/luxuryTheme';

/**
 * Shared dashboard layout for admin, seller, and super admin dashboards
 * Includes sidebar navigation, header, and content area
 */
const DashboardLayout = ({ children, activeTab }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Handle logout
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Navigation items based on user role
  const getNavigationItems = () => {
    // Common navigation items for all roles
    const commonItems = [
      { label: 'Dashboard', path: `/${user?.role}/dashboard`, icon: 'grid' },
      { label: 'Profile', path: '/profile', icon: 'user' },
    ];

    // Role-specific navigation items
    const roleSpecificItems = {
      [ROLES.BUYER]: [
        { label: 'My Orders', path: '/orders', icon: 'shopping-bag' },
        { label: 'Wishlist', path: '/wishlist', icon: 'heart' },
      ],
      [ROLES.SELLER]: [
        { label: 'Products', path: '/seller/products', icon: 'package' },
        { label: 'Orders', path: '/seller/orders', icon: 'shopping-cart' },
        { label: 'Coupons', path: '/seller/coupons', icon: 'tag' },
        { label: 'Revenue', path: '/seller/revenue', icon: 'dollar-sign' },
      ],
      [ROLES.ADMIN]: [
        { label: 'Users', path: '/admin/users', icon: 'users' },
        { label: 'Products', path: '/admin/products', icon: 'box' },
        { label: 'Orders', path: '/admin/orders', icon: 'shopping-bag' },
        { label: 'Settings', path: '/admin/settings', icon: 'settings' },
      ],
      [ROLES.SUPER_ADMIN]: [
        { label: 'Admins', path: '/super-admin/admins', icon: 'shield' },
        { label: 'Analytics', path: '/super-admin/analytics', icon: 'bar-chart-2' },
        { label: 'Access Control', path: '/super-admin/access-control', icon: 'lock' },
        { label: 'System Logs', path: '/super-admin/logs', icon: 'activity' },
      ],
    };

    return [...commonItems, ...(roleSpecificItems[user?.role] || [])];
  };

  // Feather icons helper function
  const Icon = ({ name }) => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      {name === 'grid' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />}
      {name === 'user' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />}
      {name === 'shopping-bag' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />}
      {name === 'heart' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />}
      {name === 'package' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />}
      {name === 'shopping-cart' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />}
      {name === 'dollar-sign' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />}
      {name === 'tag' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />}
      {name === 'users' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />}
      {name === 'box' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />}
      {name === 'settings' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />}
      {name === 'shield' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />}
      {name === 'bar-chart-2' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />}
      {name === 'lock' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />}
      {name === 'activity' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />}
      {name === 'log-out' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />}
    </svg>
  );

  return (
    <div className="flex h-screen bg-black text-white">
      {/* Sidebar */}
      <motion.div 
        className="fixed inset-y-0 left-0 z-50 w-64 bg-neutral-900 border-r border-gold/20 transform transition-transform duration-300 ease-in-out"
        initial={{ x: sidebarOpen ? 0 : -256 }}
        animate={{ x: sidebarOpen ? 0 : -256 }}
        style={{ boxShadow: luxuryTheme.shadows.md }}
      >
        {/* Logo */}
        <div className="p-6 border-b border-gold/20">
          <h1 
            className="text-xl font-bold text-gold"
            style={{ fontFamily: luxuryTheme.typography.fontFamily.heading }}
          >
            LUXURY ADMIN
          </h1>
        </div>

        {/* Navigation */}
        <nav className="mt-6 px-4">
          <ul className="space-y-2">
            {getNavigationItems().map((item, index) => (
              <li key={index}>
                <Link
                  to={item.path}
                  className={`flex items-center px-4 py-3 text-sm transition-all duration-300 ${
                    activeTab === item.label.toLowerCase() 
                      ? 'bg-gold/10 text-gold border-l-2 border-gold' 
                      : 'text-gray-300 hover:bg-black/20 hover:text-gold'
                  }`}
                  style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
                >
                  <Icon name={item.icon} />
                  <span className="ml-3">{item.label}</span>
                </Link>
              </li>
            ))}

            {/* Logout */}
            <li className="mt-8">
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-4 py-3 text-sm text-gray-300 hover:bg-black/20 hover:text-gold transition-all duration-300"
                style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
              >
                <Icon name="log-out" />
                <span className="ml-3">Logout</span>
              </button>
            </li>
          </ul>
        </nav>
      </motion.div>

      {/* Main Content */}
      <div className={`flex-1 flex flex-col ${sidebarOpen ? 'ml-64' : 'ml-0'} transition-all duration-300`}>
        {/* Header */}
        <header className="bg-neutral-900 border-b border-gold/20 p-4 flex justify-between items-center">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-md text-gray-300 hover:text-gold focus:outline-none"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* User Profile */}
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p 
                className="text-sm font-medium text-white"
                style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
              >
                {user?.name}
              </p>
              <p 
                className="text-xs text-gray-400 capitalize"
                style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
              >
                {user?.role}
              </p>
            </div>
            <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center">
              <span className="text-gold font-semibold">
                {user?.name?.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto bg-neutral-900 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
