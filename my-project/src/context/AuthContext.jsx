import React, { createContext, useState, useEffect } from 'react';
import { 
  login as loginApi, 
  logout as logoutApi, 
  register as registerApi,
  getCurrentUser, 
  getStoredUser,
  isAuthenticated as checkAuth
} from '../services/api/authService';
import { toast } from 'react-toastify';

// Define user roles
export const ROLES = {
  BUYER: 'buyer',
  SELLER: 'seller',
  ADMIN: 'admin',
  SUPER_ADMIN: 'super_admin' // Changed to match backend model
};

// Create context
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Production-ready authentication flow

  // Initialize auth state on app load
  useEffect(() => {
    const initAuth = async () => {
      try {
        console.log('Initializing authentication state...');
        
        // Check if user has a token
        if (checkAuth()) {
          console.log('User has token, verifying with backend...');
          
          // Get stored user data first for immediate UI update
          const storedUser = getStoredUser();
          if (storedUser) {
            setUser(storedUser);
            setIsAuthenticated(true);
          }
          
          // Then fetch fresh user data from API
          try {
            const response = await getCurrentUser();
            if (response && response.data) {
              setUser(response.data);
              setIsAuthenticated(true);
            }
          } catch (apiError) {
            console.error('Failed to verify user authentication:', apiError);
            // If API call fails, clear auth data
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
            localStorage.removeItem('isAuthenticated');
            localStorage.removeItem('userRole');
            setIsAuthenticated(false);
            setUser(null);
          }
        } else {
          // No token found, user is not authenticated
          setIsAuthenticated(false);
          setUser(null);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        // Clear any invalid auth data
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // Login function
  const login = async (email, password) => {
    setLoading(true);
    try {
      // Validate inputs
      if (!email || !password) {
        throw new Error('Email and password are required');
      }
      
      // Create credentials object
      const loginCredentials = { email, password };
      
      // Call the login API
      const response = await loginApi(loginCredentials);
      
      // Verify response has necessary data
      if (!response || !response.success) {
        throw new Error('Invalid response from server');
      }
      
      // Set user and auth state
      setUser(response.user);
      setIsAuthenticated(true);
      
      // Store auth data in localStorage
      localStorage.setItem('token', response.token);
      localStorage.setItem('refreshToken', response.refreshToken || '');
      localStorage.setItem('user', JSON.stringify(response.user));
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userRole', response.user.role);
      
      toast.success('Logged in successfully');
      return response;
    } catch (error) {
      console.error('Login error:', error);
      
      // Handle login errors
      setIsAuthenticated(false);
      setUser(null);
      
      // Clear any potentially invalid auth data
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('userRole');
      
      // Show appropriate error message
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.message || 
                          'Login failed. Please check your credentials and try again.';
      
      toast.error(errorMessage);
      
      // Throw the error to be handled by the component
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Signup function
  const signup = async (name, email, password, role = 'buyer') => {
    setLoading(true);
    try {
      // Validate inputs
      if (!name || !email || !password) {
        throw new Error('Name, email, and password are required');
      }
      
      // Validate role
      const validRole = ['buyer', 'seller', 'admin', 'super_admin'].includes(role) ? role : 'buyer';
      
      // Create user data for registration
      const userData = { name, email, password, role: validRole };
      console.log('Attempting to register user with role:', validRole);
      
      // Call the registration API
      const response = await registerApi(userData);
      
      console.log('Registration response:', response);
      
      // Handle successful registration
      if (response && response.success !== false) {
        // If we have user data in the response
        if (response.user) {
          // Set user and auth state with data from API
          setUser(response.user);
          setIsAuthenticated(true);
          
          // Store auth data in localStorage if not already done by the API service
          if (response.token) {
            localStorage.setItem('token', response.token);
          }
          
          if (response.user) {
            localStorage.setItem('user', JSON.stringify(response.user));
          }
          
          localStorage.setItem('isAuthenticated', 'true');
          
          if (response.user?.role) {
            localStorage.setItem('userRole', response.user.role);
          }
          
          toast.success('Account created successfully');
        } else {
          // If we don't have user data but registration was successful
          // (some APIs might require email verification before returning user data)
          toast.success('Registration successful! Please check your email for verification.');
        }
        
        return response;
      }
      
      return response;
    } catch (error) {
      console.error('Signup error details:', error);
      
      // Handle registration errors
      setIsAuthenticated(false);
      setUser(null);
      
      // Clear any potentially invalid auth data
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('userRole');
      
      // Show appropriate error message
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.message || 
                          'Registration failed. Please try again.';
      
      toast.error(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    setLoading(true);
    try {
      await logoutApi();
      setUser(null);
      setIsAuthenticated(false);
      
      // Clear local storage
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('userRole');
      
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to logout');
      
      // Force logout on client side even if API fails
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('userRole');
    } finally {
      setLoading(false);
    }
  };

  // Update user data in context after profile update
  const updateUserData = (updatedUserData) => {
    setUser(prevUser => ({
      ...prevUser,
      ...updatedUserData
    }));
    
    // Update stored user data
    const storedUser = getStoredUser();
    if (storedUser) {
      localStorage.setItem('user', JSON.stringify({
        ...storedUser,
        ...updatedUserData
      }));
    }
  };

  // Check if user has a specific role
  const hasRole = (role) => {
    if (!user) return false;
    return user.role === role;
  };

  // Authentication is fully enabled - no development mode
  const DEVELOPMENT_MODE = false;

  // Check if user has any of the specified roles
  const hasAnyRole = (roles) => {
    // Normal role check - development mode is disabled
    return user && roles.includes(user.role);
  };

  const isBuyer = () => hasRole(ROLES.BUYER);
  const isSeller = () => hasRole(ROLES.SELLER);
  const isAdmin = () => hasRole(ROLES.ADMIN);
  const isSuperAdmin = () => hasRole(ROLES.SUPER_ADMIN);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated,
        login,
        logout,
        signup,
        updateUserData,
        // Role-based access control
        hasRole,
        hasAnyRole,
        isBuyer,
        isSeller,
        isAdmin,
        isSuperAdmin
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Note: useAuth hook is now defined in src/hooks/useAuth.js

export default AuthContext;
