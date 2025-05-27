import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useCart } from "../hooks/useCart";
import { useAuth } from "../hooks/useAuth";
import { useWishlist } from "../context/WishlistContext";
import { luxuryTheme } from "../styles/luxuryTheme";
import NotificationBell from "./NotificationBell";

export default function Navbar({ toggleCart }) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef(null);
  const { total } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const { wishlistCount } = useWishlist();
  const location = useLocation();

  // Close mobile menu and profile menu when route changes
  useEffect(() => {
    setIsOpen(false);
    setProfileMenuOpen(false);
  }, [location]);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle clicks outside of profile menu to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setProfileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "glass-dark border-b border-gold/20 py-2"
          : "bg-transparent py-4"
      }`}
      style={{
        backdropFilter: 'blur(8px)',
        backgroundColor: scrolled ? 'rgba(10, 10, 10, 0.85)' : 'rgba(10, 10, 10, 0.5)'
      }}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-2xl md:text-3xl font-bold"
            style={{ fontFamily: luxuryTheme.typography.fontFamily.heading }}
          >
            <span className="text-gradient-gold">GiftNest</span>
          </motion.div>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-10">
          <NavLink to="/" label="Home" />
          <NavLink to="/products" label="Shop" />
          <NavLink to="/about" label="About" />
          <NavLink to="/contact" label="Contact" />
          
          {/* Auth Links */}
          {isAuthenticated ? (
            <div className="relative" ref={profileMenuRef}>
              <button 
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className="flex items-center text-white hover:text-gold transition-all duration-300"
                style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
              >
                <span className="text-xs uppercase tracking-wider font-medium mr-2">
                  {user?.name}
                </span>
                <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center text-gold">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
              </button>
              <div 
                className={`absolute right-0 mt-2 w-48 bg-neutral-900 border border-gold/20 shadow-lg py-1 z-50 transition-opacity duration-200 ${profileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
              >
                {user?.role === 'admin' && (
                  <Link to="/admin" className="block px-4 py-2 text-sm text-white hover:bg-gold/10 hover:text-gold">
                    Admin Dashboard
                  </Link>
                )}
                {user?.role === 'super_admin' && (
                  <Link to="/admin/super" className="block px-4 py-2 text-sm text-white hover:bg-gold/10 hover:text-gold">
                    Super Admin
                  </Link>
                )}
                {user?.role === 'seller' && (
                  <Link to="/seller" className="block px-4 py-2 text-sm text-white hover:bg-gold/10 hover:text-gold">
                    Seller Dashboard
                  </Link>
                )}
                <Link to="/profile" className="block px-4 py-2 text-sm text-white hover:bg-gold/10 hover:text-gold">
                  Profile
                </Link>
                <Link to="/orders" className="block px-4 py-2 text-sm text-white hover:bg-gold/10 hover:text-gold">
                  Orders
                </Link>
                <Link to="/notifications" className="block px-4 py-2 text-sm text-white hover:bg-gold/10 hover:text-gold">
                  Notifications
                </Link>
                <button
                  onClick={() => {
                    setProfileMenuOpen(false);
                    logout();
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-gold/10 hover:text-gold"
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link 
                to="/login"
                className="text-white hover:text-gold transition-all duration-300"
                style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
              >
                <span className="text-xs uppercase tracking-wider font-medium">Login</span>
              </Link>
              <Link 
                to="/signup"
                className="bg-gold/20 border border-gold/30 px-3 py-1 text-gold hover:bg-gold/30 transition-all duration-300"
                style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
              >
                <span className="text-xs uppercase tracking-wider font-medium">Sign Up</span>
              </Link>
            </div>
          )}
          
          {/* Notification Bell - Only show for authenticated users */}
          {isAuthenticated && (
            <NotificationBell />
          )}
          
          {/* Wishlist Icon */}
          <Link
            to="/wishlist"
            className="relative p-2 text-white hover:text-gold transition-all duration-300 mr-1"
            aria-label="View wishlist"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            {wishlistCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 bg-gradient-to-r from-amber-500 to-yellow-300 text-black text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center shadow-gold"
                style={{ boxShadow: '0 0 10px rgba(212, 175, 55, 0.5)' }}
              >
                {wishlistCount}
              </motion.span>
            )}
          </Link>
          
          {/* Cart Button */}
          <button
            onClick={toggleCart}
            className="relative text-white hover:text-gold transition-all duration-300 group"
            aria-label="Open cart"
            style={{ 
              background: 'rgba(212, 175, 55, 0.05)',
              border: '1px solid rgba(212, 175, 55, 0.2)',
              borderRadius: '4px',
              padding: '6px 10px',
            }}
          >
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <span className="text-xs uppercase tracking-wider font-medium">Cart</span>
            </div>
            {total.quantity > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 bg-gradient-to-r from-amber-500 to-yellow-300 text-black text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-gold"
                style={{ boxShadow: '0 0 10px rgba(212, 175, 55, 0.5)' }}
              >
                {total.quantity}
              </motion.span>
            )}
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center space-x-4 md:hidden">
          <button
            onClick={toggleCart}
            className="relative text-white hover:text-gold transition-all duration-300 group"
            aria-label="Open cart"
            style={{ 
              background: 'rgba(212, 175, 55, 0.05)',
              border: '1px solid rgba(212, 175, 55, 0.2)',
              borderRadius: '4px',
              padding: '6px 10px',
            }}
          >
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            {total.quantity > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 bg-gradient-to-r from-amber-500 to-yellow-300 text-black text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-gold"
                style={{ boxShadow: '0 0 10px rgba(212, 175, 55, 0.5)' }}
              >
                {total.quantity}
              </motion.span>
            )}
          </button>
          
          {/* Mobile Notification Bell */}
          {isAuthenticated && (
            <NotificationBell />
          )}
          
          <Link
            to="/wishlist"
            className="relative p-2 text-white hover:text-gold transition-all duration-300"
            aria-label="View wishlist"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            {wishlistCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 bg-gradient-to-r from-amber-500 to-yellow-300 text-black text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center shadow-gold"
                style={{ boxShadow: '0 0 10px rgba(212, 175, 55, 0.5)' }}
              >
                {wishlistCount}
              </motion.span>
            )}
          </Link>
          
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-white hover:text-gold p-2 transition-colors duration-300"
            aria-label={isOpen ? "Close menu" : "Open menu"}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-6 w-6" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="md:hidden glass-dark border-t border-gold/10"
          style={{
            backdropFilter: 'blur(10px)',
            backgroundColor: 'rgba(10, 10, 10, 0.95)'
          }}
        >
          <div className="container mx-auto px-4 py-3 flex flex-col space-y-3">
            <MobileNavLink to="/" label="Home" />
            <MobileNavLink to="/products" label="Shop" />
            <MobileNavLink to="/wishlist" label="Wishlist" />
            <MobileNavLink to="/about" label="About" />
            <MobileNavLink to="/contact" label="Contact" />
            {isAuthenticated ? (
              <>
                {user?.role === 'admin' && <MobileNavLink to="/admin" label="Admin Dashboard" />}
                {user?.role === 'super_admin' && <MobileNavLink to="/admin/super" label="Super Admin" />}
                {user?.role === 'seller' && <MobileNavLink to="/seller" label="Seller Dashboard" />}
                <MobileNavLink to="/profile" label="Profile" />
                <MobileNavLink to="/notifications" label="Notifications" />
                <button 
                  onClick={logout}
                  className="text-left py-2 text-white hover:text-gold transition-colors"
                  style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
                >
                  <span className="uppercase text-sm tracking-wider">Logout</span>
                </button>
              </>
            ) : (
              <>
                <MobileNavLink to="/login" label="Login" />
                <MobileNavLink to="/signup" label="Sign Up" />
              </>
            )}
          </div>
        </motion.div>
      )}
    </nav>
  );
}

