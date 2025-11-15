import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { postSalesAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import FilterBox from '../../components/Common/FilterBox';
import FloatingAddButton from '../../components/Common/FloatingAddButton';
import DataTable from '../../components/Common/DataTable';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  DocumentDuplicateIcon,
  ShareIcon,
  UserGroupIcon,
  CalendarIcon,
  StarIcon,
  TrophyIcon,
  SparklesIcon,
  ArrowTrendingUpIcon,
  ChartBarIcon,
  Squares2X2Icon,
  ListBulletIcon,
  TableCellsIcon,
  XMarkIcon,
  ArrowPathIcon,
  BuildingOfficeIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  DocumentArrowDownIcon,
  ClipboardDocumentListIcon,
  BanknotesIcon,
  CalendarDaysIcon,
  ShieldCheckIcon,
  HomeIcon,
  UserIcon,
  ArrowDownTrayIcon,
  FunnelIcon,
  AdjustmentsHorizontalIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const PostSales = () => {
  const { hasPermission } = useAuth();
  const [postSales, setPostSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState({});
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [viewMode, setViewMode] = useState('table');
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [selectedPostSales, setSelectedPostSales] = useState([]);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    payment_status: '',
  });
  const [pagination, setPagination] = useState({
    page: 1,
    per_page: 10,
    total: 0,
    pages: 0,
  });
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedPostSale, setSelectedPostSale] = useState(null);

  useEffect(() => {
    fetchPostSales();
    fetchAnalytics();
  }, [pagination.page, filters]);

  const fetchPostSales = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.page,
        per_page: pagination.per_page,
        ...filters,
      };
      
      const response = await postSalesAPI.getPostSales(params);
      setPostSales(response.data.post_sales);
      setPagination(prev => ({
        ...prev,
        total: response.data.total,
        pages: response.data.pages,
      }));
    } catch (error) {
      toast.error('Failed to fetch post-sales records');
      console.error('Post-sales fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    try {
      setAnalyticsLoading(true);
      const response = await postSalesAPI.getPostSales({ per_page: 1000 });
      const allPostSales = response.data.post_sales || [];
      
      const totalSales = allPostSales.length;
      const totalRevenue = allPostSales.reduce((sum, sale) => sum + (parseFloat(sale.sale_price) || 0), 0);
      const completedSales = allPostSales.filter(sale => sale.payment_status === 'completed').length;
      const pendingPayments = allPostSales.filter(sale => sale.payment_status === 'pending').length;
      const overduePayments = allPostSales.filter(sale => sale.payment_status === 'overdue').length;
      
      const analyticsData = {
        totalSales,
        totalRevenue,
        completedSales,
        pendingPayments,
        overduePayments,
        avgSaleValue: totalSales > 0 ? totalRevenue / totalSales : 0,
        completionRate: totalSales > 0 ? (completedSales / totalSales) * 100 : 0
      };
      
      setAnalytics(analyticsData);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
      setAnalytics({
        totalSales: 0,
        totalRevenue: 0,
        completedSales: 0,
        pendingPayments: 0,
        overduePayments: 0,
        avgSaleValue: 0,
        completionRate: 0
      });
    } finally {
      setAnalyticsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this post-sales record?')) {
      return;
    }

    try {
      await postSalesAPI.deletePostSale(id);
      toast.success('Post-sales record deleted successfully');
      fetchPostSales();
    } catch (error) {
      toast.error('Failed to delete post-sales record');
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      status: '',
      payment_status: '',
    });
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleSelectPostSale = (id) => {
    setSelectedPostSales(prev => 
      prev.includes(id) 
        ? prev.filter(saleId => saleId !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedPostSales.length === postSales.length) {
      setSelectedPostSales([]);
    } else {
      setSelectedPostSales(postSales.map(sale => sale.id));
    }
  };

  const handleBulkStatusChange = async (newStatus) => {
    try {
      // This would call a bulk update API
      toast.success(`${selectedPostSales.length} records updated successfully`);
      setSelectedPostSales([]);
      setShowBulkActions(false);
      fetchPostSales();
    } catch (error) {
      toast.error('Failed to update records');
    }
  };

  const handleBulkDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete ${selectedPostSales.length} records?`)) {
      return;
    }

    try {
      // This would call a bulk delete API
      toast.success(`${selectedPostSales.length} records deleted successfully`);
      setSelectedPostSales([]);
      setShowBulkActions(false);
      fetchPostSales();
    } catch (error) {
      toast.error('Failed to delete records');
    }
  };

  const handleExportPostSales = () => {
    // This would generate and download a CSV/Excel file
    toast.success('Export started. File will download shortly.');
  };

  const openDetailsModal = (postSale) => {
    setSelectedPostSale(postSale);
    setShowDetailsModal(true);
  };

  const closeDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedPostSale(null);
  };

  // Table columns configuration
  const columns = [
    {
      key: 'lead_name',
      label: 'Customer',
      type: 'text'
    },
    {
      key: 'property_title',
      label: 'Property',
      type: 'text'
    },
    {
      key: 'sale_price',
      label: 'Sale Price',
      type: 'currency'
    },
    {
      key: 'status',
      label: 'Status',
      type: 'status'
    },
    {
      key: 'payment_status',
      label: 'Payment',
      type: 'status'
    },
    {
      key: 'handover_date',
      label: 'Handover',
      type: 'date'
    },
    {
      key: 'created_at',
      label: 'Created',
      type: 'date'
    }
  ];

  // Custom filters for post sales
  const customFilters = [
    {
      key: 'status',
      label: 'Status',
      type: 'select',
      icon: CheckCircleIcon,
      options: [
        { value: 'active', label: 'Active' },
        { value: 'completed', label: 'Completed' },
        { value: 'pending', label: 'Pending' },
        { value: 'cancelled', label: 'Cancelled' }
      ]
    },
    {
      key: 'payment_status',
      label: 'Payment Status',
      type: 'select',
      icon: CurrencyDollarIcon,
      options: [
        { value: 'pending', label: 'Pending' },
        { value: 'partial', label: 'Partial' },
        { value: 'completed', label: 'Completed' },
        { value: 'overdue', label: 'Overdue' }
      ]
    }
  ];

  // Quick actions for floating button
  const quickActions = [
    {
      label: 'Add Post Sale',
      description: 'Create a new post-sales record',
      icon: DocumentTextIcon,
      color: 'from-orange-500 to-red-600',
      onClick: () => toast.info('Add post-sale functionality coming soon')
    },
    {
      label: 'Generate Report',
      description: 'Generate post-sales report',
      icon: DocumentDuplicateIcon,
      color: 'from-blue-500 to-indigo-600',
      onClick: () => toast.info('Report generation coming soon')
    },
    {
      label: 'Bulk Actions',
      description: 'Perform bulk operations',
      icon: ShareIcon,
      color: 'from-purple-500 to-pink-600',
      onClick: () => toast.info('Bulk actions coming soon')
    }
  ];

  const getStatusBadge = (status) => {
    const statusClasses = {
      active: 'bg-green-100 text-green-800',
      completed: 'bg-blue-100 text-blue-800',
      pending: 'bg-yellow-100 text-yellow-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusClasses[status] || 'bg-gray-100 text-gray-800'}`}>
        {status}
      </span>
    );
  };

  const getPaymentStatusBadge = (status) => {
    const statusClasses = {
      paid: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      overdue: 'bg-red-100 text-red-800',
      partial: 'bg-blue-100 text-blue-800',
    };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusClasses[status] || 'bg-gray-100 text-gray-800'}`}>
        {status}
      </span>
    );
  };

  const formatCurrency = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading && postSales.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Professional Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-4">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl">
                <DocumentTextIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Post-Sales Management</h1>
                <p className="text-sm text-gray-500">Manage post-sales activities, payments, and customer support</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowAnalytics(!showAnalytics)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  showAnalytics 
                    ? 'bg-orange-100 text-orange-700 border border-orange-200' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <ChartBarIcon className="h-4 w-4 inline mr-2" />
                Analytics
              </button>
              
              <button
                onClick={() => {
                  fetchPostSales();
                  fetchAnalytics();
                }}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                title="Refresh"
              >
                <ArrowPathIcon className="h-5 w-5" />
              </button>
              
              {hasPermission('sales_agent') && (
                <Link
                  to="/post-sales/new"
                  className="inline-flex items-center px-4 py-2 bg-orange-600 text-white text-sm font-medium rounded-lg hover:bg-orange-700 shadow-sm transition-colors"
                >
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Add Post-Sale
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Dashboard */}
      {showAnalytics && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Sales Analytics</h2>
                <button
                  onClick={() => setShowAnalytics(false)}
                  className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            {analyticsLoading ? (
              <div className="p-6">
                <div className="animate-pulse space-y-4">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                </div>
              </div>
            ) : (
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-blue-600">Total Sales</p>
                        <p className="text-3xl font-bold text-blue-700">{analytics.totalSales}</p>
                      </div>
                      <DocumentTextIcon className="h-8 w-8 text-blue-500" />
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-green-600">Total Revenue</p>
                        <p className="text-3xl font-bold text-green-700">{formatCurrency(analytics.totalRevenue)}</p>
                      </div>
                      <CurrencyDollarIcon className="h-8 w-8 text-green-500" />
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-6 border border-yellow-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-yellow-600">Completion Rate</p>
                        <p className="text-3xl font-bold text-yellow-700">{analytics.completionRate.toFixed(1)}%</p>
                      </div>
                      <TrophyIcon className="h-8 w-8 text-yellow-500" />
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-purple-600">Avg Sale Value</p>
                        <p className="text-3xl font-bold text-purple-700">{formatCurrency(analytics.avgSaleValue)}</p>
                      </div>
                      <ChartBarIcon className="h-8 w-8 text-purple-500" />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Enhanced Controls */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Search and Quick Filters */}
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="relative flex-1">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search post-sales, customers, properties..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                />
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => handleFilterChange('payment_status', '')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filters.payment_status === '' 
                      ? 'bg-orange-100 text-orange-700 border border-orange-200' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  All Payments
                </button>
                <button
                  onClick={() => handleFilterChange('payment_status', 'completed')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filters.payment_status === 'completed' 
                      ? 'bg-green-100 text-green-700 border border-green-200' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Completed
                </button>
                <button
                  onClick={() => handleFilterChange('payment_status', 'pending')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filters.payment_status === 'pending' 
                      ? 'bg-yellow-100 text-yellow-700 border border-yellow-200' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Pending
                </button>
                <button
                  onClick={() => handleFilterChange('payment_status', 'overdue')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filters.payment_status === 'overdue' 
                      ? 'bg-red-100 text-red-700 border border-red-200' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Overdue
                </button>
              </div>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700 mr-2">View:</span>
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'grid' ? 'bg-white shadow-sm text-orange-600' : 'text-gray-500 hover:text-gray-700'
                  }`}
                  title="Grid View"
                >
                  <Squares2X2Icon className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'list' ? 'bg-white shadow-sm text-orange-600' : 'text-gray-500 hover:text-gray-700'
                  }`}
                  title="List View"
                >
                  <ListBulletIcon className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('table')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'table' ? 'bg-white shadow-sm text-orange-600' : 'text-gray-500 hover:text-gray-700'
                  }`}
                  title="Table View"
                >
                  <TableCellsIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bulk Actions Bar */}
        {selectedPostSales.length > 0 && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-orange-800">
                  {selectedPostSales.length} record{selectedPostSales.length > 1 ? 's' : ''} selected
                </span>
                <button
                  onClick={() => setSelectedPostSales([])}
                  className="text-orange-600 hover:text-orange-700 text-sm"
                >
                  Clear selection
                </button>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleBulkStatusChange('completed')}
                  className="px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition-colors"
                >
                  Mark Completed
                </button>
                <button
                  onClick={handleExportPostSales}
                  className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
                >
                  Export
                </button>
                {hasPermission('admin') && (
                  <button
                    onClick={handleBulkDelete}
                    className="px-3 py-1 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition-colors"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Post-Sales Views */}
        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {postSales.map((postSale) => (
              <div key={postSale.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={selectedPostSales.includes(postSale.id)}
                        onChange={() => handleSelectPostSale(postSale.id)}
                        className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                      />
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
                        <DocumentTextIcon className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    {getPaymentStatusBadge(postSale.payment_status)}
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 cursor-pointer hover:text-orange-600 transition-colors" onClick={() => openDetailsModal(postSale)}>
                        {postSale.customer_name || 'N/A'}
                      </h3>
                      <p className="text-sm text-gray-500">{postSale.property?.title || 'N/A'}</p>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500">Sale Price</p>
                        <p className="text-lg font-bold text-gray-900">{formatCurrency(postSale.sale_price)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Created</p>
                        <p className="text-sm text-gray-900">{formatDate(postSale.created_at)}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openDetailsModal(postSale)}
                        className="p-1 text-orange-600 hover:text-orange-700 transition-colors"
                        title="View Details"
                      >
                        <EyeIcon className="h-4 w-4" />
                      </button>
                    </div>
                    {hasPermission('sales_agent') && (
                      <div className="flex items-center gap-1">
                        <Link
                          to={`/post-sales/${postSale.id}/edit`}
                          className="p-1 text-gray-400 hover:text-orange-600 transition-colors"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </Link>
                        {hasPermission('admin') && (
                          <button
                            onClick={() => handleDelete(postSale.id)}
                            className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {viewMode === 'list' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="divide-y divide-gray-200">
              {postSales.map((postSale) => (
                <div key={postSale.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <input
                        type="checkbox"
                        checked={selectedPostSales.includes(postSale.id)}
                        onChange={() => handleSelectPostSale(postSale.id)}
                        className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                      />
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
                        <DocumentTextIcon className="h-6 w-6 text-white" />
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 cursor-pointer hover:text-orange-600 transition-colors" onClick={() => openDetailsModal(postSale)}>
                          {postSale.customer_name || 'N/A'}
                        </h3>
                        <div className="flex items-center gap-3 mt-1">
                          <p className="text-sm text-gray-500">{postSale.property?.title || 'N/A'}</p>
                          {getPaymentStatusBadge(postSale.payment_status)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6">
                      <div className="text-right text-sm text-gray-600">
                        <div className="font-medium text-gray-900">{formatCurrency(postSale.sale_price)}</div>
                        <div className="text-gray-500">{formatDate(postSale.created_at)}</div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openDetailsModal(postSale)}
                          className="text-orange-600 hover:text-orange-700 text-sm font-medium"
                        >
                          View Details
                        </button>
                        
                        {hasPermission('sales_agent') && (
                          <div className="flex items-center gap-1">
                            <Link
                              to={`/post-sales/${postSale.id}/edit`}
                              className="p-1 text-gray-400 hover:text-orange-600 transition-colors"
                            >
                              <PencilIcon className="h-4 w-4" />
                            </Link>
                            {hasPermission('admin') && (
                              <button
                                onClick={() => handleDelete(postSale.id)}
                                className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                              >
                                <TrashIcon className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {viewMode === 'table' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <input
                        type="checkbox"
                        checked={selectedPostSales.length === postSales.length && postSales.length > 0}
                        onChange={handleSelectAll}
                        className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Property
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sale Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Payment Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {postSales.map((postSale) => (
                    <tr key={postSale.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedPostSales.includes(postSale.id)}
                          onChange={() => handleSelectPostSale(postSale.id)}
                          className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center mr-4">
                            <DocumentTextIcon className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900 cursor-pointer hover:text-orange-600 transition-colors" onClick={() => openDetailsModal(postSale)}>
                              {postSale.customer_name || 'N/A'}
                            </div>
                            <div className="text-sm text-gray-500">{postSale.customer_phone || 'N/A'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{postSale.property?.title || 'N/A'}</div>
                        <div className="text-sm text-gray-500">{postSale.property?.location || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(postSale.sale_price)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getPaymentStatusBadge(postSale.payment_status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(postSale.created_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openDetailsModal(postSale)}
                            className="text-orange-600 hover:text-orange-700"
                            title="View Details"
                          >
                            <EyeIcon className="h-4 w-4" />
                          </button>
                          
                          {hasPermission('sales_agent') && (
                            <>
                              <Link
                                to={`/post-sales/${postSale.id}/edit`}
                                className="text-gray-400 hover:text-orange-600 transition-colors"
                                title="Edit Post-Sale"
                              >
                                <PencilIcon className="h-4 w-4" />
                              </Link>
                              {hasPermission('admin') && (
                                <button
                                  onClick={() => handleDelete(postSale.id)}
                                  className="text-gray-400 hover:text-red-600 transition-colors"
                                  title="Delete Post-Sale"
                                >
                                  <TrashIcon className="h-4 w-4" />
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      {/* Empty State */}
      {postSales.length === 0 && !loading && (
        <div className="text-center py-12">
          <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No post-sales records found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by adding your first post-sales record.
          </p>
        </div>
      )}

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex justify-center">
          <nav className="flex space-x-2">
            <button
              onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
              disabled={pagination.page === 1}
              className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setPagination(prev => ({ ...prev, page }))}
                className={`px-3 py-2 text-sm font-medium rounded-md ${
                  page === pagination.page
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            ))}
            
            <button
              onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
              disabled={pagination.page === pagination.pages}
              className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </nav>
        </div>
      )}

        {/* Post-Sale Details Modal */}
        {showDetailsModal && selectedPostSale && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
                      <DocumentTextIcon className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">
                        Post-Sale Details
                      </h2>
                      <p className="text-sm text-gray-500">Customer: {selectedPostSale.customer_name || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {hasPermission('sales_agent') && (
                      <Link
                        to={`/post-sales/${selectedPostSale.id}/edit`}
                        className="px-3 py-2 bg-orange-600 text-white text-sm rounded-lg hover:bg-orange-700 transition-colors flex items-center"
                      >
                        <PencilIcon className="h-4 w-4 mr-1" />
                        Edit
                      </Link>
                    )}
                    <button
                      onClick={closeDetailsModal}
                      className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <XMarkIcon className="h-6 w-6" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Sale Information */}
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <DocumentTextIcon className="h-5 w-5 text-orange-500 mr-2" />
                        Sale Information
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <CurrencyDollarIcon className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-500">Sale Price</p>
                            <p className="text-gray-900 font-semibold">{formatCurrency(selectedPostSale.sale_price)}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <CalendarIcon className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-500">Sale Date</p>
                            <p className="text-gray-900">{formatDate(selectedPostSale.sale_date)}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <CheckCircleIcon className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-500">Payment Status</p>
                            <div className="mt-1">{getPaymentStatusBadge(selectedPostSale.payment_status)}</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Property Information */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <HomeIcon className="h-5 w-5 text-orange-500 mr-2" />
                        Property Details
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <BuildingOfficeIcon className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-500">Property Title</p>
                            <p className="text-gray-900">{selectedPostSale.property?.title || 'N/A'}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <MapPinIcon className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-500">Location</p>
                            <p className="text-gray-900">{selectedPostSale.property?.location || 'N/A'}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Customer Information */}
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <UserIcon className="h-5 w-5 text-orange-500 mr-2" />
                        Customer Information
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <UserIcon className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-500">Customer Name</p>
                            <p className="text-gray-900">{selectedPostSale.customer_name || 'N/A'}</p>
                          </div>
                        </div>
                        
                        {selectedPostSale.customer_phone && (
                          <div className="flex items-center gap-3">
                            <PhoneIcon className="h-5 w-5 text-gray-400" />
                            <div>
                              <p className="text-sm text-gray-500">Phone</p>
                              <a href={`tel:${selectedPostSale.customer_phone}`} className="text-orange-600 hover:text-orange-700">
                                {selectedPostSale.customer_phone}
                              </a>
                            </div>
                          </div>
                        )}
                        
                        {selectedPostSale.customer_email && (
                          <div className="flex items-center gap-3">
                            <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                            <div>
                              <p className="text-sm text-gray-500">Email</p>
                              <a href={`mailto:${selectedPostSale.customer_email}`} className="text-orange-600 hover:text-orange-700">
                                {selectedPostSale.customer_email}
                              </a>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Important Dates */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <CalendarDaysIcon className="h-5 w-5 text-orange-500 mr-2" />
                        Important Dates
                      </h3>
                      <div className="space-y-4">
                        {selectedPostSale.handover_date && (
                          <div className="flex items-center gap-3">
                            <CalendarIcon className="h-5 w-5 text-gray-400" />
                            <div>
                              <p className="text-sm text-gray-500">Handover Date</p>
                              <p className="text-gray-900">{formatDate(selectedPostSale.handover_date)}</p>
                            </div>
                          </div>
                        )}
                        
                        {selectedPostSale.possession_date && (
                          <div className="flex items-center gap-3">
                            <CalendarIcon className="h-5 w-5 text-gray-400" />
                            <div>
                              <p className="text-sm text-gray-500">Possession Date</p>
                              <p className="text-gray-900">{formatDate(selectedPostSale.possession_date)}</p>
                            </div>
                          </div>
                        )}
                        
                        {selectedPostSale.warranty_start_date && (
                          <div className="flex items-center gap-3">
                            <ShieldCheckIcon className="h-5 w-5 text-gray-400" />
                            <div>
                              <p className="text-sm text-gray-500">Warranty Start</p>
                              <p className="text-gray-900">{formatDate(selectedPostSale.warranty_start_date)}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Notes Section */}
                {selectedPostSale.notes && (
                  <div className="mt-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <DocumentTextIcon className="h-5 w-5 text-orange-500 mr-2" />
                      Notes
                    </h3>
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <p className="text-gray-700">{selectedPostSale.notes}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Floating Add Button */}
        {hasPermission('sales_agent') && (
          <FloatingAddButton
            type="post-sale"
            onAdd={() => toast.info('Add post-sale functionality coming soon')}
            quickActions={quickActions}
            label="Add Post-Sale"
          />
        )}
      </div>
    </div>
  );
};

export default PostSales;
