import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../../contexts/NotificationContext';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import {
  BellIcon,
  XMarkIcon,
  CheckIcon,
  TrashIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  UserPlusIcon,
  CalendarIcon,
  BuildingOfficeIcon,
  CurrencyDollarIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';

const NotificationDropdown = () => {
  const navigate = useNavigate();
  const { 
    notifications, 
    unreadCount, 
    loading, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification 
  } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState('all'); // all, unread, lead, property, payment

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'lead':
        return <UserPlusIcon className="h-5 w-5 text-blue-500" />;
      case 'follow_up':
        return <CalendarIcon className="h-5 w-5 text-orange-500" />;
      case 'property':
        return <BuildingOfficeIcon className="h-5 w-5 text-green-500" />;
      case 'payment':
        return <CurrencyDollarIcon className="h-5 w-5 text-yellow-500" />;
      case 'system':
        return <InformationCircleIcon className="h-5 w-5 text-gray-500" />;
      default:
        return <BellIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const getNotificationTemplate = (notification) => {
    const templates = {
      lead: {
        icon: <UserPlusIcon className="h-5 w-5 text-blue-500" />,
        bgColor: 'bg-blue-50 border-blue-200',
        textColor: 'text-blue-800',
        accentColor: 'bg-blue-100'
      },
      follow_up: {
        icon: <CalendarIcon className="h-5 w-5 text-orange-500" />,
        bgColor: 'bg-orange-50 border-orange-200',
        textColor: 'text-orange-800',
        accentColor: 'bg-orange-100'
      },
      property: {
        icon: <BuildingOfficeIcon className="h-5 w-5 text-green-500" />,
        bgColor: 'bg-green-50 border-green-200',
        textColor: 'text-green-800',
        accentColor: 'bg-green-100'
      },
      payment: {
        icon: <CurrencyDollarIcon className="h-5 w-5 text-yellow-500" />,
        bgColor: 'bg-yellow-50 border-yellow-200',
        textColor: 'text-yellow-800',
        accentColor: 'bg-yellow-100'
      },
      system: {
        icon: <InformationCircleIcon className="h-5 w-5 text-gray-500" />,
        bgColor: 'bg-gray-50 border-gray-200',
        textColor: 'text-gray-800',
        accentColor: 'bg-gray-100'
      }
    };
    
    return templates[notification.type] || templates.system;
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'lead':
        return 'bg-blue-50 border-blue-200';
      case 'follow_up':
        return 'bg-orange-50 border-orange-200';
      case 'property':
        return 'bg-green-50 border-green-200';
      case 'payment':
        return 'bg-yellow-50 border-yellow-200';
      case 'system':
        return 'bg-gray-50 border-gray-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const handleNotificationClick = async (notification) => {
    // Mark as read if not already read
    if (!notification.is_read) {
      await markAsRead(notification.id);
    }

    // Navigate based on notification type and entity
    if (notification.entity_type && notification.entity_id) {
      switch (notification.entity_type) {
        case 'lead':
          navigate(`/leads/${notification.entity_id}`);
          break;
        case 'property':
          navigate(`/properties/${notification.entity_id}`);
          break;
        case 'user':
          navigate(`/employees/${notification.entity_id}`);
          break;
        default:
          // Navigate to relevant section
          if (notification.type === 'lead') {
            navigate('/leads');
          } else if (notification.type === 'property') {
            navigate('/properties');
          }
      }
    } else {
      // Navigate to relevant section based on type
      if (notification.type === 'lead') {
        navigate('/leads');
      } else if (notification.type === 'property') {
        navigate('/properties');
      } else if (notification.type === 'follow_up') {
        navigate('/leads');
      }
    }

    setIsOpen(false);
  };

  const formatTimeAgo = (dateString) => {
    try {
      // Parse the date string as UTC
      const date = new Date(dateString);
      const now = new Date();
      const diffInSeconds = Math.floor((now - date) / 1000);

      // Handle negative differences (future dates) by showing "Just now"
      if (diffInSeconds < 0) {
        return 'Just now';
      }

      if (diffInSeconds < 60) {
        return 'Just now';
      } else if (diffInSeconds < 3600) {
        const minutes = Math.floor(diffInSeconds / 60);
        return `${minutes}m ago`;
      } else if (diffInSeconds < 86400) {
        const hours = Math.floor(diffInSeconds / 3600);
        return `${hours}h ago`;
      } else {
        const days = Math.floor(diffInSeconds / 86400);
        return `${days}d ago`;
      }
    } catch (error) {
      console.error('Error formatting time:', error);
      return 'Just now';
    }
  };

  // Filter notifications based on selected filter
  const filteredNotifications = notifications.filter(notification => {
    switch (filter) {
      case 'unread':
        return !notification.is_read;
      case 'lead':
        return notification.type === 'lead';
      case 'property':
        return notification.type === 'property';
      case 'payment':
        return notification.type === 'payment';
      case 'follow_up':
        return notification.type === 'follow_up';
      default:
        return true; // 'all'
    }
  });

  const getFilterCount = (filterType) => {
    switch (filterType) {
      case 'unread':
        return unreadCount;
      case 'lead':
        return notifications.filter(n => n.type === 'lead').length;
      case 'property':
        return notifications.filter(n => n.type === 'property').length;
      case 'payment':
        return notifications.filter(n => n.type === 'payment').length;
      case 'follow_up':
        return notifications.filter(n => n.type === 'follow_up').length;
      default:
        return notifications.length;
    }
  };

  return (
    <Menu as="div" className="relative">
      <div>
        <Menu.Button 
          className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 relative"
          onClick={() => setIsOpen(!isOpen)}
        >
          <BellIcon className="h-6 w-6" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        show={isOpen}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
              <div className="flex items-center space-x-2">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Mark all read
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            {/* Filter Tabs */}
            <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
              {[
                { key: 'all', label: 'All', count: getFilterCount('all') },
                { key: 'unread', label: 'Unread', count: getFilterCount('unread') },
                { key: 'lead', label: 'Leads', count: getFilterCount('lead') },
                { key: 'property', label: 'Properties', count: getFilterCount('property') }
              ].map(({ key, label, count }) => (
                <button
                  key={key}
                  onClick={() => setFilter(key)}
                  className={`flex-1 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                    filter === key
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {label} {count > 0 && `(${count})`}
                </button>
              ))}
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center text-gray-500">
                Loading notifications...
              </div>
            ) : filteredNotifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <BellIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No {filter === 'all' ? '' : filter} notifications</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {filteredNotifications.slice(0, 10).map((notification) => {
                  const template = getNotificationTemplate(notification);
                  return (
                    <div
                      key={notification.id}
                      className={`p-4 hover:bg-gray-50 cursor-pointer transition-all duration-200 border-l-4 ${
                        !notification.is_read 
                          ? `${template.bgColor} ${template.accentColor}` 
                          : 'bg-white'
                      }`}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                          {template.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className={`text-sm font-medium ${
                              !notification.is_read ? 'text-gray-900' : 'text-gray-700'
                            }`}>
                              {notification.title}
                            </p>
                            <div className="flex items-center space-x-1">
                              {!notification.is_read && (
                                <div className={`h-2 w-2 rounded-full ${
                                  notification.type === 'lead' ? 'bg-blue-500' :
                                  notification.type === 'property' ? 'bg-green-500' :
                                  notification.type === 'payment' ? 'bg-yellow-500' :
                                  notification.type === 'follow_up' ? 'bg-orange-500' :
                                  'bg-gray-500'
                                }`}></div>
                              )}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteNotification(notification.id);
                                }}
                                className="text-gray-400 hover:text-red-500 p-1 transition-colors"
                              >
                                <TrashIcon className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                            {notification.message}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <p className="text-xs text-gray-400">
                              {formatTimeAgo(notification.created_at)}
                            </p>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              notification.type === 'lead' ? 'bg-blue-100 text-blue-700' :
                              notification.type === 'property' ? 'bg-green-100 text-green-700' :
                              notification.type === 'payment' ? 'bg-yellow-100 text-yellow-700' :
                              notification.type === 'follow_up' ? 'bg-orange-100 text-orange-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {notification.type}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {filteredNotifications.length > 10 && (
            <div className="p-4 border-t border-gray-200">
              <button
                onClick={() => {
                  navigate('/notifications');
                  setIsOpen(false);
                }}
                className="w-full text-center text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                View all notifications
              </button>
            </div>
          )}
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default NotificationDropdown;
