import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { dashboardAPI, propertiesAPI, leadsAPI, employeesAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';
import {
  HomeIcon,
  UserGroupIcon,
  UserPlusIcon,
  CurrencyDollarIcon,
  BuildingOfficeIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  EyeIcon,
  CalendarIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  ClockIcon,
  StarIcon,
  FireIcon,
  BoltIcon,
  SparklesIcon,
  RocketLaunchIcon,
  GlobeAltIcon,
  HeartIcon,
  LightBulbIcon,
  TrophyIcon,
  GiftIcon,
  SunIcon,
  MoonIcon,
  CloudIcon,
  ArrowRightIcon,
  ArrowPathIcon,
  PlayIcon,
  PauseIcon,
  StopIcon,
  CogIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  EllipsisVerticalIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XCircleIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  FunnelIcon,
  AdjustmentsHorizontalIcon,
  DocumentTextIcon,
  PhotoIcon,
  VideoCameraIcon,
  SpeakerWaveIcon,
  WifiIcon,
  SignalIcon,
  BatteryIcon,
  CpuChipIcon,
  ServerIcon,
  DatabaseIcon,
  CloudArrowUpIcon,
  ShieldCheckIcon,
  LockClosedIcon,
  KeyIcon,
  UserCircleIcon,
  UsersIcon,
  BuildingStorefrontIcon,
  ShoppingCartIcon,
  CreditCardIcon,
  BanknotesIcon,
  ReceiptPercentIcon,
  ChartPieIcon,
  PresentationChartLineIcon,
  PresentationChartBarIcon,
  TableCellsIcon,
  ClipboardDocumentListIcon,
  DocumentDuplicateIcon,
  PrinterIcon,
  ShareIcon,
  BookmarkIcon,
  FlagIcon,
  TagIcon,
  HashtagIcon,
  AtSymbolIcon,
  LinkIcon,
  QrCodeIcon,
  BarcodeIcon,
  FingerPrintIcon,
  FaceSmileIcon,
  HandThumbUpIcon,
  HandThumbDownIcon,
  ChatBubbleLeftRightIcon,
  ChatBubbleOvalLeftEllipsisIcon,
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
  PencilIcon,
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
  ArchiveBoxIcon,
  ArchiveBoxXMarkIcon,
  TrashIcon,
  XMarkIcon,
  CheckIcon,
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
  HomeModernIcon,
  MapIcon,
  CurrencyRupeeIcon,
  ChartBarSquareIcon,
  PresentationChartBarIcon as PresentationChartBarIconOutline,
  ArrowTrendingUpIcon as ArrowTrendingUpIconOutline,
  ArrowTrendingDownIcon as ArrowTrendingDownIconOutline,
  MinusIcon as MinusIconOutline
} from '@heroicons/react/24/outline';
import {
  ArrowTrendingUpIcon as TrendingUpSolid,
  ArrowTrendingDownIcon as TrendingDownSolid,
  FireIcon as FireSolid,
  StarIcon as StarSolid,
  HeartIcon as HeartSolid,
  TrophyIcon as TrophySolid,
  CogIcon as CogSolid,
  HomeIcon as HomeSolid,
  UserIcon as UserSolid,
  UserGroupIcon as UserGroupSolid,
  UserPlusIcon as UserPlusSolid,
  CurrencyDollarIcon as CurrencyDollarSolid,
  BuildingOfficeIcon as BuildingOfficeSolid,
  ChartBarIcon as ChartBarSolid,
  EyeIcon as EyeSolid,
  CalendarIcon as CalendarSolid,
  PhoneIcon as PhoneSolid,
  EnvelopeIcon as EnvelopeSolid,
  MapPinIcon as MapPinSolid,
  ClockIcon as ClockSolid,
  SparklesIcon as SparklesSolid,
  RocketLaunchIcon as RocketLaunchSolid,
  GlobeAltIcon as GlobeAltSolid,
  LightBulbIcon as LightBulbSolid,
  GiftIcon as GiftSolid,
  SunIcon as SunSolid,
  MoonIcon as MoonSolid,
  CloudIcon as CloudSolid,
  ArrowRightIcon as ArrowRightSolid,
  PlayIcon as PlaySolid,
  PauseIcon as PauseSolid,
  StopIcon as StopSolid
} from '@heroicons/react/24/solid';

const EnhancedDashboard = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [timeOfDay, setTimeOfDay] = useState('morning');
  const [quickActions, setQuickActions] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [weatherData, setWeatherData] = useState(null);
  const [systemStatus, setSystemStatus] = useState('online');
  const [timeRange, setTimeRange] = useState('7d');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [marketTrends, setMarketTrends] = useState(null);
  const [performanceMetrics, setPerformanceMetrics] = useState(null);
  const [upcomingTasks, setUpcomingTasks] = useState([]);
  const [teamPerformance, setTeamPerformance] = useState([]);
  const [leadInsights, setLeadInsights] = useState(null);
  const [propertyInsights, setPropertyInsights] = useState(null);
  const [financialOverview, setFinancialOverview] = useState(null);
  const [systemHealth, setSystemHealth] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  
  // Real-time data states
  const [kpis, setKpis] = useState({
    totalLeads: 0,
    activeListings: 0,
    inventorySold: 0,
    inventoryAvailable: 0,
    revenueThisMonth: 0,
    pendingTasks: 0,
    conversionRate: 0
  });
  const [notifications, setNotifications] = useState([]);
  const [salesChartData, setSalesChartData] = useState([]);
  const [leadSourcesData, setLeadSourcesData] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [refreshing, setRefreshing] = useState(false);

  // Function to fetch weather data based on user location
  const fetchWeatherData = async () => {
    setWeatherLoading(true);
    try {
      // Get user's exact location from profile
      let userLocation = 'Mumbai, India'; // Default fallback
      
      if (user) {
        if (user.city && user.state) {
          userLocation = `${user.city}, ${user.state}`;
        } else if (user.city) {
          userLocation = `${user.city}, India`;
        } else if (user.state) {
          userLocation = `${user.state}, India`;
        }
      }
      
      // For demo purposes, we'll simulate weather data based on location
      // In a real app, you would call a weather API like OpenWeatherMap
      const weatherConditions = ['sunny', 'cloudy', 'rainy', 'partly-cloudy'];
      const randomCondition = weatherConditions[Math.floor(Math.random() * weatherConditions.length)];
      
      // Simulate different weather patterns based on location
      let baseTemp = 28; // Default temperature
      if (user?.city) {
        // Simulate different temperatures based on city
        const cityTemps = {
          'Mumbai': 30,
          'Delhi': 25,
          'Bangalore': 26,
          'Chennai': 32,
          'Kolkata': 28,
          'Hyderabad': 29,
          'Pune': 27,
          'Ahmedabad': 31
        };
        baseTemp = cityTemps[user.city] || 28;
      }
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const weatherData = {
        temperature: baseTemp + Math.floor(Math.random() * 6) - 3, // ±3°C variation
        condition: randomCondition,
        humidity: Math.floor(Math.random() * 30) + 50, // 50-80%
        windSpeed: Math.floor(Math.random() * 15) + 5, // 5-20 km/h
        location: userLocation,
        icon: randomCondition === 'sunny' ? 'sun' : randomCondition === 'cloudy' ? 'cloud' : 'sun',
        lastUpdated: new Date().toLocaleTimeString()
      };
      
      setWeatherData(weatherData);
    } catch (error) {
      console.error('Error fetching weather data:', error);
      // Set default weather data
      setWeatherData({
        temperature: 28,
        condition: 'sunny',
        humidity: 65,
        windSpeed: 12,
        location: user?.city ? `${user.city}, India` : 'Mumbai, India',
        icon: 'sun',
        lastUpdated: new Date().toLocaleTimeString()
      });
    } finally {
      setWeatherLoading(false);
    }
  };

  // Auto-refresh weather when user profile changes
  useEffect(() => {
    if (user) {
      fetchWeatherData();
    }
  }, [user?.city, user?.state, user?.pincode]);

  useEffect(() => {
    fetchDashboardData();
    initializeDashboard();
    setupRealTimeUpdates();
    fetchWeatherData();
    fetchMarketTrends();
    fetchPerformanceMetrics();
    fetchUpcomingTasks();
    fetchTeamPerformance();
    fetchLeadInsights();
    fetchPropertyInsights();
    fetchFinancialOverview();
    fetchSystemHealth();
  }, [timeRange]);

  // Real-time updates setup
  useEffect(() => {
    const interval = setInterval(() => {
      fetchDashboardData();
      setLastUpdated(new Date());
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  // Manual refresh function
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchDashboardData();
      setLastUpdated(new Date());
      toast.success('Dashboard updated successfully');
    } catch (error) {
      toast.error('Failed to refresh dashboard');
    } finally {
      setRefreshing(false);
    }
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch all dashboard data in parallel
      const [overviewResponse, notificationsResponse, salesChartResponse, leadSourcesResponse, quickActionsResponse] = await Promise.allSettled([
        dashboardAPI.getOverview(),
        dashboardAPI.getNotifications(),
        dashboardAPI.getSalesPerformanceChart({ months: 6 }),
        dashboardAPI.getLeadSourcesChart(),
        dashboardAPI.getQuickActions()
      ]);

      // Process overview data
      if (overviewResponse.status === 'fulfilled' && overviewResponse.value.data) {
        const data = overviewResponse.value.data;
        setDashboardData(data);
        
        // Update KPIs with real data
        if (data.kpis) {
          setKpis({
            totalLeads: data.kpis.total_leads || 0,
            activeListings: data.kpis.active_listings || 0,
            inventorySold: data.kpis.inventory_sold || 0,
            inventoryAvailable: data.kpis.inventory_available || 0,
            revenueThisMonth: data.kpis.revenue_this_month || 0,
            pendingTasks: data.kpis.pending_tasks || 0,
            conversionRate: data.kpis.conversion_rate || 0
          });
        }

        // Update recent activity from API data
        if (data.recent_activity?.activities && Array.isArray(data.recent_activity.activities)) {
          const activities = data.recent_activity.activities.map(activity => ({
            id: activity.id,
            type: activity.activity_type,
            action: activity.description,
            user: activity.user_name,
            time: getTimeAgo(activity.created_at),
            icon: getActivityIcon(activity.activity_type)
          }));
          setRecentActivity(activities);
        }

        // Update upcoming follow-ups from API data
        if (data.upcoming_follow_ups && Array.isArray(data.upcoming_follow_ups)) {
          const followUps = data.upcoming_follow_ups.map(lead => ({
            id: lead.id,
            title: `Follow up with ${lead.name}`,
            time: new Date(lead.next_follow_up).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            type: 'call',
            priority: 'medium'
          }));
          setUpcomingTasks(followUps);
        }
      }

      // Process notifications
      if (notificationsResponse.status === 'fulfilled' && notificationsResponse.value.data) {
        const notifications = notificationsResponse.value.data.notifications || [];
        setNotifications(notifications);
      } else {
        // Add some mock notifications for testing
        const mockNotifications = [
          {
            type: 'warning',
            title: 'Overdue Follow-ups',
            message: 'You have 3 overdue follow-ups',
            count: 3
          },
          {
            type: 'info',
            title: 'New Lead Assigned',
            message: 'A new lead has been assigned to you',
            count: 1
          },
          {
            type: 'success',
            title: 'Property Listing Approved',
            message: 'Your property listing has been approved',
            count: 1
          }
        ];
        setNotifications(mockNotifications);
      }

      // Process sales performance chart
      if (salesChartResponse.status === 'fulfilled' && salesChartResponse.value.data) {
        const chartData = salesChartResponse.value.data.chart_data || [];
        setSalesChartData(chartData);
      }

      // Process lead sources chart
      if (leadSourcesResponse.status === 'fulfilled' && leadSourcesResponse.value.data) {
        const chartData = leadSourcesResponse.value.data.chart_data || [];
        setLeadSourcesData(chartData);
      }

      // Process quick actions
      if (quickActionsResponse.status === 'fulfilled' && quickActionsResponse.value.data) {
        const actions = quickActionsResponse.value.data.quick_actions || [];
        setQuickActions(actions);
      }

    } catch (error) {
      console.error('Dashboard error:', error);
      // Don't show error toast for individual API failures, just log them
    } finally {
      setLoading(false);
    }
  };

  const fetchMarketTrends = async () => {
    try {
      // Mock market trends data
      setMarketTrends({
        averagePrice: 8500000,
        priceChange: 5.2,
        marketActivity: 'High',
        hotAreas: ['Bandra', 'Powai', 'Andheri'],
        newListings: 45,
        pricePerSqft: 12500
      });
    } catch (error) {
      console.error('Failed to fetch market trends:', error);
    }
  };

  const fetchPerformanceMetrics = async () => {
    try {
      setPerformanceMetrics({
        responseTime: 0.8,
        conversionRate: 12.5,
        averageDealSize: 12500000,
        clientSatisfaction: 4.8,
        leadQuality: 85,
        marketShare: 15.2
      });
    } catch (error) {
      console.error('Failed to fetch performance metrics:', error);
    }
  };

  const fetchUpcomingTasks = async () => {
    try {
      // Mock upcoming tasks for today
      const todayTasks = [
        { id: 1, title: 'Client Meeting - Property Discussion', time: '10:00 AM', type: 'meeting', priority: 'high' },
        { id: 2, title: 'Property Site Visit - Bandra West', time: '2:00 PM', type: 'meeting', priority: 'high' },
        { id: 3, title: 'Follow up with lead - Rajesh Kumar', time: '3:30 PM', type: 'call', priority: 'medium' },
        { id: 4, title: 'Review property documents', time: '4:00 PM', type: 'task', priority: 'low' },
        { id: 5, title: 'Team meeting - Weekly Review', time: '5:00 PM', type: 'meeting', priority: 'high' }
      ];
      setUpcomingTasks(todayTasks);
    } catch (error) {
      console.error('Failed to fetch upcoming tasks:', error);
    }
  };

  const fetchTeamPerformance = async () => {
    try {
      setTeamPerformance([
        { name: 'Priya Sharma', sales: 8, leads: 25, conversion: 32, avatar: 'PS' },
        { name: 'Raj Patel', sales: 6, leads: 20, conversion: 30, avatar: 'RP' },
        { name: 'Sneha Singh', sales: 5, leads: 18, conversion: 28, avatar: 'SS' },
        { name: 'Amit Kumar', sales: 4, leads: 15, conversion: 27, avatar: 'AK' }
      ]);
    } catch (error) {
      console.error('Failed to fetch team performance:', error);
    }
  };

  const fetchLeadInsights = async () => {
    try {
      setLeadInsights({
        hotLeads: 12,
        warmLeads: 28,
        coldLeads: 45,
        leadSources: {
          website: 35,
          referrals: 25,
          social: 20,
          ads: 15,
          other: 5
        },
        averageResponseTime: '2.5 hours',
        conversionFunnel: {
          contacted: 85,
          qualified: 60,
          proposal: 35,
          closed: 12
        }
      });
    } catch (error) {
      console.error('Failed to fetch lead insights:', error);
    }
  };

  const fetchPropertyInsights = async () => {
    try {
      setPropertyInsights({
        totalListings: 156,
        activeListings: 142,
        underContract: 8,
        sold: 6,
        averageDaysOnMarket: 45,
        priceReductions: 12,
        newListings: 18,
        propertyTypes: {
          apartment: 65,
          villa: 25,
          plot: 10
        }
      });
    } catch (error) {
      console.error('Failed to fetch property insights:', error);
    }
  };

  const fetchFinancialOverview = async () => {
    try {
      setFinancialOverview({
        monthlyRevenue: 2500000,
        monthlyExpenses: 800000,
        netProfit: 1700000,
        commissionEarned: 125000,
        pendingPayments: 450000,
        revenueGrowth: 18.5,
        expenseGrowth: 8.2,
        profitMargin: 68
      });
    } catch (error) {
      console.error('Failed to fetch financial overview:', error);
    }
  };

  const fetchSystemHealth = async () => {
    try {
      setSystemHealth({
        uptime: 99.9,
        responseTime: 120,
        activeUsers: 24,
        dataBackup: 'Last backup: 2 hours ago',
        securityStatus: 'Secure',
        storageUsed: 68,
        lastUpdate: '2 minutes ago'
      });
    } catch (error) {
      console.error('Failed to fetch system health:', error);
    }
  };

  // Helper function to get time ago
  const getTimeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} min ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hour ago`;
    return `${Math.floor(diffInSeconds / 86400)} day ago`;
  };

  // Helper function to get icon based on activity type
  const getActivityIcon = (activityType) => {
    switch (activityType) {
      case 'profile_update':
        return UserIcon;
      case 'property_added':
        return BuildingOfficeIcon;
      case 'lead_added':
        return UserPlusIcon;
      case 'sale_completed':
        return CurrencyDollarIcon;
      case 'meeting_scheduled':
        return CalendarIcon;
      default:
        return InformationCircleIcon;
    }
  };

  const initializeDashboard = () => {
    // Set time of day greeting
    const hour = new Date().getHours();
    if (hour < 12) setTimeOfDay('morning');
    else if (hour < 17) setTimeOfDay('afternoon');
    else setTimeOfDay('evening');

    setQuickActions([
      { id: 1, title: 'Add Property', icon: PlusIcon, color: 'blue', link: '/properties/new', description: 'List new property' },
      { id: 2, title: 'New Lead', icon: UserPlusIcon, color: 'green', link: '/leads/new', description: 'Add potential client' },
      { id: 3, title: 'Generate Report', icon: DocumentTextIcon, color: 'purple', link: '/reports', description: 'Create analytics report' },
      { id: 4, title: 'Schedule Meeting', icon: CalendarIcon, color: 'orange', link: '/calendar', description: 'Book appointment' },
      { id: 5, title: 'Market Analysis', icon: ChartBarIcon, color: 'indigo', link: '/market', description: 'View market trends' },
      { id: 6, title: 'Team Performance', icon: UserGroupIcon, color: 'pink', link: '/employees', description: 'Check team stats' }
    ]);

    // Mock weather data
    setWeatherData({
      temperature: 28,
      condition: 'Sunny',
      humidity: 65,
      windSpeed: 12,
      location: 'Mumbai',
      forecast: [
        { day: 'Today', high: 30, low: 25, condition: 'Sunny' },
        { day: 'Tomorrow', high: 29, low: 24, condition: 'Partly Cloudy' },
        { day: 'Day After', high: 31, low: 26, condition: 'Sunny' }
      ]
    });
  };

  const setupRealTimeUpdates = () => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      // Update system status
      setSystemStatus(Math.random() > 0.1 ? 'online' : 'offline');
      
      // Add random activity
      if (Math.random() > 0.7) {
        const activities = [
          'New lead added from website',
          'Property viewing scheduled',
          'Document uploaded',
          'Payment received',
          'Follow-up reminder sent',
          'Market report generated'
        ];
        const newActivity = {
          id: Date.now(),
          type: 'system',
          action: activities[Math.floor(Math.random() * activities.length)],
          user: 'System',
          time: 'Just now',
          icon: BellIcon
        };
        setRecentActivity(prev => [newActivity, ...prev.slice(0, 9)]);
      }
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  };

  // Memoized calculations
  const kpiCards = useMemo(() => {
    return [
      {
        title: 'Total Leads',
        value: kpis.totalLeads,
        change: '+8%',
        trend: 'up',
        icon: UserPlusIcon,
        gradient: 'from-blue-400 to-indigo-400',
        bgPattern: 'bg-gradient-to-br from-blue-50 to-indigo-50',
        fire: kpis.totalLeads > 50
      },
      {
        title: 'Active Listings',
        value: kpis.activeListings,
        change: '+12%',
        trend: 'up',
        icon: BuildingOfficeIcon,
        gradient: 'from-green-400 to-emerald-400',
        bgPattern: 'bg-gradient-to-br from-green-50 to-emerald-50',
        fire: true
      },
      {
        title: 'Properties Sold',
        value: kpis.inventorySold,
        change: '+15%',
        trend: 'up',
        icon: TrophyIcon,
        gradient: 'from-purple-400 to-pink-400',
        bgPattern: 'bg-gradient-to-br from-purple-50 to-pink-50',
        trophy: true
      },
      {
        title: 'Conversion Rate',
        value: `${kpis.conversionRate}%`,
        change: '+3%',
        trend: 'up',
        icon: ArrowTrendingUpIcon,
        gradient: 'from-orange-400 to-red-400',
        bgPattern: 'bg-gradient-to-br from-orange-50 to-red-50',
        star: true
      }
    ];
  }, [kpis]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-32 w-32 border-4 border-gray-200 border-t-blue-500 mx-auto"></div>
            <div className="absolute inset-0 rounded-full h-32 w-32 border-4 border-transparent border-r-purple-500 animate-spin mx-auto" style={{animationDirection: 'reverse', animationDuration: '1.5s'}}></div>
          </div>
          <p className="mt-6 text-xl text-gray-800 font-medium">Loading your command center...</p>
          <p className="mt-2 text-gray-500">Preparing your real estate empire</p>
        </div>
      </div>
    );
  }

  // Display recent activity with empty state handling
  const displayRecentActivity = recentActivity.length > 0 ? recentActivity : [];

  // Display upcoming tasks with empty state handling
  const displayUpcomingTasks = upcomingTasks.length > 0 ? upcomingTasks : [];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6 space-y-6">
        {/* Enhanced Header Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                <BuildingOfficeIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Good {timeOfDay}, Real Estate Pro
                </h1>
                <p className="text-gray-600">Welcome to your dashboard</p>
              </div>
            </div>
            
            {/* Quick Stats and Refresh */}
            <div className="flex items-center space-x-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{kpis.totalLeads}</div>
                <div className="text-sm text-gray-500">Total Leads</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{kpis.activeListings}</div>
                <div className="text-sm text-gray-500">Active Listings</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{kpis.inventorySold}</div>
                <div className="text-sm text-gray-500">Properties Sold</div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="text-right">
                  <div className="text-xs text-gray-500">Last updated</div>
                  <div className="text-xs font-medium text-gray-700">{lastUpdated.toLocaleTimeString()}</div>
                </div>
                <button
                  onClick={handleRefresh}
                  disabled={refreshing}
                  className={`p-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors ${refreshing ? 'opacity-50 cursor-not-allowed' : ''}`}
                  title="Refresh dashboard"
                >
                  <ArrowPathIcon className={`w-4 h-4 text-gray-600 ${refreshing ? 'animate-spin' : ''}`} />
                </button>
                <div className="relative">
                  <button className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors" title="Notifications">
                    <BellIcon className="w-4 h-4 text-gray-600" />
                    {notifications.length > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {notifications.length}
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Global Search Bar - Full Width */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search properties, leads, clients, or anything..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
              Search
            </button>
          </div>
        </div>

        {/* Enhanced Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            <Link to="/properties" className="flex flex-col items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
              <BuildingOfficeIcon className="w-8 h-8 text-blue-600 mb-2" />
              <span className="text-sm font-medium text-gray-700">Properties</span>
            </Link>
            <Link to="/leads" className="flex flex-col items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
              <UserPlusIcon className="w-8 h-8 text-green-600 mb-2" />
              <span className="text-sm font-medium text-gray-700">Leads</span>
            </Link>
            <Link to="/employees" className="flex flex-col items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
              <UserGroupIcon className="w-8 h-8 text-purple-600 mb-2" />
              <span className="text-sm font-medium text-gray-700">Team</span>
            </Link>
            <Link to="/reports" className="flex flex-col items-center p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors">
              <ChartBarIcon className="w-8 h-8 text-orange-600 mb-2" />
              <span className="text-sm font-medium text-gray-700">Reports</span>
            </Link>
            <Link to="/settings" className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <CogIcon className="w-8 h-8 text-gray-600 mb-2" />
              <span className="text-sm font-medium text-gray-700">Settings</span>
            </Link>
            <Link to="/post-sales" className="flex flex-col items-center p-4 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors">
              <CurrencyDollarIcon className="w-8 h-8 text-indigo-600 mb-2" />
              <span className="text-sm font-medium text-gray-700">Sales</span>
            </Link>
            <Link to="/leads?action=add" className="flex flex-col items-center p-4 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">
              <PlusIcon className="w-8 h-8 text-red-600 mb-2" />
              <span className="text-sm font-medium text-gray-700">Add Lead</span>
            </Link>
            <Link to="/leads?view=calendar" className="flex flex-col items-center p-4 bg-teal-50 rounded-lg hover:bg-teal-100 transition-colors">
              <CalendarIcon className="w-8 h-8 text-teal-600 mb-2" />
              <span className="text-sm font-medium text-gray-700">Schedule</span>
            </Link>
          </div>
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Left Column - KPI Cards and Charts */}
          <div className="xl:col-span-3 space-y-6">
            {/* Clean KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {kpiCards.map((card, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-10 h-10 bg-${card.gradient.split('-')[1]}-100 rounded-lg flex items-center justify-center`}>
                      {React.createElement(card.icon, { className: `w-5 h-5 text-${card.gradient.split('-')[1]}-600` })}
                    </div>
                    {card.fire && (
                      <div className="flex items-center space-x-1">
                        <FireIcon className="w-4 h-4 text-orange-500" />
                        <span className="text-xs font-bold text-orange-600 bg-orange-100 px-2 py-1 rounded-full">HOT</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-gray-600 text-sm font-medium">{card.title}</p>
                    <p className="text-3xl font-bold text-gray-900">{card.value}</p>
                    <div className="flex items-center space-x-2">
                      {card.trend === 'up' ? (
                        <div className="flex items-center space-x-1 bg-green-100 px-2 py-1 rounded-full">
                          <ArrowTrendingUpIcon className="h-4 w-4 text-green-600" />
                          <span className="text-sm font-semibold text-green-700">{card.change}</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-1 bg-red-100 px-2 py-1 rounded-full">
                          <ArrowTrendingDownIcon className="h-4 w-4 text-red-600" />
                          <span className="text-sm font-semibold text-red-700">{card.change}</span>
                        </div>
                      )}
                      <span className="text-xs text-gray-500">vs last month</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Clean Performance Chart */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <ChartBarIcon className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Performance Overview</h3>
                    <p className="text-gray-600 text-sm">Track your business metrics</p>
                  </div>
                </div>
                <div className="flex space-x-2 bg-gray-100 rounded-lg p-1">
                  {['7D', '30D', '90D'].map((period) => (
                    <button
                      key={period}
                      className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                        period === '30D'
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-600 hover:bg-white'
                      }`}
                    >
                      {period}
                    </button>
                  ))}
                </div>
              </div>
              <div className="h-64 bg-gray-50 rounded-lg border border-gray-200">
                {salesChartData.length > 0 ? (
                  <div className="p-4 h-full flex items-center justify-center">
                    <div className="text-center">
                      <ChartBarIcon className="h-12 w-12 text-blue-500 mx-auto mb-3" />
                      <p className="text-gray-600 font-medium">Sales Performance</p>
                      <p className="text-gray-500 text-sm">{salesChartData.length} months of data</p>
                      <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                        <div className="bg-white p-3 rounded-lg">
                          <div className="font-semibold text-green-600">
                            {salesChartData.reduce((sum, item) => sum + item.sales_count, 0)}
                          </div>
                          <div className="text-gray-500">Total Sales</div>
                        </div>
                        <div className="bg-white p-3 rounded-lg">
                          <div className="font-semibold text-blue-600">
                            ₹{salesChartData.reduce((sum, item) => sum + item.revenue, 0).toLocaleString()}
                          </div>
                          <div className="text-gray-500">Total Revenue</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center">
                      <ChartBarIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-600 font-medium">No sales data available</p>
                      <p className="text-gray-500 text-sm">Sales data will appear here once you have transactions</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
                <Link to="/reports" className="text-blue-600 text-sm font-medium hover:text-blue-700">View All</Link>
              </div>
              {displayRecentActivity.length > 0 ? (
                <div className="space-y-3">
                  {displayRecentActivity.slice(0, 5).map((activity, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        {activity.icon ? React.createElement(activity.icon, { className: "w-4 h-4 text-blue-600" }) : <UserIcon className="w-4 h-4 text-blue-600" />}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{activity.action || activity.description}</p>
                        <p className="text-xs text-gray-500">{activity.time || activity.timestamp}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <UserIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 font-medium">No recent activity</p>
                  <p className="text-gray-500 text-sm">Activity will appear here as you use the system</p>
                </div>
              )}
            </div>

            {/* Recently Viewed Items */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Recently Viewed</h3>
                <button className="text-blue-600 text-sm font-medium hover:text-blue-700">Clear All</button>
              </div>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <BuildingOfficeIcon className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Luxury Villa in Bandra</p>
                    <p className="text-xs text-gray-500">Property • Viewed 2 hours ago</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">₹2.5 Cr</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <UserIcon className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Rajesh Kumar</p>
                    <p className="text-xs text-gray-500">Lead • Viewed 4 hours ago</p>
                  </div>
                  <div className="text-right">
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">Hot</span>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <UserGroupIcon className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Team Performance Report</p>
                    <p className="text-xs text-gray-500">Report • Viewed yesterday</p>
                  </div>
                  <div className="text-right">
                    <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-semibold">Q4</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Sidebar */}
          <div className="xl:col-span-1 space-y-6">
            {/* Weather Widget - Enhanced with Profile Location */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Weather</h3>
                  <div className="text-xs text-gray-500">
                    <div className="font-medium">{weatherData?.location || 'Mumbai, India'}</div>
                    {user?.pincode && (
                      <div className="text-gray-400">PIN: {user.pincode}</div>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={fetchWeatherData}
                    disabled={weatherLoading}
                    className={`p-1 text-gray-400 hover:text-gray-600 transition-colors ${weatherLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    title="Refresh weather"
                  >
                    <ArrowPathIcon className={`w-4 h-4 ${weatherLoading ? 'animate-spin' : ''}`} />
                  </button>
                  {weatherData?.icon === 'sun' ? (
                    <SunIcon className="w-6 h-6 text-yellow-500" />
                  ) : weatherData?.icon === 'cloud' ? (
                    <CloudIcon className="w-6 h-6 text-gray-500" />
                  ) : (
                    <SunIcon className="w-6 h-6 text-yellow-500" />
                  )}
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {weatherData?.temperature || '28'}°C
                </div>
                <div className="text-sm text-gray-600 mb-3 capitalize">
                  {weatherData?.condition || 'Sunny'}
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="text-center">
                    <div className="text-gray-500">Humidity</div>
                    <div className="font-semibold">{weatherData?.humidity || '65'}%</div>
                  </div>
                  <div className="text-center">
                    <div className="text-gray-500">Wind</div>
                    <div className="font-semibold">{weatherData?.windSpeed || '12'} km/h</div>
                  </div>
                </div>
                <div className="mt-3 p-2 bg-blue-50 rounded-lg">
                  <p className="text-xs text-blue-700 font-medium">
                    {weatherData?.condition === 'rainy' ? 'Indoor meetings recommended' :
                     weatherData?.condition === 'cloudy' ? 'Good weather for site visits' :
                     weatherData?.condition === 'partly-cloudy' ? 'Good weather for site visits' :
                     'Perfect weather for site visits!'}
                  </p>
                </div>
                {weatherData?.lastUpdated && (
                  <div className="mt-2 text-xs text-gray-400">
                    Updated: {weatherData.lastUpdated}
                  </div>
                )}
              </div>
            </div>

            {/* Notifications Center */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                {notifications.length > 0 && (
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="text-sm text-gray-500">{notifications.length} new</span>
                  </div>
                )}
              </div>
              {notifications.length > 0 ? (
                <div className="space-y-3">
                  {notifications.slice(0, 5).map((notification, index) => (
                    <div key={index} className={`flex items-start space-x-3 p-3 rounded-lg border-l-4 ${
                      notification.type === 'error' ? 'bg-red-50 border-red-500' :
                      notification.type === 'warning' ? 'bg-yellow-50 border-yellow-500' :
                      notification.type === 'info' ? 'bg-blue-50 border-blue-500' :
                      'bg-green-50 border-green-500'
                    }`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        notification.type === 'error' ? 'bg-red-100' :
                        notification.type === 'warning' ? 'bg-yellow-100' :
                        notification.type === 'info' ? 'bg-blue-100' :
                        'bg-green-100'
                      }`}>
                        {notification.type === 'error' ? (
                          <ExclamationTriangleIcon className="w-4 h-4 text-red-600" />
                        ) : notification.type === 'warning' ? (
                          <ExclamationTriangleIcon className="w-4 h-4 text-yellow-600" />
                        ) : notification.type === 'info' ? (
                          <InformationCircleIcon className="w-4 h-4 text-blue-600" />
                        ) : (
                          <CheckCircleIcon className="w-4 h-4 text-green-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                        <p className="text-xs text-gray-500">{notification.message}</p>
                        {notification.count && (
                          <p className="text-xs text-gray-400 mt-1">Count: {notification.count}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <BellIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 font-medium">No notifications</p>
                  <p className="text-gray-500 text-sm">You're all caught up!</p>
                </div>
              )}
            </div>


            {/* Upcoming Tasks */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Upcoming Tasks</h3>
                <Link to="/leads" className="text-blue-600 text-sm font-medium hover:text-blue-700">View All</Link>
              </div>
              {upcomingTasks.length > 0 ? (
                <div className="space-y-3">
                  {upcomingTasks.slice(0, 4).map((task, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{task.title}</p>
                        <p className="text-xs text-gray-500">{task.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 font-medium">No upcoming tasks</p>
                  <p className="text-gray-500 text-sm">Tasks will appear here when scheduled</p>
                </div>
              )}
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm">Conversion Rate</span>
                  <span className="text-green-600 font-semibold">{kpis.conversionRate}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm">Revenue This Month</span>
                  <span className="text-blue-600 font-semibold">₹{kpis.revenueThisMonth.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm">Pending Tasks</span>
                  <span className="text-orange-600 font-semibold">{kpis.pendingTasks}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm">Available Properties</span>
                  <span className="text-purple-600 font-semibold">{kpis.inventoryAvailable}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm">Active Deals</span>
                  <span className="text-orange-600 font-semibold">23</span>
                </div>
              </div>
            </div>

            {/* Today's Schedule */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Today's Schedule</h3>
                <Link to="/leads?view=calendar" className="text-blue-600 text-sm font-medium hover:text-blue-700">View Calendar</Link>
              </div>
              {upcomingTasks.length > 0 ? (
                <div className="space-y-3">
                  {upcomingTasks.slice(0, 3).map((task, index) => (
                    <div key={index} className={`flex items-center space-x-3 p-3 rounded-lg border-l-4 ${
                      task.priority === 'high' ? 'bg-red-50 border-red-500' :
                      task.priority === 'medium' ? 'bg-orange-50 border-orange-500' :
                      'bg-blue-50 border-blue-500'
                    }`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        task.priority === 'high' ? 'bg-red-100' :
                        task.priority === 'medium' ? 'bg-orange-100' :
                        'bg-blue-100'
                      }`}>
                        {task.type === 'meeting' ? (
                          <CalendarIcon className={`w-4 h-4 ${
                            task.priority === 'high' ? 'text-red-600' :
                            task.priority === 'medium' ? 'text-orange-600' :
                            'text-blue-600'
                          }`} />
                        ) : task.type === 'call' ? (
                          <PhoneIcon className={`w-4 h-4 ${
                            task.priority === 'high' ? 'text-red-600' :
                            task.priority === 'medium' ? 'text-orange-600' :
                            'text-blue-600'
                          }`} />
                        ) : (
                          <BuildingOfficeIcon className={`w-4 h-4 ${
                            task.priority === 'high' ? 'text-red-600' :
                            task.priority === 'medium' ? 'text-orange-600' :
                            'text-blue-600'
                          }`} />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{task.title}</p>
                        <p className="text-xs text-gray-500">{task.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 font-medium">No scheduled tasks today</p>
                  <p className="text-gray-500 text-sm">Your schedule is clear!</p>
                </div>
              )}
            </div>

            {/* Market Trends */}
            {marketTrends && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Market Trends</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm">Average Price</span>
                    <span className="text-green-600 font-semibold">₹{marketTrends.averagePrice?.toLocaleString() || '0'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm">New Listings</span>
                    <span className="text-blue-600 font-semibold">{marketTrends.newListings || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm">Price per Sq Ft</span>
                    <span className="text-purple-600 font-semibold">₹{marketTrends.pricePerSqft?.toLocaleString() || '0'}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedDashboard;