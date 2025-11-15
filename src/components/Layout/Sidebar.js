import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  HomeIcon,
  BuildingOfficeIcon,
  UserGroupIcon,
  UserPlusIcon,
  DocumentTextIcon,
  ChartBarIcon,
  CogIcon,
  XMarkIcon,
  ClipboardDocumentListIcon,
  UserIcon,
} from '@heroicons/react/24/outline';

const Sidebar = ({ isOpen, onClose }) => {
  const { user, hasPermission, hasTabAccess } = useAuth();
  const location = useLocation();

  // Base navigation items (without Profile)
  const baseNavigation = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: HomeIcon,
      current: location.pathname === '/dashboard',
      tabId: 'dashboard',
    },
    {
      name: 'Properties',
      href: '/properties',
      icon: BuildingOfficeIcon,
      current: location.pathname.startsWith('/properties'),
      tabId: 'properties',
    },
    {
      name: 'Leads',
      href: '/leads',
      icon: UserPlusIcon,
      current: location.pathname.startsWith('/leads'),
      tabId: 'leads',
    },
    {
      name: 'Employees',
      href: '/employees',
      icon: UserGroupIcon,
      current: location.pathname.startsWith('/employees'),
      tabId: 'employees',
    },
    {
      name: 'Post Sales',
      href: '/post-sales',
      icon: ClipboardDocumentListIcon,
      current: location.pathname.startsWith('/post-sales'),
      tabId: 'post_sales',
    },
    {
      name: 'Reports',
      href: '/reports',
      icon: ChartBarIcon,
      current: location.pathname.startsWith('/reports'),
      tabId: 'reports',
    },
    {
      name: 'Settings',
      href: '/settings',
      icon: CogIcon,
      current: location.pathname.startsWith('/settings'),
      tabId: 'settings',
    },
  ];

  // Profile tab
  const profileTab = {
    name: 'Profile',
    href: '/profile',
    icon: UserIcon,
    current: location.pathname.startsWith('/profile'),
    // Profile doesn't need tab permission - everyone can access their own profile
  };

  // Reorder navigation based on user role
  const navigation = user?.role === 'admin' 
    ? [...baseNavigation, profileTab] // Admin: Profile at the end
    : [profileTab, ...baseNavigation]; // Employee: Profile at the beginning

  const filteredNavigation = navigation.filter(item => {
    // Profile is always accessible
    if (!item.tabId) return true;
    
    // Check tab-based permissions
    return hasTabAccess(item.tabId);
  });

  return (
    <>
      {/* Mobile sidebar overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm" onClick={onClose} />
        </div>
      )}

      {/* Sidebar - Fixed/Sticky */}
        <div className={`fixed inset-y-0 left-0 z-50 w-72 bg-white/95 backdrop-blur-sm shadow-2xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:fixed lg:inset-0 lg:w-64 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
        {/* Header */}
        <div className="flex items-center justify-between h-14 px-6 border-b border-gray-200/50">
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-sm">
              <BuildingOfficeIcon className="h-5 w-5 text-white" />
            </div>
            <span className="ml-3 text-lg font-bold text-gray-900">Real Estate CRM</span>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-lg text-gray-400 hover:text-gray-500 hover:bg-gray-100 transition-colors"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation - Scrollable */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {filteredNavigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                `group flex items-center px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 shadow-sm'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
            >
              <item.icon className={`mr-3 h-5 w-5 flex-shrink-0 ${location.pathname === item.href ? 'text-blue-600' : ''}`} />
              {item.name}
            </NavLink>
          ))}
        </nav>

        {/* User Profile */}
        <div className="border-t border-gray-200/50 p-4">
          <div className="flex items-center">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-sm">
              <span className="text-sm font-semibold text-white">
                {user?.first_name?.[0]}{user?.last_name?.[0]}
              </span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-semibold text-gray-900">
                {user?.first_name} {user?.last_name}
              </p>
              <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;