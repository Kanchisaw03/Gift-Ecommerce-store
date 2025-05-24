import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../hooks/useAuth';
import useApiForm from '../../hooks/useApiForm';
import { register } from '../../services/api/authService';

const SignupForm = () => {
  const navigate = useNavigate();
  const { signup: authSignup } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState('buyer');
  
  // Validation rules for signup form
  const validationRules = {
    name: {
      required: true,
      minLength: 2,
      maxLength: 50
    },
    email: {
      required: true,
      email: true
    },
    password: {
      required: true,
      minLength: 8,
      pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      patternMessage: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    },
    confirmPassword: {
      required: true,
      custom: (value, formData) => value === formData.password,
      customMessage: 'Passwords do not match'
    }
  };
  
  // Handle successful signup
  const handleSignupSuccess = (response) => {
    if (response && response.user) {
      toast.success('Account created successfully! Please check your email to verify your account.');
      
      // Redirect to login page
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    }
  };
  
  // Initialize form with API integration
  const {
    formData,
    errors,
    loading,
    handleChange,
    handleSubmit,
    setFieldValue
  } = useApiForm({
    apiCall: (data) => {
      // Remove confirmPassword before sending to API
      const { confirmPassword, ...apiData } = data;
      return register({ ...apiData, role });
    },
    initialData: {
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    },
    validationRules,
    onSuccess: handleSignupSuccess,
    onError: (error) => {
      console.error('Signup error:', error);
    }
  });
  
  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  
  // Handle role change
  const handleRoleChange = (e) => {
    setRole(e.target.value);
  };
  
  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="bg-gray-900 p-8 rounded-lg shadow-lg border border-gray-800">
        <h2 className="text-2xl font-bold mb-6 text-center text-white">Create Account</h2>
        
        {/* Name Field */}
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium mb-1 text-gray-300">
            Full Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`w-full px-4 py-2 bg-gray-800 border ${
              errors.name ? 'border-red-500' : 'border-gray-700'
            } rounded-md focus:outline-none focus:ring-2 focus:ring-gold-500 text-white`}
            placeholder="John Doe"
            disabled={loading}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-500">{errors.name}</p>
          )}
        </div>
        
        {/* Email Field */}
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium mb-1 text-gray-300">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full px-4 py-2 bg-gray-800 border ${
              errors.email ? 'border-red-500' : 'border-gray-700'
            } rounded-md focus:outline-none focus:ring-2 focus:ring-gold-500 text-white`}
            placeholder="your@email.com"
            disabled={loading}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-500">{errors.email}</p>
          )}
        </div>
        
        {/* Password Field */}
        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium mb-1 text-gray-300">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full px-4 py-2 bg-gray-800 border ${
                errors.password ? 'border-red-500' : 'border-gray-700'
              } rounded-md focus:outline-none focus:ring-2 focus:ring-gold-500 text-white`}
              placeholder="••••••••"
              disabled={loading}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                  <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                </svg>
              )}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-sm text-red-500">{errors.password}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            Password must be at least 8 characters with uppercase, lowercase, number, and special character.
          </p>
        </div>
        
        {/* Confirm Password Field */}
        <div className="mb-4">
          <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1 text-gray-300">
            Confirm Password
          </label>
          <input
            type={showPassword ? 'text' : 'password'}
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className={`w-full px-4 py-2 bg-gray-800 border ${
              errors.confirmPassword ? 'border-red-500' : 'border-gray-700'
            } rounded-md focus:outline-none focus:ring-2 focus:ring-gold-500 text-white`}
            placeholder="••••••••"
            disabled={loading}
          />
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>
          )}
        </div>
        
        {/* Account Type */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2 text-gray-300">
            Account Type
          </label>
          <div className="flex space-x-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio text-gold-500 focus:ring-gold-500"
                name="accountType"
                value="buyer"
                checked={role === 'buyer'}
                onChange={handleRoleChange}
                disabled={loading}
              />
              <span className="ml-2 text-gray-300">Buyer</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio text-gold-500 focus:ring-gold-500"
                name="accountType"
                value="seller"
                checked={role === 'seller'}
                onChange={handleRoleChange}
                disabled={loading}
              />
              <span className="ml-2 text-gray-300">Seller</span>
            </label>
          </div>
        </div>
        
        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gold-600 hover:bg-gold-700 text-white font-medium py-2 px-4 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-gold-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating Account...
            </span>
          ) : (
            'Create Account'
          )}
        </button>
        
        {/* Sign In Link */}
        <div className="mt-6 text-center">
          <p className="text-gray-400">
            Already have an account?{' '}
            <a href="/login" className="text-gold-400 hover:text-gold-300 transition-colors">
              Sign in
            </a>
          </p>
        </div>
      </form>
    </div>
  );
};

export default SignupForm;
