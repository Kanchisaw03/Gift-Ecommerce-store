import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { toast } from 'react-toastify';

/**
 * ProtectedRoute component for role-based access control
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render if authorized
 * @param {Array<string>} [props.allowedRoles] - Roles allowed to access the route
 * @param {string} [props.redirectPath='/login'] - Path to redirect to if unauthorized
 * @returns {React.ReactNode} - Protected route component
 */
const ProtectedRoute = ({ 
  children, 
  allowedRoles = [], 
  redirectPath = '/login' 
}) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  // Show loading state while authentication is being checked
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-gold rounded-full border-t-transparent animate-spin mb-4"></div>
          <p className="text-gold font-serif">Authenticating...</p>
        </div>
      </div>
    );
  }

  // Authentication is fully enabled
  const DISABLE_AUTH = false;

  // If user is not authenticated, redirect to login
  if (!isAuthenticated) {
    // Save the location they were trying to access for redirecting after login
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  // If no specific roles are required or user has one of the allowed roles
  if (allowedRoles.length === 0 || allowedRoles.includes(user.role)) {
    return children;
  }

  // If user is authenticated but doesn't have the required role
  return <Navigate to="/unauthorized" replace />;
};

export default ProtectedRoute;
