import React, { useState } from 'react';
import { 
  PlusIcon, 
  XMarkIcon,
  BuildingOfficeIcon,
  UserPlusIcon,
  UserGroupIcon,
  DocumentTextIcon,
  ChartBarIcon,
  CogIcon
} from '@heroicons/react/24/outline';

const FloatingAddButton = ({ 
  onAdd, 
  type = 'default',
  position = 'bottom-right',
  quickActions = [],
  label = 'Add New'
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const getIcon = () => {
    switch (type) {
      case 'property':
        return BuildingOfficeIcon;
      case 'lead':
        return UserPlusIcon;
      case 'employee':
        return UserGroupIcon;
      case 'post-sale':
        return DocumentTextIcon;
      case 'report':
        return ChartBarIcon;
      case 'setting':
        return CogIcon;
      default:
        return PlusIcon;
    }
  };

  const getColor = () => {
    switch (type) {
      case 'property':
        return 'from-blue-500 to-blue-600';
      case 'lead':
        return 'from-green-500 to-green-600';
      case 'employee':
        return 'from-purple-500 to-purple-600';
      case 'post-sale':
        return 'from-orange-500 to-orange-600';
      case 'report':
        return 'from-indigo-500 to-indigo-600';
      case 'setting':
        return 'from-gray-500 to-gray-600';
      default:
        return 'from-blue-500 to-blue-600';
    }
  };

  const getPosition = () => {
    switch (position) {
      case 'bottom-left':
        return 'bottom-6 left-6';
      case 'bottom-center':
        return 'bottom-6 left-1/2 transform -translate-x-1/2';
      case 'top-right':
        return 'top-6 right-6';
      case 'top-left':
        return 'top-6 left-6';
      default:
        return 'bottom-6 right-6';
    }
  };

  const Icon = getIcon();

  return (
    <div className={`fixed ${getPosition()} z-50`}>
      {/* Quick Actions Menu */}
      {isOpen && quickActions.length > 0 && (
        <div className="absolute bottom-16 right-0 mb-2 space-y-2">
          {quickActions.map((action, index) => (
            <div
              key={index}
              className="flex items-center bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 p-3 min-w-[200px] hover:bg-white transition-all duration-200 cursor-pointer"
              onClick={() => {
                action.onClick();
                setIsOpen(false);
              }}
            >
              <div className={`h-8 w-8 rounded-lg bg-gradient-to-br ${action.color || 'from-gray-500 to-gray-600'} flex items-center justify-center shadow-sm mr-3`}>
                <action.icon className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{action.label}</p>
                <p className="text-xs text-gray-500">{action.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Main Add Button */}
      <button
        onClick={() => {
          if (quickActions.length > 0) {
            setIsOpen(!isOpen);
          } else {
            onAdd();
          }
        }}
        className={`group relative h-14 w-14 bg-gradient-to-br ${getColor()} rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center`}
      >
        <Icon className={`h-6 w-6 text-white transition-transform duration-200 ${isOpen ? 'rotate-45' : 'group-hover:rotate-90'}`} />
        
        {/* Tooltip */}
        <div className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
          {label}
          <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
        </div>

        {/* Pulse Animation */}
        <div className={`absolute inset-0 bg-gradient-to-br ${getColor()} rounded-2xl animate-ping opacity-20`}></div>
      </button>

      {/* Close Quick Actions */}
      {isOpen && (
        <button
          onClick={() => setIsOpen(false)}
          className="absolute -top-2 -right-2 h-6 w-6 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-red-600 transition-colors duration-200"
        >
          <XMarkIcon className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};

export default FloatingAddButton;
