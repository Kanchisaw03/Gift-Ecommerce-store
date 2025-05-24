import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../hooks/useAuth';
import useApiForm from '../../hooks/useApiForm';
import { login } from '../../services/api/authService';

const LoginForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login: authLogin } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  
  // Get redirect path from location state or default to home
  const from = location.state?.from?.pathname || '/';
  
  // Validation rules for login form
  const validationRules = {
    email: {
      required: true,
      email: true
    },
    password: {
      required: true,
      minLength: 6
    }
  };
  
  // Handle successful login
  const handleLoginSuccess = (response) => {
    if (response && response.user) {
      // Use the login function from AuthContext to update global auth state
      authLogin(response.user.email, response.user.password)
        .then(() => {
          // Navigate to the page user was trying to access or home
          navigate(from, { replace: true });
        })
        .catch((error) => {
          console.error('Error in auth context login:', error);
        });
    }
  };
  
  // Initialize form with API integration
  const {
    formData,
    errors,
    loading,
    handleChange,
    handleSubmit
  } = useApiForm({
    apiCall: login,
    initialData: {
      email: '',
      password: ''
    },
    validationRules,
    onSuccess: handleLoginSuccess,
    onError: (error) => {
      console.error('Login error:', error);
    }
  });
  
  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  
  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="bg-gray-900 p-8 rounded-lg shadow-lg border border-gray-800">
        <h2 className="text-2xl font-bold mb-6 text-center text-white">Sign In</h2>
        
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
        <div className="mb-6">
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
        </div>
        
        {/* Forgot Password Link */}
        <div className="flex justify-end mb-6">
          <a
            href="/forgot-password"
            className="text-sm text-gold-400 hover:text-gold-300 transition-colors"
          >
            Forgot your password?
          </a>
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
              Signing In...
            </span>
          ) : (
            'Sign In'
          )}
        </button>
        
        {/* Sign Up Link */}
        <div className="mt-6 text-center">
          <p className="text-gray-400">
            Don't have an account?{' '}
            <a href="/signup" className="text-gold-400 hover:text-gold-300 transition-colors">
              Sign up
            </a>
          </p>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
