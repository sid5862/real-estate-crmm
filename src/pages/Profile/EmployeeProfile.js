import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import {
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  CalendarIcon,
  ClockIcon,
  CameraIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon,
  StarIcon,
  ChartBarIcon,
  BuildingOfficeIcon,
  UserGroupIcon,
  SparklesIcon,
  FireIcon,
  HeartIcon,
  RocketLaunchIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CurrencyDollarIcon,
  HomeIcon,
  BriefcaseIcon,
  AcademicCapIcon,
  HeartIcon as HeartSolid,
  StarIcon as StarSolid,
  FireIcon as FireSolid,
  InformationCircleIcon,
  UserPlusIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon,
  EyeIcon,
  EyeSlashIcon,
  TrophyIcon,
  KeyIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const EmployeeProfile = () => {
  const { user, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [editSection, setEditSection] = useState(null);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    city: '',
    state: '',
    pincode: ''
  });
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);

  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        phone: user.phone || '',
        city: user.city || '',
        state: user.state || '',
        pincode: user.pincode || ''
      });
      setAvatarPreview(user.avatar);
    }
  }, [user]);

  const tabs = [
    { id: 'overview', name: 'Overview', icon: HomeIcon },
    { id: 'personal', name: 'Personal Info', icon: UserIcon },
    { id: 'performance', name: 'Performance', icon: ChartBarIcon },
    { id: 'activity', name: 'Activity', icon: ClockIcon }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSectionEdit = (section) => {
    setEditSection(section);
    setIsEditing(true);
  };

  const handleSectionSave = async () => {
    try {
      const result = await updateProfile(formData);
      if (result.success) {
        toast.success('Profile updated successfully!');
        setIsEditing(false);
        setEditSection(null);
      } else {
        toast.error(result.error || 'Failed to update profile');
      }
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  const handleSectionCancel = () => {
    setIsEditing(false);
    setEditSection(null);
    // Reset form data to original values
    if (user) {
      setFormData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        phone: user.phone || '',
        city: user.city || '',
        state: user.state || '',
        pincode: user.pincode || ''
      });
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarUpload = async () => {
    if (!avatarFile) return;

    const formData = new FormData();
    formData.append('avatar', avatarFile);

    try {
      const response = await fetch('/api/auth/upload-avatar', {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        toast.success('Avatar updated successfully!');
        setAvatarFile(null);
        // Refresh user data
        window.location.reload();
      } else {
        toast.error('Failed to upload avatar');
      }
    } catch (error) {
      toast.error('Failed to upload avatar');
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    if (passwordData.new_password !== passwordData.confirm_password) {
      toast.error('New passwords do not match');
      return;
    }

    if (passwordData.new_password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    try {
      const response = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          current_password: passwordData.current_password,
          new_password: passwordData.new_password
        })
      });

      if (response.ok) {
        toast.success('Password changed successfully!');
        setShowPasswordForm(false);
        setPasswordData({
          current_password: '',
          new_password: '',
          confirm_password: ''
        });
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to change password');
      }
    } catch (error) {
      toast.error('Failed to change password');
    }
  };

  // Mock performance data - in real app, this would come from API
  const performanceData = {
    totalLeads: 45,
    leadsChange: 12,
    propertiesSold: 8,
    salesChange: 5,
    revenue: 1250000,
    revenueChange: 18,
    conversionRate: 17.8,
    conversionChange: 3,
    performanceScore: 85,
    scoreChange: 7,
    teamRank: 3,
    rankChange: 2
  };

  const recentActivity = [
    { id: 1, type: 'lead', action: 'New lead added', time: '2 hours ago', icon: UserPlusIcon },
    { id: 2, type: 'property', action: 'Property viewed', time: '4 hours ago', icon: BuildingOfficeIcon },
    { id: 3, type: 'meeting', action: 'Client meeting scheduled', time: '1 day ago', icon: CalendarIcon },
    { id: 4, type: 'followup', action: 'Follow-up completed', time: '2 days ago', icon: CheckIcon }
  ];

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            My Profile
          </h1>
          <p className="text-gray-600">
            Manage your personal information and track your performance
          </p>
        </div>

        {/* Profile Header Card */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-xl p-8 mb-8 text-white">
          <div className="flex items-center space-x-6">
            {/* Avatar */}
            <div className="relative">
              <div className="h-24 w-24 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-4 border-white/30">
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Profile"
                    className="h-20 w-20 rounded-full object-cover"
                  />
                ) : (
                  <UserIcon className="h-12 w-12 text-white/80" />
                )}
              </div>
              <button
                onClick={() => document.getElementById('avatar-upload').click()}
                className="absolute -bottom-1 -right-1 h-8 w-8 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-100 transition-colors"
              >
                <CameraIcon className="h-4 w-4 text-gray-600" />
              </button>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </div>

            {/* User Info */}
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-2">
                {user.first_name} {user.last_name}
              </h2>
              <p className="text-blue-100 mb-1">{user.email}</p>
              <p className="text-blue-100 mb-3">{user.phone || 'Phone not provided'}</p>
              <div className="flex items-center space-x-4">
                <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">
                  {user.role?.charAt(0).toUpperCase() + user.role?.slice(1)}
                </span>
                <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">
                  Employee ID: #{user.id}
                </span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-col space-y-3">
              <button
                onClick={() => handleSectionEdit('personal')}
                className="bg-white/20 backdrop-blur-sm hover:bg-white/30 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2"
              >
                <PencilIcon className="h-4 w-4" />
                <span>Edit Profile</span>
              </button>
              {avatarFile && (
                <button
                  onClick={handleAvatarUpload}
                  className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2"
                >
                  <CheckIcon className="h-4 w-4" />
                  <span>Save Avatar</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="h-5 w-5" />
                  <span>{tab.name}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* Performance Metrics */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">Performance Overview</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Total Leads */}
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-blue-600 text-sm font-medium">Total Leads</p>
                          <p className="text-2xl font-bold text-blue-900">{performanceData.totalLeads}</p>
                          <div className="flex items-center mt-1">
                            <ArrowTrendingUpIcon className="h-4 w-4 text-green-500 mr-1" />
                            <span className="text-green-600 text-sm">+{performanceData.leadsChange}%</span>
                          </div>
                        </div>
                        <UserGroupIcon className="h-8 w-8 text-blue-500" />
                      </div>
                    </div>

                    {/* Properties Sold */}
                    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-green-600 text-sm font-medium">Properties Sold</p>
                          <p className="text-2xl font-bold text-green-900">{performanceData.propertiesSold}</p>
                          <div className="flex items-center mt-1">
                            <ArrowTrendingUpIcon className="h-4 w-4 text-green-500 mr-1" />
                            <span className="text-green-600 text-sm">+{performanceData.salesChange}%</span>
                          </div>
                        </div>
                        <BuildingOfficeIcon className="h-8 w-8 text-green-500" />
                      </div>
                    </div>

                    {/* Revenue */}
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-purple-600 text-sm font-medium">Revenue Generated</p>
                          <p className="text-2xl font-bold text-purple-900">₹{performanceData.revenue.toLocaleString()}</p>
                          <div className="flex items-center mt-1">
                            <ArrowTrendingUpIcon className="h-4 w-4 text-green-500 mr-1" />
                            <span className="text-green-600 text-sm">+{performanceData.revenueChange}%</span>
                          </div>
                        </div>
                        <CurrencyDollarIcon className="h-8 w-8 text-purple-500" />
                      </div>
                    </div>

                    {/* Conversion Rate */}
                    <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 border border-orange-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-orange-600 text-sm font-medium">Conversion Rate</p>
                          <p className="text-2xl font-bold text-orange-900">{performanceData.conversionRate}%</p>
                          <div className="flex items-center mt-1">
                            <ArrowTrendingUpIcon className="h-4 w-4 text-green-500 mr-1" />
                            <span className="text-green-600 text-sm">+{performanceData.conversionChange}%</span>
                          </div>
                        </div>
                        <ChartBarIcon className="h-8 w-8 text-orange-500" />
                      </div>
                    </div>

                    {/* Performance Score */}
                    <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl p-6 border border-indigo-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-indigo-600 text-sm font-medium">Performance Score</p>
                          <p className="text-2xl font-bold text-indigo-900">{performanceData.performanceScore}/100</p>
                          <div className="flex items-center mt-1">
                            <ArrowTrendingUpIcon className="h-4 w-4 text-green-500 mr-1" />
                            <span className="text-green-600 text-sm">+{performanceData.scoreChange}%</span>
                          </div>
                        </div>
                        <StarIcon className="h-8 w-8 text-indigo-500" />
                      </div>
                    </div>

                    {/* Team Rank */}
                    <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-xl p-6 border border-pink-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-pink-600 text-sm font-medium">Team Rank</p>
                          <p className="text-2xl font-bold text-pink-900">#{performanceData.teamRank}</p>
                          <div className="flex items-center mt-1">
                            <ArrowTrendingUpIcon className="h-4 w-4 text-green-500 mr-1" />
                            <span className="text-green-600 text-sm">+{performanceData.rankChange} positions</span>
                          </div>
                        </div>
                        <TrophyIcon className="h-8 w-8 text-pink-500" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Activity</h3>
                  <div className="space-y-4">
                    {recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <activity.icon className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-gray-900 font-medium">{activity.action}</p>
                          <p className="text-gray-500 text-sm">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Personal Info Tab */}
            {activeTab === 'personal' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
                  {!isEditing && (
                    <button
                      onClick={() => handleSectionEdit('personal')}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2"
                    >
                      <PencilIcon className="h-4 w-4" />
                      <span>Edit</span>
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Full Name */}
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <UserIcon className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <label className="text-sm font-medium text-gray-500">Full Name</label>
                      {isEditing && editSection === 'personal' ? (
                        <div className="flex space-x-2">
                          <input
                            type="text"
                            name="first_name"
                            value={formData.first_name}
                            onChange={handleInputChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                            placeholder="First Name"
                          />
                          <input
                            type="text"
                            name="last_name"
                            value={formData.last_name}
                            onChange={handleInputChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                            placeholder="Last Name"
                          />
                        </div>
                      ) : (
                        <p className="text-base font-semibold text-gray-900">
                          {user.first_name} {user.last_name}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <EnvelopeIcon className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <label className="text-sm font-medium text-gray-500">Email</label>
                      {isEditing && editSection === 'personal' ? (
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        />
                      ) : (
                        <p className="text-base font-semibold text-gray-900">{user.email}</p>
                      )}
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <PhoneIcon className="h-5 w-5 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <label className="text-sm font-medium text-gray-500">Phone</label>
                      {isEditing && editSection === 'personal' ? (
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        />
                      ) : (
                        <p className="text-base font-semibold text-gray-900">
                          {user.phone || 'Not provided'}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* City */}
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <MapPinIcon className="h-5 w-5 text-orange-600" />
                    </div>
                    <div className="flex-1">
                      <label className="text-sm font-medium text-gray-500">City</label>
                      {isEditing && editSection === 'personal' ? (
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        />
                      ) : (
                        <p className="text-base font-semibold text-gray-900">
                          {user.city || 'Not specified'}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* State */}
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-indigo-100 rounded-lg">
                      <MapPinIcon className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div className="flex-1">
                      <label className="text-sm font-medium text-gray-500">State</label>
                      {isEditing && editSection === 'personal' ? (
                        <input
                          type="text"
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        />
                      ) : (
                        <p className="text-base font-semibold text-gray-900">
                          {user.state || 'Not specified'}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Pincode */}
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-pink-100 rounded-lg">
                      <MapPinIcon className="h-5 w-5 text-pink-600" />
                    </div>
                    <div className="flex-1">
                      <label className="text-sm font-medium text-gray-500">Pincode</label>
                      {isEditing && editSection === 'personal' ? (
                        <input
                          type="text"
                          name="pincode"
                          value={formData.pincode}
                          onChange={handleInputChange}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        />
                      ) : (
                        <p className="text-base font-semibold text-gray-900">
                          {user.pincode || 'Not specified'}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Edit Actions */}
                {isEditing && editSection === 'personal' && (
                  <div className="flex items-center space-x-4 pt-6 border-t border-gray-200">
                    <button
                      onClick={handleSectionSave}
                      className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2"
                    >
                      <CheckIcon className="h-4 w-4" />
                      <span>Save Changes</span>
                    </button>
                    <button
                      onClick={handleSectionCancel}
                      className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2"
                    >
                      <XMarkIcon className="h-4 w-4" />
                      <span>Cancel</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Performance Tab */}
            {activeTab === 'performance' && (
              <div className="space-y-8">
                <h3 className="text-lg font-semibold text-gray-900">Performance Analytics</h3>
                
                {/* Performance Charts Placeholder */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
                    <h4 className="text-lg font-semibold text-blue-900 mb-4">Monthly Performance</h4>
                    <div className="h-64 bg-white rounded-lg flex items-center justify-center">
                      <p className="text-gray-500">Performance chart would go here</p>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
                    <h4 className="text-lg font-semibold text-green-900 mb-4">Goal Progress</h4>
                    <div className="h-64 bg-white rounded-lg flex items-center justify-center">
                      <p className="text-gray-500">Goal progress chart would go here</p>
                    </div>
                  </div>
                </div>

                {/* Performance Goals */}
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
                  <h4 className="text-lg font-semibold text-purple-900 mb-4">Current Goals</h4>
                  <div className="space-y-4">
                    <div className="bg-white rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-900">Monthly Lead Target</span>
                        <span className="text-sm text-gray-500">45/50</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: '90%' }}></div>
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-900">Sales Target</span>
                        <span className="text-sm text-gray-500">8/10</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-600 h-2 rounded-full" style={{ width: '80%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Activity Tab */}
            {activeTab === 'activity' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Activity History</h3>
                
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <activity.icon className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-900 font-medium">{activity.action}</p>
                        <p className="text-gray-500 text-sm">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Security Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Security</h3>
            <button
              onClick={() => setShowPasswordForm(!showPasswordForm)}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2"
            >
              <KeyIcon className="h-4 w-4" />
              <span>Change Password</span>
            </button>
          </div>

          {showPasswordForm && (
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? 'text' : 'password'}
                    value={passwordData.current_password}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, current_password: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                  >
                    {showCurrentPassword ? <EyeSlashIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={passwordData.new_password}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, new_password: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                  >
                    {showNewPassword ? <EyeSlashIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={passwordData.confirm_password}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, confirm_password: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeSlashIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Update Password
                </button>
                <button
                  type="button"
                  onClick={() => setShowPasswordForm(false)}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeProfile;
