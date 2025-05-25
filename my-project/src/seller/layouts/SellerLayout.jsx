import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const SellerLayout = ({ children }) => {
  const location = useLocation();
  
  // Navigation links for seller dashboard
  const navLinks = [
    { name: 'Dashboard', path: '/seller' },
    { name: 'Products', path: '/seller/products' },
    { name: 'Add Product', path: '/seller/products/add' },
    { name: 'Orders', path: '/seller/orders' },
    { name: 'Test Product', path: '/seller/test-product' },
  ];
  
  // Check if the current path matches the nav link
  const isActive = (path) => {
    return location.pathname === path;
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-900">
      {/* Seller Header */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold text-white">Seller Dashboard</h1>
            <Link 
              to="/"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Return to Store
            </Link>
          </div>
        </div>
      </header>
      
      {/* Seller Navigation */}
      <div className="bg-gray-800 border-b border-gray-700 shadow-md">
        <div className="container mx-auto px-4">
          <nav className="flex overflow-x-auto">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-3 text-sm font-medium whitespace-nowrap ${
                  isActive(link.path)
                    ? 'text-gold-400 border-b-2 border-gold-400'
                    : 'text-gray-300 hover:text-white hover:border-b-2 hover:border-gray-300'
                } transition-colors`}
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>
      
      {/* Main Content */}
      <main className="flex-grow bg-gray-900">
        {children}
      </main>
      
      {/* Seller Footer */}
      <footer className="bg-gray-800 border-t border-gray-700 py-4">
        <div className="container mx-auto px-4">
          <p className="text-center text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} Seller Portal - All rights reserved
          </p>
        </div>
      </footer>
    </div>
  );
};

export default SellerLayout;
