import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { employeesAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import {
  ArrowLeftIcon,
  UserIcon,
  PhoneIcon,
  EnvelopeIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const EmployeeForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const isEdit = Boolean(id);
  
  // Debug: Log current user info

  // Available tabs/sections for permissions
  const availableTabs = [
    { id: 'dashboard', name: 'Dashboard', description: 'Overview and analytics' },
    { id: 'leads', name: 'Leads', description: 'Lead management and tracking' },
    { id: 'properties', name: 'Properties', description: 'Property listings and management' },
    { id: 'employees', name: 'Employees', description: 'Employee management' },
    { id: 'post_sales', name: 'Post Sales', description: 'Customer support and maintenance' },
    { id: 'reports', name: 'Reports', description: 'Analytics and reporting' },
    { id: 'settings', name: 'Settings', description: 'System configuration' },
  ];
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    role: 'employee',
    permissions: [],
    is_active: true,
    password: '',
    confirm_password: '',
  });

  useEffect(() => {
    if (isEdit) {
      fetchEmployee();
    }
  }, [id]);

  const fetchEmployee = async () => {
    try {
      const response = await employeesAPI.getEmployee(id);
      const employee = response.data.employee;
      setFormData({
        first_name: employee.first_name,
        last_name: employee.last_name,
        email: employee.email,
        phone: employee.phone || '',
        role: employee.role,
        permissions: employee.permissions || [],
        is_active: employee.is_active,
        password: '',
        confirm_password: '',
      });
    } catch (error) {
      toast.error('Failed to fetch employee details');
      navigate('/employees');
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handlePermissionChange = (tabId, isChecked) => {
    setFormData(prev => ({
      ...prev,
      permissions: isChecked 
        ? [...prev.permissions, tabId]
        : prev.permissions.filter(id => id !== tabId)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validation
    if (!isEdit && (!formData.password || formData.password.length < 6)) {
      toast.error('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    if (!isEdit && formData.password !== formData.confirm_password) {
      toast.error('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const submitData = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        phone: formData.phone,
        role: formData.role,
        is_active: formData.is_active,
      };

      // Only include password for new employees
      if (!isEdit) {
        submitData.password = formData.password;
      }


      if (isEdit) {
        await employeesAPI.updateEmployee(id, submitData);
        toast.success('Employee updated successfully');
      } else {
        const response = await employeesAPI.createEmployee(submitData);
        if (response.data.email_sent) {
          toast.success('Employee created successfully! Welcome email sent to ' + formData.email);
        } else {
          toast.success('Employee created successfully! (Email notification could not be sent)');
        }
      }
      
      navigate('/employees');
    } catch (error) {
      console.error('Employee creation/update error:', error);
      
      let errorMessage = 'Failed to create employee';
      
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.response?.status === 403) {
        errorMessage = 'Permission denied. Only admins can create employees.';
      } else if (error.response?.status === 400) {
        errorMessage = 'Invalid data. Please check all required fields.';
      } else if (error.response?.status === 500) {
        errorMessage = 'Server error. Please try again.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate('/employees')}
          className="p-2 text-gray-400 hover:text-gray-600"
        >
          <ArrowLeftIcon className="h-6 w-6" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isEdit ? 'Edit Employee' : 'Add New Employee'}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {isEdit ? 'Update employee information' : 'Create a new employee account'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>
          </div>
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="form-label">First Name *</label>
                <div className="relative">
                  <UserIcon className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    required
                    className="form-input pl-10"
                    placeholder="Enter first name"
                  />
                </div>
              </div>
              
              <div>
                <label className="form-label">Last Name *</label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  required
                  className="form-input"
                  placeholder="Enter last name"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="form-label">Email *</label>
                <div className="relative">
                  <EnvelopeIcon className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="form-input pl-10"
                    placeholder="Enter email address"
                  />
                </div>
              </div>
              
              <div>
                <label className="form-label">Phone</label>
                <div className="relative">
                  <PhoneIcon className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="form-input pl-10"
                    placeholder="Enter phone number"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Role & Permissions</h3>
          </div>
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="form-label">Role *</label>
                <div className="relative">
                  <ShieldCheckIcon className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    required
                    className="form-input pl-10"
                  >
                    <option value="employee">Employee</option>
                    <option value="sales_agent">Sales Agent</option>
                    <option value="manager">Manager</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  {formData.role === 'admin' && 'Full system access and user management'}
                  {formData.role === 'manager' && 'Team management and reporting access'}
                  {formData.role === 'sales_agent' && 'Property and lead management access'}
                  {formData.role === 'employee' && 'Basic system access'}
                </p>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 text-sm text-gray-700">
                  Active Employee
                </label>
              </div>
            </div>

            {/* Tab Access Permissions */}
            <div className="mt-6">
              <label className="form-label">Tab Access Permissions</label>
              <p className="text-sm text-gray-500 mb-4">
                Select which sections of the CRM this employee can access
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {availableTabs.map((tab) => (
                  <div key={tab.id} className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <input
                      type="checkbox"
                      id={`permission-${tab.id}`}
                      checked={formData.permissions.includes(tab.id)}
                      onChange={(e) => handlePermissionChange(tab.id, e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
                    />
                    <div className="flex-1">
                      <label htmlFor={`permission-${tab.id}`} className="text-sm font-medium text-gray-900 cursor-pointer">
                        {tab.name}
                      </label>
                      <p className="text-xs text-gray-500 mt-1">
                        {tab.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              {formData.permissions.length === 0 && (
                <p className="text-sm text-amber-600 mt-2">
                  ⚠️ No tabs selected. Employee will have no access to the CRM.
                </p>
              )}
            </div>
          </div>
        </div>

        {!isEdit && (
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Account Setup</h3>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="form-label">Password *</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required={!isEdit}
                    minLength={6}
                    className="form-input"
                    placeholder="Enter password"
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Password must be at least 6 characters long
                  </p>
                </div>
                
                <div>
                  <label className="form-label">Confirm Password *</label>
                  <input
                    type="password"
                    name="confirm_password"
                    value={formData.confirm_password}
                    onChange={handleChange}
                    required={!isEdit}
                    className="form-input"
                    placeholder="Confirm password"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/employees')}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
          >
            {loading ? (
              <div className="spinner mr-2"></div>
            ) : null}
            {isEdit ? 'Update Employee' : 'Create Employee'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EmployeeForm;
