import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import {
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  CalendarIcon,
  ClockIcon,
  ShieldCheckIcon,
  KeyIcon,
  BellIcon,
  CogIcon,
  CameraIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon,
  StarIcon,
  ChartBarIcon,
  DocumentTextIcon,
  BuildingOfficeIcon,
  UserGroupIcon,
  SparklesIcon,
  FireIcon,
  HeartIcon,
  RocketLaunchIcon,
  GlobeAltIcon,
  ComputerDesktopIcon,
  DevicePhoneMobileIcon,
  EyeIcon,
  EyeSlashIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CurrencyDollarIcon,
  HomeIcon,
  BriefcaseIcon,
  AcademicCapIcon,
  HeartIcon as HeartSolid,
  StarIcon as StarSolid,
  FireIcon as FireSolid,
  MagnifyingGlassIcon,
  FunnelIcon,
  InformationCircleIcon,
  UserPlusIcon,
  CreditCardIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, updateProfile, changePassword } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [editingSection, setEditingSection] = useState(null); // Track which section is being edited
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [profileData, setProfileData] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    city: user?.city || '',
    state: user?.state || '',
    pincode: user?.pincode || '',
    bio: user?.bio || '',
    department: user?.department || '',
    position: user?.position || '',
    join_date: user?.join_date || '',
    avatar: user?.avatar || '',
    timezone: user?.timezone || 'Asia/Kolkata',
    language: user?.language || 'en',
    notifications: {
      email: true,
      sms: false,
      push: true,
      marketing: false
    },
    privacy: {
      profile_visibility: 'public',
      show_email: true,
      show_phone: false,
      show_address: false
    }
  });

  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });

  const [stats, setStats] = useState({
    total_leads: 0,
    properties_sold: 0,
    revenue_generated: 0,
    conversion_rate: 0,
    performance_score: 0,
    team_rank: 0
  });

  const [recentActivity, setRecentActivity] = useState([]);
  const [activityLoading, setActivityLoading] = useState(true);
  const [activitySearchTerm, setActivitySearchTerm] = useState('');
  const [activityFilterType, setActivityFilterType] = useState('all');
  const [activityCurrentPage, setActivityCurrentPage] = useState(1);
  const [activityTotalPages, setActivityTotalPages] = useState(1);
  const activityItemsPerPage = 10;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: UserIcon },
    { id: 'personal', label: 'Personal Info', icon: PencilIcon },
    { id: 'security', label: 'Security', icon: ShieldCheckIcon },
    { id: 'preferences', label: 'Preferences', icon: CogIcon },
    { id: 'activity', label: 'Activity', icon: ClockIcon }
  ];


  useEffect(() => {
    fetchProfileStats();
    fetchActivities();
  }, []);

  useEffect(() => {
    if (activeTab === 'activity') {
      fetchActivities();
    }
  }, [activityCurrentPage, activityFilterType, activeTab]);

  const fetchProfileStats = async () => {
    try {
      // Mock data - replace with actual API call
      setStats({
        total_leads: 156,
        properties_sold: 23,
        revenue_generated: 2500000,
        conversion_rate: 14.7,
        performance_score: 87,
        team_rank: 3
      });
    } catch (error) {
      console.error('Failed to fetch profile stats:', error);
    }
  };

  const fetchActivities = async () => {
    try {
      setActivityLoading(true);
      const token = localStorage.getItem('token');
      const url = `http://localhost:5000/api/activities?page=${activityCurrentPage}&per_page=${activityItemsPerPage}&type=${activityFilterType}`;
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setRecentActivity(data.activities || []);
        setActivityTotalPages(Math.ceil((data.total || 0) / activityItemsPerPage));
      } else {
        const errorText = await response.text();
        console.error('Activities API error:', response.status, errorText);
        // Show empty state instead of mock data
        setRecentActivity([]);
        setActivityTotalPages(1);
      }
    } catch (error) {
      console.error('Error fetching activities:', error);
      // Show empty state instead of mock data
      setRecentActivity([]);
      setActivityTotalPages(1);
    } finally {
      setActivityLoading(false);
    }
  };


  const getActivityIcon = (activityType) => {
    switch (activityType) {
      case 'profile_update':
        return UserIcon;
      case 'property_added':
        return BuildingOfficeIcon;
      case 'lead_added':
        return UserPlusIcon;
      case 'employee_added':
        return UserGroupIcon;
      case 'sale_completed':
        return CurrencyDollarIcon;
      case 'communication_added':
        return EnvelopeIcon;
      case 'payment_added':
        return CreditCardIcon;
      case 'support_ticket_created':
        return ExclamationTriangleIcon;
      case 'lead_stage_changed':
        return ArrowPathIcon;
      case 'meeting_scheduled':
        return CalendarIcon;
      case 'employee_deleted':
        return TrashIcon;
      case 'lead_deleted':
        return TrashIcon;
      case 'property_deleted':
        return TrashIcon;
      default:
        return InformationCircleIcon;
    }
  };

  const getActivityColor = (activityType) => {
    switch (activityType) {
      case 'profile_update':
        return 'bg-blue-100 text-blue-600';
      case 'property_added':
        return 'bg-green-100 text-green-600';
      case 'lead_added':
        return 'bg-purple-100 text-purple-600';
      case 'employee_added':
        return 'bg-orange-100 text-orange-600';
      case 'sale_completed':
        return 'bg-yellow-100 text-yellow-600';
      case 'communication_added':
        return 'bg-pink-100 text-pink-600';
      case 'payment_added':
        return 'bg-emerald-100 text-emerald-600';
      case 'support_ticket_created':
        return 'bg-red-100 text-red-600';
      case 'lead_stage_changed':
        return 'bg-cyan-100 text-cyan-600';
      case 'meeting_scheduled':
        return 'bg-indigo-100 text-indigo-600';
      case 'employee_deleted':
        return 'bg-red-100 text-red-600';
      case 'lead_deleted':
        return 'bg-red-100 text-red-600';
      case 'property_deleted':
        return 'bg-red-100 text-red-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const getTimeAgo = (dateString) => {
    if (!dateString) return 'Unknown time';
    
    // Use UTC time for consistent comparison
    const now = new Date();
    const date = new Date(dateString);
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      console.error('Invalid date string:', dateString);
      return 'Invalid date';
    }
    
    // Convert both to UTC for accurate comparison
    const nowUTC = new Date(now.getTime() + (now.getTimezoneOffset() * 60000));
    const dateUTC = new Date(date.getTime() + (date.getTimezoneOffset() * 60000));
    
    const diffInSeconds = Math.floor((nowUTC - dateUTC) / 1000);
    
    // Handle negative differences (future dates)
    if (diffInSeconds < 0) return 'Just now';
    
    if (diffInSeconds < 60) return 'Just now';
    
    const minutes = Math.floor(diffInSeconds / 60);
    if (minutes < 60) {
      if (minutes === 1) return '1 minute ago';
      return `${minutes} minutes ago`;
    }
    
    const hours = Math.floor(diffInSeconds / 3600);
    if (hours < 24) {
      if (hours === 1) return '1 hour ago';
      return `${hours} hours ago`;
    }
    
    const days = Math.floor(diffInSeconds / 86400);
    if (days < 7) {
      if (days === 1) return '1 day ago';
      return `${days} days ago`;
    }
    
    const weeks = Math.floor(days / 7);
    if (weeks < 4) {
      if (weeks === 1) return '1 week ago';
      return `${weeks} weeks ago`;
    }
    
    const months = Math.floor(days / 30);
    if (months < 12) {
      if (months === 1) return '1 month ago';
      return `${months} months ago`;
    }
    
    const years = Math.floor(days / 365);
    if (years === 1) return '1 year ago';
    return `${years} years ago`;
  };

  const handleProfileUpdate = async () => {
    try {
      setLoading(true);
      await updateProfile(profileData);
      toast.success('Profile updated successfully!');
      setIsEditing(false);
      setEditingSection(null);
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSection = async (section) => {
    setLoading(true);
    try {
      await updateProfile(profileData);
      toast.success(`${section} updated successfully!`);
      setEditingSection(null);
    } catch (error) {
      toast.error(`Failed to update ${section}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingSection(null);
    // Reset profile data to original values
    setProfileData({
      first_name: user?.first_name || '',
      last_name: user?.last_name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      city: user?.city || '',
      state: user?.state || '',
      pincode: user?.pincode || '',
      bio: user?.bio || '',
      department: user?.department || '',
      position: user?.position || '',
      join_date: user?.join_date || '',
      avatar: user?.avatar || '',
      timezone: user?.timezone || 'Asia/Kolkata',
      language: user?.language || 'en',
      notifications: {
        email: true,
        sms: false,
        push: true,
        marketing: false
      },
      privacy: {
        profile_visibility: 'public',
        show_email: true,
        show_phone: false,
        show_address: false
      }
    });
  };

  const handlePasswordChange = async () => {
    if (passwordData.new_password !== passwordData.confirm_password) {
      toast.error('New passwords do not match');
      return;
    }

    try {
      setLoading(true);
      await changePassword(passwordData.current_password, passwordData.new_password);
      toast.success('Password changed successfully!');
      setPasswordData({ current_password: '', new_password: '', confirm_password: '' });
    } catch (error) {
      toast.error('Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    setLoading(true);
    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('image', file);

      // Upload image to server
      const response = await fetch('/api/upload/image', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      const data = await response.json();
      
      if (data.success && data.filename) {
        // Update profile data with server URL
        const avatarUrl = `/uploads/images/${data.filename}`;
        setProfileData(prev => ({ ...prev, avatar: avatarUrl }));
        
        // Save to database immediately
        await updateProfile({ ...profileData, avatar: avatarUrl });
        
        toast.success('Profile picture updated successfully!');
      } else {
        throw new Error(data.error || 'Upload failed');
      }
    } catch (error) {
      console.error('Avatar upload error:', error);
      toast.error('Failed to upload profile picture');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const renderOverview = () => (
    <div className="space-y-8">
      {/* Profile Header */}
      <div className="bg-gradient-to-br from-indigo-50 via-white to-purple-50 rounded-3xl p-8 border border-white/20 shadow-lg">
        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6">
          {/* Avatar Section */}
          <div className="relative group">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
              {profileData.avatar ? (
                <img
                  src={profileData.avatar}
                  alt="Profile"
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <UserIcon className="h-16 w-16 text-white" />
              )}
            </div>
            <label className="absolute bottom-0 right-0 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors">
              <CameraIcon className="h-5 w-5 text-gray-600" />
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
              />
            </label>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-emerald-400 to-cyan-400 rounded-full flex items-center justify-center">
              <SparklesIcon className="h-4 w-4 text-white" />
            </div>
          </div>

          {/* Profile Info */}
          <div className="flex-1 text-center lg:text-left">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {profileData.first_name} {profileData.last_name}
            </h1>
            <p className="text-lg text-gray-600 mb-2">{profileData.position}</p>
            <p className="text-sm text-gray-500 mb-4">{profileData.department}</p>
            
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <EnvelopeIcon className="h-4 w-4" />
                {profileData.email}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <PhoneIcon className="h-4 w-4" />
                {profileData.phone}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPinIcon className="h-4 w-4" />
                {profileData.city && profileData.state && profileData.pincode 
                  ? `${profileData.city}, ${profileData.state} - ${profileData.pincode}`
                  : 'Address not provided'
                }
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            <div className="text-center lg:text-left">
              <p className="text-sm text-gray-500 mb-2">Quick Actions</p>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => setActiveTab('personal')}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 shadow-md hover:shadow-lg transition-all duration-200 text-sm"
                >
                  <PencilIcon className="h-4 w-4" />
                  Edit Personal Info
                </button>
                <button
                  onClick={() => setActiveTab('settings')}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg hover:from-purple-600 hover:to-pink-700 shadow-md hover:shadow-lg transition-all duration-200 text-sm"
                >
                  <CogIcon className="h-4 w-4" />
                  Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { title: 'Total Leads', value: stats.total_leads, icon: UserGroupIcon, color: 'from-blue-500 to-indigo-600', change: '+12%' },
          { title: 'Properties Sold', value: stats.properties_sold, icon: BuildingOfficeIcon, color: 'from-green-500 to-emerald-600', change: '+8%' },
          { title: 'Revenue Generated', value: formatCurrency(stats.revenue_generated), icon: CurrencyDollarIcon, color: 'from-purple-500 to-pink-600', change: '+15%' },
          { title: 'Conversion Rate', value: `${stats.conversion_rate}%`, icon: ArrowTrendingUpIcon, color: 'from-orange-500 to-red-600', change: '+3%' },
          { title: 'Performance Score', value: `${stats.performance_score}/100`, icon: StarIcon, color: 'from-yellow-500 to-orange-600', change: '+5%' },
          { title: 'Team Rank', value: `#${stats.team_rank}`, icon: StarIcon, color: 'from-indigo-500 to-purple-600', change: '+2' }
        ].map((stat, index) => (
          <div
            key={stat.title}
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50 hover:shadow-xl hover:scale-105 transition-all duration-200"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 bg-gradient-to-br ${stat.color} rounded-xl shadow-lg`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-green-600">{stat.change}</p>
                <p className="text-xs text-gray-500">vs last month</p>
              </div>
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">{stat.title}</h3>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );

  const renderPersonalInfo = () => (
    <div className="space-y-6">
      <div className={`bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border transition-all duration-200 ${
        editingSection === 'personal' 
          ? 'border-blue-300 shadow-blue-100 shadow-2xl' 
          : 'border-gray-200/50'
      }`}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">Personal Information</h3>
          <div className="flex items-center gap-2">
            {editingSection === 'personal' ? (
              <>
                <button
                  onClick={() => handleSaveSection('Personal Information')}
                  disabled={loading}
                  className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors duration-200 text-sm disabled:opacity-50"
                >
                  <CheckIcon className="h-4 w-4" />
                  {loading ? 'Saving...' : 'Save'}
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors duration-200 text-sm"
                >
                  <XMarkIcon className="h-4 w-4" />
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={() => setEditingSection('personal')}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200 text-sm"
              >
                <PencilIcon className="h-4 w-4" />
                Edit
              </button>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
            {editingSection === 'personal' ? (
              <input
                type="text"
                value={profileData.first_name}
                onChange={(e) => setProfileData(prev => ({ ...prev, first_name: e.target.value }))}
                className="w-full px-4 py-3 bg-blue-50/50 border border-blue-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                placeholder="Enter your first name"
              />
            ) : (
              <div className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900">
                {profileData.first_name || 'Not provided'}
              </div>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
            {editingSection === 'personal' ? (
              <input
                type="text"
                value={profileData.last_name}
                onChange={(e) => setProfileData(prev => ({ ...prev, last_name: e.target.value }))}
                className="w-full px-4 py-3 bg-blue-50/50 border border-blue-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                placeholder="Enter your last name"
              />
            ) : (
              <div className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900">
                {profileData.last_name || 'Not provided'}
              </div>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            {editingSection === 'personal' ? (
              <input
                type="email"
                value={profileData.email}
                onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-4 py-3 bg-blue-50/50 border border-blue-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                placeholder="Enter your email"
              />
            ) : (
              <div className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900">
                {profileData.email || 'Not provided'}
              </div>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
            <input
              type="tel"
              value={profileData.phone}
              onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
              className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
              disabled={!isEditing}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
            <input
              type="text"
              value={profileData.city}
              onChange={(e) => setProfileData(prev => ({ ...prev, city: e.target.value }))}
              className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
              disabled={editingSection !== 'personal'}
              placeholder="Enter your city"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
            <input
              type="text"
              value={profileData.state}
              onChange={(e) => setProfileData(prev => ({ ...prev, state: e.target.value }))}
              className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
              disabled={editingSection !== 'personal'}
              placeholder="Enter your state"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Pincode</label>
            <input
              type="text"
              value={profileData.pincode}
              onChange={(e) => setProfileData(prev => ({ ...prev, pincode: e.target.value }))}
              className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
              disabled={editingSection !== 'personal'}
              placeholder="Enter your pincode"
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
            <textarea
              value={profileData.bio}
              onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
              rows={4}
              placeholder="Tell us about yourself..."
              className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
              disabled={!isEditing}
            />
          </div>
        </div>
        
        {isEditing && (
          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={() => setIsEditing(false)}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              onClick={handleProfileUpdate}
              disabled={loading}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        )}
      </div>
    </div>
  );

  const renderSecurity = () => (
    <div className="space-y-6">
      {/* Password Change */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-200/50">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Change Password</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={passwordData.current_password}
                onChange={(e) => setPasswordData(prev => ({ ...prev, current_password: e.target.value }))}
                className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
              </button>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
            <input
              type="password"
              value={passwordData.new_password}
              onChange={(e) => setPasswordData(prev => ({ ...prev, new_password: e.target.value }))}
              className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
            <input
              type="password"
              value={passwordData.confirm_password}
              onChange={(e) => setPasswordData(prev => ({ ...prev, confirm_password: e.target.value }))}
              className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
            />
          </div>
        </div>
        
        <button
          onClick={handlePasswordChange}
          disabled={loading || !passwordData.current_password || !passwordData.new_password || !passwordData.confirm_password}
          className="mt-6 px-6 py-3 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-xl hover:from-red-600 hover:to-pink-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50"
        >
          {loading ? 'Changing...' : 'Change Password'}
        </button>
      </div>

      {/* Security Settings */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-200/50">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Security Settings</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-3">
              <ShieldCheckIcon className="h-6 w-6 text-green-500" />
              <div>
                <p className="font-medium text-gray-900">Two-Factor Authentication</p>
                <p className="text-sm text-gray-500">Add an extra layer of security</p>
              </div>
            </div>
            <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
              Enable
            </button>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-3">
              <KeyIcon className="h-6 w-6 text-blue-500" />
              <div>
                <p className="font-medium text-gray-900">Login Sessions</p>
                <p className="text-sm text-gray-500">Manage your active sessions</p>
              </div>
            </div>
            <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
              View
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPreferences = () => (
    <div className="space-y-6">
      {/* Notification Preferences */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-200/50">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Notification Preferences</h3>
        
        <div className="space-y-4">
          {[
            { key: 'email', label: 'Email Notifications', description: 'Receive notifications via email' },
            { key: 'sms', label: 'SMS Notifications', description: 'Receive notifications via SMS' },
            { key: 'push', label: 'Push Notifications', description: 'Receive push notifications' },
            { key: 'marketing', label: 'Marketing Emails', description: 'Receive marketing and promotional emails' }
          ].map((notification) => (
            <div key={notification.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div>
                <p className="font-medium text-gray-900">{notification.label}</p>
                <p className="text-sm text-gray-500">{notification.description}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={profileData.notifications[notification.key]}
                  onChange={(e) => setProfileData(prev => ({
                    ...prev,
                    notifications: {
                      ...prev.notifications,
                      [notification.key]: e.target.checked
                    }
                  }))}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Privacy Settings */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-200/50">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Privacy Settings</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Profile Visibility</label>
            <select
              value={profileData.privacy.profile_visibility}
              onChange={(e) => setProfileData(prev => ({
                ...prev,
                privacy: { ...prev.privacy, profile_visibility: e.target.value }
              }))}
              className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
            >
              <option value="public">Public</option>
              <option value="team">Team Only</option>
              <option value="private">Private</option>
            </select>
          </div>
          
          <div className="space-y-3">
            {[
              { key: 'show_email', label: 'Show Email Address' },
              { key: 'show_phone', label: 'Show Phone Number' },
              { key: 'show_address', label: 'Show Location (City, State, Pincode)' }
            ].map((setting) => (
              <div key={setting.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <p className="font-medium text-gray-900">{setting.label}</p>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={profileData.privacy[setting.key]}
                    onChange={(e) => setProfileData(prev => ({
                      ...prev,
                      privacy: {
                        ...prev.privacy,
                        [setting.key]: e.target.checked
                      }
                    }))}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderActivity = () => {
    const filteredActivities = recentActivity.filter(activity => {
      const matchesSearch = activity.description.toLowerCase().includes(activitySearchTerm.toLowerCase()) ||
                           activity.user_name.toLowerCase().includes(activitySearchTerm.toLowerCase());
      const matchesFilter = activityFilterType === 'all' || activity.activity_type === activityFilterType;
      return matchesSearch && matchesFilter;
    });

    const activityTypes = [
      { value: 'all', label: 'All Activities' },
      { value: 'profile_update', label: 'Profile Updates' },
      { value: 'property_added', label: 'Properties Added' },
      { value: 'property_deleted', label: 'Properties Deleted' },
      { value: 'lead_added', label: 'Leads Added' },
      { value: 'lead_deleted', label: 'Leads Deleted' },
      { value: 'employee_added', label: 'Employees Added' },
      { value: 'employee_deleted', label: 'Employees Deleted' },
      { value: 'sale_completed', label: 'Sales Completed' },
      { value: 'communication_added', label: 'Communications' },
      { value: 'payment_added', label: 'Payments' },
      { value: 'support_ticket_created', label: 'Support Tickets' },
      { value: 'lead_stage_changed', label: 'Lead Stage Changes' },
      { value: 'meeting_scheduled', label: 'Meetings Scheduled' }
    ];

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-200/50">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900">Recent Activity</h3>
              <p className="text-gray-600 mt-1">Track all your activities and changes</p>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <ClockIcon className="h-5 w-5" />
              <span>Last updated: {new Date().toLocaleTimeString()}</span>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search activities..."
                  value={activitySearchTerm}
                  onChange={(e) => setActivitySearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Filter */}
            <div className="sm:w-64">
              <div className="relative">
                <FunnelIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <select
                  value={activityFilterType}
                  onChange={(e) => setActivityFilterType(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                >
                  {activityTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Activity List */}
          {activityLoading ? (
            <div className="animate-pulse space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredActivities.length === 0 ? (
            <div className="text-center py-12">
              <InformationCircleIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No activities found</h3>
              <p className="text-gray-500">No activities match your current filters.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredActivities.map((activity) => {
                const IconComponent = getActivityIcon(activity.activity_type);
                const colorClass = getActivityColor(activity.activity_type);
                
                return (
                  <div key={activity.id} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    {/* Icon */}
                    <div className={`flex-shrink-0 w-10 h-10 rounded-full ${colorClass} flex items-center justify-center`}>
                      <IconComponent className="h-5 w-5" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900">
                          {activity.description}
                        </p>
                        <time className="text-xs text-gray-500">
                          {getTimeAgo(activity.created_at)}
                        </time>
                      </div>
                      
                      <div className="mt-1 flex items-center space-x-4 text-xs text-gray-500">
                        <span>By: {activity.user_name}</span>
                        <span>•</span>
                        <span className="capitalize">{activity.activity_type.replace('_', ' ')}</span>
                        {activity.entity_type && (
                          <>
                            <span>•</span>
                            <span className="capitalize">{activity.entity_type}</span>
                          </>
                        )}
                      </div>

                      {/* Metadata */}
                      {activity.metadata && Object.keys(activity.metadata).length > 0 && (
                        <div className="mt-2 text-xs text-gray-600 bg-gray-50 rounded p-2">
                          <details>
                            <summary className="cursor-pointer hover:text-gray-800">View Details</summary>
                            <pre className="mt-2 text-xs overflow-x-auto">
                              {JSON.stringify(activity.metadata, null, 2)}
                            </pre>
                          </details>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {activityTotalPages > 1 && (
            <div className="mt-6 flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing {((activityCurrentPage - 1) * activityItemsPerPage) + 1} to {Math.min(activityCurrentPage * activityItemsPerPage, filteredActivities.length)} of {filteredActivities.length} activities
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setActivityCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={activityCurrentPage === 1}
                  className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => setActivityCurrentPage(prev => Math.min(prev + 1, activityTotalPages))}
                  disabled={activityCurrentPage === activityTotalPages}
                  className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };


  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'personal':
        return renderPersonalInfo();
      case 'security':
        return renderSecurity();
      case 'preferences':
        return renderPreferences();
      case 'activity':
        return renderActivity();
      default:
        return renderOverview();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-indigo-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-cyan-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-pink-400/10 to-orange-400/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className={`text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent`}>
            Profile
          </h1>
          <p className="text-lg text-gray-600 mt-2">
            Manage your profile, preferences, and account settings
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-2xl p-2 shadow-lg border border-white/20 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-6 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg transform scale-105'
                  : 'text-gray-600 hover:bg-gray-100 hover:scale-105'
              }`}
            >
              <tab.icon className="h-5 w-5" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default Profile;