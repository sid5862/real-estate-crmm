import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const GlobalRedirect = ({ children }) => {
  const { user, hasTabAccess } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Only redirect non-admin users from restricted pages
    if (user && user.role !== 'admin') {
      const currentPath = location.pathname;
      
      // Redirect from dashboard if no dashboard access
      if (currentPath === '/dashboard' && !hasTabAccess('dashboard')) {
        navigate('/profile', { replace: true });
        return;
      }
      
      // Redirect from other restricted pages if no access
      const restrictedPages = [
        { path: '/employees', permission: 'employees' },
        { path: '/post-sales', permission: 'post_sales' },
        { path: '/reports', permission: 'reports' },
        { path: '/settings', permission: 'settings' }
      ];
      
      for (const page of restrictedPages) {
        if (currentPath.startsWith(page.path) && !hasTabAccess(page.permission)) {
          navigate('/profile', { replace: true });
          return;
        }
      }
    }
  }, [user, location.pathname, navigate, hasTabAccess]);

  return children;
};

export default GlobalRedirect;
