import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import FilterBox from '../../components/Common/FilterBox';
import FloatingAddButton from '../../components/Common/FloatingAddButton';
import { employeesAPI } from '../../services/api';
import {
  CogIcon,
  UserGroupIcon,
  GlobeAltIcon,
  BellIcon,
  ShieldCheckIcon,
  CircleStackIcon,
  CloudArrowUpIcon,
  KeyIcon,
  DocumentDuplicateIcon,
  ShareIcon,
  SparklesIcon,
  TrophyIcon,
  StarIcon,
  ArrowTrendingUpIcon,
  PlusIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XMarkIcon,
  EyeIcon,
  EyeSlashIcon,
  ArrowPathIcon,
  ClockIcon,
  ServerIcon,
  CircleStackIcon as DatabaseIcon,
  CpuChipIcon,
  WifiIcon,
  LockClosedIcon,
  UserIcon,
  ChartBarIcon,
  DocumentTextIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  BuildingOfficeIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  LinkIcon,
  AdjustmentsHorizontalIcon,
  SunIcon,
  MoonIcon,
  ComputerDesktopIcon,
  PaintBrushIcon,
  SwatchIcon,
  LightBulbIcon,
  ClipboardDocumentListIcon,
  ArchiveBoxIcon,
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  TrashIcon,
  PencilIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  CheckIcon,
  XMarkIcon as XIcon,
  PlayIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const Settings = () => {
  const { user, hasPermission } = useAuth();
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showThemeModal, setShowThemeModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAutomationManagement, setShowAutomationManagement] = useState(false);
  const [showWorkflowBuilder, setShowWorkflowBuilder] = useState(false);
  const [showAutomationRules, setShowAutomationRules] = useState(false);
  const [showTriggerManagement, setShowTriggerManagement] = useState(false);
  const [showActionManagement, setShowActionManagement] = useState(false);
  const [showAutomationAnalytics, setShowAutomationAnalytics] = useState(false);
  const [showWorkflowTemplates, setShowWorkflowTemplates] = useState(false);
  const [showAutomationInsights, setShowAutomationInsights] = useState(false);
  const [showIntegrationManagement, setShowIntegrationManagement] = useState(false);
  const [showAutomationTesting, setShowAutomationTesting] = useState(false);
  const [userStats, setUserStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    adminUsers: 0,
    loading: true
  });
  
  const [settings, setSettings] = useState({
    company_name: '',
    company_email: '',
    company_phone: '',
    company_address: '',
    website_url: '',
    timezone: 'Asia/Kolkata',
    currency: 'INR',
    date_format: 'DD/MM/YYYY',
    email_notifications: true,
    sms_notifications: false,
    auto_assign_leads: true,
    lead_assignment_method: 'round_robin',
    backup_frequency: 'daily',
    session_timeout: 30,
    theme: 'light',
    language: 'en',
    two_factor_auth: false,
    ip_whitelist: false,
    login_attempts_limit: 5,
    password_policy: 'strong',
    cloud_backup: false,
    email_backup_reports: true,
    auto_sync_properties: true,
    lead_form_integration: true,
    property_search_api: false,
  });

  const tabs = [
    { id: 'general', name: 'General', icon: CogIcon, badge: null, description: 'Basic CRM configuration' },
    { id: 'notifications', name: 'Notifications', icon: BellIcon, badge: '3', description: 'Email and SMS settings' },
    { id: 'users', name: 'User Management', icon: UserGroupIcon, badge: userStats.loading ? '...' : userStats.totalUsers.toString(), description: 'Manage users and permissions' },
    { id: 'website', name: 'Website Integration', icon: GlobeAltIcon, badge: null, description: 'Website and API settings' },
    { id: 'security', name: 'Security', icon: ShieldCheckIcon, badge: '2', description: 'Security and access control' },
    { id: 'appearance', name: 'Appearance', icon: PaintBrushIcon, badge: null, description: 'Theme and customization' },
  ];

  useEffect(() => {
    fetchSettings();
    fetchUserStats();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Get saved theme from localStorage
      const savedTheme = localStorage.getItem('theme') || 'light';
      
      // Set default values with saved theme
      const defaultSettings = {
        company_name: localStorage.getItem('company_name') || 'Real Estate CRM',
        company_email: localStorage.getItem('company_email') || 'info@realestatecrm.com',
        company_phone: localStorage.getItem('company_phone') || '+91 9876543210',
        company_address: localStorage.getItem('company_address') || '123 Business Park, Mumbai, Maharashtra 400001',
        website_url: localStorage.getItem('website_url') || 'https://realestatecrm.com',
        timezone: localStorage.getItem('timezone') || 'Asia/Kolkata',
        currency: localStorage.getItem('currency') || 'INR',
        date_format: localStorage.getItem('date_format') || 'DD/MM/YYYY',
        email_notifications: localStorage.getItem('email_notifications') === 'true',
        sms_notifications: localStorage.getItem('sms_notifications') === 'true',
        auto_assign_leads: localStorage.getItem('auto_assign_leads') !== 'false',
        lead_assignment_method: localStorage.getItem('lead_assignment_method') || 'round_robin',
        session_timeout: parseInt(localStorage.getItem('session_timeout')) || 30,
        theme: savedTheme,
        language: localStorage.getItem('language') || 'en',
        two_factor_auth: localStorage.getItem('two_factor_auth') === 'true',
        ip_whitelist: localStorage.getItem('ip_whitelist') === 'true',
        login_attempts_limit: parseInt(localStorage.getItem('login_attempts_limit')) || 5,
        password_policy: localStorage.getItem('password_policy') || 'strong',
        auto_sync_properties: localStorage.getItem('auto_sync_properties') !== 'false',
        lead_form_integration: localStorage.getItem('lead_form_integration') !== 'false',
        property_search_api: localStorage.getItem('property_search_api') === 'true',
      };
      
      setSettings(defaultSettings);
      
      // Apply the theme immediately
      applyTheme(savedTheme);
      
      setLoading(false);
    } catch (error) {
      toast.error('Failed to fetch settings');
      setLoading(false);
    }
  };

  const fetchUserStats = async () => {
    try {
      setUserStats(prev => ({ ...prev, loading: true }));
      
      // Fetch all employees/users
      const response = await employeesAPI.getEmployees({ per_page: 1000 });
      const employees = response.data.employees || [];
      
      // Calculate statistics
      const totalUsers = employees.length;
      const activeUsers = employees.filter(emp => emp.is_active).length;
      const adminUsers = employees.filter(emp => emp.role === 'admin').length;
      
      setUserStats({
        totalUsers,
        activeUsers,
        adminUsers,
        loading: false
      });
      
    } catch (error) {
      console.error('Failed to fetch user stats:', error);
      setUserStats({
        totalUsers: 0,
        activeUsers: 0,
        adminUsers: 0,
        loading: false
      });
    }
  };


  const handleSave = async () => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Save all settings to localStorage
      Object.keys(settings).forEach(key => {
        localStorage.setItem(key, settings[key]);
      });
      
      // Apply theme immediately
      applyTheme(settings.theme);
      
      toast.success('Settings saved successfully!', {
        duration: 3000,
      });
      setLoading(false);
    } catch (error) {
      toast.error('Failed to save settings');
      setLoading(false);
    }
  };

  const resetToDefaults = () => {
    if (window.confirm('Are you sure you want to reset all settings to default values?')) {
      const defaultSettings = {
        company_name: 'Real Estate CRM',
        company_email: 'info@realestatecrm.com',
        company_phone: '+91 9876543210',
        company_address: '123 Business Park, Mumbai, Maharashtra 400001',
        website_url: 'https://realestatecrm.com',
        timezone: 'Asia/Kolkata',
        currency: 'INR',
        date_format: 'DD/MM/YYYY',
        email_notifications: true,
        sms_notifications: false,
        auto_assign_leads: true,
        lead_assignment_method: 'round_robin',
        session_timeout: 30,
        theme: 'light',
        language: 'en',
        two_factor_auth: false,
        ip_whitelist: false,
        login_attempts_limit: 5,
        password_policy: 'strong',
        auto_sync_properties: true,
        lead_form_integration: true,
        property_search_api: false,
      };
      
      setSettings(defaultSettings);
      
      // Clear localStorage and set defaults
      Object.keys(defaultSettings).forEach(key => {
        localStorage.setItem(key, defaultSettings[key]);
      });
      
      // Apply light theme
      applyTheme('light');
      
      toast.success('Settings reset to defaults!', {
        duration: 3000,
      });
    }
  };

  const handleExport = async () => {
    try {
      const dataStr = JSON.stringify(settings, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'crm-settings.json';
      link.click();
      URL.revokeObjectURL(url);
      toast.success('Settings exported successfully!');
    } catch (error) {
      toast.error('Failed to export settings');
    }
  };

  const handleImport = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedSettings = JSON.parse(e.target.result);
          setSettings(prev => ({ ...prev, ...importedSettings }));
          toast.success('Settings imported successfully!');
        } catch (error) {
          toast.error('Invalid settings file');
        }
      };
      reader.readAsText(file);
    }
  };

  const handleChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value,
    }));
    
    // Apply theme changes immediately
    if (key === 'theme') {
      applyTheme(value);
    }
    
    // Show immediate feedback for important changes
    if (['company_name', 'theme', 'language'].includes(key)) {
      toast.success(`${key.replace('_', ' ')} updated!`, {
        duration: 2000,
      });
    }
  };

  const applyTheme = (theme) => {
    const root = document.documentElement;
    
    if (theme === 'dark') {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else if (theme === 'light') {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    } else if (theme === 'auto') {
      // Auto theme based on system preference
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
      localStorage.setItem('theme', 'auto');
    }
  };

  const handleInputChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleToggle = (key) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
    
    // Show feedback for toggle changes
    const toggleNames = {
      email_notifications: 'Email notifications',
      sms_notifications: 'SMS notifications',
      auto_assign_leads: 'Auto-assign leads',
      two_factor_auth: 'Two-factor authentication',
      ip_whitelist: 'IP whitelist',
      auto_sync_properties: 'Auto-sync properties',
      lead_form_integration: 'Lead form integration',
      property_search_api: 'Property search API'
    };
    
    const toggleName = toggleNames[key] || key.replace('_', ' ');
    const status = settings[key] ? 'disabled' : 'enabled';
    toast.success(`${toggleName} ${status}!`, {
      duration: 2000,
    });
  };

  // Quick actions for floating button
  const quickActions = [
    {
      label: 'Automation Management',
      description: 'Manage automated workflows',
      icon: CogIcon,
      color: 'from-blue-500 to-indigo-600',
      onClick: () => setShowAutomationManagement(true)
    },
    {
      label: 'Workflow Builder',
      description: 'Create custom workflows',
      icon: ShareIcon,
      color: 'from-green-500 to-emerald-600',
      onClick: () => setShowWorkflowBuilder(true)
    },
    {
      label: 'Automation Rules',
      description: 'Configure automation rules',
      icon: ShieldCheckIcon,
      color: 'from-purple-500 to-pink-600',
      onClick: () => setShowAutomationRules(true)
    },
    {
      label: 'Trigger Management',
      description: 'Manage workflow triggers',
      icon: SparklesIcon,
      color: 'from-yellow-500 to-orange-600',
      onClick: () => setShowTriggerManagement(true)
    },
    {
      label: 'Action Management',
      description: 'Configure automated actions',
      icon: CheckCircleIcon,
      color: 'from-orange-500 to-red-600',
      onClick: () => setShowActionManagement(true)
    },
    {
      label: 'Automation Analytics',
      description: 'View automation performance',
      icon: ChartBarIcon,
      color: 'from-teal-500 to-cyan-600',
      onClick: () => setShowAutomationAnalytics(true)
    },
    {
      label: 'Workflow Templates',
      description: 'Use predefined templates',
      icon: DocumentTextIcon,
      color: 'from-indigo-500 to-purple-600',
      onClick: () => setShowWorkflowTemplates(true)
    },
    {
      label: 'Automation Insights',
      description: 'AI-powered automation insights',
      icon: LightBulbIcon,
      color: 'from-pink-500 to-rose-600',
      onClick: () => setShowAutomationInsights(true)
    },
    {
      label: 'Integration Management',
      description: 'Manage third-party integrations',
      icon: LinkIcon,
      color: 'from-cyan-500 to-blue-600',
      onClick: () => setShowIntegrationManagement(true)
    },
    {
      label: 'Automation Testing',
      description: 'Test automation workflows',
      icon: PlayIcon,
      color: 'from-green-500 to-teal-600',
      onClick: () => setShowAutomationTesting(true)
    },
    {
      label: 'Add User',
      description: 'Create a new user account',
      icon: UserGroupIcon,
      color: 'from-blue-500 to-indigo-600',
      onClick: () => setActiveTab('users')
    },
    {
      label: 'Import Data',
      description: 'Import CRM data',
      icon: ArrowUpTrayIcon,
      color: 'from-green-500 to-emerald-600',
      onClick: () => setShowImportModal(true)
    },
    {
      label: 'Export Settings',
      description: 'Export configuration',
      icon: DocumentDuplicateIcon,
      color: 'from-purple-500 to-pink-600',
      onClick: () => setShowExportModal(true)
    },
    {
      label: 'Reset Settings',
      description: 'Reset to default settings',
      icon: ArrowPathIcon,
      color: 'from-orange-500 to-red-600',
      onClick: () => resetToDefaults()
    }
  ];

  // Theme options
  const themeOptions = [
    { id: 'light', name: 'Light', icon: SunIcon, description: 'Clean and bright interface' },
    { id: 'dark', name: 'Dark', icon: MoonIcon, description: 'Easy on the eyes' },
    { id: 'auto', name: 'Auto', icon: ComputerDesktopIcon, description: 'Follow system preference' }
  ];

  // Language options
  const languageOptions = [
    { id: 'en', name: 'English', flag: '🇺🇸' },
    { id: 'hi', name: 'Hindi', flag: '🇮🇳' },
    { id: 'es', name: 'Spanish', flag: '🇪🇸' },
    { id: 'fr', name: 'French', flag: '🇫🇷' }
  ];

  const renderGeneralSettings = () => (
    <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="form-label">Company Name</label>
            <input
              type="text"
              value={settings.company_name}
              onChange={(e) => handleInputChange('company_name', e.target.value)}
              className="form-input"
              placeholder="Enter company name"
            />
          </div>
          
          <div>
            <label className="form-label">Company Email</label>
            <input
              type="email"
              value={settings.company_email}
              onChange={(e) => handleInputChange('company_email', e.target.value)}
              className="form-input"
              placeholder="Enter company email"
            />
          </div>
        </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="form-label">Company Phone</label>
          <input
            type="tel"
            value={settings.company_phone}
            onChange={(e) => handleInputChange('company_phone', e.target.value)}
            className="form-input"
            placeholder="Enter company phone"
          />
        </div>
        
        <div>
          <label className="form-label">Website URL</label>
          <input
            type="url"
            value={settings.website_url}
            onChange={(e) => handleInputChange('website_url', e.target.value)}
            className="form-input"
            placeholder="Enter website URL"
          />
        </div>
      </div>

      <div>
        <label className="form-label">Company Address</label>
        <textarea
          value={settings.company_address}
          onChange={(e) => handleInputChange('company_address', e.target.value)}
          rows={3}
          className="form-input"
          placeholder="Enter company address"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="form-label">Timezone</label>
          <select
            value={settings.timezone}
            onChange={(e) => handleChange('timezone', e.target.value)}
            className="form-input"
          >
            <option value="Asia/Kolkata">Asia/Kolkata</option>
            <option value="Asia/Dubai">Asia/Dubai</option>
            <option value="America/New_York">America/New_York</option>
            <option value="Europe/London">Europe/London</option>
          </select>
        </div>
        
        <div>
          <label className="form-label">Currency</label>
          <select
            value={settings.currency}
            onChange={(e) => handleChange('currency', e.target.value)}
            className="form-input"
          >
            <option value="INR">INR (₹)</option>
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
            <option value="GBP">GBP (£)</option>
          </select>
        </div>
        
        <div>
          <label className="form-label">Date Format</label>
          <select
            value={settings.date_format}
            onChange={(e) => handleChange('date_format', e.target.value)}
            className="form-input"
          >
            <option value="DD/MM/YYYY">DD/MM/YYYY</option>
            <option value="MM/DD/YYYY">MM/DD/YYYY</option>
            <option value="YYYY-MM-DD">YYYY-MM-DD</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <BellIcon className="h-5 w-5 text-blue-400" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">
              Notification Preferences
            </h3>
            <div className="mt-2 text-sm text-blue-700">
              <p>Configure how you receive notifications for CRM activities and updates.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <h3 className="text-sm font-medium text-gray-900">Email Notifications</h3>
            <p className="text-sm text-gray-500">Receive email notifications for important events</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.email_notifications}
              onChange={() => handleToggle('email_notifications')}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
        
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <h3 className="text-sm font-medium text-gray-900">SMS Notifications</h3>
            <p className="text-sm text-gray-500">Receive SMS notifications for urgent events</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.sms_notifications}
              onChange={() => handleToggle('sms_notifications')}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
        
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <h3 className="text-sm font-medium text-gray-900">Auto-assign Leads</h3>
            <p className="text-sm text-gray-500">Automatically assign new leads to available agents</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.auto_assign_leads}
              onChange={() => handleToggle('auto_assign_leads')}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>

      {settings.auto_assign_leads && (
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <label className="form-label">Lead Assignment Method</label>
          <select
            value={settings.lead_assignment_method}
            onChange={(e) => handleChange('lead_assignment_method', e.target.value)}
            className="form-input"
          >
            <option value="round_robin">Round Robin - Distribute leads evenly</option>
            <option value="least_busy">Least Busy - Assign to agent with fewest leads</option>
            <option value="by_location">By Location - Assign based on property location</option>
            <option value="manual">Manual Assignment - Require manual assignment</option>
          </select>
          <p className="mt-1 text-sm text-gray-500">
            Choose how new leads are automatically assigned to your team members.
          </p>
        </div>
      )}
    </div>
  );

  const renderUserManagement = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <UserGroupIcon className="h-5 w-5 text-blue-400" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">
              User Management Overview
            </h3>
            <div className="mt-2 text-sm text-blue-700">
              <p>Monitor and manage your team members, their roles, and system access permissions.</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <div className="flex items-center">
            <UserGroupIcon className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Total Users</h3>
              {userStats.loading ? (
                <div className="flex items-center">
                  <div className="spinner mr-2"></div>
                  <span className="text-sm text-gray-500">Loading...</span>
                </div>
              ) : (
                <p className="text-2xl font-semibold text-gray-900">{userStats.totalUsers}</p>
              )}
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <div className="flex items-center">
            <ShieldCheckIcon className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Active Users</h3>
              {userStats.loading ? (
                <div className="flex items-center">
                  <div className="spinner mr-2"></div>
                  <span className="text-sm text-gray-500">Loading...</span>
                </div>
              ) : (
                <p className="text-2xl font-semibold text-gray-900">{userStats.activeUsers}</p>
              )}
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <div className="flex items-center">
            <CogIcon className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Admin Users</h3>
              {userStats.loading ? (
                <div className="flex items-center">
                  <div className="spinner mr-2"></div>
                  <span className="text-sm text-gray-500">Loading...</span>
                </div>
              ) : (
                <p className="text-2xl font-semibold text-gray-900">{userStats.adminUsers}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Additional User Management Features */}
      <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <button
            onClick={() => {
              toast.success('Redirecting to Employees page...');
              // In a real app, this would navigate to employees page
              window.location.href = '/employees';
            }}
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <UserGroupIcon className="h-6 w-6 text-blue-600 mr-3" />
            <div className="text-left">
              <div className="font-medium text-gray-900">Manage Employees</div>
              <div className="text-sm text-gray-500">View and edit team members</div>
            </div>
          </button>
          
          <button
            onClick={() => {
              toast.success('Redirecting to Roles & Permissions...');
            }}
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <ShieldCheckIcon className="h-6 w-6 text-green-600 mr-3" />
            <div className="text-left">
              <div className="font-medium text-gray-900">Roles & Permissions</div>
              <div className="text-sm text-gray-500">Configure access levels</div>
            </div>
          </button>
          
          <button
            onClick={() => {
              toast.success('Redirecting to User Activity...');
            }}
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <ChartBarIcon className="h-6 w-6 text-purple-600 mr-3" />
            <div className="text-left">
              <div className="font-medium text-gray-900">User Activity</div>
              <div className="text-sm text-gray-500">Monitor user actions</div>
            </div>
          </button>
        </div>
      </div>

      {/* Refresh Button */}
      <div className="flex justify-end">
        <button
          onClick={fetchUserStats}
          disabled={userStats.loading}
          className="btn-secondary flex items-center"
        >
          <ArrowPathIcon className={`h-4 w-4 mr-2 ${userStats.loading ? 'animate-spin' : ''}`} />
          Refresh Data
        </button>
      </div>
    </div>
  );

  const renderWebsiteIntegration = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <GlobeAltIcon className="h-5 w-5 text-blue-400" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">
              Website Integration
            </h3>
            <div className="mt-2 text-sm text-blue-700">
              <p>Configure how your CRM integrates with your website for lead capture and property listings.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-gray-900">Auto-sync Properties</h3>
            <p className="text-sm text-gray-500">Automatically sync property listings with your website</p>
          </div>
          <input
            type="checkbox"
            checked={true}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-gray-900">Lead Form Integration</h3>
            <p className="text-sm text-gray-500">Capture leads directly from your website contact forms</p>
          </div>
          <input
            type="checkbox"
            checked={true}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-gray-900">Property Search API</h3>
            <p className="text-sm text-gray-500">Enable API access for property search on your website</p>
          </div>
          <input
            type="checkbox"
            checked={false}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
        </div>
      </div>

      <div>
        <label className="form-label">API Endpoint</label>
        <input
          type="text"
          value="https://your-crm.com/api/properties"
          readOnly
          className="form-input bg-gray-50"
        />
        <p className="mt-1 text-sm text-gray-500">Use this endpoint to fetch properties for your website</p>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="form-label">Session Timeout (minutes)</label>
          <input
            type="number"
            value={settings.session_timeout}
            onChange={(e) => handleChange('session_timeout', parseInt(e.target.value))}
            min="5"
            max="480"
            className="form-input"
          />
          <p className="mt-1 text-sm text-gray-500">Users will be logged out after this period of inactivity</p>
        </div>
        
        <div>
          <label className="form-label">Password Policy</label>
          <select className="form-input">
            <option value="standard">Standard (6+ characters)</option>
            <option value="strong">Strong (8+ characters, mixed case, numbers)</option>
            <option value="very_strong">Very Strong (12+ characters, special chars)</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-gray-900">Two-Factor Authentication</h3>
            <p className="text-sm text-gray-500">Require 2FA for all admin users</p>
          </div>
          <input
            type="checkbox"
            checked={false}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-gray-900">IP Whitelist</h3>
            <p className="text-sm text-gray-500">Restrict access to specific IP addresses</p>
          </div>
          <input
            type="checkbox"
            checked={false}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-gray-900">Login Attempts Limit</h3>
            <p className="text-sm text-gray-500">Lock account after failed login attempts</p>
          </div>
          <input
            type="checkbox"
            checked={true}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
        </div>
      </div>
    </div>
  );


  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return renderGeneralSettings();
      case 'notifications':
        return renderNotificationSettings();
      case 'users':
        return renderUserManagement();
      case 'website':
        return renderWebsiteIntegration();
      case 'security':
        return renderSecuritySettings();
      case 'appearance':
        return renderAppearanceSettings();
      default:
        return renderGeneralSettings();
    }
  };

  const renderAppearanceSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="form-label">Theme</label>
          <div className="grid grid-cols-3 gap-3">
            {themeOptions.map((theme) => {
              const IconComponent = theme.icon;
              return (
                <button
                  key={theme.id}
                  onClick={() => handleChange('theme', theme.id)}
                  className={`p-4 border rounded-lg text-center transition-colors ${
                    settings.theme === theme.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <IconComponent className="h-6 w-6 mx-auto mb-2" />
                  <div className="font-medium">{theme.name}</div>
                  <div className="text-xs text-gray-500">{theme.description}</div>
                </button>
              );
            })}
          </div>
        </div>
        
        <div>
          <label className="form-label">Language</label>
          <select
            value={settings.language}
            onChange={(e) => handleChange('language', e.target.value)}
            className="form-input"
          >
            {languageOptions.map((lang) => (
              <option key={lang.id} value={lang.id}>
                {lang.flag} {lang.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );


  const renderModals = () => (
    <>
      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Export Settings</h3>
              <button
                onClick={() => setShowExportModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                <div className="text-center">
                  <DocumentDuplicateIcon className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">Export Configuration</h4>
                  <p className="text-gray-500">Download your current settings as a JSON file for backup or sharing.</p>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => setShowExportModal(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    handleExport();
                    setShowExportModal(false);
                  }}
                  className="btn-primary"
                >
                  Export Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Import Settings</h3>
              <button
                onClick={() => setShowImportModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                <div className="text-center">
                  <ArrowUpTrayIcon className="h-12 w-12 text-green-600 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">Import Configuration</h4>
                  <p className="text-gray-500">Upload a settings file to restore your configuration.</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select File</label>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImport}
                    className="form-input"
                  />
                </div>
              </div>
              
              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => setShowImportModal(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Theme Customization Modal */}
      {showThemeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Theme Customization</h3>
              <button
                onClick={() => setShowThemeModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Theme Selection</label>
                  <div className="grid grid-cols-3 gap-3">
                    {themeOptions.map((theme) => {
                      const IconComponent = theme.icon;
                      return (
                        <button
                          key={theme.id}
                          onClick={() => handleChange('theme', theme.id)}
                          className={`p-4 border rounded-lg text-center transition-colors ${
                            settings.theme === theme.id
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                        >
                          <IconComponent className="h-6 w-6 mx-auto mb-2" />
                          <div className="font-medium">{theme.name}</div>
                          <div className="text-xs text-gray-500">{theme.description}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                  <select
                    value={settings.language}
                    onChange={(e) => handleChange('language', e.target.value)}
                    className="form-input"
                  >
                    {languageOptions.map((lang) => (
                      <option key={lang.id} value={lang.id}>
                        {lang.flag} {lang.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => setShowThemeModal(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    toast.success('Theme updated successfully!');
                    setShowThemeModal(false);
                  }}
                  className="btn-primary"
                >
                  Apply Theme
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );

  return (
    <div className="space-y-6">
      {/* Enhanced Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <CogIcon className="h-8 w-8 text-blue-600 mr-3" />
              Settings & Configuration
            </h1>
            <p className="mt-2 text-gray-600">
              Manage CRM settings, user preferences, and configurations
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className={`btn-secondary flex items-center ${showAdvanced ? 'bg-orange-50 text-orange-700 border-orange-200' : ''}`}
            >
              <AdjustmentsHorizontalIcon className="h-4 w-4 mr-2" />
              Advanced
            </button>
            
            
            <button
              onClick={handleSave}
              className="btn-primary flex items-center"
              disabled={loading}
            >
              {loading ? (
                <ArrowPathIcon className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <CheckIcon className="h-4 w-4 mr-2" />
              )}
              Save Settings
            </button>
          </div>
        </div>
      </div>


      <div className="flex flex-col lg:flex-row gap-6">
        {/* Enhanced Sidebar */}
        <div className="lg:w-80">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Settings Categories</h3>
              <button
                onClick={() => setSearchTerm('')}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-4 w-4" />
              </button>
            </div>
            
            <div className="relative mb-4">
              <MagnifyingGlassIcon className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search settings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <nav className="space-y-1">
              {tabs
                .filter(tab => 
                  searchTerm === '' || 
                  tab.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  tab.description.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center justify-between px-3 py-3 text-sm font-medium rounded-lg transition-colors ${
                        isActive
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <div className="flex items-center">
                        <Icon className="h-5 w-5 mr-3" />
                        <div className="text-left">
                          <div className="font-medium">{tab.name}</div>
                          <div className="text-xs text-gray-500">{tab.description}</div>
                        </div>
                      </div>
                      {tab.badge && (
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          tab.badge === 'OK' ? 'bg-green-100 text-green-700' :
                          tab.badge === '2' ? 'bg-red-100 text-red-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {tab.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
            </nav>
          </div>
        </div>

        {/* Enhanced Main Content */}
        <div className="flex-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    {tabs.find(tab => tab.id === activeTab)?.icon && (
                      React.createElement(tabs.find(tab => tab.id === activeTab).icon, {
                        className: "h-5 w-5 mr-2 text-blue-600"
                      })
                    )}
                    {tabs.find(tab => tab.id === activeTab)?.name}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {tabs.find(tab => tab.id === activeTab)?.description}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {activeTab === 'appearance' && (
                    <button
                      onClick={() => setShowThemeModal(true)}
                      className="btn-secondary text-sm"
                    >
                      <SwatchIcon className="h-4 w-4 mr-1" />
                      Customize
                    </button>
                  )}
                </div>
              </div>
            </div>
            
            <div className="p-6">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <ArrowPathIcon className="h-8 w-8 animate-spin text-blue-600" />
                  <span className="ml-2 text-gray-600">Loading settings...</span>
                </div>
              ) : (
                renderTabContent()
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modals and Additional Components */}
      {renderModals()}

      {/* Floating Add Button */}
      {hasPermission('admin') && (
        <FloatingAddButton
          type="setting"
          onAdd={() => setActiveTab('general')}
          quickActions={quickActions}
          label="Settings Actions"
        />
      )}

      {/* Automation Management Modals */}
      {showAutomationManagement && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Automation Management</h2>
                <button
                  onClick={() => setShowAutomationManagement(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl p-6 text-white">
                  <div className="flex items-center justify-between mb-4">
                    <CogIcon className="h-8 w-8" />
                    <span className="text-2xl font-bold">25</span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Active Workflows</h3>
                  <p className="text-blue-100">Running smoothly</p>
                </div>
                <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-6 text-white">
                  <div className="flex items-center justify-between mb-4">
                    <CheckCircleIcon className="h-8 w-8" />
                    <span className="text-2xl font-bold">1,247</span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Actions Executed</h3>
                  <p className="text-green-100">This month</p>
                </div>
                <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl p-6 text-white">
                  <div className="flex items-center justify-between mb-4">
                    <SparklesIcon className="h-8 w-8" />
                    <span className="text-2xl font-bold">98.5%</span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Success Rate</h3>
                  <p className="text-purple-100">Excellent performance</p>
                </div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Automations</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">Lead Assignment</h4>
                        <p className="text-sm text-gray-600">Auto-assign new leads</p>
                      </div>
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">Active</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">Follow-up Emails</h4>
                        <p className="text-sm text-gray-600">Send automated follow-ups</p>
                      </div>
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">Active</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">Task Creation</h4>
                        <p className="text-sm text-gray-600">Create tasks for high-value leads</p>
                      </div>
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-semibold">Paused</span>
                    </div>
                  </div>
                </div>
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Email Delivery Rate</span>
                      <span className="font-semibold text-green-600">99.2%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Lead Response Time</span>
                      <span className="font-semibold text-blue-600">2.5 min</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Conversion Rate</span>
                      <span className="font-semibold text-purple-600">15.8%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Cost Savings</span>
                      <span className="font-semibold text-orange-600">₹45,000/month</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Workflow Builder Modal */}
      {showWorkflowBuilder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Workflow Builder</h2>
                <button
                  onClick={() => setShowWorkflowBuilder(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">🚀 Drag & Drop Workflow Builder</h3>
                <p className="text-blue-700">Create powerful automated workflows with our visual builder. Drag triggers and actions to design your perfect automation flow.</p>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Components</h3>
                  <div className="space-y-3">
                    <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg cursor-move">
                      <div className="flex items-center">
                        <SparklesIcon className="h-5 w-5 text-blue-600 mr-2" />
                        <span className="font-medium">Triggers</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">Start workflows automatically</p>
                    </div>
                    <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg cursor-move">
                      <div className="flex items-center">
                        <CheckCircleIcon className="h-5 w-5 text-green-600 mr-2" />
                        <span className="font-medium">Actions</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">Execute automated tasks</p>
                    </div>
                    <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg cursor-move">
                      <div className="flex items-center">
                        <FunnelIcon className="h-5 w-5 text-purple-600 mr-2" />
                        <span className="font-medium">Conditions</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">Add logic to workflows</p>
                    </div>
                    <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg cursor-move">
                      <div className="flex items-center">
                        <ClockIcon className="h-5 w-5 text-orange-600 mr-2" />
                        <span className="font-medium">Delays</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">Add timing to workflows</p>
                    </div>
                  </div>
                </div>
                <div className="lg:col-span-2">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Workflow Canvas</h3>
                  <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg h-96 flex items-center justify-center">
                    <div className="text-center">
                      <ShareIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <h4 className="text-lg font-medium text-gray-600 mb-2">Start Building Your Workflow</h4>
                      <p className="text-gray-500">Drag components from the left panel to create your automation workflow</p>
                      <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        Use Template
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Automation Rules Modal */}
      {showAutomationRules && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Automation Rules</h2>
                <button
                  onClick={() => setShowAutomationRules(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="space-y-6">
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Lead Assignment Rule</h3>
                      <p className="text-sm text-gray-600">Automatically assign new leads to available agents</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">Active</span>
                      <button className="text-gray-400 hover:text-gray-600">
                        <CogIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                  <div className="text-sm text-gray-700">
                    <strong>Trigger:</strong> New lead created<br/>
                    <strong>Condition:</strong> Lead source is "Website" OR "Facebook"<br/>
                    <strong>Action:</strong> Assign to next available agent using round-robin method
                  </div>
                </div>
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Follow-up Email Sequence</h3>
                      <p className="text-sm text-gray-600">Send automated follow-up emails to leads</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">Active</span>
                      <button className="text-gray-400 hover:text-gray-600">
                        <CogIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                  <div className="text-sm text-gray-700">
                    <strong>Trigger:</strong> Lead status changed to "Contacted"<br/>
                    <strong>Condition:</strong> No response after 3 days<br/>
                    <strong>Action:</strong> Send follow-up email template #2
                  </div>
                </div>
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">High-Value Lead Alert</h3>
                      <p className="text-sm text-gray-600">Notify managers about high-value leads</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-semibold">Paused</span>
                      <button className="text-gray-400 hover:text-gray-600">
                        <CogIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                  <div className="text-sm text-gray-700">
                    <strong>Trigger:</strong> New lead created<br/>
                    <strong>Condition:</strong> Budget > ₹1 Crore<br/>
                    <strong>Action:</strong> Send WhatsApp notification to manager
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Automation Analytics Modal */}
      {showAutomationAnalytics && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Automation Analytics</h2>
                <button
                  onClick={() => setShowAutomationAnalytics(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl p-6 text-white">
                  <div className="flex items-center justify-between mb-4">
                    <ArrowTrendingUpIcon className="h-8 w-8" />
                    <span className="text-2xl font-bold">85%</span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Efficiency Gain</h3>
                  <p className="text-blue-100">vs manual processes</p>
                </div>
                <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-6 text-white">
                  <div className="flex items-center justify-between mb-4">
                    <ClockIcon className="h-8 w-8" />
                    <span className="text-2xl font-bold">240</span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Hours Saved</h3>
                  <p className="text-green-100">This month</p>
                </div>
                <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl p-6 text-white">
                  <div className="flex items-center justify-between mb-4">
                    <CurrencyDollarIcon className="h-8 w-8" />
                    <span className="text-2xl font-bold">₹68K</span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Cost Savings</h3>
                  <p className="text-purple-100">Monthly estimate</p>
                </div>
                <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-xl p-6 text-white">
                  <div className="flex items-center justify-between mb-4">
                    <TrophyIcon className="h-8 w-8" />
                    <span className="text-2xl font-bold">99.1%</span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Uptime</h3>
                  <p className="text-orange-100">Reliability score</p>
                </div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Workflows</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">Lead Nurturing</h4>
                        <p className="text-sm text-gray-600">95% success rate</p>
                      </div>
                      <span className="text-green-600 font-semibold">+23%</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">Property Alerts</h4>
                        <p className="text-sm text-gray-600">88% engagement</p>
                      </div>
                      <span className="text-green-600 font-semibold">+15%</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">Task Automation</h4>
                        <p className="text-sm text-gray-600">92% completion</p>
                      </div>
                      <span className="text-green-600 font-semibold">+8%</span>
                    </div>
                  </div>
                </div>
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Trends</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Email Open Rate</span>
                      <span className="font-semibold text-blue-600">68.5%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Click-through Rate</span>
                      <span className="font-semibold text-green-600">15.2%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Lead Conversion</span>
                      <span className="font-semibold text-purple-600">12.8%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Response Time</span>
                      <span className="font-semibold text-orange-600">3.2 min</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;