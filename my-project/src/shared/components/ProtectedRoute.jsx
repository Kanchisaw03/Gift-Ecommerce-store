import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

/**
 * ProtectedRoute component for role-based access control
 * 
 * @param {React.ReactNode} children - The child components to render if authorized
 * @param {string|string[]} allowedRoles - A single role or array of roles that are allowed to access this route
 * @param {boolean} requireVerified - Whether to require email verification (default: false)
 */
const ProtectedRoute = ({ children, allowedRoles, requireVerified = false }) => {
  const { user, isAuthenticated, hasRole, hasAnyRole, loading } = useAuth();
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);
  
  // Authentication is fully enabled
  const DEVELOPMENT_MODE = false;
  
  useEffect(() => {
    // After auth context is loaded, we can finish our check
    if (!loading) {
      setIsChecking(false);
    }
  }, [loading]);
  
  // Show loading state while checking authentication
  if (loading || isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-gold-400">
          <svg className="animate-spin h-10 w-10 mr-3" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }
  
  if (DEVELOPMENT_MODE) {
    // Log access attempt for debugging
    console.log(`DEV MODE: Bypassing auth for route requiring roles: ${JSON.stringify(allowedRoles)}`);
    
    // In development mode, if there's no user in context but we have a userRole in localStorage,
    // we can simulate having a user with that role
    const userRole = localStorage.getItem('userRole');
    if (!user && userRole) {
      console.log(`DEV MODE: Using role from localStorage: ${userRole}`);
    }
    
    // Bypass all authentication and role checks during development
    return children;
  }
  
  // PRODUCTION MODE: Full authentication and role checks
  
  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    console.log('User not authenticated, redirecting to login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if user has required role(s)
  const hasRequiredRole = 
    !allowedRoles || // No roles specified, allow access
    (typeof allowedRoles === 'string' && hasRole(allowedRoles)) || // Single role check
    (Array.isArray(allowedRoles) && hasAnyRole(allowedRoles)); // Multiple roles check

  // Check if email verification is required and user is verified
  const isVerified = !requireVerified || (user && user.isVerified);

  // If user has required role and meets verification requirements, render children
  if (hasRequiredRole && isVerified) {
    return children;
  }
  
  // Handle unauthorized access based on the specific reason
  if (!isVerified && requireVerified) {
    console.log('User not verified, redirecting to verify email page');
    return <Navigate to="/verify-email" state={{ from: location }} replace />;
  }
  
  // If user doesn't have the required role, redirect to unauthorized page
  console.log(`User role ${user?.role} not authorized for this route requiring: ${JSON.stringify(allowedRoles)}`);
  return <Navigate to="/unauthorized" state={{ from: location, requiredRoles: allowedRoles }} replace />;
};

export default ProtectedRoute;
