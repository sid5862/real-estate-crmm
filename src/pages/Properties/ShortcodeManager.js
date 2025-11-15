import React, { useState, useEffect } from 'react';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  ClipboardDocumentIcon,
  CheckIcon,
  XMarkIcon,
  FunnelIcon,
  CogIcon,
  LinkIcon,
  MagnifyingGlassIcon,
  CalendarIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { api } from '../../services/api';

const ShortcodeManager = () => {
  const [shortcodes, setShortcodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewShortcode, setPreviewShortcode] = useState(null);
  const [editingShortcode, setEditingShortcode] = useState(null);
  const [copiedShortcode, setCopiedShortcode] = useState(null);
  
  // Search and filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // all, active, inactive
  const [sortBy, setSortBy] = useState('created_at'); // created_at, name, updated_at
  const [sortOrder, setSortOrder] = useState('desc'); // asc, desc
  
  // Bulk operations state
  const [selectedShortcodes, setSelectedShortcodes] = useState([]);
  const [showBulkActions, setShowBulkActions] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    is_active: true,
    filters: {
      status: 'all', // all, active, inactive
      property_type: '',
      min_price: '',
      max_price: '',
      location: '',
      bedrooms: '',
      bathrooms: '',
      limit: 10
    },
    display_options: {
      show_images: true,
      show_price: true,
      show_location: true,
      show_details: true,
      layout: 'grid', // grid, list
      items_per_row: 3
    }
  });

  useEffect(() => {
    fetchShortcodes();
  }, []);

  const fetchShortcodes = async () => {
    try {
      const response = await api.get('/shortcodes');
      setShortcodes(response.data.shortcodes || []);
    } catch (error) {
      console.error('Error fetching shortcodes:', error);
      toast.error('Failed to fetch shortcodes');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateShortcode = async () => {
    try {
      const response = await api.post('/shortcodes', formData);

      setShortcodes([response.data.shortcode, ...shortcodes]);
      setShowCreateModal(false);
      resetForm();
      toast.success('Shortcode created successfully!');
    } catch (error) {
      console.error('Error creating shortcode:', error);
      toast.error(error.response?.data?.error || 'Failed to create shortcode');
    }
  };

  const handleUpdateShortcode = async () => {
    try {
      const response = await api.put(`/shortcodes/${editingShortcode.id}`, formData);
      
      setShortcodes(shortcodes.map(sc => sc.id === editingShortcode.id ? response.data.shortcode : sc));
      setShowEditModal(false);
      setEditingShortcode(null);
      resetForm();
      toast.success('Shortcode updated successfully!');
    } catch (error) {
      console.error('Error updating shortcode:', error);
      toast.error(error.response?.data?.error || 'Failed to update shortcode');
    }
  };

  const handleDeleteShortcode = async (shortcode) => {
    if (!window.confirm(`Are you sure you want to delete "${shortcode.name}"?`)) {
      return;
    }

    try {
      await api.delete(`/shortcodes/${shortcode.id}`);
      setShortcodes(shortcodes.filter(sc => sc.id !== shortcode.id));
      toast.success('Shortcode deleted successfully!');
    } catch (error) {
      console.error('Error deleting shortcode:', error);
      toast.error(error.response?.data?.error || 'Failed to delete shortcode');
    }
  };

  const handleToggleActive = async (shortcode) => {
    try {
      const newActiveStatus = !shortcode.is_active;
      
      // Optimistic update for better UX
      setShortcodes(shortcodes.map(sc => 
        sc.id === shortcode.id ? { ...sc, is_active: newActiveStatus } : sc
      ));
      
      const response = await api.put(`/shortcodes/${shortcode.id}`, {
        is_active: newActiveStatus
      });
      
      // Update with server response
      setShortcodes(shortcodes.map(sc => 
        sc.id === shortcode.id ? response.data.shortcode : sc
      ));
      
      toast.success(
        `Shortcode ${newActiveStatus ? 'activated' : 'deactivated'} successfully!`,
        {
          icon: newActiveStatus ? '✅' : '⏸️',
          duration: 2000,
        }
      );
    } catch (error) {
      console.error('Error toggling shortcode status:', error);
      
      // Revert optimistic update on error
      setShortcodes(shortcodes.map(sc => 
        sc.id === shortcode.id ? { ...sc, is_active: !shortcode.is_active } : sc
      ));
      
      toast.error(error.response?.data?.error || 'Failed to update shortcode status');
    }
  };

  const copyToClipboard = async (text, shortcode) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedShortcode(shortcode);
      toast.success('Copied to clipboard!');
      setTimeout(() => setCopiedShortcode(null), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
      toast.error('Failed to copy to clipboard');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      is_active: true,
      filters: {
        status: 'all',
        property_type: '',
        min_price: '',
        max_price: '',
        location: '',
        bedrooms: '',
        bathrooms: '',
        limit: 10
      },
      display_options: {
        show_images: true,
        show_price: true,
        show_location: true,
        show_details: true,
        layout: 'grid',
        items_per_row: 3
      }
    });
  };

  const openEditModal = (shortcode) => {
    setEditingShortcode(shortcode);
    setFormData({
      name: shortcode.name,
      description: shortcode.description || '',
      is_active: shortcode.is_active !== false,
      filters: shortcode.filters || formData.filters,
      display_options: shortcode.display_options || formData.display_options
    });
    setShowEditModal(true);
  };

  const openCreateModal = () => {
    resetForm();
    setShowCreateModal(true);
  };

  const openPreviewModal = (shortcode) => {
    setPreviewShortcode(shortcode);
    setShowPreviewModal(true);
  };

  const closeModals = () => {
    setShowCreateModal(false);
    setShowEditModal(false);
    setShowPreviewModal(false);
    setPreviewShortcode(null);
    setEditingShortcode(null);
    resetForm();
  };

  // Bulk operations
  const handleSelectShortcode = (shortcodeId) => {
    setSelectedShortcodes(prev => 
      prev.includes(shortcodeId) 
        ? prev.filter(id => id !== shortcodeId)
        : [...prev, shortcodeId]
    );
  };

  const handleSelectAll = () => {
    if (selectedShortcodes.length === filteredAndSortedShortcodes.length) {
      setSelectedShortcodes([]);
    } else {
      setSelectedShortcodes(filteredAndSortedShortcodes.map(s => s.id));
    }
  };

  const handleBulkActivate = async () => {
    try {
      const promises = selectedShortcodes.map(id => 
        api.put(`/shortcodes/${id}`, { is_active: true })
      );
      await Promise.all(promises);
      
      setShortcodes(shortcodes.map(sc => 
        selectedShortcodes.includes(sc.id) ? { ...sc, is_active: true } : sc
      ));
      
      setSelectedShortcodes([]);
      toast.success(`${selectedShortcodes.length} shortcodes activated successfully!`);
    } catch (error) {
      toast.error('Failed to activate shortcodes');
    }
  };

  const handleBulkDeactivate = async () => {
    try {
      const promises = selectedShortcodes.map(id => 
        api.put(`/shortcodes/${id}`, { is_active: false })
      );
      await Promise.all(promises);
      
      setShortcodes(shortcodes.map(sc => 
        selectedShortcodes.includes(sc.id) ? { ...sc, is_active: false } : sc
      ));
      
      setSelectedShortcodes([]);
      toast.success(`${selectedShortcodes.length} shortcodes deactivated successfully!`);
    } catch (error) {
      toast.error('Failed to deactivate shortcodes');
    }
  };

  const handleBulkDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete ${selectedShortcodes.length} shortcodes?`)) {
      return;
    }

    try {
      const promises = selectedShortcodes.map(id => 
        api.delete(`/shortcodes/${id}`)
      );
      await Promise.all(promises);
      
      setShortcodes(shortcodes.filter(sc => !selectedShortcodes.includes(sc.id)));
      setSelectedShortcodes([]);
      toast.success(`${selectedShortcodes.length} shortcodes deleted successfully!`);
    } catch (error) {
      toast.error('Failed to delete shortcodes');
    }
  };

  // Filter and sort shortcodes
  const filteredAndSortedShortcodes = shortcodes
    .filter(shortcode => {
      // Search filter
      const matchesSearch = searchTerm === '' || 
        shortcode.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shortcode.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shortcode.shortcode.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Status filter
      const matchesStatus = statusFilter === 'all' || 
        (statusFilter === 'active' && shortcode.is_active) ||
        (statusFilter === 'inactive' && !shortcode.is_active);
      
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'updated_at':
          aValue = new Date(a.updated_at || a.created_at);
          bValue = new Date(b.updated_at || b.created_at);
          break;
        case 'created_at':
        default:
          aValue = new Date(a.created_at);
          bValue = new Date(b.created_at);
          break;
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Property Shortcodes</h1>
          <p className="text-gray-600 mt-2">Create embeddable property listings for external websites</p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <PlusIcon className="h-5 w-5" />
          Create Shortcode
        </button>
      </div>

      {/* Analytics Stats */}
      {shortcodes.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <LinkIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Total Shortcodes</p>
                <p className="text-2xl font-bold text-gray-900">{shortcodes.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckIcon className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Active</p>
                <p className="text-2xl font-bold text-gray-900">{shortcodes.filter(s => s.is_active).length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="p-2 bg-gray-100 rounded-lg">
                <XMarkIcon className="h-6 w-6 text-gray-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Inactive</p>
                <p className="text-2xl font-bold text-gray-900">{shortcodes.filter(s => !s.is_active).length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <ChartBarIcon className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Usage Rate</p>
                <p className="text-2xl font-bold text-gray-900">
                  {shortcodes.length > 0 ? Math.round((shortcodes.filter(s => s.is_active).length / shortcodes.length) * 100) : 0}%
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search shortcodes by name, description, or code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          {/* Status Filter */}
          <div className="lg:w-48">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive Only</option>
            </select>
          </div>
          
          {/* Sort By */}
          <div className="lg:w-48">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="created_at">Sort by Created</option>
              <option value="updated_at">Sort by Updated</option>
              <option value="name">Sort by Name</option>
            </select>
          </div>
          
          {/* Sort Order */}
          <div className="lg:w-32">
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="desc">Newest First</option>
              <option value="asc">Oldest First</option>
            </select>
          </div>
        </div>
        
        {/* Results Summary */}
        <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center gap-4">
            <div>
              Showing {filteredAndSortedShortcodes.length} of {shortcodes.length} shortcodes
              {searchTerm && (
                <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                  "{searchTerm}"
                </span>
              )}
              {statusFilter !== 'all' && (
                <span className="ml-2 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                  {statusFilter}
                </span>
              )}
            </div>
            {filteredAndSortedShortcodes.length > 0 && (
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedShortcodes.length === filteredAndSortedShortcodes.length && filteredAndSortedShortcodes.length > 0}
                  onChange={handleSelectAll}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="text-sm font-medium">Select All</span>
              </label>
            )}
          </div>
          <div className="flex items-center gap-2">
            <ChartBarIcon className="h-4 w-4" />
            <span>
              {shortcodes.filter(s => s.is_active).length} active, {shortcodes.filter(s => !s.is_active).length} inactive
            </span>
          </div>
        </div>
      </div>

      {/* Bulk Actions Bar */}
      {selectedShortcodes.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-blue-900">
                {selectedShortcodes.length} shortcode{selectedShortcodes.length > 1 ? 's' : ''} selected
              </span>
              <button
                onClick={() => setSelectedShortcodes([])}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Clear selection
              </button>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleBulkActivate}
                className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors"
              >
                <CheckIcon className="h-4 w-4" />
                Activate
              </button>
              <button
                onClick={handleBulkDeactivate}
                className="flex items-center gap-1 px-3 py-1.5 bg-gray-600 text-white rounded text-sm hover:bg-gray-700 transition-colors"
              >
                <XMarkIcon className="h-4 w-4" />
                Deactivate
              </button>
              <button
                onClick={handleBulkDelete}
                className="flex items-center gap-1 px-3 py-1.5 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors"
              >
                <TrashIcon className="h-4 w-4" />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Shortcodes List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAndSortedShortcodes.map((shortcode) => (
          <div key={shortcode.id} className={`bg-white rounded-lg shadow-md p-6 border border-gray-200 transition-all ${
            selectedShortcodes.includes(shortcode.id) ? 'ring-2 ring-blue-500 border-blue-300' : ''
          }`}>
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={selectedShortcodes.includes(shortcode.id)}
                  onChange={() => handleSelectShortcode(shortcode.id)}
                  className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <div>
                  <h3 className="font-bold text-lg text-gray-900">{shortcode.name}</h3>
                  <p className="text-sm text-gray-500">Code: {shortcode.shortcode}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <CalendarIcon className="h-3 w-3" />
                      <span>Created {new Date(shortcode.created_at).toLocaleDateString()}</span>
                    </div>
                    {shortcode.updated_at && shortcode.updated_at !== shortcode.created_at && (
                      <div className="flex items-center gap-1">
                        <PencilIcon className="h-3 w-3" />
                        <span>Updated {new Date(shortcode.updated_at).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${
                shortcode.is_active 
                  ? 'bg-green-100 text-green-800 border border-green-200' 
                  : 'bg-gray-100 text-gray-600 border border-gray-200'
              }`}>
                <div className={`w-2 h-2 rounded-full ${
                  shortcode.is_active ? 'bg-green-500' : 'bg-gray-400'
                }`}></div>
                {shortcode.is_active ? 'Active' : 'Inactive'}
              </div>
            </div>

            {shortcode.description && (
              <p className="text-gray-600 text-sm mb-4">{shortcode.description}</p>
            )}

            {/* Embed Code */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Embed Code:</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={`<iframe src="http://localhost:5000/api/embed/${shortcode.shortcode}/widget" width="100%" height="600"></iframe>`}
                  readOnly
                  className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm bg-gray-50"
                />
                <button
                  onClick={() => copyToClipboard(
                    `<iframe src="http://localhost:5000/api/embed/${shortcode.shortcode}/widget" width="100%" height="600"></iframe>`,
                    shortcode.shortcode
                  )}
                  className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded text-sm transition-colors"
                >
                  {copiedShortcode === shortcode.shortcode ? (
                    <CheckIcon className="h-4 w-4 text-green-600" />
                  ) : (
                    <ClipboardDocumentIcon className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              {/* Status Toggle */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-700">Status</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleActive(shortcode)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                        shortcode.is_active ? 'bg-green-500' : 'bg-gray-300'
                      }`}
                      title={shortcode.is_active ? 'Deactivate shortcode' : 'Activate shortcode'}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out ${
                          shortcode.is_active ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                    <span className={`text-sm font-medium ${
                      shortcode.is_active ? 'text-green-600' : 'text-gray-500'
                    }`}>
                      {shortcode.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
                <div className="text-xs text-gray-500">
                  {shortcode.is_active ? 'Publicly accessible' : 'Hidden from public'}
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => openPreviewModal(shortcode)}
                  className="flex items-center gap-1.5 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm hover:bg-blue-200 transition-colors font-medium"
                >
                  <EyeIcon className="h-4 w-4" />
                  Preview
                </button>
                <button
                  onClick={() => copyToClipboard(
                    `<iframe src="http://localhost:5000/api/embed/${shortcode.shortcode}/widget" width="100%" height="600"></iframe>`,
                    shortcode.shortcode
                  )}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm transition-colors font-medium ${
                    copiedShortcode === shortcode.shortcode
                      ? 'bg-green-100 text-green-700'
                      : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                  }`}
                >
                  {copiedShortcode === shortcode.shortcode ? (
                    <>
                      <CheckIcon className="h-4 w-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <ClipboardDocumentIcon className="h-4 w-4" />
                      Copy Code
                    </>
                  )}
                </button>
                <button
                  onClick={() => openEditModal(shortcode)}
                  className="flex items-center gap-1.5 px-3 py-2 bg-yellow-100 text-yellow-700 rounded-lg text-sm hover:bg-yellow-200 transition-colors font-medium"
                >
                  <PencilIcon className="h-4 w-4" />
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteShortcode(shortcode)}
                  className="flex items-center gap-1.5 px-3 py-2 bg-red-100 text-red-700 rounded-lg text-sm hover:bg-red-200 transition-colors font-medium"
                >
                  <TrashIcon className="h-4 w-4" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredAndSortedShortcodes.length === 0 && shortcodes.length === 0 && (
        <div className="text-center py-12">
          <LinkIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No shortcodes created yet</h3>
          <p className="text-gray-500 mb-4">Create your first shortcode to start embedding properties on external websites</p>
          <button
            onClick={openCreateModal}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Create Your First Shortcode
          </button>
        </div>
      )}

      {filteredAndSortedShortcodes.length === 0 && shortcodes.length > 0 && (
        <div className="text-center py-12">
          <MagnifyingGlassIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No shortcodes found</h3>
          <p className="text-gray-500 mb-4">
            No shortcodes match your current search and filter criteria. Try adjusting your search terms or filters.
          </p>
          <div className="flex justify-center gap-3">
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
              }}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Clear Filters
            </button>
            <button
              onClick={openCreateModal}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create New Shortcode
            </button>
          </div>
        </div>
      )}

      {/* Create/Edit Modal */}
      {(showCreateModal || showEditModal) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  {showCreateModal ? 'Create New Shortcode' : 'Edit Shortcode'}
                </h2>
                <button
                  onClick={closeModals}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Basic Info */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g., Featured Properties"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Optional description for this shortcode"
                      />
                    </div>
                    <div>
                      <label className="flex items-center justify-between">
                        <div>
                          <span className="text-sm font-medium text-gray-700">Shortcode Status</span>
                          <p className="text-xs text-gray-500">Make shortcode publicly accessible</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, is_active: !prev.is_active }))}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                            formData.is_active ? 'bg-green-500' : 'bg-gray-300'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out ${
                              formData.is_active ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Filters */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                    <FunnelIcon className="h-5 w-5" />
                    Filters
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                      <select
                        value={formData.filters.status}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          filters: { ...prev.filters, status: e.target.value }
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="all">All Properties</option>
                        <option value="active">Active Only</option>
                        <option value="inactive">Inactive Only</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Property Type</label>
                      <select
                        value={formData.filters.property_type}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          filters: { ...prev.filters, property_type: e.target.value }
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">All Types</option>
                        <option value="apartment">Apartment</option>
                        <option value="house">House</option>
                        <option value="villa">Villa</option>
                        <option value="commercial">Commercial</option>
                        <option value="land">Land</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Min Price (₹)</label>
                      <input
                        type="number"
                        value={formData.filters.min_price}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          filters: { ...prev.filters, min_price: e.target.value }
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Max Price (₹)</label>
                      <input
                        type="number"
                        value={formData.filters.max_price}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          filters: { ...prev.filters, max_price: e.target.value }
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="No limit"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                      <input
                        type="text"
                        value={formData.filters.location}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          filters: { ...prev.filters, location: e.target.value }
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g., Mumbai"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Max Results</label>
                      <input
                        type="number"
                        value={formData.filters.limit}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          filters: { ...prev.filters, limit: parseInt(e.target.value) || 10 }
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        min="1"
                        max="50"
                      />
                    </div>
                  </div>
                </div>

                {/* Display Options */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                    <CogIcon className="h-5 w-5" />
                    Display Options
                  </h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.display_options.show_images}
                          onChange={(e) => setFormData(prev => ({ 
                            ...prev, 
                            display_options: { ...prev.display_options, show_images: e.target.checked }
                          }))}
                          className="mr-2"
                        />
                        Show Images
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.display_options.show_price}
                          onChange={(e) => setFormData(prev => ({ 
                            ...prev, 
                            display_options: { ...prev.display_options, show_price: e.target.checked }
                          }))}
                          className="mr-2"
                        />
                        Show Price
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.display_options.show_location}
                          onChange={(e) => setFormData(prev => ({ 
                            ...prev, 
                            display_options: { ...prev.display_options, show_location: e.target.checked }
                          }))}
                          className="mr-2"
                        />
                        Show Location
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.display_options.show_details}
                          onChange={(e) => setFormData(prev => ({ 
                            ...prev, 
                            display_options: { ...prev.display_options, show_details: e.target.checked }
                          }))}
                          className="mr-2"
                        />
                        Show Details
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-8">
                <button
                  onClick={closeModals}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={showCreateModal ? handleCreateShortcode : handleUpdateShortcode}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {showCreateModal ? 'Create Shortcode' : 'Update Shortcode'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {showPreviewModal && previewShortcode && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Preview: {previewShortcode.name}</h2>
                  <p className="text-sm text-gray-500">Shortcode: {previewShortcode.shortcode}</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => copyToClipboard(
                      `<iframe src="http://localhost:5000/api/embed/${previewShortcode.shortcode}/widget" width="100%" height="600"></iframe>`,
                      previewShortcode.shortcode
                    )}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    {copiedShortcode === previewShortcode.shortcode ? (
                      <>
                        <CheckIcon className="h-4 w-4" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <ClipboardDocumentIcon className="h-4 w-4" />
                        Copy Embed Code
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => window.open(`http://localhost:5000/api/embed/${previewShortcode.shortcode}/widget`, '_blank')}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <EyeIcon className="h-4 w-4" />
                    Open in New Tab
                  </button>
                  <button
                    onClick={closeModals}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>
              </div>
            </div>
            
            <div className="h-[calc(90vh-200px)]">
              <iframe
                src={`http://localhost:5000/api/embed/${previewShortcode.shortcode}/widget`}
                className="w-full h-full border-0"
                title={`Preview of ${previewShortcode.name}`}
              />
            </div>
            
            {/* Embed Code Section */}
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-700">Embed Code</h3>
                <button
                  onClick={() => copyToClipboard(
                    `<iframe src="http://localhost:5000/api/embed/${previewShortcode.shortcode}/widget" width="100%" height="600"></iframe>`,
                    previewShortcode.shortcode
                  )}
                  className="flex items-center gap-1 px-3 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700 transition-colors"
                >
                  {copiedShortcode === previewShortcode.shortcode ? (
                    <>
                      <CheckIcon className="h-3 w-3" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <ClipboardDocumentIcon className="h-3 w-3" />
                      Copy
                    </>
                  )}
                </button>
              </div>
              <div className="bg-white border border-gray-300 rounded p-3">
                <code className="text-xs text-gray-800 break-all">
                  {`<iframe src="http://localhost:5000/api/embed/${previewShortcode.shortcode}/widget" width="100%" height="600"></iframe>`}
                </code>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShortcodeManager;
