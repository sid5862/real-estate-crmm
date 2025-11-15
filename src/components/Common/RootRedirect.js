import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const RootRedirect = () => {
  const { user, hasTabAccess } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Only admins with dashboard access go to dashboard
  if (user.role === 'admin' && hasTabAccess('dashboard')) {
    return <Navigate to="/dashboard" replace />;
  }

  // All employees and non-admin users go to profile
  return <Navigate to="/profile" replace />;
};

export default RootRedirect;
