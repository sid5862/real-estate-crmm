import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Profile from '../../pages/Profile/Profile';
import EmployeeProfile from '../../pages/Profile/EmployeeProfile';

const ProfileWrapper = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Admin users see the full profile page
  if (user.role === 'admin') {
    return <Profile />;
  }

  // All other users (employees, managers, etc.) see the employee profile page
  return <EmployeeProfile />;
};

export default ProfileWrapper;
