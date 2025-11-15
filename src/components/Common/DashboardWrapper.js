import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Dashboard from '../../pages/Dashboard/Dashboard';

const DashboardWrapper = () => {
  const { user, hasTabAccess } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Check if user has dashboard access permission
  if (hasTabAccess('dashboard')) {
    return <Dashboard />;
  }

  // Users without dashboard access are redirected to profile
  return <Navigate to="/profile" replace />;
};

export default DashboardWrapper;
