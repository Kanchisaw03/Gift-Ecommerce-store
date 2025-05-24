import axiosInstance from './axiosConfig';


/**
 * Register a new user
 * @param {Object} userData - User registration data
 * @returns {Promise} - Response from API
 */
export const register = async (userData) => {
  try {
    console.log('Registering user with data:', { ...userData, password: '***HIDDEN***' });
    
    // Validate required fields before sending request
    if (!userData.name || !userData.email || !userData.password) {
      throw new Error('Name, email and password are required');
    }
    
    // Validate role if provided
    if (userData.role && !['buyer', 'seller', 'admin', 'super_admin'].includes(userData.role)) {
      console.warn(`Invalid role: ${userData.role}, defaulting to 'buyer'`);
      userData.role = 'buyer';
    }
    
    // Make the API request
    console.log('Sending registration request to API endpoint');
    const response = await axiosInstance.post('/auth/register', userData);
    
    console.log('Registration successful! Response:', response.data);
    
    // Store authentication data in localStorage
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('refreshToken', response.data.refreshToken);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    
    return response.data;
  } catch (error) {
    console.error('Registration error:', error);
    
    // Enhanced error handling with more detailed information
    if (error.response) {
      // The server responded with a status code outside the 2xx range
      console.error('Server error response:', {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers
      });
      
      // Return a structured error object
      const errorMessage = error.response.data?.error || 
                          error.response.data?.message || 
                          'Registration failed: Server returned an error';
      
      throw { 
        message: errorMessage,
        status: error.response.status,
        data: error.response.data
      };
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received from server:', error.request);
      throw { 
        message: 'Registration failed: No response from server. Please check your internet connection and try again.',
        networkError: true
      };
    } else {
      // Something happened in setting up the request
      console.error('Request setup error:', error.message);
      throw { 
        message: `Registration failed: ${error.message}`,
        clientError: true
      };
    }
  }
};

/**
 * Login user
 * @param {Object} credentials - User login credentials
 * @returns {Promise} - Response from API
 */
export const login = async (credentials) => {
  try {
    console.log('Attempting login with credentials:', { email: credentials.email });
    
    // Validate required fields
    if (!credentials.email || !credentials.password) {
      throw new Error('Email and password are required');
    }
    
    // Make the API request
    console.log('Sending login request to:', axiosInstance.defaults.baseURL + '/auth/login');
    const response = await axiosInstance.post('/auth/login', credentials);
    
    console.log('Login successful!');
    
    // Store authentication data in localStorage
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('refreshToken', response.data.refreshToken);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      // Temporarily disable auth guards as per user requirements
      // TODO: Remove this when moving to production
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userRole', response.data.user?.role || 'buyer');
    }
    
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    
    // Enhanced error handling
    if (error.response) {
      console.error('Server error response:', {
        status: error.response.status,
        data: error.response.data
      });
      
      const errorMessage = error.response.data?.error || 
                          error.response.data?.message || 
                          'Invalid credentials';
      
      throw { 
        message: errorMessage,
        status: error.response.status
      };
    } else if (error.request) {
      console.error('No response received from server:', error.request);
      throw { 
        message: 'Login failed: No response from server. Please check your internet connection.',
        networkError: true
      };
    } else {
      console.error('Request setup error:', error.message);
      throw { 
        message: `Login failed: ${error.message}`,
        clientError: true
      };
    }
  }
};

/**
 * Logout user
 * @returns {Promise} - Response from API
 */
