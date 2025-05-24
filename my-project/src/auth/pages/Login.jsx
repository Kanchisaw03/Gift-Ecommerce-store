import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { useAuth } from '../../hooks/useAuth';
import { luxuryTheme } from '../../styles/luxuryTheme';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get redirect path from location state or default to home
  const from = location.state?.from?.pathname || '/';

  // Handle input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    
    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Clear previous login error
    setLoginError('');
    
    // Validate form
    if (!validateForm()) return;
    
    try {
      setIsSubmitting(true);
      console.log('Attempting login with:', { email: formData.email });
      
      // Call login function from auth context
      const result = await login(formData.email, formData.password);
      
      console.log('Login successful:', result);
      
      // For development - temporarily disable auth guards as per requirements
      // TODO: Remove this when moving to production
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userRole', result.user?.role || 'buyer');
      
      // Get redirect path from location state or default based on user role
      const redirectPath = location.state?.from?.pathname || 
        (result.user?.role === 'admin' ? '/admin' :
        result.user?.role === 'seller' ? '/seller' :
        result.user?.role === 'super_admin' ? '/superadmin' : 
        '/');
      
      toast.success(`Welcome back, ${result.user?.name || 'User'}!`);
      
      // Add short delay to allow state to update
      setTimeout(() => {
        navigate(redirectPath, { replace: true });
      }, 1000);
    } catch (error) {
      console.error('Login error in component:', error);
      
      // Display specific error message if available
      if (error.message) {
        setLoginError(error.message);
        toast.error(error.message);
      } else if (error.response?.data?.error) {
        setLoginError(error.response.data.error);
        toast.error(error.response.data.error);
      } else if (error.response?.status === 401) {
        const errorMsg = 'Invalid credentials. Please check your email and password.';
        setLoginError(errorMsg);
        toast.error(errorMsg);
      } else if (!navigator.onLine) {
        const errorMsg = 'Network error: Please check your internet connection and try again.';
        setLoginError(errorMsg);
        toast.error(errorMsg);
      } else {
        const errorMsg = 'Failed to log in. Please try again.';
        setLoginError(errorMsg);
        toast.error(errorMsg);
      }
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
            Sign in to your account
          </motion.h2>
          
          <motion.p
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="mt-2 text-sm text-gray-400"
            style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
          >
            Or{' '}
            <Link to="/signup" className="text-gold hover:text-gold-light">
              create a new account
            </Link>
          </motion.p>
        </div>
        
        {/* Login form */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="bg-neutral-900 border border-gold/30 shadow-xl rounded-sm px-8 pt-8 pb-8 mb-4"
          style={{ boxShadow: luxuryTheme.shadows.lg + ', ' + luxuryTheme.shadows.goldInset }}
        >
          {/* Login error message */}
          {loginError && (
            <div className="mb-4 p-3 bg-red-900/30 border border-red-500/50 text-red-200 text-sm rounded-sm">
              {loginError}
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
                name="email"
                type="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-black/20 border ${
                  errors.email ? 'border-red-500' : 'border-gold/30'
                } focus:outline-none focus:border-gold text-white`}
                style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email}</p>
              )}
            </div>
            
            {/* Password field */}
            <div className="mb-6">
              <label 
                htmlFor="password" 
                className="block text-sm font-medium text-gray-300 mb-2"
                style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-black/20 border ${
                    errors.password ? 'border-red-500' : 'border-gold/30'
                  } focus:outline-none focus:border-gold text-white`}
                  style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gold"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">{errors.password}</p>
              )}
            </div>
            
            {/* Remember me and forgot password */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <input
                  id="rememberMe"
                  name="rememberMe"
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="h-4 w-4 bg-black border-gold/30 focus:ring-gold"
                />
                <label 
                  htmlFor="rememberMe" 
                  className="ml-2 block text-sm text-gray-300"
                  style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
                >
                  Remember me
                </label>
              </div>
              
              <div className="text-sm">
                <Link 
                  to="/forgot-password" 
                  className="text-gold hover:text-gold-light"
                  style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
                >
                  Forgot your password?
                </Link>
              </div>
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
                  'SIGN IN'
                )}
              </motion.button>
            </div>
            
            {/* Social login */}
            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gold/20"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span 
                    className="px-4 bg-neutral-900 text-gray-400"
                    style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
                  >
                    Or continue with
                  </span>
                </div>
              </div>
              
              <div className="mt-6">
                <motion.button
                  type="button"
                  className="w-full flex justify-center items-center py-3 px-4 border border-gold/30 hover:border-gold/50 bg-black/20 text-white hover:bg-black/30 focus:outline-none transition-all duration-300"
                  style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
                  whileTap={{ scale: 0.98 }}
                >
                  <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"/>
                  </svg>
                  Google
                </motion.button>
              </div>
            </div>
          </form>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Login;
