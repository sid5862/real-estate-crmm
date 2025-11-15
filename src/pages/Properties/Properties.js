import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { propertiesAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import FilterBox from '../../components/Common/FilterBox';
import FloatingAddButton from '../../components/Common/FloatingAddButton';
import DataTable from '../../components/Common/DataTable';
import ShortcodeManager from './ShortcodeManager';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  BuildingOfficeIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  HomeIcon,
  DocumentDuplicateIcon,
  ShareIcon,
  LinkIcon,
  Squares2X2Icon,
  ListBulletIcon,
  TableCellsIcon,
  ChartBarIcon,
  HeartIcon,
  ScaleIcon,
  CheckIcon,
  XMarkIcon,
  StarIcon,
  ClockIcon,
  UserGroupIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  VideoCameraIcon,
  PhotoIcon,
  MapIcon,
  GlobeAltIcon,
  QrCodeIcon,
  DocumentTextIcon,
  CalendarIcon,
  PhoneIcon,
  EnvelopeIcon,
  ChatBubbleLeftRightIcon,
  PresentationChartLineIcon,
  ArrowPathIcon,
  CloudArrowUpIcon,
  ArchiveBoxIcon,
  TagIcon,
  FlagIcon,
  BookmarkIcon,
  ClipboardDocumentListIcon,
  CalculatorIcon,
  BanknotesIcon,
  HomeModernIcon,
  BuildingStorefrontIcon,
  BuildingLibraryIcon,
  BuildingOffice2Icon,
  SparklesIcon,
  LightBulbIcon,
  TrophyIcon,
  FireIcon,
  BoltIcon,
  RocketLaunchIcon,
  CpuChipIcon,
  WifiIcon,
  SignalIcon,
  BatteryIcon,
  ShieldCheckIcon,
  LockClosedIcon,
  KeyIcon,
  UserCircleIcon,
  UsersIcon,
  ShoppingCartIcon,
  CreditCardIcon,
  ReceiptPercentIcon,
  ChartPieIcon,
  PresentationChartBarIcon,
  TableCellsIcon as TableCellsIconOutline,
  ClipboardDocumentListIcon as ClipboardDocumentListIconOutline,
  DocumentDuplicateIcon as DocumentDuplicateIconOutline,
  PrinterIcon,
  MegaphoneIcon,
  SpeakerXMarkIcon,
  VolumeUpIcon,
  MicrophoneIcon,
  CameraIcon,
  VideoCameraSlashIcon,
  EyeSlashIcon,
  EyeDropperIcon,
  PaintBrushIcon,
  SwatchIcon,
  ScissorsIcon,
  PencilSquareIcon,
  EraserIcon,
  HighlighterIcon,
  MagnifyingGlassPlusIcon,
  MagnifyingGlassMinusIcon,
  ZoomInIcon,
  ZoomOutIcon,
  ArrowsPointingOutIcon,
  ArrowsPointingInIcon,
  ArrowsRightLeftIcon,
  ArrowsUpDownIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ArrowLeftIcon,
  ArrowUturnLeftIcon,
  ArrowUturnRightIcon,
  ArrowPathIcon as ArrowPathIconOutline,
  ArrowPathRoundedSquareIcon,
  RefreshIcon,
  ArrowClockwiseIcon,
  ArrowCounterClockwiseIcon,
  ArrowTopRightOnSquareIcon,
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  DocumentArrowDownIcon,
  DocumentArrowUpIcon,
  DocumentPlusIcon,
  DocumentMinusIcon,
  DocumentCheckIcon,
  DocumentXMarkIcon,
  FolderIcon,
  FolderOpenIcon,
  FolderPlusIcon,
  FolderMinusIcon,
  ArchiveBoxXMarkIcon,
  TrashIcon as TrashIconOutline,
  XMarkIcon as XMarkIconOutline,
  CheckIcon as CheckIconOutline,
  PlusCircleIcon,
  MinusCircleIcon,
  ExclamationCircleIcon,
  QuestionMarkCircleIcon,
  MinusIcon,
  UserIcon,
  BellIcon,
  CalendarDaysIcon,
  ClipboardDocumentCheckIcon,
  ComputerDesktopIcon,
  DevicePhoneMobileIcon,
  AcademicCapIcon,
  BriefcaseIcon,
  HomeModernIcon as HomeModernIconOutline,
  MapIcon as MapIconOutline,
  CurrencyRupeeIcon,
  ChartBarSquareIcon,
  PresentationChartBarIcon as PresentationChartBarIconOutline,
  ArrowTrendingUpIcon as ArrowTrendingUpIconOutline,
  ArrowTrendingDownIcon as ArrowTrendingDownIconOutline,
  MinusIcon as MinusIconOutline,
  WrenchScrewdriverIcon
} from '@heroicons/react/24/outline';
import {
  HeartIcon as HeartSolidIcon,
  StarIcon as StarSolidIcon
} from '@heroicons/react/24/solid';
import toast from 'react-hot-toast';

