import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { employeesAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  UserGroupIcon,
  PhoneIcon,
  EnvelopeIcon,
  ChartBarIcon,
  UserIcon,
  CalendarIcon,
  Squares2X2Icon,
  ListBulletIcon,
  TableCellsIcon,
  XMarkIcon,
  CheckCircleIcon,
  TrophyIcon,
  BuildingOfficeIcon,
  ArrowPathIcon,
  UserPlusIcon,
  EyeIcon,
  StarIcon,
  ClockIcon,
  DocumentTextIcon,
  AcademicCapIcon,
  ChatBubbleLeftRightIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  MinusIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const Employees = () => {
  const { hasPermission } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState({});
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [filters, setFilters] = useState({
    search: '',
    role: '',
    is_active: '',
    department: '',
    date_range: '',
  });
  const [pagination, setPagination] = useState({
    page: 1,
    per_page: 20,
    total: 0,
    pages: 0,
  });
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showPerformanceModal, setShowPerformanceModal] = useState(false);
  const [employeePerformance, setEmployeePerformance] = useState(null);
  const [showPerformanceManagement, setShowPerformanceManagement] = useState(false);
  const [showGoalTracking, setShowGoalTracking] = useState(false);
  const [showPerformanceReviews, setShowPerformanceReviews] = useState(false);
  const [showSkillAssessment, setShowSkillAssessment] = useState(false);
  const [showPerformanceAnalytics, setShowPerformanceAnalytics] = useState(false);
  const [showTeamPerformance, setShowTeamPerformance] = useState(false);
  const [showPerformanceInsights, setShowPerformanceInsights] = useState(false);
  const [showPerformanceCoaching, setShowPerformanceCoaching] = useState(false);
  const [showPerformanceReports, setShowPerformanceReports] = useState(false);
  const [showPerformanceBenchmarking, setShowPerformanceBenchmarking] = useState(false);
  const [showPerformanceForecasting, setShowPerformanceForecasting] = useState(false);
  const [showPerformanceOptimization, setShowPerformanceOptimization] = useState(false);
  const [showPerformanceGamification, setShowPerformanceGamification] = useState(false);
  const [showPerformanceRecognition, setShowPerformanceRecognition] = useState(false);
  const [showPerformanceDevelopment, setShowPerformanceDevelopment] = useState(false);

  useEffect(() => {
    fetchEmployees();
    fetchAnalytics();
  }, [pagination.page, filters]);

  const fetchAnalytics = async () => {
    try {
      setAnalyticsLoading(true);
      const employeesResponse = await employeesAPI.getEmployees({ per_page: 1000 });
      const allEmployees = employeesResponse.data.employees || [];
      
      const totalEmployees = allEmployees.length;
      const activeEmployees = allEmployees.filter(emp => emp.is_active).length;
      const inactiveEmployees = totalEmployees - activeEmployees;
      
      const roleDistribution = allEmployees.reduce((acc, emp) => {
        acc[emp.role] = (acc[emp.role] || 0) + 1;
        return acc;
      }, {});
      
      const analyticsData = {
        totalEmployees,
        activeEmployees,
        inactiveEmployees,
        roleDistribution,
        avgLeadsPerEmployee: 0,
        avgConversionRate: 0
      };
      
      setAnalytics(analyticsData);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
      setAnalytics({
        totalEmployees: 0,
        activeEmployees: 0,
        inactiveEmployees: 0,
        roleDistribution: {},
        avgLeadsPerEmployee: 0,
        avgConversionRate: 0
      });
    } finally {
      setAnalyticsLoading(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.page,
        per_page: pagination.per_page,
        ...filters,
      };
      
      const response = await employeesAPI.getEmployees(params);
      setEmployees(response.data.employees);
      setPagination(prev => ({
        ...prev,
        total: response.data.total,
        pages: response.data.pages,
      }));
    } catch (error) {
      toast.error('Failed to fetch employees');
      console.error('Employees fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this employee?')) {
      return;
    }

    try {
      await employeesAPI.deleteEmployee(id);
      toast.success('Employee deleted successfully');
      fetchEmployees();
    } catch (error) {
      toast.error('Failed to delete employee');
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      role: '',
      is_active: '',
      department: '',
      date_range: '',
    });
    setSearchTerm('');
    setStatusFilter('');
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const openDetailsModal = (employee) => {
    setSelectedEmployee(employee);
    setShowDetailsModal(true);
  };

  const closeDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedEmployee(null);
  };

  const openPerformanceModal = async (employee) => {
    setSelectedEmployee(employee);
    setShowPerformanceModal(true);
    
    // For now, show empty performance data since we don't have real performance data
    const performanceData = {
      employee: employee,
      hasData: false, // Flag to indicate if we have real data
      message: "Performance data will be available once the employee starts working with leads and properties."
    };
    
    setEmployeePerformance(performanceData);
  };

  const closePerformanceModal = () => {
    setShowPerformanceModal(false);
    setSelectedEmployee(null);
    setEmployeePerformance(null);
  };

  // Enhanced Performance Management Functions
  const openPerformanceManagement = () => {
    setShowPerformanceManagement(true);
  };

  const openGoalTracking = () => {
    setShowGoalTracking(true);
  };

  const openPerformanceReviews = () => {
    setShowPerformanceReviews(true);
  };

  const openSkillAssessment = () => {
    setShowSkillAssessment(true);
  };

  const openPerformanceAnalytics = () => {
    setShowPerformanceAnalytics(true);
  };

  const openTeamPerformance = () => {
    setShowTeamPerformance(true);
  };

  const openPerformanceInsights = () => {
    setShowPerformanceInsights(true);
  };

  const openPerformanceCoaching = () => {
    setShowPerformanceCoaching(true);
  };

  const openPerformanceReports = () => {
    setShowPerformanceReports(true);
  };

  const openPerformanceBenchmarking = () => {
    setShowPerformanceBenchmarking(true);
  };

  const openPerformanceForecasting = () => {
    setShowPerformanceForecasting(true);
  };

  const openPerformanceOptimization = () => {
    setShowPerformanceOptimization(true);
  };

  const openPerformanceGamification = () => {
    setShowPerformanceGamification(true);
  };

  const openPerformanceRecognition = () => {
    setShowPerformanceRecognition(true);
  };

  const openPerformanceDevelopment = () => {
    setShowPerformanceDevelopment(true);
  };

  const closeAllPerformanceModals = () => {
    setShowPerformanceManagement(false);
    setShowGoalTracking(false);
    setShowPerformanceReviews(false);
    setShowSkillAssessment(false);
    setShowPerformanceAnalytics(false);
    setShowTeamPerformance(false);
    setShowPerformanceInsights(false);
    setShowPerformanceCoaching(false);
    setShowPerformanceReports(false);
    setShowPerformanceBenchmarking(false);
    setShowPerformanceForecasting(false);
    setShowPerformanceOptimization(false);
    setShowPerformanceGamification(false);
    setShowPerformanceRecognition(false);
    setShowPerformanceDevelopment(false);
  };

  // Advanced Performance Analytics Functions
  const getPerformanceMetrics = () => {
    return {
      overallScore: 87,
      salesPerformance: 92,
      customerSatisfaction: 85,
      teamCollaboration: 88,
      goalAchievement: 90,
      skillDevelopment: 82,
      leadership: 85,
      innovation: 78,
      productivity: 89,
      quality: 91,
      trends: {
        salesPerformance: '+12%',
        customerSatisfaction: '+8%',
        teamCollaboration: '+5%',
        goalAchievement: '+15%',
        skillDevelopment: '+3%'
      },
      strengths: ['Sales Excellence', 'Customer Relations', 'Goal Achievement'],
      areasForImprovement: ['Innovation', 'Skill Development', 'Leadership'],
      nextReviewDate: '2024-02-15',
      lastReviewDate: '2024-01-15'
    };
  };

  const getGoalTrackingData = () => {
    return {
      currentGoals: [
        { id: 1, title: 'Increase Sales by 20%', target: 120, current: 95, deadline: '2024-03-31', status: 'On Track', priority: 'High' },
        { id: 2, title: 'Complete Advanced Training', target: 100, current: 75, deadline: '2024-02-28', status: 'In Progress', priority: 'Medium' },
        { id: 3, title: 'Improve Customer Satisfaction', target: 90, current: 85, deadline: '2024-04-30', status: 'On Track', priority: 'High' },
        { id: 4, title: 'Lead Team Project', target: 100, current: 60, deadline: '2024-05-15', status: 'Behind', priority: 'High' }
      ],
      completedGoals: [
        { id: 5, title: 'Complete Basic Training', completedDate: '2024-01-15', achievement: 100, impact: 'High' },
        { id: 6, title: 'Meet Q4 Sales Target', completedDate: '2023-12-31', achievement: 105, impact: 'Very High' }
      ],
      goalCategories: ['Sales', 'Training', 'Customer Service', 'Leadership', 'Innovation'],
      goalTypes: ['Quantitative', 'Qualitative', 'Behavioral', 'Developmental']
    };
  };

  const getSkillAssessmentData = () => {
    return {
      currentSkills: [
        { skill: 'Sales & Negotiation', level: 90, category: 'Core', lastAssessed: '2024-01-10' },
        { skill: 'Customer Relations', level: 85, category: 'Core', lastAssessed: '2024-01-10' },
        { skill: 'Communication', level: 88, category: 'Soft Skills', lastAssessed: '2024-01-10' },
        { skill: 'Leadership', level: 75, category: 'Management', lastAssessed: '2024-01-10' },
        { skill: 'Technical Skills', level: 70, category: 'Technical', lastAssessed: '2024-01-10' },
        { skill: 'Problem Solving', level: 82, category: 'Analytical', lastAssessed: '2024-01-10' }
      ],
      skillGaps: [
        { skill: 'Digital Marketing', gap: 25, priority: 'High', recommendedTraining: 'Digital Marketing Fundamentals' },
        { skill: 'Data Analysis', gap: 30, priority: 'Medium', recommendedTraining: 'Excel Advanced & Analytics' },
        { skill: 'Project Management', gap: 20, priority: 'High', recommendedTraining: 'PMP Certification' }
      ],
      skillCategories: ['Core', 'Soft Skills', 'Management', 'Technical', 'Analytical'],
      assessmentHistory: [
        { date: '2024-01-10', overallScore: 87, improvement: '+5%' },
        { date: '2023-10-15', overallScore: 82, improvement: '+8%' },
        { date: '2023-07-20', overallScore: 74, improvement: '+3%' }
      ]
    };
  };

  const getTeamPerformanceData = () => {
    return {
      teamMetrics: {
        overallTeamScore: 89,
        teamCollaboration: 92,
        teamProductivity: 87,
        teamInnovation: 78,
        teamSatisfaction: 85
      },
      individualContributions: [
        { name: 'Rajesh Kumar', contribution: 95, role: 'Team Lead', impact: 'Very High' },
        { name: 'Priya Sharma', contribution: 88, role: 'Senior Sales', impact: 'High' },
        { name: 'Amit Patel', contribution: 82, role: 'Sales Executive', impact: 'Medium' },
        { name: 'Sneha Singh', contribution: 90, role: 'Sales Executive', impact: 'High' }
      ],
      teamGoals: [
        { goal: 'Team Sales Target', target: 1000, current: 850, deadline: '2024-03-31', status: 'On Track' },
        { goal: 'Customer Satisfaction', target: 90, current: 87, deadline: '2024-04-30', status: 'On Track' },
        { goal: 'Team Training Completion', target: 100, current: 75, deadline: '2024-02-28', status: 'In Progress' }
      ],
      collaborationMetrics: {
        crossTeamProjects: 5,
        knowledgeSharing: 92,
        mentorship: 88,
        conflictResolution: 85
      }
    };
  };

  const filteredAndSortedEmployees = employees.filter(emp => {
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      if (!`${emp.first_name} ${emp.last_name}`.toLowerCase().includes(searchLower) &&
          !emp.email?.toLowerCase().includes(searchLower) &&
          !emp.phone?.includes(searchTerm) &&
          !emp.role?.toLowerCase().includes(searchLower)) {
        return false;
      }
    }

    if (statusFilter) {
      if (statusFilter === 'active' && !emp.is_active) return false;
      if (statusFilter === 'inactive' && emp.is_active) return false;
    }

    return true;
  });

  const getRoleBadge = (role) => {
    const roleClasses = {
      admin: 'bg-red-100 text-red-800',
      manager: 'bg-blue-100 text-blue-800',
      sales_agent: 'bg-green-100 text-green-800',
      employee: 'bg-gray-100 text-gray-800',
    };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${roleClasses[role] || 'bg-gray-100 text-gray-800'}`}>
        {role.replace('_', ' ')}
      </span>
    );
  };

  const getStatusBadge = (isActive) => {
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
      }`}>
        {isActive ? 'Active' : 'Inactive'}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading && employees.length === 0) {
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
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl">
                <UserGroupIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Employee Directory</h1>
                <p className="text-sm text-gray-500">Manage your team and track performance</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowAnalytics(!showAnalytics)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  showAnalytics 
                    ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <ChartBarIcon className="h-4 w-4 inline mr-2" />
                Analytics
              </button>
              
              <button
                onClick={() => {
                  fetchEmployees();
                  fetchAnalytics();
                }}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                title="Refresh"
              >
                <ArrowPathIcon className="h-5 w-5" />
              </button>
              
              {hasPermission('admin') && (
                <Link
                  to="/employees/new"
                  className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 shadow-sm transition-colors"
                >
                  <UserPlusIcon className="h-4 w-4 mr-2" />
                  Add Employee
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Team Overview Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <UserGroupIcon className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Team</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.totalEmployees || 0}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircleIcon className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Active</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.activeEmployees || 0}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <TrophyIcon className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Avg Performance</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.avgConversionRate || 0}%</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <ChartBarIcon className="h-6 w-6 text-purple-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Leads/Person</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.avgLeadsPerEmployee || 0}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Analytics Panel */}
        {showAnalytics && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Performance Insights</h2>
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
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Team Structure */}
                  <div>
                    <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center">
                      <BuildingOfficeIcon className="h-5 w-5 text-blue-500 mr-2" />
                      Team Structure
                    </h3>
                    <div className="space-y-3">
                      {Object.entries(analytics.roleDistribution || {}).map(([role, count]) => (
                        <div key={role} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                          <div className="flex items-center gap-3">
                            <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                            <span className="font-medium text-gray-900 capitalize">{role.replace('_', ' ')}</span>
                          </div>
                          <span className="font-bold text-gray-700 bg-white px-2 py-1 rounded-full text-sm">{count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Enhanced Controls */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Search and Quick Filters */}
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="relative flex-1">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search employees by name, email, or role..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                />
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => setStatusFilter('')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    statusFilter === '' 
                      ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setStatusFilter('active')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    statusFilter === 'active' 
                      ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Active
                </button>
                <button
                  onClick={() => setStatusFilter('inactive')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    statusFilter === 'inactive' 
                      ? 'bg-red-100 text-red-700 border border-red-200' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Inactive
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
                    viewMode === 'grid' ? 'bg-white shadow-sm text-emerald-600' : 'text-gray-500 hover:text-gray-700'
                  }`}
                  title="Grid View"
                >
                  <Squares2X2Icon className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'list' ? 'bg-white shadow-sm text-emerald-600' : 'text-gray-500 hover:text-gray-700'
                  }`}
                  title="List View"
                >
                  <ListBulletIcon className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('table')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'table' ? 'bg-white shadow-sm text-emerald-600' : 'text-gray-500 hover:text-gray-700'
                  }`}
                  title="Table View"
                >
                  <TableCellsIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Employee Views */}
        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedEmployees.map((employee) => (
              <div key={employee.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                <div className="p-6 text-center bg-gradient-to-br from-gray-50 to-gray-100">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center mb-4 mx-auto">
                    <span className="text-2xl font-bold text-white">
                      {employee.first_name[0]}{employee.last_name[0]}
                    </span>
                  </div>
                  <h3 
                    className="text-lg font-semibold text-gray-900 mb-2 cursor-pointer hover:text-emerald-600 transition-colors"
                    onClick={() => openDetailsModal(employee)}
                    title="Click to view details"
                  >
                    {employee.first_name} {employee.last_name}
                  </h3>
                  <div className="flex justify-center space-x-2 mb-4">
                    {getRoleBadge(employee.role)}
                    {getStatusBadge(employee.is_active)}
                  </div>
                </div>
                <div className="p-6">
                  <div className="space-y-3 text-sm">
                    {employee.phone && (
                      <div className="flex items-center text-gray-600">
                        <PhoneIcon className="h-4 w-4 mr-3 text-gray-400" />
                        <a href={`tel:${employee.phone}`} className="hover:text-emerald-600 transition-colors">
                          {employee.phone}
                        </a>
                      </div>
                    )}
                    {employee.email && (
                      <div className="flex items-center text-gray-600">
                        <EnvelopeIcon className="h-4 w-4 mr-3 text-gray-400" />
                        <a href={`mailto:${employee.email}`} className="hover:text-emerald-600 transition-colors truncate">
                          {employee.email}
                        </a>
                      </div>
                    )}
                    <div className="flex items-center text-gray-600">
                      <CalendarIcon className="h-4 w-4 mr-3 text-gray-400" />
                      <span>Joined {formatDate(employee.created_at)}</span>
                    </div>
                  </div>
                  <div className="mt-6 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openDetailsModal(employee)}
                        className="p-1 text-emerald-600 hover:text-emerald-700 transition-colors"
                        title="View Details"
                      >
                        <EyeIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => openPerformanceModal(employee)}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center"
                      >
                        <ChartBarIcon className="h-4 w-4 mr-1" />
                        Performance
                      </button>
                    </div>
                    {hasPermission('admin') && (
                      <div className="flex items-center gap-1">
                        <Link
                          to={`/employees/${employee.id}/edit`}
                          className="p-1 text-gray-400 hover:text-emerald-600 transition-colors"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(employee.id)}
                          className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
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
              {filteredAndSortedEmployees.map((employee) => (
                <div key={employee.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                        <span className="text-lg font-bold text-white">
                          {employee.first_name[0]}{employee.last_name[0]}
                        </span>
                      </div>
                      
                      <div>
                        <h3 
                          className="text-lg font-semibold text-gray-900 cursor-pointer hover:text-emerald-600 transition-colors"
                          onClick={() => openDetailsModal(employee)}
                          title="Click to view details"
                        >
                          {employee.first_name} {employee.last_name}
                        </h3>
                        <div className="flex items-center gap-3 mt-1">
                          {getRoleBadge(employee.role)}
                          {getStatusBadge(employee.is_active)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6">
                      <div className="text-right text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <PhoneIcon className="h-4 w-4" />
                          <a href={`tel:${employee.phone}`} className="hover:text-emerald-600 transition-colors">
                            {employee.phone || 'N/A'}
                          </a>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <EnvelopeIcon className="h-4 w-4" />
                          <a href={`mailto:${employee.email}`} className="hover:text-emerald-600 transition-colors">
                            {employee.email}
                          </a>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openDetailsModal(employee)}
                          className="p-1 text-emerald-600 hover:text-emerald-700 transition-colors"
                          title="View Details"
                        >
                          <EyeIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => openPerformanceModal(employee)}
                          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                        >
                          Performance
                        </button>
                        
                        {hasPermission('admin') && (
                          <div className="flex items-center gap-1">
                            <Link
                              to={`/employees/${employee.id}/edit`}
                              className="p-1 text-gray-400 hover:text-emerald-600 transition-colors"
                            >
                              <PencilIcon className="h-4 w-4" />
                            </Link>
                            <button
                              onClick={() => handleDelete(employee.id)}
                              className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                            >
                              <TrashIcon className="h-4 w-4" />
                            </button>
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
                      Employee
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Joined
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredAndSortedEmployees.map((employee) => (
                    <tr key={employee.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center mr-4">
                            <span className="text-sm font-bold text-white">
                              {employee.first_name[0]}{employee.last_name[0]}
                            </span>
                          </div>
                          <div>
                            <div 
                              className="text-sm font-medium text-gray-900 cursor-pointer hover:text-emerald-600 transition-colors"
                              onClick={() => openDetailsModal(employee)}
                              title="Click to view details"
                            >
                              {employee.first_name} {employee.last_name}
                            </div>
                            <div className="text-sm text-gray-500">{employee.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getRoleBadge(employee.role)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(employee.is_active)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="space-y-1">
                          {employee.phone && (
                            <div>
                              <a href={`tel:${employee.phone}`} className="hover:text-emerald-600 transition-colors">
                                {employee.phone}
                              </a>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(employee.created_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openDetailsModal(employee)}
                            className="text-emerald-600 hover:text-emerald-700"
                            title="View Details"
                          >
                            <EyeIcon className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => openPerformanceModal(employee)}
                            className="text-blue-600 hover:text-blue-700"
                            title="View Performance"
                          >
                            <ChartBarIcon className="h-4 w-4" />
                          </button>
                          
                          {hasPermission('admin') && (
                            <>
                              <Link
                                to={`/employees/${employee.id}/edit`}
                                className="text-gray-400 hover:text-emerald-600 transition-colors"
                                title="Edit Employee"
                              >
                                <PencilIcon className="h-4 w-4" />
                              </Link>
                              <button
                                onClick={() => handleDelete(employee.id)}
                                className="text-gray-400 hover:text-red-600 transition-colors"
                                title="Delete Employee"
                              >
                                <TrashIcon className="h-4 w-4" />
                              </button>
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
        {filteredAndSortedEmployees.length === 0 && !loading && (
          <div className="text-center py-12">
            <UserGroupIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No employees found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by adding your first employee.
            </p>
            {hasPermission('admin') && (
              <div className="mt-6">
                <Link to="/employees/new" className="btn-primary">
                  <PlusIcon className="h-5 w-5 mr-2" />
                  Add Employee
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="flex justify-center mt-8">
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
                      ? 'bg-emerald-600 text-white'
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
      </div>

      {/* Employee Details Modal */}
      {showDetailsModal && selectedEmployee && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                    <span className="text-2xl font-bold text-white">
                      {selectedEmployee.first_name[0]}{selectedEmployee.last_name[0]}
                    </span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {selectedEmployee.first_name} {selectedEmployee.last_name}
                    </h2>
                    <div className="flex items-center gap-3 mt-1">
                      {getRoleBadge(selectedEmployee.role)}
                      {getStatusBadge(selectedEmployee.is_active)}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      closeDetailsModal();
                      openPerformanceModal(selectedEmployee);
                    }}
                    className="px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                  >
                    <ChartBarIcon className="h-4 w-4 mr-1" />
                    Performance
                  </button>
                  {hasPermission('admin') && (
                    <Link
                      to={`/employees/${selectedEmployee.id}/edit`}
                      className="px-3 py-2 bg-emerald-600 text-white text-sm rounded-lg hover:bg-emerald-700 transition-colors flex items-center"
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
                {/* Personal Information */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <UserIcon className="h-5 w-5 text-emerald-500 mr-2" />
                      Personal Information
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">Email</p>
                          <a href={`mailto:${selectedEmployee.email}`} className="text-emerald-600 hover:text-emerald-700">
                            {selectedEmployee.email}
                          </a>
                        </div>
                      </div>
                      
                      {selectedEmployee.phone && (
                        <div className="flex items-center gap-3">
                          <PhoneIcon className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-500">Phone</p>
                            <a href={`tel:${selectedEmployee.phone}`} className="text-emerald-600 hover:text-emerald-700">
                              {selectedEmployee.phone}
                            </a>
                          </div>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-3">
                        <CalendarIcon className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">Joined Date</p>
                          <p className="text-gray-900">{formatDate(selectedEmployee.created_at)}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <BuildingOfficeIcon className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">Department</p>
                          <p className="text-gray-900 capitalize">{selectedEmployee.role?.replace('_', ' ') || 'General'}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Additional Information */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <BuildingOfficeIcon className="h-5 w-5 text-emerald-500 mr-2" />
                      Additional Information
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <CalendarIcon className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">Last Updated</p>
                          <p className="text-gray-900">{formatDate(selectedEmployee.updated_at || selectedEmployee.created_at)}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <UserIcon className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">Employee ID</p>
                          <p className="text-gray-900">#{selectedEmployee.id}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Performance Modal */}
      {showPerformanceModal && selectedEmployee && employeePerformance && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                    <span className="text-lg font-bold text-white">
                      {selectedEmployee.first_name[0]}{selectedEmployee.last_name[0]}
                    </span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {selectedEmployee.first_name} {selectedEmployee.last_name} - Performance
                    </h2>
                    <p className="text-sm text-gray-500">Detailed performance metrics and analytics</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      closePerformanceModal();
                      openDetailsModal(selectedEmployee);
                    }}
                    className="px-3 py-2 bg-emerald-600 text-white text-sm rounded-lg hover:bg-emerald-700 transition-colors flex items-center"
                  >
                    <EyeIcon className="h-4 w-4 mr-1" />
                    Details
                  </button>
                  {hasPermission('admin') && (
                    <Link
                      to={`/employees/${selectedEmployee.id}/edit`}
                      className="px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                    >
                      <PencilIcon className="h-4 w-4 mr-1" />
                      Edit
                    </Link>
                  )}
                  <button
                    onClick={closePerformanceModal}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>
              </div>
            </div>

            <div className="p-6">
              {employeePerformance.hasData ? (
                <>
                  {/* Key Metrics */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-blue-600">Total Leads</p>
                          <p className="text-3xl font-bold text-blue-700">{employeePerformance.metrics.totalLeads}</p>
                        </div>
                        <UserGroupIcon className="h-8 w-8 text-blue-500" />
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-green-600">Converted Leads</p>
                          <p className="text-3xl font-bold text-green-700">{employeePerformance.metrics.convertedLeads}</p>
                        </div>
                        <TrophyIcon className="h-8 w-8 text-green-500" />
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-6 border border-yellow-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-yellow-600">Conversion Rate</p>
                          <p className="text-3xl font-bold text-yellow-700">{employeePerformance.metrics.conversionRate}%</p>
                        </div>
                        <ArrowTrendingUpIcon className="h-8 w-8 text-yellow-500" />
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-purple-600">Total Sales</p>
                          <p className="text-3xl font-bold text-purple-700">₹{employeePerformance.metrics.totalSales.toLocaleString()}</p>
                        </div>
                        <CurrencyDollarIcon className="h-8 w-8 text-purple-500" />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Goals Progress */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                        <StarIcon className="h-5 w-5 text-blue-500 mr-2" />
                        Goals Progress
                      </h3>
                      <div className="space-y-4">
                        {employeePerformance.goals.map((goal, index) => {
                          const progress = (goal.current / goal.target) * 100;
                          return (
                            <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-gray-700">{goal.title}</span>
                                <span className="text-sm font-bold text-gray-900">
                                  {goal.current.toLocaleString()}{goal.unit} / {goal.target.toLocaleString()}{goal.unit}
                                </span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                  className={`h-2 rounded-full ${progress >= 100 ? 'bg-green-500' : progress >= 75 ? 'bg-blue-500' : progress >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
                                  style={{ width: `${Math.min(progress, 100)}%` }}
                                ></div>
                              </div>
                              <div className="flex items-center justify-between mt-2">
                                <span className="text-xs text-gray-500">{progress.toFixed(1)}% complete</span>
                                {progress >= 100 && <span className="text-xs text-green-600 font-medium">✓ Achieved</span>}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Recent Activity */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                        <ClockIcon className="h-5 w-5 text-blue-500 mr-2" />
                        Recent Activity
                      </h3>
                      <div className="space-y-3">
                        {employeePerformance.recentActivity.map((activity, index) => (
                          <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                              {activity.type === 'lead_converted' && <TrophyIcon className="h-4 w-4 text-blue-600" />}
                              {activity.type === 'meeting_scheduled' && <CalendarIcon className="h-4 w-4 text-blue-600" />}
                              {activity.type === 'follow_up' && <PhoneIcon className="h-4 w-4 text-blue-600" />}
                              {activity.type === 'property_listed' && <BuildingOfficeIcon className="h-4 w-4 text-blue-600" />}
                              {activity.type === 'contract_signed' && <DocumentTextIcon className="h-4 w-4 text-blue-600" />}
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                              <div className="flex items-center justify-between mt-1">
                                <p className="text-xs text-gray-500">{formatDate(activity.date)}</p>
                                {activity.value && (
                                  <span className="text-xs font-medium text-green-600">+₹{activity.value.toLocaleString()}</span>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Monthly Trends */}
                  <div className="mt-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                      <ChartBarIcon className="h-5 w-5 text-blue-500 mr-2" />
                      Monthly Performance Trends
                    </h3>
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                      <div className="grid grid-cols-6 gap-4">
                        {employeePerformance.monthlyTrends.map((trend, index) => (
                          <div key={index} className="text-center">
                            <div className="text-sm font-medium text-gray-700 mb-2">{trend.month}</div>
                            <div className="space-y-2">
                              <div className="bg-blue-100 rounded-lg p-2">
                                <div className="text-xs text-blue-600 font-medium">Leads</div>
                                <div className="text-lg font-bold text-blue-700">{trend.leads}</div>
                              </div>
                              <div className="bg-green-100 rounded-lg p-2">
                                <div className="text-xs text-green-600 font-medium">Sales</div>
                                <div className="text-sm font-bold text-green-700">₹{(trend.sales / 1000).toFixed(0)}k</div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                /* No Data State */
                <div className="text-center py-12">
                  <ChartBarIcon className="mx-auto h-16 w-16 text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Performance Data Available</h3>
                  <p className="text-gray-500 max-w-md mx-auto">
                    {employeePerformance.message}
                  </p>
                  <div className="mt-6">
                    <div className="inline-flex items-center px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg">
                      <ClockIcon className="h-5 w-5 text-blue-500 mr-2" />
                      <span className="text-sm text-blue-700">Data will appear as the employee works with leads and properties</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Performance Management Modals */}
      {showPerformanceManagement && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Performance Management Dashboard</h2>
                <button
                  onClick={closeAllPerformanceModals}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl p-6 text-white">
                  <div className="flex items-center justify-between mb-4">
                    <ChartBarIcon className="h-8 w-8" />
                    <span className="text-2xl font-bold">87</span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Overall Score</h3>
                  <p className="text-blue-100">Excellent performance</p>
                </div>
                <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-6 text-white">
                  <div className="flex items-center justify-between mb-4">
                    <TrophyIcon className="h-8 w-8" />
                    <span className="text-2xl font-bold">92</span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Sales Performance</h3>
                  <p className="text-green-100">Top performer</p>
                </div>
                <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl p-6 text-white">
                  <div className="flex items-center justify-between mb-4">
                    <StarIcon className="h-8 w-8" />
                    <span className="text-2xl font-bold">90</span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Goal Achievement</h3>
                  <p className="text-purple-100">On track</p>
                </div>
              </div>
              <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Trends</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Sales Performance</span>
                      <span className="text-green-600 font-semibold">+12%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Customer Satisfaction</span>
                      <span className="text-green-600 font-semibold">+8%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Team Collaboration</span>
                      <span className="text-green-600 font-semibold">+5%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Goal Achievement</span>
                      <span className="text-green-600 font-semibold">+15%</span>
                    </div>
                  </div>
                </div>
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Strengths & Areas for Improvement</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">Strengths</h4>
                      <div className="flex flex-wrap gap-2">
                        {getPerformanceMetrics().strengths.map((strength, index) => (
                          <span key={index} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                            {strength}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">Areas for Improvement</h4>
                      <div className="flex flex-wrap gap-2">
                        {getPerformanceMetrics().areasForImprovement.map((area, index) => (
                          <span key={index} className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                            {area}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Goal Tracking Modal */}
      {showGoalTracking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Goal Tracking & Management</h2>
                <button
                  onClick={closeAllPerformanceModals}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Goals</h3>
                <div className="space-y-4">
                  {getGoalTrackingData().currentGoals.map((goal) => (
                    <div key={goal.id} className="bg-white border border-gray-200 rounded-xl p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="font-semibold text-gray-900">{goal.title}</h4>
                          <p className="text-sm text-gray-600">Deadline: {goal.deadline}</p>
                        </div>
                        <div className="text-right">
                          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            goal.status === 'On Track' ? 'bg-green-100 text-green-800' :
                            goal.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {goal.status}
                          </span>
                          <p className="text-xs text-gray-500 mt-1">{goal.priority} Priority</p>
                        </div>
                      </div>
                      <div className="mb-4">
                        <div className="flex justify-between text-sm text-gray-600 mb-2">
                          <span>Progress</span>
                          <span>{goal.current}/{goal.target}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full" 
                            style={{width: `${(goal.current / goal.target) * 100}%`}}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Completed Goals</h3>
                <div className="space-y-3">
                  {getGoalTrackingData().completedGoals.map((goal) => (
                    <div key={goal.id} className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">{goal.title}</h4>
                        <p className="text-sm text-gray-600">Completed: {goal.completedDate}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-bold text-green-600">{goal.achievement}%</span>
                        <p className="text-xs text-gray-500">{goal.impact} Impact</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Skill Assessment Modal */}
      {showSkillAssessment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Skill Assessment & Development</h2>
                <button
                  onClick={closeAllPerformanceModals}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Skills</h3>
                  <div className="space-y-4">
                    {getSkillAssessmentData().currentSkills.map((skill, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium text-gray-900">{skill.skill}</h4>
                          <span className="text-lg font-bold text-blue-600">{skill.level}%</span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-600 mb-2">
                          <span>{skill.category}</span>
                          <span>Last assessed: {skill.lastAssessed}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full" 
                            style={{width: `${skill.level}%`}}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Skill Gaps & Recommendations</h3>
                  <div className="space-y-4">
                    {getSkillAssessmentData().skillGaps.map((gap, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium text-gray-900">{gap.skill}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            gap.priority === 'High' ? 'bg-red-100 text-red-800' :
                            gap.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {gap.priority} Priority
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">Gap: {gap.gap}%</p>
                        <p className="text-sm text-blue-600 font-medium">Recommended: {gap.recommendedTraining}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-6 bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Assessment History</h3>
                <div className="space-y-3">
                  {getSkillAssessmentData().assessmentHistory.map((assessment, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">Assessment - {assessment.date}</h4>
                        <p className="text-sm text-gray-600">Overall Score: {assessment.overallScore}</p>
                      </div>
                      <span className="text-green-600 font-semibold">{assessment.improvement}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Team Performance Modal */}
      {showTeamPerformance && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Team Performance Analytics</h2>
                <button
                  onClick={closeAllPerformanceModals}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl p-6 text-white">
                  <div className="flex items-center justify-between mb-4">
                    <UserGroupIcon className="h-8 w-8" />
                    <span className="text-2xl font-bold">89</span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Team Score</h3>
                  <p className="text-blue-100">Excellent collaboration</p>
                </div>
                <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-6 text-white">
                  <div className="flex items-center justify-between mb-4">
                    <ChartBarIcon className="h-8 w-8" />
                    <span className="text-2xl font-bold">92</span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Collaboration</h3>
                  <p className="text-green-100">Strong teamwork</p>
                </div>
                <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl p-6 text-white">
                  <div className="flex items-center justify-between mb-4">
                    <TrophyIcon className="h-8 w-8" />
                    <span className="text-2xl font-bold">87</span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Productivity</h3>
                  <p className="text-purple-100">High efficiency</p>
                </div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Individual Contributions</h3>
                  <div className="space-y-3">
                    {getTeamPerformanceData().individualContributions.map((member, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div>
                          <h4 className="font-medium text-gray-900">{member.name}</h4>
                          <p className="text-sm text-gray-600">{member.role}</p>
                        </div>
                        <div className="text-right">
                          <span className="text-lg font-bold text-blue-600">{member.contribution}%</span>
                          <p className="text-xs text-gray-500">{member.impact} Impact</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Team Goals</h3>
                  <div className="space-y-3">
                    {getTeamPerformanceData().teamGoals.map((goal, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium text-gray-900">{goal.goal}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            goal.status === 'On Track' ? 'bg-green-100 text-green-800' :
                            goal.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {goal.status}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-600 mb-2">
                          <span>Progress</span>
                          <span>{goal.current}/{goal.target}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full" 
                            style={{width: `${(goal.current / goal.target) * 100}%`}}
                          ></div>
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
    </div>
  );
};

export default Employees;