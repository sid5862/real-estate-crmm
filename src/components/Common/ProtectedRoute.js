import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const ProtectedRoute = ({ children, requiredTab }) => {
  const { user, hasTabAccess } = useAuth();
  const location = useLocation();

  // If no user, redirect to login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If tab permission is required, check it
  if (requiredTab && !hasTabAccess(requiredTab)) {
    // Redirect to dashboard if user doesn't have access to this tab
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