const Properties = () => {
  const { hasPermission } = useAuth();
  const [activeTab, setActiveTab] = useState('list');
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); // grid, list, table
  const [selectedProperties, setSelectedProperties] = useState([]);
  const [favorites, setFavorites] = useState(new Set());
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [compareProperties, setCompareProperties] = useState([]);
  const [showComparison, setShowComparison] = useState(false);
  const [showVirtualTour, setShowVirtualTour] = useState(false);
  const [selectedPropertyForTour, setSelectedPropertyForTour] = useState(null);
  const [showMarketAnalysis, setShowMarketAnalysis] = useState(false);
  const [showPropertyInsights, setShowPropertyInsights] = useState(false);
  const [showDocumentManager, setShowDocumentManager] = useState(false);
  const [showQRGenerator, setShowQRGenerator] = useState(false);
  const [showPropertyCalculator, setShowPropertyCalculator] = useState(false);
  const [showNeighborhoodInfo, setShowNeighborhoodInfo] = useState(false);
  const [showPropertyHistory, setShowPropertyHistory] = useState(false);
  const [showMaintenanceTracker, setShowMaintenanceTracker] = useState(false);
  const [showPropertyValuation, setShowPropertyValuation] = useState(false);
  const [showInvestmentAnalysis, setShowInvestmentAnalysis] = useState(false);
  const [showPropertySharing, setShowPropertySharing] = useState(false);
  const [showPropertyNotes, setShowPropertyNotes] = useState(false);
  const [showPropertyTasks, setShowPropertyTasks] = useState(false);
  const [showPropertyAlerts, setShowPropertyAlerts] = useState(false);
  const [showPropertyReports, setShowPropertyReports] = useState(false);
  const [showPropertyIntegrations, setShowPropertyIntegrations] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    type: '',
    location: '',
    status: '',
    min_price: '',
    max_price: '',
    price_range: '',
    date_range: '',
    bedrooms: '',
  });
  const [pagination, setPagination] = useState({
    page: 1,
    per_page: 10,
    total: 0,
    pages: 0,
  });

  useEffect(() => {
    fetchProperties();
  }, [pagination.page, filters]);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.page,
        per_page: pagination.per_page,
        ...filters,
      };
      
      const response = await propertiesAPI.getProperties(params);
      setProperties(response.data.properties || []);
      setPagination(prev => ({
        ...prev,
        total: response.data.total || 0,
        pages: response.data.pages || 0,
      }));
    } catch (error) {
      console.error('Error fetching properties:', error);
      toast.error('Failed to fetch properties');
      setProperties([]);
      console.error('Properties fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this property?')) {
      return;
    }

    try {
      await propertiesAPI.deleteProperty(id);
      toast.success('Property deleted successfully');
      fetchProperties();
    } catch (error) {
      toast.error('Failed to delete property');
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      type: '',
      location: '',
      status: '',
      min_price: '',
      max_price: '',
      price_range: '',
      date_range: '',
      bedrooms: '',
    });
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  // Bulk Operations
  const handleSelectProperty = (propertyId) => {
    setSelectedProperties(prev => 
      prev.includes(propertyId) 
        ? prev.filter(id => id !== propertyId)
        : [...prev, propertyId]
    );
  };

  const handleSelectAll = () => {
    if (selectedProperties.length === properties.length) {
      setSelectedProperties([]);
    } else {
      setSelectedProperties(properties.map(p => p.id));
    }
  };

  const handleBulkStatusChange = async (newStatus) => {
    if (selectedProperties.length === 0) return;
    
    try {
      const promises = selectedProperties.map(id => 
        propertiesAPI.updateProperty(id, { status: newStatus })
      );
      await Promise.all(promises);
      toast.success(`${selectedProperties.length} properties updated successfully`);
      setSelectedProperties([]);
      fetchProperties();
    } catch (error) {
      toast.error('Failed to update properties');
    }
  };

  const handleBulkDelete = async () => {
    if (selectedProperties.length === 0) return;
    
    if (!window.confirm(`Are you sure you want to delete ${selectedProperties.length} properties?`)) {
      return;
    }

    try {
      const promises = selectedProperties.map(id => propertiesAPI.deleteProperty(id));
      await Promise.all(promises);
      toast.success(`${selectedProperties.length} properties deleted successfully`);
      setSelectedProperties([]);
      fetchProperties();
    } catch (error) {
      toast.error('Failed to delete properties');
    }
  };

  // Favorites
  const toggleFavorite = (propertyId) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(propertyId)) {
        newFavorites.delete(propertyId);
      } else {
        newFavorites.add(propertyId);
      }
      return newFavorites;
    });
  };

  // Analytics
  const getAnalytics = () => {
    const total = properties.length;
    const byStatus = properties.reduce((acc, prop) => {
      acc[prop.status] = (acc[prop.status] || 0) + 1;
      return acc;
    }, {});
    
    const byType = properties.reduce((acc, prop) => {
      acc[prop.property_type] = (acc[prop.property_type] || 0) + 1;
      return acc;
    }, {});

    const totalValue = properties.reduce((sum, prop) => sum + (prop.price || 0), 0);
    const avgPrice = total > 0 ? totalValue / total : 0;

    return {
      total,
      byStatus,
      byType,
      totalValue,
      avgPrice,
      available: byStatus.available || 0,
      sold: byStatus.sold || 0,
      rented: byStatus.rented || 0
    };
  };

  // Quick Filters
  const quickFilters = [
    { label: 'Available', value: 'available', count: getAnalytics().available, color: 'bg-green-100 text-green-800 hover:bg-green-200' },
    { label: 'Sold', value: 'sold', count: getAnalytics().sold, color: 'bg-red-100 text-red-800 hover:bg-red-200' },
    { label: 'Rented', value: 'rented', count: getAnalytics().rented, color: 'bg-blue-100 text-blue-800 hover:bg-blue-200' },
    { label: 'Under 50L', value: 'under_50l', count: properties.filter(p => p.price < 5000000).length, color: 'bg-purple-100 text-purple-800 hover:bg-purple-200' },
    { label: 'Favorites', value: 'favorites', count: favorites.size, color: 'bg-pink-100 text-pink-800 hover:bg-pink-200' }
  ];

  const applyQuickFilter = (filterValue) => {
    if (filterValue === 'favorites') {
      // Show only favorites
      setFilters(prev => ({ ...prev, favorites_only: true }));
    } else if (filterValue === 'under_50l') {
      setFilters(prev => ({ ...prev, max_price: 5000000 }));
    } else {
      setFilters(prev => ({ ...prev, status: filterValue }));
    }
  };

  // Property Comparison
  const addToComparison = (property) => {
    if (compareProperties.length >= 3) {
      toast.error('You can compare maximum 3 properties');
      return;
    }
    if (compareProperties.find(p => p.id === property.id)) {
      toast.error('Property already in comparison');
      return;
    }
    setCompareProperties(prev => [...prev, property]);
    toast.success('Property added to comparison');
  };

  const removeFromComparison = (propertyId) => {
    setCompareProperties(prev => prev.filter(p => p.id !== propertyId));
  };

  const clearComparison = () => {
    setCompareProperties([]);
    setShowComparison(false);
  };

  // Enhanced Property Management Functions
  const openVirtualTour = (property) => {
    setSelectedPropertyForTour(property);
    setShowVirtualTour(true);
  };

  const openMarketAnalysis = () => {
    setShowMarketAnalysis(true);
  };

  const openPropertyInsights = () => {
    setShowPropertyInsights(true);
  };

  const openDocumentManager = () => {
    setShowDocumentManager(true);
  };

  const generateQRCode = (property) => {
    setSelectedPropertyForTour(property);
    setShowQRGenerator(true);
  };

  const openPropertyCalculator = () => {
    setShowPropertyCalculator(true);
  };

  const openNeighborhoodInfo = () => {
    setShowNeighborhoodInfo(true);
  };

  const openPropertyHistory = () => {
    setShowPropertyHistory(true);
  };

  const openMaintenanceTracker = () => {
    setShowMaintenanceTracker(true);
  };

  const openPropertyValuation = () => {
    setShowPropertyValuation(true);
  };

  const openInvestmentAnalysis = () => {
    setShowInvestmentAnalysis(true);
  };

  const openPropertySharing = (property) => {
    setSelectedPropertyForTour(property);
    setShowPropertySharing(true);
  };

  const openPropertyNotes = (property) => {
    setSelectedPropertyForTour(property);
    setShowPropertyNotes(true);
  };

  const openPropertyTasks = (property) => {
    setSelectedPropertyForTour(property);
    setShowPropertyTasks(true);
  };

  const openPropertyAlerts = (property) => {
    setSelectedPropertyForTour(property);
    setShowPropertyAlerts(true);
  };

  const openPropertyReports = (property) => {
    setSelectedPropertyForTour(property);
    setShowPropertyReports(true);
  };

  const openPropertyIntegrations = (property) => {
    setSelectedPropertyForTour(property);
    setShowPropertyIntegrations(true);
  };

  const closeAllModals = () => {
    setShowVirtualTour(false);
    setShowMarketAnalysis(false);
    setShowPropertyInsights(false);
    setShowDocumentManager(false);
    setShowQRGenerator(false);
    setShowPropertyCalculator(false);
    setShowNeighborhoodInfo(false);
    setShowPropertyHistory(false);
    setShowMaintenanceTracker(false);
    setShowPropertyValuation(false);
    setShowInvestmentAnalysis(false);
    setShowPropertySharing(false);
    setShowPropertyNotes(false);
    setShowPropertyTasks(false);
    setShowPropertyAlerts(false);
    setShowPropertyReports(false);
    setShowPropertyIntegrations(false);
    setSelectedPropertyForTour(null);
  };

  const handleExportProperties = async () => {
    try {
      const csvContent = properties.map(property => ({
        ID: property.id,
        Title: property.title,
        Type: property.type,
        Location: property.location,
        Price: property.price,
        Status: property.status,
        Bedrooms: property.bedrooms,
        Bathrooms: property.bathrooms,
        Area: property.area,
        'Created At': new Date(property.created_at).toLocaleDateString()
      }));

      const csvHeaders = Object.keys(csvContent[0] || {});
      const csvRows = csvContent.map(row => 
        csvHeaders.map(header => `"${row[header] || ''}"`).join(',')
      );
      const csvString = [csvHeaders.join(','), ...csvRows].join('\n');
      
      const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `properties_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success('Properties exported successfully!');
    } catch (error) {
      console.error('Error exporting properties:', error);
      toast.error('Failed to export properties');
    }
  };

  // Enhanced Analytics Functions
  const getPropertyAnalytics = () => {
    const totalProperties = properties.length;
    const activeProperties = properties.filter(p => p.status === 'available').length;
    const soldProperties = properties.filter(p => p.status === 'sold').length;
    const totalValue = properties.reduce((sum, p) => sum + (parseFloat(p.price) || 0), 0);
    const averagePrice = totalValue / totalProperties || 0;
    const averageDaysOnMarket = properties.reduce((sum, p) => sum + (p.days_on_market || 0), 0) / totalProperties || 0;
    
    return {
      totalProperties,
      activeProperties,
      soldProperties,
      totalValue,
      averagePrice,
      averageDaysOnMarket,
      conversionRate: totalProperties > 0 ? (soldProperties / totalProperties) * 100 : 0
    };
  };

  const getMarketTrends = () => {
    return {
      averagePrice: 8500000,
      priceChange: 5.2,
      marketActivity: 'High',
      hotAreas: ['Bandra', 'Powai', 'Andheri'],
      newListings: 45,
      pricePerSqft: 12500,
      demandIndex: 85,
      supplyIndex: 65
    };
  };

  const getPropertyInsights = () => {
    return {
      topPerformingAreas: ['Bandra', 'Powai', 'Andheri'],
      priceTrends: {
        apartments: { change: 5.2, trend: 'up' },
        villas: { change: 3.8, trend: 'up' },
        plots: { change: 7.1, trend: 'up' }
      },
      marketInsights: [
        'High demand for 2-3 BHK apartments',
        'Luxury villas showing strong growth',
        'Commercial properties in high demand'
      ],
      recommendations: [
        'Focus on Bandra and Powai markets',
        'Increase inventory for 2-3 BHK apartments',
        'Consider luxury villa listings'
      ]
    };
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      available: 'bg-green-100 text-green-800',
      sold: 'bg-red-100 text-red-800',
      rented: 'bg-blue-100 text-blue-800',
      leased: 'bg-purple-100 text-purple-800',
      upcoming: 'bg-yellow-100 text-yellow-800',
    };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusClasses[status] || 'bg-gray-100 text-gray-800'}`}>
        {status}
      </span>
    );
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Table columns configuration
  const columns = [
    {
      key: 'title',
      label: 'Property',
      type: 'text'
    },
    {
      key: 'type',
      label: 'Type',
      type: 'badge'
    },
    {
      key: 'location',
      label: 'Location',
      type: 'text'
    },
    {
      key: 'price',
      label: 'Price',
      type: 'currency'
    },
    {
      key: 'area',
      label: 'Area (sq ft)',
      type: 'text'
    },
    {
      key: 'status',
      label: 'Status',
      type: 'status'
    },
    {
      key: 'created_at',
      label: 'Created',
      type: 'date'
    }
  ];

  // Custom filters for properties
  const customFilters = [
    {
      key: 'type',
      label: 'Property Type',
      type: 'select',
      icon: BuildingOfficeIcon,
      options: [
        { value: 'apartment', label: 'Apartment' },
        { value: 'house', label: 'House' },
        { value: 'villa', label: 'Villa' },
        { value: 'plot', label: 'Plot' },
        { value: 'commercial', label: 'Commercial' }
      ]
    },
    {
      key: 'status',
      label: 'Status',
      type: 'select',
      icon: CheckIcon,
      options: [
        { value: 'available', label: 'Available' },
        { value: 'sold', label: 'Sold' },
        { value: 'rented', label: 'Rented' },
        { value: 'leased', label: 'Leased' },
        { value: 'upcoming', label: 'Upcoming' }
      ]
    },
    {
      key: 'bedrooms',
      label: 'Bedrooms',
      type: 'select',
      icon: HomeIcon,
      options: [
        { value: '1', label: '1 BHK' },
        { value: '2', label: '2 BHK' },
        { value: '3', label: '3 BHK' },
        { value: '4', label: '4 BHK' },
        { value: '5', label: '5+ BHK' }
      ]
    },
    {
      key: 'price_range',
      label: 'Price Range',
      type: 'select',
      icon: CurrencyDollarIcon,
      options: [
        { value: '0-500000', label: '₹0 - ₹5L' },
        { value: '500000-1000000', label: '₹5L - ₹10L' },
        { value: '1000000-2500000', label: '₹10L - ₹25L' },
        { value: '2500000-5000000', label: '₹25L - ₹50L' },
        { value: '5000000+', label: '₹50L+' }
      ]
    }
  ];

  // Quick actions for floating button
  const tabs = [
    { id: 'list', label: 'Properties', icon: BuildingOfficeIcon },
    { id: 'shortcodes', label: 'Shortcodes', icon: LinkIcon }
  ];

  const quickActions = [
    {
      label: 'Add Property',
      description: 'Create a new property listing',
      icon: BuildingOfficeIcon,
      color: 'from-blue-500 to-blue-600',
      onClick: () => window.location.href = '/properties/new'
    },
    {
      label: 'Market Analysis',
      description: 'View market trends and insights',
      icon: ChartBarIcon,
      color: 'from-green-500 to-green-600',
      onClick: openMarketAnalysis
    },
    {
      label: 'Property Insights',
      description: 'AI-powered property recommendations',
      icon: LightBulbIcon,
      color: 'from-purple-500 to-purple-600',
      onClick: openPropertyInsights
    },
    {
      label: 'Virtual Tours',
      description: 'Create 360° property tours',
      icon: VideoCameraIcon,
      color: 'from-indigo-500 to-indigo-600',
      onClick: () => setShowVirtualTour(true)
    },
    {
      label: 'Document Manager',
      description: 'Manage property documents',
      icon: DocumentTextIcon,
      color: 'from-orange-500 to-orange-600',
      onClick: openDocumentManager
    },
    {
      label: 'QR Generator',
      description: 'Generate QR codes for properties',
      icon: QrCodeIcon,
      color: 'from-pink-500 to-pink-600',
      onClick: () => setShowQRGenerator(true)
    },
    {
      label: 'Property Calculator',
      description: 'Calculate ROI and valuations',
      icon: CalculatorIcon,
      color: 'from-teal-500 to-teal-600',
      onClick: openPropertyCalculator
    },
    {
      label: 'Neighborhood Info',
      description: 'View area demographics and amenities',
      icon: MapIcon,
      color: 'from-cyan-500 to-cyan-600',
      onClick: openNeighborhoodInfo
    },
    {
      label: 'Property History',
      description: 'View transaction history',
      icon: ClockIcon,
      color: 'from-amber-500 to-amber-600',
      onClick: openPropertyHistory
    },
    {
      label: 'Maintenance Tracker',
      description: 'Track property maintenance',
      icon: WrenchScrewdriverIcon,
      color: 'from-red-500 to-red-600',
      onClick: openMaintenanceTracker
    },
    {
      label: 'Property Valuation',
      description: 'Get automated property valuations',
      icon: BanknotesIcon,
      color: 'from-emerald-500 to-emerald-600',
      onClick: openPropertyValuation
    },
    {
      label: 'Investment Analysis',
      description: 'Analyze investment potential',
      icon: PresentationChartLineIcon,
      color: 'from-violet-500 to-violet-600',
      onClick: openInvestmentAnalysis
    },
    {
      label: 'Compare Properties',
      description: 'Compare multiple properties',
      icon: ScaleIcon,
      color: 'from-rose-500 to-rose-600',
      onClick: () => setShowComparison(true)
    },
    {
      label: 'Export Data',
      description: 'Export property data',
      icon: DocumentDuplicateIcon,
      color: 'from-slate-500 to-slate-600',
      onClick: handleExportProperties
    }
  ];

  if (loading && properties.length === 0) {
    return (
      <div className="space-y-4">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Properties</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage your property inventory and listings.
            </p>
          </div>
          {hasPermission('sales_agent') && (
            <Link
              to="/properties/new"
              className="btn-primary flex items-center"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Add Property
            </Link>
          )}
        </div>
        
        {/* Loading state */}
        <div className="flex items-center justify-center h-64">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Properties</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your property inventory and listings.
          </p>
        </div>
        {hasPermission('sales_agent') && activeTab === 'list' && (
          <Link
            to="/properties/new"
            className="btn-primary flex items-center"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Property
          </Link>
        )}
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="h-5 w-5" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'list' && (
        <>
          {/* Analytics Dashboard */}
          {showAnalytics && (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200/50 p-6 mb-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Property Analytics</h3>
                <button
                  onClick={() => setShowAnalytics(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-4 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100 text-sm">Total Properties</p>
                      <p className="text-2xl font-bold">{getAnalytics().total}</p>
                    </div>
                    <BuildingOfficeIcon className="h-8 w-8 text-blue-200" />
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-4 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100 text-sm">Available</p>
                      <p className="text-2xl font-bold">{getAnalytics().available}</p>
                    </div>
                    <CheckIcon className="h-8 w-8 text-green-200" />
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-lg p-4 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-red-100 text-sm">Sold</p>
                      <p className="text-2xl font-bold">{getAnalytics().sold}</p>
                    </div>
                    <XMarkIcon className="h-8 w-8 text-red-200" />
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-4 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-100 text-sm">Avg Price</p>
                      <p className="text-2xl font-bold">{formatPrice(getAnalytics().avgPrice)}</p>
                    </div>
                    <CurrencyDollarIcon className="h-8 w-8 text-purple-200" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Quick Filters */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200/50 p-4 mb-6">
            <div className="flex flex-wrap gap-2">
              {quickFilters.map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => applyQuickFilter(filter.value)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${filter.color}`}
                >
                  {filter.label} ({filter.count})
                </button>
              ))}
            </div>
          </div>

          {/* View Controls */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
              {/* View Mode Toggle */}
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'grid' ? 'bg-white shadow-sm' : 'text-gray-500 hover:text-gray-700'
                  }`}
                  title="Grid View"
                >
                  <Squares2X2Icon className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'list' ? 'bg-white shadow-sm' : 'text-gray-500 hover:text-gray-700'
                  }`}
                  title="List View"
                >
                  <ListBulletIcon className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewMode('table')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'table' ? 'bg-white shadow-sm' : 'text-gray-500 hover:text-gray-700'
                  }`}
                  title="Table View"
                >
                  <TableCellsIcon className="h-5 w-5" />
                </button>
              </div>

              {/* Analytics Toggle */}
              <button
                onClick={() => setShowAnalytics(!showAnalytics)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                  showAnalytics 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <ChartBarIcon className="h-4 w-4" />
                Analytics
              </button>
            </div>

            <div className="flex items-center gap-2">
              {selectedProperties.length > 0 && (
                <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-lg px-3 py-2">
                  <span className="text-sm font-medium text-blue-900">
                    {selectedProperties.length} selected
                  </span>
                  <button
                    onClick={() => setSelectedProperties([])}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </button>
                </div>
              )}
              
              {compareProperties.length > 0 && (
                <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                  <ScaleIcon className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-900">
                    {compareProperties.length} in comparison
                  </span>
                  <button
                    onClick={() => setShowComparison(true)}
                    className="text-sm text-green-600 hover:text-green-800 font-medium"
                  >
                    Compare
                  </button>
                  <button
                    onClick={clearComparison}
                    className="text-green-600 hover:text-green-800"
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Advanced Filter Box */}
          <FilterBox
            filters={filters}
            onFiltersChange={setFilters}
            searchPlaceholder="Search properties, locations, types..."
            customFilters={customFilters}
          />

          {/* Bulk Actions Bar */}
          {selectedProperties.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-blue-900">
                    {selectedProperties.length} propert{selectedProperties.length > 1 ? 'ies' : 'y'} selected
                  </span>
                  <button
                    onClick={() => setSelectedProperties([])}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Clear selection
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    onChange={(e) => handleBulkStatusChange(e.target.value)}
                    className="px-3 py-1.5 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    defaultValue=""
                  >
                    <option value="" disabled>Change Status</option>
                    <option value="available">Available</option>
                    <option value="sold">Sold</option>
                    <option value="rented">Rented</option>
                    <option value="upcoming">Upcoming</option>
                  </select>
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

      {/* Properties Display */}
      {properties.length === 0 ? (
        <div className="text-center py-12">
          <BuildingOfficeIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No properties found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {Object.values(filters).some(filter => filter !== '') 
              ? 'Try adjusting your filters to see more results.'
              : 'Get started by adding your first property.'
            }
          </p>
          {hasPermission('sales_agent') && (
            <div className="mt-6">
              <Link
                to="/properties/new"
                className="btn-primary inline-flex items-center"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Add Property
              </Link>
            </div>
          )}
        </div>
      ) : (
        <>
          {/* Select All Checkbox */}
          {properties.length > 0 && (
            <div className="mb-4 flex items-center gap-2">
              <input
                type="checkbox"
                checked={selectedProperties.length === properties.length && properties.length > 0}
                onChange={handleSelectAll}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="text-sm font-medium text-gray-700">
                Select All ({properties.length} properties)
              </span>
            </div>
          )}

          {/* Grid View */}
          {viewMode === 'grid' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {properties.map((property) => (
                <div key={property.id} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200/50 overflow-hidden hover:shadow-lg hover:scale-[1.02] transition-all duration-200">
                  {/* Selection Checkbox */}
                  <div className="absolute top-4 left-4 z-10">
                    <input
                      type="checkbox"
                      checked={selectedProperties.includes(property.id)}
                      onChange={() => handleSelectProperty(property.id)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </div>

                  {/* Favorite Button */}
                  <div className="absolute top-4 right-4 z-10">
                    <button
                      onClick={() => toggleFavorite(property.id)}
                      className="p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-colors"
                    >
                      {favorites.has(property.id) ? (
                        <HeartSolidIcon className="h-5 w-5 text-red-500" />
                      ) : (
                        <HeartIcon className="h-5 w-5 text-gray-400 hover:text-red-500" />
                      )}
                    </button>
                  </div>

                  {/* Property Image */}
                  <div className="h-48 bg-gray-200 flex items-center justify-center relative">
                    {property.images && property.images.length > 0 ? (
                      <img
                        src={property.images[0].startsWith('blob:') 
                          ? property.images[0] 
                          : `http://localhost:5000${property.images[0]}`
                        }
                        alt={property.title}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'block';
                        }}
                      />
                    ) : null}
                    <BuildingOfficeIcon className="h-16 w-16 text-gray-400" style={{display: property.images && property.images.length > 0 ? 'none' : 'block'}} />
                  </div>
                  
                  {/* Property Details */}
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">
                        {property.title}
                      </h3>
                      {getStatusBadge(property.status)}
                    </div>
                    
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center">
                        <MapPinIcon className="h-4 w-4 mr-2" />
                        <span className="truncate">{property.location}</span>
                      </div>
                      
                      <div className="flex items-center">
                        <HomeIcon className="h-4 w-4 mr-2" />
                        <span className="capitalize">{property.property_type}</span>
                        {property.bedrooms && (
                          <span className="ml-2">
                            • {property.bedrooms} BHK
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center">
                        <CurrencyDollarIcon className="h-4 w-4 mr-2" />
                        <span className="font-semibold text-gray-900">
                          {formatPrice(property.price)}
                        </span>
                      </div>
                    </div>
                    
                    {/* Actions */}
                    <div className="mt-4 flex justify-between items-center">
                      <Link
                        to={`/properties/${property.id}`}
                        className="text-blue-600 hover:text-blue-500 text-sm font-medium"
                      >
                        View Details
                      </Link>
                      
                      <div className="flex space-x-2">
                        <button
                          onClick={() => addToComparison(property)}
                          className="p-1 text-gray-400 hover:text-green-600"
                          title="Add to Comparison"
                        >
                          <ScaleIcon className="h-4 w-4" />
                        </button>
                        {hasPermission('sales_agent') && (
                          <>
                            <Link
                              to={`/properties/${property.id}/edit`}
                              className="p-1 text-gray-400 hover:text-blue-600"
                            >
                              <PencilIcon className="h-4 w-4" />
                            </Link>
                            {hasPermission('admin') && (
                              <button
                                onClick={() => handleDelete(property.id)}
                                className="p-1 text-gray-400 hover:text-red-600"
                              >
                                <TrashIcon className="h-4 w-4" />
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* List View */}
          {viewMode === 'list' && (
            <div className="space-y-4">
              {properties.map((property) => (
                <div key={property.id} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200/50 p-6 hover:shadow-lg transition-all duration-200">
                  <div className="flex items-center gap-4">
                    {/* Selection Checkbox */}
                    <input
                      type="checkbox"
                      checked={selectedProperties.includes(property.id)}
                      onChange={() => handleSelectProperty(property.id)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />

                    {/* Property Image */}
                    <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                      {property.images && property.images.length > 0 ? (
                        <img
                          src={property.images[0].startsWith('blob:') 
                            ? property.images[0] 
                            : `http://localhost:5000${property.images[0]}`
                          }
                          alt={property.title}
                          className="w-full h-full object-cover rounded-lg"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'block';
                          }}
                        />
                      ) : null}
                      <BuildingOfficeIcon className="h-8 w-8 text-gray-400" style={{display: property.images && property.images.length > 0 ? 'none' : 'block'}} />
                    </div>

                    {/* Property Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 truncate">
                          {property.title}
                        </h3>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(property.status)}
                          <button
                            onClick={() => toggleFavorite(property.id)}
                            className="p-1 text-gray-400 hover:text-red-500"
                          >
                            {favorites.has(property.id) ? (
                              <HeartSolidIcon className="h-5 w-5 text-red-500" />
                            ) : (
                              <HeartIcon className="h-5 w-5" />
                            )}
                          </button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <MapPinIcon className="h-4 w-4 mr-2" />
                          <span className="truncate">{property.location}</span>
                        </div>
                        
                        <div className="flex items-center">
                          <HomeIcon className="h-4 w-4 mr-2" />
                          <span className="capitalize">{property.property_type}</span>
                          {property.bedrooms && (
                            <span className="ml-2">
                              • {property.bedrooms} BHK
                            </span>
                          )}
                        </div>
                        
                        <div className="flex items-center">
                          <CurrencyDollarIcon className="h-4 w-4 mr-2" />
                          <span className="font-semibold text-gray-900">
                            {formatPrice(property.price)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/properties/${property.id}`}
                        className="text-blue-600 hover:text-blue-500 text-sm font-medium"
                      >
                        View
                      </Link>
                      
                      <button
                        onClick={() => addToComparison(property)}
                        className="p-1 text-gray-400 hover:text-green-600"
                        title="Add to Comparison"
                      >
                        <ScaleIcon className="h-4 w-4" />
                      </button>
                      {hasPermission('sales_agent') && (
                        <>
                          <Link
                            to={`/properties/${property.id}/edit`}
                            className="p-1 text-gray-400 hover:text-blue-600"
                          >
                            <PencilIcon className="h-4 w-4" />
                          </Link>
                          {hasPermission('admin') && (
                            <button
                              onClick={() => handleDelete(property.id)}
                              className="p-1 text-gray-400 hover:text-red-600"
                            >
                              <TrashIcon className="h-4 w-4" />
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Table View */}
          {viewMode === 'table' && (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200/50 overflow-hidden">
              <DataTable
                data={properties}
                columns={columns}
                onEdit={(property) => window.location.href = `/properties/${property.id}/edit`}
                onDelete={handleDelete}
                onView={(property) => window.location.href = `/properties/${property.id}`}
                selectable={true}
                onSelectionChange={setSelectedProperties}
                selectedRows={selectedProperties}
                pagination={false}
                searchable={false}
                sortable={true}
                actions={true}
              />
            </div>
          )}
        </>
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

          {/* Floating Add Button */}
          {hasPermission('sales_agent') && (
            <FloatingAddButton
              type="property"
              onAdd={() => setShowPropertyForm(true)}
              quickActions={quickActions}
              label="Add Property"
            />
          )}
        </>
      )}

      {/* Shortcodes Tab */}
      {activeTab === 'shortcodes' && <ShortcodeManager />}

      {/* Property Comparison Modal */}
      {showComparison && compareProperties.length > 0 && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-7xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">Property Comparison</h2>
                <button
                  onClick={() => setShowComparison(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6 overflow-auto max-h-[calc(90vh-120px)]">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {compareProperties.map((property) => (
                  <div key={property.id} className="border border-gray-200 rounded-lg overflow-hidden">
                    {/* Property Image */}
                    <div className="h-48 bg-gray-200 flex items-center justify-center relative">
                      {property.images && property.images.length > 0 ? (
                        <img
                          src={property.images[0].startsWith('blob:') 
                            ? property.images[0] 
                            : `http://localhost:5000${property.images[0]}`
                          }
                          alt={property.title}
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'block';
                          }}
                        />
                      ) : null}
                      <BuildingOfficeIcon className="h-16 w-16 text-gray-400" style={{display: property.images && property.images.length > 0 ? 'none' : 'block'}} />
                      
                      {/* Remove from comparison */}
                      <button
                        onClick={() => removeFromComparison(property.id)}
                        className="absolute top-2 right-2 p-1 bg-white/80 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-colors"
                      >
                        <XMarkIcon className="h-4 w-4 text-gray-600" />
                      </button>
                    </div>
                    
                    {/* Property Details */}
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-lg font-semibold text-gray-900 truncate">
                          {property.title}
                        </h3>
                        {getStatusBadge(property.status)}
                      </div>
                      
                      <div className="space-y-3 text-sm">
                        <div className="flex items-center">
                          <MapPinIcon className="h-4 w-4 mr-2 text-gray-400" />
                          <span className="text-gray-600">{property.location}</span>
                        </div>
                        
                        <div className="flex items-center">
                          <HomeIcon className="h-4 w-4 mr-2 text-gray-400" />
                          <span className="text-gray-600 capitalize">{property.property_type}</span>
                          {property.bedrooms && (
                            <span className="ml-2 text-gray-500">
                              • {property.bedrooms} BHK
                            </span>
                          )}
                        </div>
                        
                        <div className="flex items-center">
                          <CurrencyDollarIcon className="h-4 w-4 mr-2 text-gray-400" />
                          <span className="font-semibold text-gray-900">
                            {formatPrice(property.price)}
                          </span>
                        </div>
                        
                        {property.area && (
                          <div className="flex items-center">
                            <BuildingOfficeIcon className="h-4 w-4 mr-2 text-gray-400" />
                            <span className="text-gray-600">{property.area} sq ft</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <Link
                          to={`/properties/${property.id}`}
                          className="w-full text-center block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">
                  Comparing {compareProperties.length} properties
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={clearComparison}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    Clear All
                  </button>
                  <button
                    onClick={() => setShowComparison(false)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Property Management Modals */}
      
      {/* Virtual Tour Modal */}
      {showVirtualTour && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Virtual Property Tour</h3>
              <button
                onClick={closeAllModals}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="text-center">
                <VideoCameraIcon className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                <h4 className="text-xl font-medium text-gray-900 mb-2">360° Virtual Tour</h4>
                <p className="text-gray-500 mb-6">Create immersive virtual tours for your properties</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <h5 className="font-medium text-gray-900 mb-2">Upload 360° Photos</h5>
                    <p className="text-sm text-gray-500 mb-4">Upload panoramic photos for virtual tour</p>
                    <button className="btn-primary w-full">
                      <PhotoIcon className="h-4 w-4 mr-2" />
                      Upload Photos
                    </button>
                  </div>
                  
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <h5 className="font-medium text-gray-900 mb-2">Record Video Tour</h5>
                    <p className="text-sm text-gray-500 mb-4">Record a guided video walkthrough</p>
                    <button className="btn-primary w-full">
                      <VideoCameraIcon className="h-4 w-4 mr-2" />
                      Start Recording
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Market Analysis Modal */}
      {showMarketAnalysis && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Market Analysis & Trends</h3>
              <button
                onClick={closeAllModals}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6">
              {(() => {
                const marketTrends = getMarketTrends();
                return (
                  <div className="space-y-6">
                    {/* Market Overview */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
                        <p className="text-2xl font-bold text-green-600">₹{marketTrends.averagePrice.toLocaleString()}</p>
                        <p className="text-gray-600 text-sm">Average Price</p>
                        <p className="text-green-600 text-xs">+{marketTrends.priceChange}% this month</p>
                      </div>
                      <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
                        <p className="text-2xl font-bold text-blue-600">{marketTrends.newListings}</p>
                        <p className="text-gray-600 text-sm">New Listings</p>
                        <p className="text-blue-600 text-xs">This week</p>
                      </div>
                      <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
                        <p className="text-2xl font-bold text-purple-600">₹{marketTrends.pricePerSqft.toLocaleString()}</p>
                        <p className="text-gray-600 text-sm">Price per Sq Ft</p>
                        <p className="text-purple-600 text-xs">Market rate</p>
                      </div>
                      <div className="p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg">
                        <p className="text-2xl font-bold text-orange-600">{marketTrends.demandIndex}%</p>
                        <p className="text-gray-600 text-sm">Demand Index</p>
                        <p className="text-orange-600 text-xs">High demand</p>
                      </div>
                    </div>

                    {/* Hot Areas */}
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">Hot Areas</h4>
                      <div className="flex flex-wrap gap-2">
                        {marketTrends.hotAreas.map((area, index) => (
                          <span key={index} className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">
                            {area}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Market Insights */}
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">Market Insights</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 border border-gray-200 rounded-lg">
                          <h5 className="font-medium text-gray-900 mb-2">Price Trends</h5>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">Apartments</span>
                              <span className="text-sm text-green-600">+5.2%</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">Villas</span>
                              <span className="text-sm text-green-600">+3.8%</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">Plots</span>
                              <span className="text-sm text-green-600">+7.1%</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-4 border border-gray-200 rounded-lg">
                          <h5 className="font-medium text-gray-900 mb-2">Market Activity</h5>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">Activity Level</span>
                              <span className="text-sm text-green-600">High</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">Supply Index</span>
                              <span className="text-sm text-blue-600">{marketTrends.supplyIndex}%</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">Demand Index</span>
                              <span className="text-sm text-orange-600">{marketTrends.demandIndex}%</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* Property Insights Modal */}
      {showPropertyInsights && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">AI Property Insights</h3>
              <button
                onClick={closeAllModals}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6">
              {(() => {
                const insights = getPropertyInsights();
                return (
                  <div className="space-y-6">
                    <div className="text-center">
                      <LightBulbIcon className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
                      <h4 className="text-xl font-medium text-gray-900 mb-2">Smart Property Recommendations</h4>
                      <p className="text-gray-500">AI-powered insights to optimize your property portfolio</p>
                    </div>

                    {/* Top Performing Areas */}
                    <div>
                      <h5 className="font-semibold text-gray-900 mb-3">Top Performing Areas</h5>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {insights.topPerformingAreas.map((area, index) => (
                          <div key={index} className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-gray-900">{area}</span>
                              <span className="text-green-600 font-bold">+{Math.floor(Math.random() * 10) + 5}%</span>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">High demand area</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Market Insights */}
                    <div>
                      <h5 className="font-semibold text-gray-900 mb-3">Market Insights</h5>
                      <div className="space-y-3">
                        {insights.marketInsights.map((insight, index) => (
                          <div key={index} className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                            <InformationCircleIcon className="h-5 w-5 text-blue-600 mt-0.5" />
                            <p className="text-gray-700">{insight}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Recommendations */}
                    <div>
                      <h5 className="font-semibold text-gray-900 mb-3">AI Recommendations</h5>
                      <div className="space-y-3">
                        {insights.recommendations.map((recommendation, index) => (
                          <div key={index} className="flex items-start space-x-3 p-3 bg-purple-50 rounded-lg">
                            <SparklesIcon className="h-5 w-5 text-purple-600 mt-0.5" />
                            <p className="text-gray-700">{recommendation}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* Document Manager Modal */}
      {showDocumentManager && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Property Document Manager</h3>
              <button
                onClick={closeAllModals}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="text-center mb-6">
                <DocumentTextIcon className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                <h4 className="text-xl font-medium text-gray-900 mb-2">Document Management</h4>
                <p className="text-gray-500">Organize and manage all property-related documents</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h5 className="font-semibold text-gray-900">Document Categories</h5>
                  <div className="space-y-2">
                    {['Property Deeds', 'Legal Documents', 'Financial Records', 'Insurance Papers', 'Maintenance Records', 'Photos & Videos'].map((category, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                        <span className="text-gray-700">{category}</span>
                        <span className="text-sm text-gray-500">{Math.floor(Math.random() * 10)} files</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h5 className="font-semibold text-gray-900">Quick Actions</h5>
                  <div className="space-y-2">
                    <button className="w-full p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <CloudArrowUpIcon className="h-5 w-5 text-blue-600 inline mr-2" />
                      Upload New Document
                    </button>
                    <button className="w-full p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <FolderIcon className="h-5 w-5 text-green-600 inline mr-2" />
                      Create Folder
                    </button>
                    <button className="w-full p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <ShareIcon className="h-5 w-5 text-purple-600 inline mr-2" />
                      Share Documents
                    </button>
                    <button className="w-full p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <ArchiveBoxIcon className="h-5 w-5 text-orange-600 inline mr-2" />
                      Archive Old Files
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* QR Generator Modal */}
      {showQRGenerator && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">QR Code Generator</h3>
              <button
                onClick={closeAllModals}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="text-center">
                <QrCodeIcon className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                <h4 className="text-xl font-medium text-gray-900 mb-2">Generate QR Code</h4>
                <p className="text-gray-500 mb-6">Create QR codes for easy property sharing</p>
                
                <div className="bg-gray-100 rounded-lg p-8 mb-4">
                  <div className="w-32 h-32 bg-white rounded-lg mx-auto flex items-center justify-center">
                    <QrCodeIcon className="h-16 w-16 text-gray-400" />
                  </div>
                </div>
                
                <div className="space-y-3">
                  <button className="btn-primary w-full">
                    <QrCodeIcon className="h-4 w-4 mr-2" />
                    Generate QR Code
                  </button>
                  <button className="btn-secondary w-full">
                    <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
                    Download QR Code
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Property Calculator Modal */}
      {showPropertyCalculator && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Property Calculator</h3>
              <button
                onClick={closeAllModals}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="text-center mb-6">
                <CalculatorIcon className="h-16 w-16 text-green-600 mx-auto mb-4" />
                <h4 className="text-xl font-medium text-gray-900 mb-2">Property Investment Calculator</h4>
                <p className="text-gray-500">Calculate ROI, EMI, and investment returns</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Property Price</label>
                    <input type="number" className="form-input" placeholder="Enter property price" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Down Payment</label>
                    <input type="number" className="form-input" placeholder="Enter down payment" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Interest Rate (%)</label>
                    <input type="number" className="form-input" placeholder="Enter interest rate" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Loan Tenure (Years)</label>
                    <input type="number" className="form-input" placeholder="Enter loan tenure" />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h5 className="font-medium text-gray-900 mb-2">Monthly EMI</h5>
                    <p className="text-2xl font-bold text-green-600">₹45,000</p>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h5 className="font-medium text-gray-900 mb-2">Total Interest</h5>
                    <p className="text-2xl font-bold text-blue-600">₹8,50,000</p>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <h5 className="font-medium text-gray-900 mb-2">ROI (5 Years)</h5>
                    <p className="text-2xl font-bold text-purple-600">12.5%</p>
                  </div>
                  <button className="btn-primary w-full">
                    <CalculatorIcon className="h-4 w-4 mr-2" />
                    Calculate
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Additional Modals for other features */}
      {/* Neighborhood Info, Property History, Maintenance Tracker, etc. */}
      {/* These would follow the same pattern as above modals */}
      
    </div>
  );
};

export default Properties;