export const logout = async () => {
  try {
    console.log('Attempting to logout user');
    
    // Support both GET and POST methods for logout
    // Some browsers prefetch GET requests which can cause unintended logouts
    const response = await axiosInstance.post('/auth/logout', {}, {
      withCredentials: true // Important for clearing cookies
    });
    
    console.log('Logout API response:', response.data);
    
    // Clear all authentication data from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userRole');
    
    // Clear any potential cookies related to authentication
    // This is a client-side approach to clearing cookies
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = 'refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    
    console.log('User logged out successfully');
    return response.data;
  } catch (error) {
    console.error('Logout error:', error);
    
    // Still clear localStorage even if API call fails
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userRole');
    
    // Clear cookies even if API call fails
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = 'refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    
    console.log('Cleared local authentication data despite API error');
    
    // Don't throw an error if we're in development mode
    if (import.meta.env.DEV) {
      console.log('In development mode, ignoring logout API error');
      return { success: true, message: 'Logged out (client-side only)' };
    }
    
    throw error.response?.data || error;
  }
};

/**
 * Get current user profile
 * @returns {Promise} - Response from API
 */
export const getCurrentUser = async () => {
  try {
    const response = await axiosInstance.get('/auth/me');
    return response.data;
  } catch (error) {
    console.error('Get current user error:', error);
    throw error.response?.data || { message: 'Failed to get user profile' };
  }
};

/**
 * Refresh access token
 * @returns {Promise<string>} - New access token
 */
export const refreshToken = async () => {
  try {
    console.log('Attempting to refresh token');
    
    // Create a new axios instance for this request to avoid interceptor loops
    const axios = require('axios').default;
    const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/$/, '');
    
    // Make the API request - the refresh token is sent in the cookie automatically
    const response = await axios.post(
      `${API_URL}/auth/refresh-token`,
      {},
      { 
        withCredentials: true // Important for sending cookies
      }
    );
    
    console.log('Token refresh response:', response.data);
    
    // Update tokens in localStorage
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      
      if (response.data.refreshToken) {
        localStorage.setItem('refreshToken', response.data.refreshToken);
      }
      
      // Update user data if provided
      if (response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
        localStorage.setItem('userRole', response.data.user.role || 'buyer');
      }
      
      console.log('Token refreshed successfully');
      return response.data.token;
    } else {
      throw new Error('No token received from refresh endpoint');
    }
  } catch (error) {
    console.error('Token refresh error:', error);
    
    // If refresh fails, clear authentication data
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userRole');
    
    throw error;
  }
};

/**
 * Forgot password
 * @param {Object} data - Email data
 * @returns {Promise} - Response from API
 */
export const forgotPassword = async (data) => {
  try {
    const response = await axiosInstance.post('/auth/forgotpassword', data);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Forgot password request failed' };
  }
};

/**
 * Reset password
 * @param {string} resetToken - Password reset token
 * @param {Object} passwordData - New password data
 * @returns {Promise} - API response
 */
export const resetPassword = async (resetToken, passwordData) => {
  try {
    const response = await axiosInstance.put(`/auth/resetpassword/${resetToken}`, passwordData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Password reset failed' };
  }
};

/**
 * Update user password
 * @param {Object} passwordData - Password update data
 * @returns {Promise} - API response
 */
export const updatePassword = async (passwordData) => {
  try {
    const response = await axiosInstance.put('/auth/updatepassword', passwordData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Password update failed' };
  }
};

/**
 * Verify email
 * @param {string} verificationToken - Email verification token
 * @returns {Promise} - API response
 * @returns {Promise} - Response from API
 */
export const verifyEmail = async (verificationToken) => {
  try {
    const response = await axiosInstance.get(`/auth/verify-email/${verificationToken}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Email verification failed' };
  }
};

/**
 * Check if user is authenticated
 * @returns {boolean} - True if authenticated
 */
export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

/**
 * Get current user data from localStorage
 * @returns {Object|null} - User data or null
 */
export const getStoredUser = () => {
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  
  try {
    return JSON.parse(userStr);
  } catch (error) {
    console.error('Failed to parse user data', error);
    return null;
  }
};

/**
 * Get user role
 * @returns {string|null} - User role or null
 */
export const getUserRole = () => {
  const user = getStoredUser();
  return user ? user.role : null;
};
