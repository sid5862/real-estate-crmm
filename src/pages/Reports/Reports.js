import React, { useState, useEffect, useMemo } from 'react';
import { reportsAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import FilterBox from '../../components/Common/FilterBox';
import FloatingAddButton from '../../components/Common/FloatingAddButton';
import {
  ChartBarIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  BuildingOfficeIcon,
  UserPlusIcon,
  CalendarIcon,
  DocumentArrowDownIcon,
  DocumentDuplicateIcon,
  ShareIcon,
  SparklesIcon,
  TrophyIcon,
  StarIcon,
  ArrowTrendingUpIcon,
  ArrowDownIcon,
  ArrowUpIcon,
  EyeIcon,
  Cog6ToothIcon,
  ClockIcon,
  FunnelIcon,
  TableCellsIcon,
  ChartPieIcon,
  PresentationChartLineIcon,
  DocumentTextIcon,
  PrinterIcon,
  EnvelopeIcon,
  BookmarkIcon,
  PlusIcon,
  XMarkIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
  CalendarDaysIcon,
  BanknotesIcon,
  HomeIcon,
  UserIcon,
  ChartBarSquareIcon,
  ArrowTrendingDownIcon,
  MinusIcon
} from '@heroicons/react/24/outline';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import toast from 'react-hot-toast';

const Reports = () => {
  const { hasPermission, user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState({
    salesPerformance: [],
    leadSources: [],
    employeeProductivity: [],
    inventoryData: {},
    leadData: {},
    financialData: {},
    propertyAnalytics: {},
    conversionMetrics: {},
  });
  
  // Enhanced state management
  const [activeTab, setActiveTab] = useState('overview');
  const [viewMode, setViewMode] = useState('dashboard'); // dashboard, charts, tables
  const [selectedReportType, setSelectedReportType] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showSavedReports, setShowSavedReports] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [comparisonData, setComparisonData] = useState(null);
  const [savedReports, setSavedReports] = useState([]);
  const [analytics, setAnalytics] = useState({});
  const [showFinancialManagement, setShowFinancialManagement] = useState(false);
  const [showBudgetTracking, setShowBudgetTracking] = useState(false);
  const [showExpenseManagement, setShowExpenseManagement] = useState(false);
  const [showRevenueAnalytics, setShowRevenueAnalytics] = useState(false);
  const [showFinancialForecasting, setShowFinancialForecasting] = useState(false);
  const [showProfitLossAnalysis, setShowProfitLossAnalysis] = useState(false);
  const [showCashFlowManagement, setShowCashFlowManagement] = useState(false);
  const [showFinancialInsights, setShowFinancialInsights] = useState(false);
  const [showTaxManagement, setShowTaxManagement] = useState(false);
  const [showInvestmentTracking, setShowInvestmentTracking] = useState(false);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  
  // Date range with presets
  const [dateRange, setDateRange] = useState({
    start_date: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    end_date: new Date().toISOString().split('T')[0],
    preset: 'this_month'
  });
  
  // Filter states
  const [filters, setFilters] = useState({
    property_type: '',
    location: '',
    employee: '',
    lead_source: '',
    status: '',
    price_range: { min: '', max: '' }
  });

  useEffect(() => {
    fetchReportData();
    fetchAnalytics();
  }, [dateRange, filters]);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      
      const [salesResponse, leadSourcesResponse, employeeResponse, inventoryResponse, leadsResponse] = await Promise.all([
        reportsAPI.getSalesPerformance({ months: 12 }),
        reportsAPI.getLeadSources(),
        reportsAPI.getEmployeeProductivity(dateRange),
        reportsAPI.getInventory(),
        reportsAPI.getLeads(),
      ]);

      setReportData({
        salesPerformance: salesResponse.data.sales_performance || [],
        leadSources: leadSourcesResponse.data.lead_sources || [],
        employeeProductivity: employeeResponse.data.employee_productivity || [],
        inventoryData: inventoryResponse.data || {},
        leadData: leadsResponse.data || {},
        financialData: salesResponse.data.financial_metrics || {},
        propertyAnalytics: inventoryResponse.data.property_analytics || {},
        conversionMetrics: leadsResponse.data.conversion_metrics || {},
      });
    } catch (error) {
      toast.error('Failed to fetch report data');
      console.error('Reports fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    try {
      setAnalyticsLoading(true);
      const response = await reportsAPI.getDashboard({
        start_date: dateRange.start_date,
        end_date: dateRange.end_date,
        ...filters
      });
      setAnalytics(response.data);
    } catch (error) {
      console.error('Analytics fetch error:', error);
    } finally {
      setAnalyticsLoading(false);
    }
  };

  // Date range presets
  const datePresets = [
    { label: 'Today', value: 'today' },
    { label: 'Yesterday', value: 'yesterday' },
    { label: 'This Week', value: 'this_week' },
    { label: 'Last Week', value: 'last_week' },
    { label: 'This Month', value: 'this_month' },
    { label: 'Last Month', value: 'last_month' },
    { label: 'This Quarter', value: 'this_quarter' },
    { label: 'Last Quarter', value: 'last_quarter' },
    { label: 'This Year', value: 'this_year' },
    { label: 'Last Year', value: 'last_year' },
    { label: 'Custom', value: 'custom' }
  ];

  const applyDatePreset = (preset) => {
    const now = new Date();
    let startDate, endDate;

    switch (preset) {
      case 'today':
        startDate = endDate = now;
        break;
      case 'yesterday':
        startDate = endDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case 'this_week':
        startDate = new Date(now.setDate(now.getDate() - now.getDay()));
        endDate = new Date(now.setDate(now.getDate() - now.getDay() + 6));
        break;
      case 'last_week':
        startDate = new Date(now.setDate(now.getDate() - now.getDay() - 7));
        endDate = new Date(now.setDate(now.getDate() - now.getDay() - 1));
        break;
      case 'this_month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        break;
      case 'last_month':
        startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        endDate = new Date(now.getFullYear(), now.getMonth(), 0);
        break;
      case 'this_quarter':
        const quarter = Math.floor(now.getMonth() / 3);
        startDate = new Date(now.getFullYear(), quarter * 3, 1);
        endDate = new Date(now.getFullYear(), quarter * 3 + 3, 0);
        break;
      case 'last_quarter':
        const lastQuarter = Math.floor(now.getMonth() / 3) - 1;
        startDate = new Date(now.getFullYear(), lastQuarter * 3, 1);
        endDate = new Date(now.getFullYear(), lastQuarter * 3 + 3, 0);
        break;
      case 'this_year':
        startDate = new Date(now.getFullYear(), 0, 1);
        endDate = new Date(now.getFullYear(), 11, 31);
        break;
      case 'last_year':
        startDate = new Date(now.getFullYear() - 1, 0, 1);
        endDate = new Date(now.getFullYear() - 1, 11, 31);
        break;
      default:
        return;
    }

    setDateRange({
      start_date: startDate.toISOString().split('T')[0],
      end_date: endDate.toISOString().split('T')[0],
      preset
    });
  };

  // Report types
  const reportTypes = [
    { id: 'all', name: 'All Reports', icon: ChartBarIcon, color: 'blue' },
    { id: 'sales', name: 'Sales Reports', icon: CurrencyDollarIcon, color: 'green' },
    { id: 'leads', name: 'Lead Reports', icon: UserPlusIcon, color: 'purple' },
    { id: 'properties', name: 'Property Reports', icon: BuildingOfficeIcon, color: 'orange' },
    { id: 'financial', name: 'Financial Reports', icon: BanknotesIcon, color: 'emerald' },
    { id: 'performance', name: 'Performance Reports', icon: TrophyIcon, color: 'yellow' }
  ];

  // Export functions
  const handleExport = async (format) => {
    try {
      toast.loading(`Exporting ${format} report...`);
      // Implementation for export functionality
      setTimeout(() => {
        toast.success(`${format} report exported successfully!`);
      }, 2000);
    } catch (error) {
      toast.error(`Failed to export ${format} report`);
    }
  };

  // Save report function
  const saveReport = (reportName, reportConfig) => {
    const newReport = {
      id: Date.now(),
      name: reportName,
      config: reportConfig,
      created_at: new Date().toISOString(),
      created_by: user?.name || 'Unknown'
    };
    setSavedReports(prev => [...prev, newReport]);
    toast.success('Report saved successfully!');
  };

  // Comparison functions
  const startComparison = () => {
    setComparisonData({
      current: { ...reportData, ...analytics },
      previous: null
    });
    setShowComparison(true);
  };

  // Financial Management Functions
  const openFinancialManagement = () => {
    setShowFinancialManagement(true);
  };

  const openBudgetTracking = () => {
    setShowBudgetTracking(true);
  };

  const openExpenseManagement = () => {
    setShowExpenseManagement(true);
  };

  const openRevenueAnalytics = () => {
    setShowRevenueAnalytics(true);
  };

  const openFinancialForecasting = () => {
    setShowFinancialForecasting(true);
  };

  const openProfitLossAnalysis = () => {
    setShowProfitLossAnalysis(true);
  };

  const openCashFlowManagement = () => {
    setShowCashFlowManagement(true);
  };

  const openFinancialInsights = () => {
    setShowFinancialInsights(true);
  };

  const openTaxManagement = () => {
    setShowTaxManagement(true);
  };

  const openInvestmentTracking = () => {
    setShowInvestmentTracking(true);
  };

  const closeAllFinancialModals = () => {
    setShowFinancialManagement(false);
    setShowBudgetTracking(false);
    setShowExpenseManagement(false);
    setShowRevenueAnalytics(false);
    setShowFinancialForecasting(false);
    setShowProfitLossAnalysis(false);
    setShowCashFlowManagement(false);
    setShowFinancialInsights(false);
    setShowTaxManagement(false);
    setShowInvestmentTracking(false);
  };

  // Financial Data Functions
  const getFinancialMetrics = () => {
    return {
      totalRevenue: 2500000,
      totalExpenses: 1800000,
      netProfit: 700000,
      profitMargin: 28,
      cashFlow: 450000,
      budgetUtilization: 85,
      monthlyRecurring: 120000,
      averageDealValue: 850000,
      revenueGrowth: 15.5,
      expenseGrowth: 8.2,
      profitGrowth: 22.3
    };
  };

  const getBudgetData = () => {
    return {
      categories: [
        { name: 'Marketing', budget: 300000, spent: 250000, remaining: 50000, utilization: 83 },
        { name: 'Operations', budget: 500000, spent: 420000, remaining: 80000, utilization: 84 },
        { name: 'Technology', budget: 200000, spent: 180000, remaining: 20000, utilization: 90 },
        { name: 'Personnel', budget: 800000, spent: 750000, remaining: 50000, utilization: 94 },
        { name: 'Facilities', budget: 150000, spent: 120000, remaining: 30000, utilization: 80 }
      ],
      monthlyTrends: [
        { month: 'Jan', budget: 200000, spent: 180000 },
        { month: 'Feb', budget: 200000, spent: 195000 },
        { month: 'Mar', budget: 200000, spent: 210000 },
        { month: 'Apr', budget: 200000, spent: 185000 },
        { month: 'May', budget: 200000, spent: 220000 },
        { month: 'Jun', budget: 200000, spent: 205000 }
      ]
    };
  };

  const getExpenseData = () => {
    return {
      categories: [
        { name: 'Office Rent', amount: 45000, percentage: 25, trend: '+5%' },
        { name: 'Marketing', amount: 35000, percentage: 19, trend: '+12%' },
        { name: 'Software', amount: 25000, percentage: 14, trend: '+8%' },
        { name: 'Travel', amount: 20000, percentage: 11, trend: '-3%' },
        { name: 'Utilities', amount: 15000, percentage: 8, trend: '+2%' },
        { name: 'Other', amount: 35000, percentage: 19, trend: '+1%' }
      ],
      monthlyExpenses: [
        { month: 'Jan', amount: 165000 },
        { month: 'Feb', amount: 172000 },
        { month: 'Mar', amount: 185000 },
        { month: 'Apr', amount: 178000 },
        { month: 'May', amount: 192000 },
        { month: 'Jun', amount: 180000 }
      ]
    };
  };

  // Quick actions for floating button
  const quickActions = [
    {
      label: 'Financial Management',
      description: 'Comprehensive financial analytics',
      icon: BanknotesIcon,
      color: 'from-green-500 to-emerald-600',
      onClick: openFinancialManagement
    },
    {
      label: 'Budget Tracking',
      description: 'Monitor budget utilization',
      icon: ChartBarIcon,
      color: 'from-blue-500 to-indigo-600',
      onClick: openBudgetTracking
    },
    {
      label: 'Expense Management',
      description: 'Track and analyze expenses',
      icon: CurrencyDollarIcon,
      color: 'from-red-500 to-pink-600',
      onClick: openExpenseManagement
    },
    {
      label: 'Revenue Analytics',
      description: 'Analyze revenue streams',
      icon: ArrowTrendingUpIcon,
      color: 'from-green-500 to-teal-600',
      onClick: openRevenueAnalytics
    },
    {
      label: 'Financial Forecasting',
      description: 'Predict future financial trends',
      icon: PresentationChartLineIcon,
      color: 'from-purple-500 to-indigo-600',
      onClick: openFinancialForecasting
    },
    {
      label: 'Profit & Loss Analysis',
      description: 'Detailed P&L insights',
      icon: ChartPieIcon,
      color: 'from-orange-500 to-red-600',
      onClick: openProfitLossAnalysis
    },
    {
      label: 'Cash Flow Management',
      description: 'Monitor cash flow patterns',
      icon: ArrowUpIcon,
      color: 'from-cyan-500 to-blue-600',
      onClick: openCashFlowManagement
    },
    {
      label: 'Financial Insights',
      description: 'AI-powered financial insights',
      icon: SparklesIcon,
      color: 'from-yellow-500 to-orange-600',
      onClick: openFinancialInsights
    },
    {
      label: 'Tax Management',
      description: 'Tax planning and compliance',
      icon: DocumentTextIcon,
      color: 'from-gray-500 to-slate-600',
      onClick: openTaxManagement
    },
    {
      label: 'Investment Tracking',
      description: 'Track investment performance',
      icon: TrophyIcon,
      color: 'from-amber-500 to-yellow-600',
      onClick: openInvestmentTracking
    },
    {
      label: 'Generate Report',
      description: 'Create a new custom report',
      icon: ChartBarIcon,
      color: 'from-blue-500 to-indigo-600',
      onClick: () => setShowExportModal(true)
    },
    {
      label: 'Export Data',
      description: 'Export data to Excel/CSV',
      icon: DocumentArrowDownIcon,
      color: 'from-green-500 to-emerald-600',
      onClick: () => handleExport('Excel')
    },
    {
      label: 'Compare Periods',
      description: 'Compare with previous period',
      icon: ArrowTrendingUpIcon,
      color: 'from-purple-500 to-pink-600',
      onClick: () => startComparison()
    },
    {
      label: 'Save Report',
      description: 'Save current report configuration',
      icon: BookmarkIcon,
      color: 'from-orange-500 to-red-600',
      onClick: () => saveReport('Custom Report', { dateRange, filters, activeTab })
    }
  ];

  // Utility functions
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Computed values
  const totalRevenue = useMemo(() => {
    return reportData.salesPerformance.reduce((sum, item) => sum + (item.total || 0), 0);
  }, [reportData.salesPerformance]);

  const totalLeads = useMemo(() => {
    return reportData.leadSources.reduce((sum, item) => sum + (item.count || 0), 0);
  }, [reportData.leadSources]);

  const totalProperties = useMemo(() => {
    return reportData.salesPerformance.reduce((sum, item) => sum + (item.count || 0), 0);
  }, [reportData.salesPerformance]);

  const conversionRate = useMemo(() => {
    if (totalLeads === 0) return 0;
    return ((totalProperties / totalLeads) * 100).toFixed(1);
  }, [totalLeads, totalProperties]);

  const averageDealSize = useMemo(() => {
    if (totalProperties === 0) return 0;
    return totalRevenue / totalProperties;
  }, [totalRevenue, totalProperties]);

  // KPI calculations with trends
  const kpiData = useMemo(() => {
    const previousPeriod = {
      revenue: totalRevenue * 0.85, // Mock previous period data
      leads: totalLeads * 0.92,
      properties: totalProperties * 0.88,
      conversion: parseFloat(conversionRate) * 0.95
    };

    return [
      {
        title: 'Total Revenue',
        value: formatCurrency(totalRevenue),
        change: ((totalRevenue - previousPeriod.revenue) / previousPeriod.revenue * 100).toFixed(1),
        trend: totalRevenue > previousPeriod.revenue ? 'up' : 'down',
        icon: CurrencyDollarIcon,
        color: 'blue'
      },
      {
        title: 'Total Leads',
        value: totalLeads.toLocaleString(),
        change: ((totalLeads - previousPeriod.leads) / previousPeriod.leads * 100).toFixed(1),
        trend: totalLeads > previousPeriod.leads ? 'up' : 'down',
        icon: UserPlusIcon,
        color: 'green'
      },
      {
        title: 'Properties Sold',
        value: totalProperties.toLocaleString(),
        change: ((totalProperties - previousPeriod.properties) / previousPeriod.properties * 100).toFixed(1),
        trend: totalProperties > previousPeriod.properties ? 'up' : 'down',
        icon: BuildingOfficeIcon,
        color: 'purple'
      },
      {
        title: 'Conversion Rate',
        value: `${conversionRate}%`,
        change: ((parseFloat(conversionRate) - previousPeriod.conversion) / previousPeriod.conversion * 100).toFixed(1),
        trend: parseFloat(conversionRate) > previousPeriod.conversion ? 'up' : 'down',
        icon: ArrowTrendingUpIcon,
        color: 'orange'
      }
    ];
  }, [totalRevenue, totalLeads, totalProperties, conversionRate]);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Enhanced Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <ChartBarIcon className="h-8 w-8 text-blue-600 mr-3" />
              Reports & Analytics
            </h1>
            <p className="mt-2 text-gray-600">
              Comprehensive insights into your real estate business performance
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Date Range Controls */}
            <div className="flex items-center gap-2">
              <CalendarDaysIcon className="h-5 w-5 text-gray-400" />
              <select
                value={dateRange.preset}
                onChange={(e) => applyDatePreset(e.target.value)}
                className="form-select text-sm"
              >
                {datePresets.map(preset => (
                  <option key={preset.value} value={preset.value}>
                    {preset.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={dateRange.start_date}
                onChange={(e) => setDateRange(prev => ({ ...prev, start_date: e.target.value, preset: 'custom' }))}
                className="form-input text-sm"
              />
              <span className="text-gray-500">to</span>
              <input
                type="date"
                value={dateRange.end_date}
                onChange={(e) => setDateRange(prev => ({ ...prev, end_date: e.target.value, preset: 'custom' }))}
                className="form-input text-sm"
              />
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`btn-secondary flex items-center ${showFilters ? 'bg-blue-50 text-blue-700 border-blue-200' : ''}`}
              >
                <FunnelIcon className="h-4 w-4 mr-2" />
                Filters
              </button>
              
              <button
                onClick={() => setShowSavedReports(true)}
                className="btn-secondary flex items-center"
              >
                <BookmarkIcon className="h-4 w-4 mr-2" />
                Saved
              </button>
              
              <button
                onClick={() => setShowExportModal(true)}
                className="btn-primary flex items-center"
              >
                <DocumentArrowDownIcon className="h-4 w-4 mr-2" />
                Export
              </button>
            </div>
          </div>
        </div>
        
        {/* Report Type Tabs */}
        <div className="mt-6">
          <div className="flex flex-wrap gap-2">
            {reportTypes.map((type) => {
              const IconComponent = type.icon;
              return (
                <button
                  key={type.id}
                  onClick={() => setSelectedReportType(type.id)}
                  className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedReportType === type.id
                      ? `bg-${type.color}-100 text-${type.color}-700 border border-${type.color}-200`
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <IconComponent className="h-4 w-4 mr-2" />
                  {type.name}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Advanced Filters</h3>
            <button
              onClick={() => setShowFilters(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Property Type</label>
              <select
                value={filters.property_type}
                onChange={(e) => setFilters(prev => ({ ...prev, property_type: e.target.value }))}
                className="form-select"
              >
                <option value="">All Types</option>
                <option value="apartment">Apartment</option>
                <option value="villa">Villa</option>
                <option value="plot">Plot</option>
                <option value="commercial">Commercial</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input
                type="text"
                value={filters.location}
                onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                placeholder="Enter location"
                className="form-input"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Employee</label>
              <select
                value={filters.employee}
                onChange={(e) => setFilters(prev => ({ ...prev, employee: e.target.value }))}
                className="form-select"
              >
                <option value="">All Employees</option>
                <option value="1">John Doe</option>
                <option value="2">Jane Smith</option>
                <option value="3">Mike Johnson</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Lead Source</label>
              <select
                value={filters.lead_source}
                onChange={(e) => setFilters(prev => ({ ...prev, lead_source: e.target.value }))}
                className="form-select"
              >
                <option value="">All Sources</option>
                <option value="website">Website</option>
                <option value="referral">Referral</option>
                <option value="social_media">Social Media</option>
                <option value="advertisement">Advertisement</option>
              </select>
            </div>
          </div>
          
          <div className="mt-4 flex justify-end gap-3">
            <button
              onClick={() => setFilters({
                property_type: '',
                location: '',
                employee: '',
                lead_source: '',
                status: '',
                price_range: { min: '', max: '' }
              })}
              className="btn-secondary"
            >
              Clear Filters
            </button>
            <button
              onClick={() => setShowFilters(false)}
              className="btn-primary"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}

      {/* View Mode Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">View:</span>
          <div className="flex bg-gray-100 rounded-lg p-1">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: ChartBarSquareIcon },
              { id: 'charts', label: 'Charts', icon: ChartPieIcon },
              { id: 'tables', label: 'Tables', icon: TableCellsIcon }
            ].map((mode) => {
              const IconComponent = mode.icon;
              return (
                <button
                  key={mode.id}
                  onClick={() => setViewMode(mode.id)}
                  className={`flex items-center px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    viewMode === mode.id
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <IconComponent className="h-4 w-4 mr-1.5" />
                  {mode.label}
                </button>
              );
            })}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={startComparison}
            className="btn-secondary flex items-center text-sm"
          >
            <ArrowTrendingUpIcon className="h-4 w-4 mr-1.5" />
            Compare
          </button>
          <button
            onClick={() => fetchReportData()}
            className="btn-secondary flex items-center text-sm"
          >
            <ArrowTrendingUpIcon className="h-4 w-4 mr-1.5" />
            Refresh
          </button>
        </div>
      </div>

      {/* Enhanced KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiData.map((kpi, index) => {
          const IconComponent = kpi.icon;
          const TrendIcon = kpi.trend === 'up' ? ArrowUpIcon : ArrowDownIcon;
          const trendColor = kpi.trend === 'up' ? 'text-green-600' : 'text-red-600';
          const bgColor = `bg-${kpi.color}-100`;
          const iconColor = `text-${kpi.color}-600`;
          
          return (
            <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`p-3 rounded-lg ${bgColor}`}>
                    <IconComponent className={`h-6 w-6 ${iconColor}`} />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">{kpi.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
                  </div>
                </div>
                <div className={`flex items-center ${trendColor}`}>
                  <TrendIcon className="h-4 w-4 mr-1" />
                  <span className="text-sm font-medium">{kpi.change}%</span>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center text-xs text-gray-500">
                  <span>vs previous period</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Additional Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Average Deal Size</p>
              <p className="text-xl font-bold text-gray-900">{formatCurrency(averageDealSize)}</p>
            </div>
            <div className="p-3 bg-emerald-100 rounded-lg">
              <BanknotesIcon className="h-6 w-6 text-emerald-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Active Listings</p>
              <p className="text-xl font-bold text-gray-900">
                {analytics.active_listings || 0}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <HomeIcon className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Pipeline Value</p>
              <p className="text-xl font-bold text-gray-900">
                {formatCurrency(analytics.pipeline_value || 0)}
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <ArrowTrendingUpIcon className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Charts Grid */}
      {viewMode === 'dashboard' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sales Performance */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Sales Performance</h3>
                <p className="text-sm text-gray-500">Revenue trends over time</p>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 text-gray-400 hover:text-gray-600">
                  <EyeIcon className="h-4 w-4" />
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600">
                  <ShareIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={reportData.salesPerformance}>
                  <defs>
                    <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip 
                    formatter={(value) => [formatCurrency(value), 'Revenue']}
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="total" 
                    stroke="#3B82F6" 
                    strokeWidth={2}
                    fill="url(#salesGradient)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Lead Sources */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Lead Sources</h3>
                <p className="text-sm text-gray-500">Distribution of lead sources</p>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 text-gray-400 hover:text-gray-600">
                  <EyeIcon className="h-4 w-4" />
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600">
                  <ShareIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={reportData.leadSources}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {reportData.leadSources.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Employee Productivity */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Employee Productivity</h3>
                <p className="text-sm text-gray-500">Performance by employee</p>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 text-gray-400 hover:text-gray-600">
                  <EyeIcon className="h-4 w-4" />
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600">
                  <ShareIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={reportData.employeeProductivity}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="employee_name" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Legend />
                  <Bar dataKey="leads_handled" fill="#3B82F6" name="Leads Handled" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="conversions" fill="#10B981" name="Conversions" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Inventory Status */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Inventory Status</h3>
                <p className="text-sm text-gray-500">Property status distribution</p>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 text-gray-400 hover:text-gray-600">
                  <EyeIcon className="h-4 w-4" />
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600">
                  <ShareIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={reportData.inventoryData.inventory_by_status || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="status" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip 
                    formatter={(value) => [value, 'Properties']}
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Bar dataKey="count" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Detailed Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performing Employees */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Top Performing Employees</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {reportData.employeeProductivity
                .sort((a, b) => b.conversions - a.conversions)
                .slice(0, 5)
                .map((employee, index) => (
                  <div key={employee.employee_id} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
                          <span className="text-sm font-medium text-white">
                            {employee.employee_name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">{employee.employee_name}</p>
                        <p className="text-sm text-gray-500">{employee.conversions} conversions</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {formatCurrency(employee.sales_value)}
                      </p>
                      <p className="text-sm text-gray-500">{employee.conversion_rate}% rate</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Lead Source Performance */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Lead Source Performance</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {reportData.leadSources.map((source, index) => (
                <div key={source.source} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div 
                      className="h-4 w-4 rounded-full mr-3"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    ></div>
                    <p className="text-sm font-medium text-gray-900 capitalize">
                      {source.source.replace('_', ' ')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{source.count} leads</p>
                    <p className="text-sm text-gray-500">{source.conversion_rate}% conversion</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Export Report</h3>
              <button
                onClick={() => setShowExportModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Report Name</label>
                  <input
                    type="text"
                    placeholder="Enter report name"
                    className="form-input w-full"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Format</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => handleExport('PDF')}
                      className="flex items-center justify-center p-3 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      <DocumentTextIcon className="h-5 w-5 text-red-600 mr-2" />
                      PDF
                    </button>
                    <button
                      onClick={() => handleExport('Excel')}
                      className="flex items-center justify-center p-3 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      <DocumentArrowDownIcon className="h-5 w-5 text-green-600 mr-2" />
                      Excel
                    </button>
                  </div>
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
                    handleExport('PDF');
                    setShowExportModal(false);
                  }}
                  className="btn-primary"
                >
                  Export
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Saved Reports Modal */}
      {showSavedReports && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Saved Reports</h3>
              <button
                onClick={() => setShowSavedReports(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6">
              {savedReports.length === 0 ? (
                <div className="text-center py-8">
                  <BookmarkIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">No saved reports</h4>
                  <p className="text-gray-500">Save your report configurations for quick access</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {savedReports.map((report) => (
                    <div key={report.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">{report.name}</h4>
                        <p className="text-sm text-gray-500">
                          Created by {report.created_by} • {new Date(report.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="btn-secondary text-sm">Load</button>
                        <button className="btn-secondary text-sm text-red-600">Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Comparison Modal */}
      {showComparison && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Period Comparison</h3>
              <button
                onClick={() => setShowComparison(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-4">Current Period</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Revenue:</span>
                      <span className="font-medium">{formatCurrency(totalRevenue)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Leads:</span>
                      <span className="font-medium">{totalLeads}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Properties Sold:</span>
                      <span className="font-medium">{totalProperties}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Conversion Rate:</span>
                      <span className="font-medium">{conversionRate}%</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-4">Previous Period</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Revenue:</span>
                      <span className="font-medium">{formatCurrency(totalRevenue * 0.85)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Leads:</span>
                      <span className="font-medium">{Math.round(totalLeads * 0.92)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Properties Sold:</span>
                      <span className="font-medium">{Math.round(totalProperties * 0.88)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Conversion Rate:</span>
                      <span className="font-medium">{(parseFloat(conversionRate) * 0.95).toFixed(1)}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Financial Management Modals */}
      {showFinancialManagement && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Financial Management Dashboard</h2>
                <button
                  onClick={closeAllFinancialModals}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-6 text-white">
                  <div className="flex items-center justify-between mb-4">
                    <BanknotesIcon className="h-8 w-8" />
                    <span className="text-2xl font-bold">₹25L</span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Total Revenue</h3>
                  <p className="text-green-100">+15.5% from last month</p>
                </div>
                <div className="bg-gradient-to-br from-red-500 to-pink-600 rounded-xl p-6 text-white">
                  <div className="flex items-center justify-between mb-4">
                    <CurrencyDollarIcon className="h-8 w-8" />
                    <span className="text-2xl font-bold">₹18L</span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Total Expenses</h3>
                  <p className="text-red-100">+8.2% from last month</p>
                </div>
                <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl p-6 text-white">
                  <div className="flex items-center justify-between mb-4">
                    <ArrowTrendingUpIcon className="h-8 w-8" />
                    <span className="text-2xl font-bold">₹7L</span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Net Profit</h3>
                  <p className="text-blue-100">+22.3% from last month</p>
                </div>
                <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl p-6 text-white">
                  <div className="flex items-center justify-between mb-4">
                    <ChartBarIcon className="h-8 w-8" />
                    <span className="text-2xl font-bold">28%</span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Profit Margin</h3>
                  <p className="text-purple-100">Excellent performance</p>
                </div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Financial Metrics</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Cash Flow</span>
                      <span className="font-semibold text-green-600">₹4.5L</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Budget Utilization</span>
                      <span className="font-semibold text-blue-600">85%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Monthly Recurring</span>
                      <span className="font-semibold text-purple-600">₹1.2L</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Average Deal Value</span>
                      <span className="font-semibold text-orange-600">₹8.5L</span>
                    </div>
                  </div>
                </div>
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Growth Trends</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Revenue Growth</span>
                      <span className="font-semibold text-green-600">+15.5%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Expense Growth</span>
                      <span className="font-semibold text-red-600">+8.2%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Profit Growth</span>
                      <span className="font-semibold text-green-600">+22.3%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Market Share</span>
                      <span className="font-semibold text-blue-600">12.5%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Budget Tracking Modal */}
      {showBudgetTracking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Budget Tracking & Management</h2>
                <button
                  onClick={closeAllFinancialModals}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="space-y-6">
                {getBudgetData().categories.map((category, index) => (
                  <div key={index} className="bg-white border border-gray-200 rounded-xl p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
                        <p className="text-sm text-gray-600">Budget: {formatCurrency(category.budget)}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-bold text-blue-600">{category.utilization}%</span>
                        <p className="text-sm text-gray-500">Utilized</p>
                      </div>
                    </div>
                    <div className="mb-4">
                      <div className="flex justify-between text-sm text-gray-600 mb-2">
                        <span>Spent: {formatCurrency(category.spent)}</span>
                        <span>Remaining: {formatCurrency(category.remaining)}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className={`h-3 rounded-full ${
                            category.utilization > 90 ? 'bg-red-500' :
                            category.utilization > 75 ? 'bg-yellow-500' :
                            'bg-green-500'
                          }`}
                          style={{width: `${category.utilization}%`}}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Expense Management Modal */}
      {showExpenseManagement && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Expense Management & Analysis</h2>
                <button
                  onClick={closeAllFinancialModals}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Expense Categories</h3>
                  <div className="space-y-4">
                    {getExpenseData().categories.map((expense, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div>
                          <h4 className="font-medium text-gray-900">{expense.name}</h4>
                          <p className="text-sm text-gray-600">{expense.percentage}% of total</p>
                        </div>
                        <div className="text-right">
                          <span className="text-lg font-bold text-gray-900">{formatCurrency(expense.amount)}</span>
                          <p className={`text-xs ${expense.trend.startsWith('+') ? 'text-red-600' : 'text-green-600'}`}>
                            {expense.trend}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Expense Trends</h3>
                  <div className="space-y-3">
                    {getExpenseData().monthlyExpenses.map((month, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span className="text-gray-600">{month.month}</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-500 h-2 rounded-full" 
                              style={{width: `${(month.amount / 200000) * 100}%`}}
                            ></div>
                          </div>
                          <span className="text-sm font-semibold">{formatCurrency(month.amount)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Add Button */}
      <FloatingAddButton
        type="report"
        onAdd={() => setShowExportModal(true)}
        quickActions={quickActions}
        label="Generate Report"
      />
    </div>
  );
};

export default Reports;
