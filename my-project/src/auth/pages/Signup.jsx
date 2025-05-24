import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { useAuth } from '../../hooks/useAuth';
import { ROLES } from '../../context/AuthContext';
import { luxuryTheme } from '../../styles/luxuryTheme';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: ROLES.BUYER
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [signupError, setSignupError] = useState('');

  const { signup } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check for role in URL query params
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const roleParam = queryParams.get('role');
    
    if (roleParam) {
      let selectedRole = ROLES.BUYER;
      
      // Map the role parameter to the correct ROLES constant
      switch(roleParam.toLowerCase()) {
        case 'seller':
          selectedRole = ROLES.SELLER;
          break;
        case 'admin':
          selectedRole = ROLES.ADMIN;
          break;
        case 'super_admin':
          selectedRole = ROLES.SUPER_ADMIN;
          break;
        default:
          selectedRole = ROLES.BUYER;
      }
      
      setFormData(prevData => ({
        ...prevData,
        role: selectedRole
      }));
    }
  }, [location]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
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
    
    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
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
    
    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Clear previous signup error
    setSignupError('');
    
    // Validate form
    if (!validateForm()) return;
    
    try {
      setIsSubmitting(true);
      console.log('Submitting registration form with data:', { 
        name: formData.name, 
        email: formData.email, 
        role: formData.role 
      });
      
      // Create userData object to match the expected format in authService
      const userData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role
      };
      
      // Call signup function from auth context with userData
      const result = await signup(userData.name, userData.email, userData.password, userData.role);
      
      console.log('Registration successful:', result);
      
      // For development - temporarily disable auth guards as per requirements
      // TODO: Remove this when moving to production
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userRole', userData.role);
      
      // Navigate to dashboard based on role
      const dashboardPath = 
        formData.role === ROLES.ADMIN ? '/admin' :
        formData.role === ROLES.SELLER ? '/seller' :
        formData.role === ROLES.SUPER_ADMIN ? '/superadmin' : 
        '/';
      
      toast.success(`Registration successful! Redirecting to ${dashboardPath}`);
      
      // Add short delay to allow state to update
      setTimeout(() => {
        navigate(dashboardPath, { replace: true });
      }, 1000);
    } catch (error) {
      console.error('Registration error in component:', error);
      
      // Display specific error message if available
      if (error.message) {
        setSignupError(error.message);
        toast.error(error.message);
      } else if (error.response?.data?.error) {
        setSignupError(error.response.data.error);
        toast.error(error.response.data.error);
      } else if (error.response?.status === 400) {
        const errorMsg = 'Invalid registration data. Please check your information and try again.';
        setSignupError(errorMsg);
        toast.error(errorMsg);
      } else if (!navigator.onLine) {
        const errorMsg = 'Network error: Please check your internet connection and try again.';
        setSignupError(errorMsg);
        toast.error(errorMsg);
      } else {
        const errorMsg = 'Failed to create an account. Please try again.';
        setSignupError(errorMsg);
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
            Create your account
          </motion.h2>
          
          <motion.p
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="mt-2 text-sm text-gray-400"
            style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
          >
            Already have an account?{' '}
            <Link to="/login" className="text-gold hover:text-gold-light">
              Sign in
            </Link>
          </motion.p>
        </div>
        
        {/* Signup form */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="bg-neutral-900 border border-gold/30 shadow-xl rounded-sm px-8 pt-8 pb-8 mb-4"
          style={{ boxShadow: luxuryTheme.shadows.lg + ', ' + luxuryTheme.shadows.goldInset }}
        >
          {/* Signup error message */}
          {signupError && (
            <div className="mb-4 p-3 bg-red-900/30 border border-red-500/50 text-red-200 text-sm rounded-sm">
              {signupError}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            {/* Name field */}
            <div className="mb-6">
              <label 
                htmlFor="name" 
                className="block text-sm font-medium text-gray-300 mb-2"
                style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
              >
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-black/20 border ${
                  errors.name ? 'border-red-500' : 'border-gold/30'
                } focus:outline-none focus:border-gold text-white`}
                style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-500">{errors.name}</p>
              )}
            </div>
            
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
                  autoComplete="new-password"
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
            
            {/* Confirm Password field */}
            <div className="mb-6">
              <label 
                htmlFor="confirmPassword" 
                className="block text-sm font-medium text-gray-300 mb-2"
                style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
              >
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-black/20 border ${
                  errors.confirmPassword ? 'border-red-500' : 'border-gold/30'
                } focus:outline-none focus:border-gold text-white`}
                style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>
              )}
            </div>
            
            {/* Role selection */}
            <div className="mb-6">
              <label 
                className="block text-sm font-medium text-gray-300 mb-2"
                style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
              >
                Account Type
              </label>
              <div className="grid grid-cols-3 gap-2">
                {Object.values(ROLES).map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setFormData({ ...formData, role })}
                    className={`py-2 px-4 border ${
                      formData.role === role
                        ? 'bg-gold/20 border-gold text-gold'
                        : 'border-gold/30 text-gray-300 hover:border-gold/50'
                    } focus:outline-none transition-all duration-300 capitalize`}
                    style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
                  >
                    {role.replace('_', ' ')}
                  </button>
                ))}
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
                  'CREATE ACCOUNT'
                )}
              </motion.button>
            </div>
            
            {/* Terms and conditions */}
            <div className="mt-4 text-center">
              <p 
                className="text-xs text-gray-400"
                style={{ fontFamily: luxuryTheme.typography.fontFamily.body }}
              >
                By signing up, you agree to our{' '}
                <Link to="/terms" className="text-gold hover:text-gold-light">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link to="/privacy" className="text-gold hover:text-gold-light">
                  Privacy Policy
                </Link>
              </p>
            </div>
            
            {/* Social signup */}
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

export default Signup;