// Desktop navigation link component
function NavLink({ to, label }) {
  const location = useLocation();
  const isActive = location.pathname === to || 
    (to !== "/" && location.pathname.startsWith(to));

  return (
    <Link
      to={to}
      className={`relative font-medium transition-all duration-300 group ${isActive ? "text-gold" : "text-white hover:text-gold"}`}
      style={{ fontFamily: luxuryTheme.typography.fontFamily.body, letterSpacing: '1px' }}
    >
      <span className="uppercase text-sm tracking-wider">{label}</span>
      <div 
        className={`absolute -bottom-1 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold to-transparent ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'}`}
        style={{ transition: 'all 0.3s ease' }}
      />
      {isActive && (
        <motion.div
          layoutId="navbar-indicator"
          className="absolute -bottom-1 left-0 right-0 h-0.5"
          style={{ background: luxuryTheme.colors.gradients.gold }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      )}
    </Link>
  );
}

// Mobile navigation link component
function MobileNavLink({ to, label }) {
  const location = useLocation();
  const isActive = location.pathname === to || 
    (to !== "/" && location.pathname.startsWith(to));

  return (
    <Link
      to={to}
      className={`py-3 block font-medium transition-all duration-300 ${isActive ? "text-gold" : "text-white hover:text-gold"}`}
      style={{ fontFamily: luxuryTheme.typography.fontFamily.body, letterSpacing: '1px' }}
    >
      <div className="flex items-center">
        <span className="uppercase text-sm tracking-wider">{label}</span>
        {isActive && (
          <motion.div 
            className="ml-2 h-1 w-1 rounded-full bg-gold"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            layoutId="mobile-nav-indicator"
          ></motion.div>
        )}
      </div>
    </Link>
  );
}
