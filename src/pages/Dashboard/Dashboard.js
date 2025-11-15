import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import EnhancedDashboard from './EnhancedDashboard';

const Dashboard = () => {
  const { user, hasTabAccess } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user has dashboard access
    if (user && !hasTabAccess('dashboard')) {
      // Redirect to profile if no dashboard access
      navigate('/profile', { replace: true });
    }
  }, [user, hasTabAccess, navigate]);

  // If user doesn't have dashboard access, don't render anything
  if (user && !hasTabAccess('dashboard')) {
    return null;
  }

  return <EnhancedDashboard />;
};

export default Dashboard;