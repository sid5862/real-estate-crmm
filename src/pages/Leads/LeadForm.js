import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { leadsAPI, employeesAPI, propertiesAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import {
  ArrowLeftIcon,
  UserIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  CurrencyDollarIcon,
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const LeadForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const isEdit = Boolean(id);
  
  const [loading, setLoading] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [properties, setProperties] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    source: 'website',
    status: 'new',
    property_id: '',
    assigned_employee_id: user?.id || '',
    budget: '',
    notes: '',
  });

  useEffect(() => {
    fetchEmployees();
    fetchProperties();
    if (isEdit) {
      fetchLead();
    }
  }, [id]);

  const fetchEmployees = async () => {
    try {
      const response = await employeesAPI.getEmployees();
      setEmployees(response.data.employees || []);
    } catch (error) {
      console.error('Failed to fetch employees:', error);
      setEmployees([]);
    }
  };

  const fetchProperties = async () => {
    try {
      const response = await propertiesAPI.getProperties({ per_page: 100 });
      setProperties(response.data.properties || []);
    } catch (error) {
      console.error('Failed to fetch properties:', error);
      setProperties([]);
    }
  };

  const fetchLead = async () => {
    try {
      const response = await leadsAPI.getLead(id);
      const lead = response.data.lead;
      setFormData({
        ...lead,
        budget: lead.budget?.toString() || '',
      });
    } catch (error) {
      toast.error('Failed to fetch lead details');
      navigate('/leads');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const submitData = {
        ...formData,
        budget: formData.budget ? parseFloat(formData.budget) : null,
        property_id: formData.property_id || null,
        assigned_employee_id: formData.assigned_employee_id || null,
      };

      if (isEdit) {
        await leadsAPI.updateLead(id, submitData);
        toast.success('Lead updated successfully');
      } else {
        await leadsAPI.createLead(submitData);
        toast.success('Lead created successfully');
      }
      
      navigate('/leads');
    } catch (error) {
      toast.error(isEdit ? 'Failed to update lead' : 'Failed to create lead');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate('/leads')}
          className="p-2 text-gray-400 hover:text-gray-600"
        >
          <ArrowLeftIcon className="h-6 w-6" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isEdit ? 'Edit Lead' : 'Add New Lead'}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {isEdit ? 'Update lead information' : 'Create a new lead'}
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
                <label className="form-label">Full Name *</label>
                <div className="relative">
                  <UserIcon className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="form-input pl-10"
                    placeholder="Enter full name"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="form-label">Email</label>
                <div className="relative">
                  <EnvelopeIcon className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="form-input pl-10"
                    placeholder="Enter email address"
                  />
                </div>
              </div>
              
              <div>
                <label className="form-label">Phone *</label>
                <div className="relative">
                  <PhoneIcon className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="form-input pl-10"
                    placeholder="Enter phone number"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="form-label">Lead Source *</label>
                <select
                  name="source"
                  value={formData.source}
                  onChange={handleChange}
                  required
                  className="form-input"
                >
                  <option value="website">Website</option>
                  <option value="referral">Referral</option>
                  <option value="walk_in">Walk In</option>
                  <option value="advertisement">Advertisement</option>
                  <option value="social_media">Social Media</option>
                  <option value="cold_call">Cold Call</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Lead Details</h3>
          </div>
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="form-label">Current Stage</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="form-input"
                >
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="qualified">Qualified</option>
                  <option value="proposal">Proposal</option>
                  <option value="negotiation">Negotiation</option>
                  <option value="closed_won">Closed Won</option>
                  <option value="closed_lost">Closed Lost</option>
                </select>
              </div>
              
              <div>
                <label className="form-label">Assigned Employee</label>
                <select
                  name="assigned_employee_id"
                  value={formData.assigned_employee_id}
                  onChange={handleChange}
                  className="form-input"
                >
                  <option value="">Select employee</option>
                  {(employees || []).map(employee => (
                    <option key={employee.id} value={employee.id}>
                      {employee.name || `${employee.first_name} ${employee.last_name}`}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="form-label">Interested Property</label>
              <select
                name="property_id"
                value={formData.property_id}
                onChange={handleChange}
                className="form-input"
              >
                <option value="">Select property</option>
                {(properties || []).map(property => (
                  <option key={property.id} value={property.id}>
                    {property.title} - {property.location} (₹{property.price?.toLocaleString()})
                  </option>
                ))}
              </select>
            </div>


            <div>
              <label className="form-label">Budget</label>
              <div className="relative">
                <CurrencyDollarIcon className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
                <input
                  type="number"
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                  min="0"
                  className="form-input pl-10"
                  placeholder="Enter budget amount"
                />
              </div>
            </div>

            <div>
              <label className="form-label">Notes</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={4}
                className="form-input"
                placeholder="Enter any additional notes about this lead"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/leads')}
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
            {isEdit ? 'Update Lead' : 'Create Lead'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default LeadForm;
