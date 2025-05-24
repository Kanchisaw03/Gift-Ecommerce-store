import axios from 'axios';
import { refreshToken } from './authService';

// Production-ready configuration

// Get the base URL from environment variables
// Make sure the URL doesn't have a trailing slash
const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/$/, '');

console.log('API URL configured as:', API_URL);

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: true, // Required for cookies and authentication
  timeout: 15000, // 15 second timeout for slower connections
});

// Log requests in development mode
if (import.meta.env.DEV) {
  axiosInstance.interceptors.request.use(request => {
    console.log('API Request:', {
      url: request.url,
      method: request.method,
      headers: request.headers,
      data: request.data,
      withCredentials: request.withCredentials
    });
    return request;
  });
  
  // Log responses in development mode
  axiosInstance.interceptors.response.use(
    response => {
      console.log('API Response:', {
        status: response.status,
        statusText: response.statusText,
        data: response.data,
        headers: response.headers
      });
      return response;
    },
    error => {
      console.error('API Error Response:', {
        message: error.message,
        response: error.response ? {
          status: error.response.status,
          statusText: error.response.statusText,
          data: error.response.data,
          headers: error.response.headers
        } : 'No response received'
      });
      return Promise.reject(error);
    }
  );
}

// Request interceptor for adding auth token
axiosInstance.interceptors.request.use(
  (config) => {
    // Skip adding token for auth-related endpoints like login and register
    const isAuthEndpoint = config.url && (
      config.url.includes('/auth/login') ||
      config.url.includes('/auth/register')
    );

    // For non-auth endpoints, add the token
    if (!isAuthEndpoint) {
      // Get token from localStorage
      const token = localStorage.getItem('token');
      
      if (token) {
        // Add token to Authorization header
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for handling token refresh
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Check if error is due to an expired token (401 Unauthorized)
    if (error.response?.status === 401 && 
        !originalRequest._retry && 
        originalRequest.url !== '/auth/refresh-token') {
      
      console.log('Token expired, attempting to refresh...');
      originalRequest._retry = true;

      try {
        // Create a new axios instance for this request to avoid interceptor loops
        const refreshAxios = axios.create({
          baseURL: API_URL,
          withCredentials: true // Important for sending and receiving cookies
        });
        
        // Get refresh token from localStorage as backup if cookie fails
        const storedRefreshToken = localStorage.getItem('refreshToken');
        
        // Attempt to refresh the token
        const response = await refreshAxios.post('/auth/refresh-token', {
          refreshToken: storedRefreshToken
        });
        
        if (response.data && response.data.success && response.data.token) {
          const newToken = response.data.token;
          
          // Update the token in localStorage
          localStorage.setItem('token', newToken);
          
          // Update auth state if needed
          if (response.data.user) {
            localStorage.setItem('user', JSON.stringify(response.data.user));
            localStorage.setItem('isAuthenticated', 'true');
          }
          
          // Update the Authorization header for the original request
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          
          // Retry the original request with the new token
          return axiosInstance(originalRequest);
        } else {
          // Handle case where refresh token response doesn't contain a new token
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
          localStorage.removeItem('isAuthenticated');
          
          // Redirect to login page
          window.location.href = '/login?session=expired';
        }
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        
        // Clear authentication data
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        localStorage.removeItem('isAuthenticated');
        
        // Redirect to login page
        window.location.href = '/login?session=expired';
        
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
