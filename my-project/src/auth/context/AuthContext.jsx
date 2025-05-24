import React, { createContext, useContext, useState, useEffect } from 'react';
import { luxuryTheme } from '../../styles/luxuryTheme';

// Create the auth context
const AuthContext = createContext();

// Define user roles
export const ROLES = {
  BUYER: 'buyer',
  SELLER: 'seller',
  ADMIN: 'admin',
  SUPER_ADMIN: 'super_admin'
};

export const AuthProvider = ({ children }) => {
  // User state with role
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is already logged in (from localStorage)
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        setLoading(true);
        // Get stored user from localStorage
        const storedUser = localStorage.getItem('luxuryUser');
        
        if (storedUser) {
          // In a real app, you would validate the token with your backend here
          // For now, we'll just use the stored user data
          setUser(JSON.parse(storedUser));
        } else {
          // For testing purposes, create a default admin user
          // REMOVE THIS IN PRODUCTION
          const defaultUser = {
            id: 'default-admin',
            name: 'Admin User',
            email: 'admin@example.com',
            role: ROLES.ADMIN,
            token: 'mock-jwt-token'
          };
          
          setUser(defaultUser);
          localStorage.setItem('luxuryUser', JSON.stringify(defaultUser));
          console.log('Created default admin user for testing');
        }
      } catch (err) {
        console.error('Auth status check failed:', err);
        setError('Authentication failed. Please log in again.');
        localStorage.removeItem('luxuryUser');
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }
      const data = await response.json();
      setUser(data.user);
      localStorage.setItem('luxuryUser', JSON.stringify(data.user));
      return data.user;
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Signup function
  const signup = async (name, email, password, role) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role })
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Signup failed');
      }
      const data = await response.json();
      setUser(data.user);
      localStorage.setItem('luxuryUser', JSON.stringify(data.user));
      return data.user;
    } catch (err) {
      setError(err.message || 'Signup failed. Please try again.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('luxuryUser');
  };

  // Password reset request
  const requestPasswordReset = async (email) => {
    try {
      setLoading(true);
      setError(null);
      
      // In a real app, you would make an API call here
      // For now, we'll simulate a successful request
      
      // Simulated API call
      // const response = await fetch('/api/reset-password', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email })
      // });
      
      // if (!response.ok) throw new Error('Password reset request failed');
      
      return { success: true, message: 'Password reset email sent' };
    } catch (err) {
      console.error('Password reset error:', err);
      setError(err.message || 'Password reset failed. Please try again.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Check if user has a specific role
  const hasRole = (role) => {
    if (!user) return false;
    
    // Convert role names to lowercase for case-insensitive comparison
    const userRole = user.role.toLowerCase();
    
    // If role is an array, check if user has any of the roles
    if (Array.isArray(role)) {
      return role.some(r => userRole === r.toLowerCase());
    }
    
    // If role is a string, do direct comparison
    return userRole === role.toLowerCase();
  };

  // Context value
  const value = {
    user,
    loading,
    error,
    login,
    signup,
    logout,
    requestPasswordReset,
    hasRole,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook for using the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
