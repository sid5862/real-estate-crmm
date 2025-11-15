import React, { useState, useEffect, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { leadsAPI, employeesAPI, propertiesAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import FilterBox from '../../components/Common/FilterBox';
import FloatingAddButton from '../../components/Common/FloatingAddButton';
import DataTable from '../../components/Common/DataTable';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  UserPlusIcon,
  PhoneIcon,
  EnvelopeIcon,
  CalendarIcon,
  ChartBarIcon,
  DocumentDuplicateIcon,
  ShareIcon,
  UserGroupIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  BuildingOfficeIcon,
  ClockIcon,
  StarIcon,
  FireIcon,
  TrophyIcon,
  SparklesIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  Squares2X2Icon,
  ListBulletIcon,
  TableCellsIcon,
  AdjustmentsHorizontalIcon,
  XMarkIcon,
  CheckIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  ArrowPathIcon,
  DocumentArrowDownIcon,
  DocumentArrowUpIcon,
  DocumentTextIcon,
  ClipboardDocumentListIcon,
  BellIcon,
  HeartIcon,
  BookmarkIcon,
  TagIcon,
  ChatBubbleLeftRightIcon,
  CalendarDaysIcon,
  UserCircleIcon,
  GlobeAltIcon,
  DevicePhoneMobileIcon,
  ComputerDesktopIcon,
  CpuChipIcon,
  LightBulbIcon,
  RocketLaunchIcon,
  ChartPieIcon,
  PresentationChartLineIcon,
  PresentationChartBarIcon,
  BanknotesIcon,
  HandThumbUpIcon,
  HandThumbDownIcon,
  FaceSmileIcon,
  FaceFrownIcon,
  MapIcon,
  CogIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import {
  HeartIcon as HeartSolidIcon,
  StarIcon as StarSolidIcon,
  BookmarkIcon as BookmarkSolidIcon
} from '@heroicons/react/24/solid';
import toast from 'react-hot-toast';

const Leads = () => {
  const { hasPermission, user } = useAuth();
  const location = useLocation();
  const [view, setView] = useState('list'); // 'list', 'pipeline', 'grid', 'table'
  const [viewMode, setViewMode] = useState('list'); // 'list', 'grid', 'table'
  const [leads, setLeads] = useState([]);
  const [pipeline, setPipeline] = useState({});
  const [loading, setLoading] = useState(true);
  const [employees, setEmployees] = useState([]);
  const [properties, setProperties] = useState([]);
  const [analytics, setAnalytics] = useState({});
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [selectedLeads, setSelectedLeads] = useState([]);
  const [favorites, setFavorites] = useState(new Set());
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [savedFilters, setSavedFilters] = useState([]);
  const [activeFilter, setActiveFilter] = useState(null);
  const [activeId, setActiveId] = useState(null);
  const [draggedLead, setDraggedLead] = useState(null);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importData, setImportData] = useState([]);
  const [importMapping, setImportMapping] = useState({});
  const [importLoading, setImportLoading] = useState(false);
  const [showSaveFilterModal, setShowSaveFilterModal] = useState(false);
  const [filterName, setFilterName] = useState('');
  const [compareLeads, setCompareLeads] = useState([]);
  const [showComparisonModal, setShowComparisonModal] = useState(false);
  const [showAIModal, setShowAIModal] = useState(false);
  const [aiInsights, setAiInsights] = useState({});
  const [aiLoading, setAiLoading] = useState(false);
  const [showLeadIntelligence, setShowLeadIntelligence] = useState(false);
  const [showBehavioralAnalytics, setShowBehavioralAnalytics] = useState(false);
  const [showAutomatedNurturing, setShowAutomatedNurturing] = useState(false);
  const [showLeadScoring, setShowLeadScoring] = useState(false);
  const [showLeadSegmentation, setShowLeadSegmentation] = useState(false);
  const [showLeadPredictions, setShowLeadPredictions] = useState(false);
  const [showLeadJourney, setShowLeadJourney] = useState(false);
  const [showLeadEngagement, setShowLeadEngagement] = useState(false);
  const [showLeadConversion, setShowLeadConversion] = useState(false);
  const [showLeadRetention, setShowLeadRetention] = useState(false);
  const [showLeadInsights, setShowLeadInsights] = useState(false);
  const [showLeadAutomation, setShowLeadAutomation] = useState(false);
  const [showLeadPersonalization, setShowLeadPersonalization] = useState(false);
  const [showLeadTracking, setShowLeadTracking] = useState(false);
  const [showLeadOptimization, setShowLeadOptimization] = useState(false);
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [selectedLeadActivity, setSelectedLeadActivity] = useState(null);
  const [leadActivities, setLeadActivities] = useState({});
  const [showAutoAssignModal, setShowAutoAssignModal] = useState(false);
  const [autoAssignRules, setAutoAssignRules] = useState([]);
  const [showTemplatesModal, setShowTemplatesModal] = useState(false);
  const [leadTemplates, setLeadTemplates] = useState([
    {
      id: 1,
      name: 'Website Lead',
      template: {
        source: 'website',
        status: 'new',
        status: 'contacted',
        notes: 'Interested in property investment'
      }
    },
    {
      id: 2,
      name: 'Referral Lead',
      template: {
        source: 'referral',
        status: 'contacted',
        status: 'qualified',
        notes: 'Referred by existing client'
      }
    },
    {
      id: 3,
      name: 'Cold Call Lead',
      template: {
        source: 'cold_call',
        status: 'new',
        status: 'new',
        notes: 'Initial contact made'
      }
    }
  ]);
  const [filters, setFilters] = useState({
    search: '',
    stage: '',
    source: '',
    status: '',
    assigned_employee_id: '',
    property_id: '',
    date_range: '',
    budget: '',
    budget: '',
    location: '',
    tags: '',
  });
  const [pagination, setPagination] = useState({
    page: 1,
    per_page: 20,
    total: 0,
    pages: 0,
  });

  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    fetchEmployees();
    fetchProperties();
    fetchAnalytics(); // Fetch analytics on initial load
    if (view === 'list' || view === 'grid' || view === 'table') {
      fetchLeads();
    } else {
      fetchPipeline();
    }
  }, [view, pagination.page, filters, sortBy, sortOrder]);

  // Fetch analytics after leads are loaded
  useEffect(() => {
    if (leads.length > 0 || Object.keys(pipeline).length > 0) {
      fetchAnalytics();
    }
  }, [leads, pipeline]);

  // Handle URL parameters on component mount
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const propertyId = urlParams.get('property_id');
    if (propertyId) {
      setFilters(prev => ({
        ...prev,
        property_id: propertyId
      }));
    }
  }, [location.search]);

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

  const fetchAnalytics = async () => {
    try {
      setAnalyticsLoading(true);
      // Fetch all leads for analytics (without pagination)
      const response = await leadsAPI.getLeads({ per_page: 1000 });
      const allLeads = response.data.leads || [];
      
      // Calculate real analytics from the data
      const totalLeads = (allLeads || []).length;
      const newLeads = (allLeads || []).filter(l => l.status === 'new').length;
      const hotLeads = (allLeads || []).filter(l => l.source === 'website').length; // Using source as proxy for hot leads
      const closedWon = (allLeads || []).filter(l => l.status === 'closed_won').length;
      const conversionRate = totalLeads > 0 ? ((closedWon / totalLeads) * 100).toFixed(1) : 0;
      
      // Calculate source distribution
      const sourceCounts = {};
      (allLeads || []).forEach(lead => {
        sourceCounts[lead.source] = (sourceCounts[lead.source] || 0) + 1;
      });
      
      const topSources = Object.entries(sourceCounts || {})
        .map(([source, count]) => ({
          source: source.charAt(0).toUpperCase() + source.slice(1).replace('_', ' '),
          count,
          percentage: totalLeads > 0 ? Math.round((count / totalLeads) * 100) : 0
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 4);
      
      // Calculate stage distribution
      const stageDistribution = {
        new: (allLeads || []).filter(l => l.status === 'new').length,
        contacted: (allLeads || []).filter(l => l.status === 'contacted').length,
        qualified: (allLeads || []).filter(l => l.status === 'qualified').length,
        proposal: (allLeads || []).filter(l => l.status === 'proposal').length,
        negotiation: (allLeads || []).filter(l => l.status === 'negotiation').length,
        closed_won: (allLeads || []).filter(l => l.status === 'closed_won').length,
        closed_lost: (allLeads || []).filter(l => l.status === 'closed_lost').length
      };
      
      // Calculate monthly trend (last 6 months)
      const monthlyTrend = [];
      const now = new Date();
      for (let i = 5; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthName = date.toLocaleDateString('en-US', { month: 'short' });
        const monthLeads = (allLeads || []).filter(lead => {
          const leadDate = new Date(lead.created_at);
          return leadDate.getMonth() === date.getMonth() && leadDate.getFullYear() === date.getFullYear();
        });
        const monthConversions = (monthLeads || []).filter(lead => lead.status === 'closed_won').length;
        
        monthlyTrend.push({
          month: monthName,
          leads: (monthLeads || []).length,
          conversions: monthConversions
        });
      }
      
      const analyticsData = {
        totalLeads,
        newLeads,
        hotLeads,
        conversionRate: parseFloat(conversionRate),
        avgResponseTime: '2.3 hours', // This would need to be calculated from actual response times
        topSources,
        stageDistribution,
        monthlyTrend
      };
      
      setAnalytics(analyticsData);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
      // Set default analytics if API fails
      setAnalytics({
        totalLeads: 0,
        newLeads: 0,
        hotLeads: 0,
        conversionRate: 0,
        avgResponseTime: '0 hours',
        topSources: [],
        stageDistribution: {
          new: 0,
          contacted: 0,
          qualified: 0,
          proposal: 0,
          negotiation: 0,
          closed_won: 0,
          closed_lost: 0
        },
        monthlyTrend: []
      });
    } finally {
      setAnalyticsLoading(false);
    }
  };

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.page,
        per_page: pagination.per_page,
        ...filters,
      };
      
      const response = await leadsAPI.getLeads(params);
      setLeads(response.data.leads || response.data || []);
      setPagination(prev => ({
        ...prev,
        total: response.data.total || 0,
        pages: response.data.pages || 0,
      }));
    } catch (error) {
      toast.error('Failed to fetch leads');
      console.error('Leads fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPipeline = async () => {
    try {
      setLoading(true);
      const response = await leadsAPI.getPipeline();
      setPipeline(response.data.pipeline);
    } catch (error) {
      toast.error('Failed to fetch pipeline');
      console.error('Pipeline fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this lead?')) {
      return;
    }

    try {
      await leadsAPI.deleteLead(id);
      toast.success('Lead deleted successfully');
      if (view === 'list') {
        fetchLeads();
      } else {
        fetchPipeline();
      }
    } catch (error) {
      toast.error('Failed to delete lead');
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      stage: '',
      source: '',
      status: '',
      assigned_employee_id: '',
      property_id: '',
      date_range: '',
      budget: '',
      budget: '',
      location: '',
      tags: '',
    });
    setSearchTerm('');
    setStatusFilter('');
    setActiveFilter(null);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  // Filter Preset Functions
  const saveCurrentFilter = () => {
    if (!filterName.trim()) return;
    
    const newFilter = {
      id: Date.now(),
      name: filterName.trim(),
      filters: { ...filters },
      searchTerm,
      statusFilter,
      createdAt: new Date().toISOString(),
    };
    
    setSavedFilters(prev => [...prev, newFilter]);
    setFilterName('');
    setShowSaveFilterModal(false);
    toast.success('Filter preset saved successfully');
  };

  const applySavedFilter = (filter) => {
    setFilters(filter.filters);
    setSearchTerm(filter.searchTerm || '');
    setStatusFilter(filter.statusFilter || '');
    setActiveFilter(filter);
    setPagination(prev => ({ ...prev, page: 1 }));
    toast.success(`Applied filter: ${filter.name}`);
  };

  const deleteSavedFilter = (filterId) => {
    setSavedFilters(prev => prev.filter(f => f.id !== filterId));
    if (activeFilter?.id === filterId) {
      setActiveFilter(null);
    }
    toast.success('Filter preset deleted');
  };

  // Lead Comparison Functions
  const addToComparison = (lead) => {
    if (compareLeads.length >= 3) {
      toast.error('You can compare up to 3 leads at a time');
      return;
    }
    if (compareLeads.find(l => l.id === lead.id)) {
      toast.error('Lead already in comparison');
      return;
    }
    setCompareLeads(prev => [...prev, lead]);
    toast.success('Lead added to comparison');
  };

  const removeFromComparison = (leadId) => {
    setCompareLeads(prev => prev.filter(l => l.id !== leadId));
  };

  const clearComparison = () => {
    setCompareLeads([]);
    setShowComparisonModal(false);
  };

  // AI Insights and Lead Scoring Functions
  const calculateLeadScore = (lead) => {
    let score = 0;
    
    // Email presence (20 points)
    if (lead.email) score += 20;
    
    // Phone presence (20 points)
    if (lead.phone) score += 20;
    
    // Budget range (30 points)
    if (lead.budget) {
      const budgetRange = lead.budget;
      if (budgetRange > 0) score += 30;
    }
    
    // Location preference (15 points)
    if (lead.notes) score += 15;
    
    // Source quality (15 points)
    const sourceScores = {
      'referral': 15,
      'website': 12,
      'social_media': 10,
      'advertisement': 8,
      'cold_call': 5,
      'import': 3
    };
    score += sourceScores[lead.source] || 5;
    
    // Recent activity (bonus)
    const daysSinceCreated = Math.floor((new Date() - new Date(lead.created_at)) / (1000 * 60 * 60 * 24));
    if (daysSinceCreated <= 1) score += 10;
    else if (daysSinceCreated <= 7) score += 5;
    
    return Math.min(score, 100); // Cap at 100
  };

  const generateAIInsights = async () => {
    setAiLoading(true);
    try {
      // Simulate AI analysis
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const allLeads = leads;
      const totalLeads = allLeads.length;
      const hotLeads = allLeads.filter(l => calculateLeadScore(l) >= 70).length;
      const warmLeads = allLeads.filter(l => calculateLeadScore(l) >= 40 && calculateLeadScore(l) < 70).length;
      const coldLeads = allLeads.filter(l => calculateLeadScore(l) < 40).length;
      
      // Calculate conversion probability
      const avgScore = allLeads.reduce((sum, lead) => sum + calculateLeadScore(lead), 0) / totalLeads;
      const conversionProbability = Math.min((avgScore / 100) * 0.8, 0.75); // Max 75% conversion rate
      
      // Generate insights
      const insights = {
        totalLeads,
        hotLeads,
        warmLeads,
        coldLeads,
        avgScore: Math.round(avgScore),
        conversionProbability: Math.round(conversionProbability * 100),
        recommendations: [
          {
            type: 'priority',
            title: 'Focus on Hot Leads',
            description: `${hotLeads} leads have high conversion potential. Prioritize follow-ups within 24 hours.`,
            impact: 'high'
          },
          {
            type: 'optimization',
            title: 'Improve Lead Quality',
            description: `${coldLeads} leads need more information. Consider lead nurturing campaigns.`,
            impact: 'medium'
          },
          {
            type: 'process',
            title: 'Automate Follow-ups',
            description: 'Set up automated email sequences for warm leads to improve conversion rates.',
            impact: 'high'
          }
        ],
        trends: {
          bestPerformingSource: allLeads.reduce((acc, lead) => {
            acc[lead.source] = (acc[lead.source] || 0) + 1;
            return acc;
          }, {}),
          avgResponseTime: '2.3 hours',
          peakHours: '10 AM - 2 PM'
        }
      };
      
      setAiInsights(insights);
      setShowAIModal(true);
    } catch (error) {
      toast.error('Failed to generate AI insights');
      console.error('AI insights error:', error);
    } finally {
      setAiLoading(false);
    }
  };

  // Activity Timeline Functions
  const generateLeadActivity = (lead) => {
    const activities = [];
    const now = new Date();
    
    // Lead creation
    activities.push({
      id: `created-${lead.id}`,
      type: 'created',
      title: 'Lead Created',
      description: `Lead was created from ${lead.source}`,
      timestamp: new Date(lead.created_at),
      icon: 'UserPlusIcon',
      color: 'blue'
    });
    
    // Stage changes (simulated)
    const stages = ['new', 'contacted', 'qualified', 'proposal', 'negotiation', 'closed_won', 'closed_lost'];
    const currentStageIndex = stages.indexOf(lead.status);
    
    for (let i = 0; i < currentStageIndex; i++) {
      const statusDate = new Date(lead.created_at);
      statusDate.setDate(statusDate.getDate() + (i + 1) * 2);
      
      activities.push({
        id: `stage-${lead.id}-${i}`,
        type: 'stage_change',
        title: `Moved to ${stages[i + 1].replace('_', ' ')}`,
        description: `Lead progressed to ${stages[i + 1].replace('_', ' ')} stage`,
        timestamp: statusDate,
        icon: 'ArrowRightIcon',
        color: 'green'
      });
    }
    
    // Communications (simulated)
    if (lead.phone) {
      const callDate = new Date(lead.created_at);
      callDate.setHours(callDate.getHours() + 2);
      activities.push({
        id: `call-${lead.id}`,
        type: 'call',
        title: 'Phone Call Made',
        description: `Called ${lead.phone}`,
        timestamp: callDate,
        icon: 'PhoneIcon',
        color: 'purple'
      });
    }
    
    if (lead.email) {
      const emailDate = new Date(lead.created_at);
      emailDate.setHours(emailDate.getHours() + 4);
      activities.push({
        id: `email-${lead.id}`,
        type: 'email',
        title: 'Email Sent',
        description: `Sent email to ${lead.email}`,
        timestamp: emailDate,
        icon: 'EnvelopeIcon',
        color: 'indigo'
      });
    }
    
    // Notes (simulated)
    if (lead.notes) {
      const noteDate = new Date(lead.created_at);
      noteDate.setHours(noteDate.getHours() + 6);
      activities.push({
        id: `note-${lead.id}`,
        type: 'note',
        title: 'Note Added',
        description: lead.notes.substring(0, 50) + (lead.notes.length > 50 ? '...' : ''),
        timestamp: noteDate,
        icon: 'DocumentTextIcon',
        color: 'yellow'
      });
    }
    
    // Sort by timestamp
    return activities.sort((a, b) => b.timestamp - a.timestamp);
  };

  const showLeadActivity = (lead) => {
    const activities = generateLeadActivity(lead);
    setLeadActivities(prev => ({ ...prev, [lead.id]: activities }));
    setSelectedLeadActivity(lead);
    setShowActivityModal(true);
  };

  // Auto Assignment Functions
  const autoAssignLeads = async () => {
    try {
      const unassignedLeads = leads.filter(lead => !lead.assigned_employee_id);
      const availableEmployees = employees.filter(emp => emp.role === 'sales_agent');
      
      if (unassignedLeads.length === 0) {
        toast.info('No unassigned leads found');
        return;
      }
      
      if (availableEmployees.length === 0) {
        toast.error('No sales agents available for assignment');
        return;
      }
      
      // Simple round-robin assignment
      let employeeIndex = 0;
      const assignments = [];
      
      for (const lead of unassignedLeads) {
        const employee = availableEmployees[employeeIndex];
        assignments.push({
          leadId: lead.id,
          employeeId: employee.id,
          employeeName: `${employee.first_name} ${employee.last_name}`
        });
        employeeIndex = (employeeIndex + 1) % availableEmployees.length;
      }
      
      // Apply assignments
      for (const assignment of assignments) {
        await leadsAPI.updateLead(assignment.leadId, {
          assigned_employee_id: assignment.employeeId
        });
      }
      
      toast.success(`${assignments.length} leads assigned successfully`);
      fetchLeads();
      fetchAnalytics();
    } catch (error) {
      toast.error('Failed to auto-assign leads');
      console.error('Auto-assignment error:', error);
    }
  };

  // Lead Templates Functions
  const createLeadFromTemplate = (template) => {
    const templateData = {
      ...template.template,
      assigned_employee_id: user?.id || null
    };
    
    // Navigate to lead form with template data
    const queryParams = new URLSearchParams(templateData).toString();
    navigate(`/leads/new?template=${queryParams}`);
    setShowTemplatesModal(false);
    toast.success(`Creating lead from ${template.name} template`);
  };

  // Enhanced Lead Intelligence Functions
  const openLeadIntelligence = () => {
    setShowLeadIntelligence(true);
  };

  const openBehavioralAnalytics = () => {
    setShowBehavioralAnalytics(true);
  };

  const openAutomatedNurturing = () => {
    setShowAutomatedNurturing(true);
  };

  const openLeadScoring = () => {
    setShowLeadScoring(true);
  };

  const openLeadSegmentation = () => {
    setShowLeadSegmentation(true);
  };

  const openLeadPredictions = () => {
    setShowLeadPredictions(true);
  };

  const openLeadJourney = () => {
    setShowLeadJourney(true);
  };

  const openLeadEngagement = () => {
    setShowLeadEngagement(true);
  };

  const openLeadConversion = () => {
    setShowLeadConversion(true);
  };

  const openLeadRetention = () => {
    setShowLeadRetention(true);
  };

  const openLeadInsights = () => {
    setShowLeadInsights(true);
  };

  const openLeadAutomation = () => {
    setShowLeadAutomation(true);
  };

  const openLeadPersonalization = () => {
    setShowLeadPersonalization(true);
  };

  const openLeadTracking = () => {
    setShowLeadTracking(true);
  };

  const openLeadOptimization = () => {
    setShowLeadOptimization(true);
  };

  const closeAllLeadModals = () => {
    setShowLeadIntelligence(false);
    setShowBehavioralAnalytics(false);
    setShowAutomatedNurturing(false);
    setShowLeadScoring(false);
    setShowLeadSegmentation(false);
    setShowLeadPredictions(false);
    setShowLeadJourney(false);
    setShowLeadEngagement(false);
    setShowLeadConversion(false);
    setShowLeadRetention(false);
    setShowLeadInsights(false);
    setShowLeadAutomation(false);
    setShowLeadPersonalization(false);
    setShowLeadTracking(false);
    setShowLeadOptimization(false);
  };

  // Advanced Lead Analytics Functions
  const getLeadBehavioralData = () => {
    return {
      websiteVisits: 1250,
      pageViews: 3400,
      timeOnSite: 8.5,
      bounceRate: 35.2,
      conversionRate: 12.8,
      engagementScore: 85,
      lastActivity: '2 hours ago',
      preferredTime: '2:00 PM - 4:00 PM',
      deviceType: 'Mobile (65%)',
      trafficSource: 'Organic (45%), Direct (30%), Social (25%)',
      interests: ['Luxury Apartments', 'Investment Properties', 'Commercial Real Estate'],
      behaviorPattern: 'High Intent - Multiple Property Views',
      leadScore: 92,
      nextBestAction: 'Schedule Property Viewing',
      predictedConversion: 78
    };
  };

  const getLeadSegmentationData = () => {
    return {
      segments: [
        { name: 'Hot Leads', count: 45, color: 'red', criteria: 'Score > 80, Recent Activity' },
        { name: 'Warm Leads', count: 120, color: 'orange', criteria: 'Score 50-80, Some Activity' },
        { name: 'Cold Leads', count: 200, color: 'blue', criteria: 'Score < 50, No Recent Activity' },
        { name: 'VIP Clients', count: 25, color: 'purple', criteria: 'High Value, Repeat Customers' },
        { name: 'First-time Buyers', count: 80, color: 'green', criteria: 'New to Market, Low Experience' },
        { name: 'Investors', count: 60, color: 'yellow', criteria: 'Multiple Properties, High Budget' }
      ],
      demographics: {
        ageGroups: { '25-35': 35, '36-45': 40, '46-55': 20, '55+': 5 },
        incomeLevels: { 'Low': 15, 'Medium': 45, 'High': 30, 'Very High': 10 },
        locations: { 'Mumbai': 40, 'Delhi': 25, 'Bangalore': 20, 'Other': 15 },
        preferences: { 'Apartments': 60, 'Villas': 25, 'Commercial': 15 }
      }
    };
  };

  const getLeadJourneyData = () => {
    return {
      stages: [
        { name: 'Awareness', leads: 500, conversion: 20, avgTime: '7 days' },
        { name: 'Interest', leads: 100, conversion: 40, avgTime: '14 days' },
        { name: 'Consideration', leads: 40, conversion: 60, avgTime: '21 days' },
        { name: 'Intent', leads: 24, conversion: 80, avgTime: '30 days' },
        { name: 'Purchase', leads: 19, conversion: 100, avgTime: '45 days' }
      ],
      touchpoints: [
        { name: 'Website Visit', count: 1250, impact: 'High' },
        { name: 'Email Open', count: 890, impact: 'Medium' },
        { name: 'Property View', count: 450, impact: 'High' },
        { name: 'Phone Call', count: 120, impact: 'Very High' },
        { name: 'Property Visit', count: 80, impact: 'Very High' },
        { name: 'Proposal Sent', count: 45, impact: 'High' }
      ],
      bottlenecks: [
        { stage: 'Interest to Consideration', dropoff: 60, reason: 'Lack of follow-up' },
        { stage: 'Consideration to Intent', dropoff: 40, reason: 'Price sensitivity' },
        { stage: 'Intent to Purchase', dropoff: 20, reason: 'Financing issues' }
      ]
    };
  };

  const getLeadPredictions = () => {
    return {
      conversionProbability: [
        { lead: 'Rajesh Kumar', probability: 85, timeframe: '2 weeks', factors: ['High engagement', 'Budget confirmed', 'Location preference clear'] },
        { lead: 'Priya Sharma', probability: 72, timeframe: '1 month', factors: ['Multiple property views', 'Active communication', 'Decision maker identified'] },
        { lead: 'Amit Patel', probability: 45, timeframe: '2 months', factors: ['Price sensitive', 'Comparing options', 'Long decision cycle'] },
        { lead: 'Sneha Singh', probability: 90, timeframe: '1 week', factors: ['Urgent requirement', 'Budget approved', 'Location finalized'] }
      ],
      churnRisk: [
        { lead: 'Vikram Mehta', risk: 'High', reason: 'No activity for 30 days', action: 'Re-engagement campaign' },
        { lead: 'Anita Desai', risk: 'Medium', reason: 'Price objections', action: 'Value proposition review' },
        { lead: 'Rohit Gupta', risk: 'Low', reason: 'Active engagement', action: 'Continue nurturing' }
      ],
      nextBestActions: [
        { lead: 'Rajesh Kumar', action: 'Schedule property viewing', priority: 'High', expectedOutcome: 'Qualification' },
        { lead: 'Priya Sharma', action: 'Send property comparison', priority: 'High', expectedOutcome: 'Decision acceleration' },
        { lead: 'Amit Patel', action: 'Provide financing options', priority: 'Medium', expectedOutcome: 'Objection handling' }
      ]
    };
  };

  // Bulk Operations
  const handleSelectLead = (leadId) => {
    setSelectedLeads(prev => 
      prev.includes(leadId) 
        ? prev.filter(id => id !== leadId)
        : [...prev, leadId]
    );
  };

  const handleSelectAll = () => {
    if (selectedLeads.length === leads.length) {
      setSelectedLeads([]);
    } else {
      setSelectedLeads((leads || []).map(l => l.id));
    }
  };

  const handleBulkStageChange = async (newStage) => {
    try {
      const promises = (selectedLeads || []).map(leadId => 
        leadsAPI.updateLead(leadId, { status: newStage })
      );
      await Promise.all(promises);
      toast.success(`${(selectedLeads || []).length} leads updated successfully`);
      setSelectedLeads([]);
      fetchLeads();
    } catch (error) {
      toast.error('Failed to update leads');
    }
  };

  const handleBulkAssign = async (employeeId) => {
    try {
      const promises = (selectedLeads || []).map(leadId => 
        leadsAPI.updateLead(leadId, { assigned_employee_id: employeeId })
      );
      await Promise.all(promises);
      toast.success(`${(selectedLeads || []).length} leads assigned successfully`);
      setSelectedLeads([]);
      fetchLeads();
    } catch (error) {
      toast.error('Failed to assign leads');
    }
  };

  const handleBulkDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete ${(selectedLeads || []).length} leads?`)) {
      return;
    }

    try {
      const promises = (selectedLeads || []).map(leadId => leadsAPI.deleteLead(leadId));
      await Promise.all(promises);
      toast.success(`${(selectedLeads || []).length} leads deleted successfully`);
      setSelectedLeads([]);
      fetchLeads();
    } catch (error) {
      toast.error('Failed to delete leads');
    }
  };

  const handleExportLeads = () => {
    const csvContent = [
      ['Name', 'Email', 'Phone', 'Source', 'Status', 'Budget', 'Assigned To', 'Created Date'],
      ...(leads || []).map(lead => [
        lead.name || '',
        lead.email || '',
        lead.phone || '',
        lead.source,
        lead.status,
        lead.budget || '',
        lead.assigned_employee ? (lead.assigned_employee.name || `${lead.assigned_employee.first_name} ${lead.assigned_employee.last_name}`) : 'Unassigned',
        new Date(lead.created_at).toLocaleDateString()
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'leads-export.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Leads exported successfully');
  };

  // CSV Import Functions
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const csv = e.target.result;
      const lines = csv.split('\n');
      const headers = (lines[0] || '').split(',').map(h => h.trim().replace(/"/g, ''));
      const data = (lines || []).slice(1).filter(line => line.trim()).map(line => {
        const values = (line || '').split(',').map(v => v.trim().replace(/"/g, ''));
        const row = {};
        (headers || []).forEach((header, index) => {
          row[header] = (values || [])[index] || '';
        });
        return row;
      });

      setImportData(data);
      setShowImportModal(true);
      
      // Auto-map common fields
      const autoMapping = {};
      headers.forEach(header => {
        const lowerHeader = header.toLowerCase();
        if (lowerHeader.includes('name') || lowerHeader.includes('full name')) {
          autoMapping.first_name = header;
        } else if (lowerHeader.includes('email')) {
          autoMapping.email = header;
        } else if (lowerHeader.includes('phone') || lowerHeader.includes('mobile')) {
          autoMapping.phone = header;
        } else if (lowerHeader.includes('source')) {
          autoMapping.source = header;
        } else if (lowerHeader.includes('stage') || lowerHeader.includes('status')) {
          autoMapping.status = header;
        } else if (lowerHeader.includes('location') || lowerHeader.includes('city')) {
          autoMapping.notes = header;
        }
      });
      setImportMapping(autoMapping);
    };
    reader.readAsText(file);
  };

  const handleImportLeads = async () => {
    if ((importData || []).length === 0) return;

    setImportLoading(true);
    try {
      const leadsToImport = (importData || []).map(row => {
        const lead = {
          name: (row || {})[importMapping.name] || `${(row || {})[importMapping.first_name] || ''} ${(row || {})[importMapping.last_name] || ''}`.trim(),
          email: (row || {})[importMapping.email] || '',
          phone: (row || {})[importMapping.phone] || '',
          source: (row || {})[importMapping.source] || 'import',
          status: (row || {})[importMapping.status] || 'new',
          budget: (row || {})[importMapping.budget] ? parseFloat((row || {})[importMapping.budget]) : null,
          notes: (row || {})[importMapping.notes] || '',
          assigned_employee_id: user?.id || null,
        };

        // Split full name if no separate first/last name
        if (!lead.name && (row || {})[importMapping.first_name]) {
          const nameParts = ((row || {})[importMapping.first_name] || '').split(' ');
          lead.name = nameParts.join(' ') || '';
        }

        return lead;
      }).filter(lead => lead.name && (lead.email || lead.phone));

      // Import leads in batches
      const batchSize = 10;
      for (let i = 0; i < (leadsToImport || []).length; i += batchSize) {
        const batch = (leadsToImport || []).slice(i, i + batchSize);
        const promises = (batch || []).map(lead => leadsAPI.createLead(lead));
        await Promise.all(promises);
      }

      toast.success(`${(leadsToImport || []).length} leads imported successfully`);
      setShowImportModal(false);
      setImportData([]);
      setImportMapping({});
      fetchLeads();
      fetchAnalytics();
    } catch (error) {
      toast.error('Failed to import leads');
      console.error('Import error:', error);
    } finally {
      setImportLoading(false);
    }
  };

  const toggleFavorite = (leadId) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(leadId)) {
        newFavorites.delete(leadId);
      } else {
        newFavorites.add(leadId);
      }
      return newFavorites;
    });
  };

  // Drag and drop handlers
  const handleDragStart = (event) => {
    const { active } = event;
    setActiveId(active.id);
    
    // Find the dragged lead
    const lead = Object.values(pipeline).flat().find(l => l.id === active.id);
    setDraggedLead(lead);
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    setActiveId(null);
    setDraggedLead(null);

    if (!over) return;

    const leadId = active.id;
    const newStage = over.id;

    // Find the current lead
    const lead = Object.values(pipeline).flat().find(l => l.id === leadId);
    if (!lead || lead.stage === newStage) return;

    try {
      // Update the lead stage
      await leadsAPI.updateLead(leadId, { stage: newStage });
      toast.success(`Lead moved to ${newStage.replace('_', ' ')} stage`);
      
      // Refresh the pipeline
      fetchPipeline();
      fetchAnalytics();
    } catch (error) {
      toast.error('Failed to update lead stage');
      console.error('Error updating lead stage:', error);
    }
  };

  // Filter and sort leads
  const filteredAndSortedLeads = useMemo(() => {
    let filtered = leads;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(lead => 
        (lead.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.phone?.includes(searchTerm) ||
        lead.notes?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter) {
      filtered = filtered.filter(lead => lead.stage === statusFilter);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];

      if (sortBy === 'name') {
        aValue = `${a.first_name} ${a.last_name}`;
        bValue = `${b.first_name} ${b.last_name}`;
      }

      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [leads, searchTerm, statusFilter, sortBy, sortOrder]);

  const getStageBadge = (stage) => {
    const stageClasses = {
      new: 'bg-blue-100 text-blue-800',
      contacted: 'bg-yellow-100 text-yellow-800',
      site_visit_scheduled: 'bg-purple-100 text-purple-800',
      negotiation: 'bg-orange-100 text-orange-800',
      closed_won: 'bg-green-100 text-green-800',
      closed_lost: 'bg-red-100 text-red-800',
    };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${stageClasses[stage] || 'bg-gray-100 text-gray-800'}`}>
        {stage.replace('_', ' ')}
      </span>
    );
  };

  const getScoreBadge = (score) => {
    const scoreClasses = {
      hot: 'bg-red-100 text-red-800',
      warm: 'bg-orange-100 text-orange-800',
      cold: 'bg-blue-100 text-blue-800',
    };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${scoreClasses[score] || 'bg-gray-100 text-gray-800'}`}>
        {score}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  // Table columns configuration
  const columns = [
    {
      key: 'name',
      label: 'Lead Name',
      type: 'text'
    },
    {
      key: 'email',
      label: 'Email',
      type: 'text'
    },
    {
      key: 'phone',
      label: 'Phone',
      type: 'text'
    },
    {
      key: 'source',
      label: 'Source',
      type: 'badge'
    },
    {
      key: 'stage',
      label: 'Stage',
      type: 'status'
    },
    {
      key: 'lead_score',
      label: 'Score',
      type: 'text'
    },
    {
      key: 'budget',
      label: 'Budget',
      type: 'currency'
    },
    {
      key: 'created_at',
      label: 'Created',
      type: 'date'
    }
  ];

  // Custom filters for leads
  const customFilters = [
    {
      key: 'stage',
      label: 'Lead Stage',
      type: 'select',
      icon: ChartBarIcon,
      options: [
        { value: 'new', label: 'New' },
        { value: 'contacted', label: 'Contacted' },
        { value: 'qualified', label: 'Qualified' },
        { value: 'proposal', label: 'Proposal' },
        { value: 'negotiation', label: 'Negotiation' },
        { value: 'closed_won', label: 'Closed Won' },
        { value: 'closed_lost', label: 'Closed Lost' }
      ]
    },
    {
      key: 'source',
      label: 'Lead Source',
      type: 'select',
      icon: UserGroupIcon,
      options: [
        { value: 'website', label: 'Website' },
        { value: 'referral', label: 'Referral' },
        { value: 'social_media', label: 'Social Media' },
        { value: 'advertisement', label: 'Advertisement' },
        { value: 'cold_call', label: 'Cold Call' },
        { value: 'walk_in', label: 'Walk In' }
      ]
    },
    {
      key: 'assigned_employee_id',
      label: 'Assigned To',
      type: 'select',
      icon: UserGroupIcon,
      options: (employees || []).map(emp => ({
        value: emp.id.toString(),
        label: emp.name || `${emp.first_name} ${emp.last_name}`
      }))
    },
    {
      key: 'property_id',
      label: 'Property',
      type: 'select',
      icon: BuildingOfficeIcon,
      options: (properties || []).map(prop => ({
        value: prop.id.toString(),
        label: `${prop.title} - ${prop.location}`
      }))
    },
    {
      key: 'lead_score',
      label: 'Lead Score',
      type: 'select',
      icon: StarIcon,
      options: [
        { value: 'hot', label: 'Hot' },
        { value: 'warm', label: 'Warm' },
        { value: 'cold', label: 'Cold' }
      ]
    }
  ];

  // Quick actions for floating button
  const quickActions = [
    {
      label: 'Add Lead',
      description: 'Create a new lead',
      icon: UserPlusIcon,
      color: 'from-green-500 to-emerald-600',
      onClick: () => navigate('/leads/new')
    },
    {
      label: 'Lead Intelligence',
      description: 'AI-powered lead insights',
      icon: SparklesIcon,
      color: 'from-purple-500 to-pink-600',
      onClick: openLeadIntelligence
    },
    {
      label: 'Behavioral Analytics',
      description: 'Track lead behavior patterns',
      icon: ChartBarIcon,
      color: 'from-blue-500 to-indigo-600',
      onClick: openBehavioralAnalytics
    },
    {
      label: 'Automated Nurturing',
      description: 'Set up automated campaigns',
      icon: RocketLaunchIcon,
      color: 'from-orange-500 to-red-600',
      onClick: openAutomatedNurturing
    },
    {
      label: 'Lead Scoring',
      description: 'AI-powered lead scoring',
      icon: StarIcon,
      color: 'from-yellow-500 to-orange-600',
      onClick: openLeadScoring
    },
    {
      label: 'Lead Segmentation',
      description: 'Segment leads by behavior',
      icon: UserGroupIcon,
      color: 'from-teal-500 to-cyan-600',
      onClick: openLeadSegmentation
    },
    {
      label: 'Predictive Analytics',
      description: 'Predict conversion probability',
      icon: ArrowTrendingUpIcon,
      color: 'from-indigo-500 to-purple-600',
      onClick: openLeadPredictions
    },
    {
      label: 'Lead Journey',
      description: 'Map lead journey stages',
      icon: MapIcon,
      color: 'from-green-500 to-emerald-600',
      onClick: openLeadJourney
    },
    {
      label: 'Engagement Tracking',
      description: 'Track lead engagement',
      icon: EyeIcon,
      color: 'from-pink-500 to-rose-600',
      onClick: openLeadEngagement
    },
    {
      label: 'Conversion Optimization',
      description: 'Optimize conversion rates',
      icon: TrophyIcon,
      color: 'from-amber-500 to-yellow-600',
      onClick: openLeadConversion
    },
    {
      label: 'Lead Retention',
      description: 'Retain and re-engage leads',
      icon: HeartIcon,
      color: 'from-red-500 to-pink-600',
      onClick: openLeadRetention
    },
    {
      label: 'Smart Insights',
      description: 'Get actionable insights',
      icon: LightBulbIcon,
      color: 'from-cyan-500 to-blue-600',
      onClick: openLeadInsights
    },
    {
      label: 'Automation Rules',
      description: 'Create automation workflows',
      icon: CogIcon,
      color: 'from-gray-500 to-slate-600',
      onClick: openLeadAutomation
    },
    {
      label: 'Personalization',
      description: 'Personalize lead experience',
      icon: UserIcon,
      color: 'from-violet-500 to-purple-600',
      onClick: openLeadPersonalization
    },
    {
      label: 'Lead Tracking',
      description: 'Track lead activities',
      icon: ClockIcon,
      color: 'from-emerald-500 to-green-600',
      onClick: openLeadTracking
    },
    {
      label: 'Performance Optimization',
      description: 'Optimize lead performance',
      icon: FireIcon,
      color: 'from-orange-500 to-red-600',
      onClick: openLeadOptimization
    },
    {
      label: 'Templates',
      description: 'Use lead templates',
      icon: DocumentTextIcon,
      color: 'from-indigo-500 to-blue-600',
      onClick: () => setShowTemplatesModal(true)
    },
    {
      label: 'Import Leads',
      description: 'Import leads from CSV',
      icon: DocumentDuplicateIcon,
      color: 'from-blue-500 to-indigo-600',
          onClick: () => toast.info('Import functionality coming soon')
    },
    {
      label: 'Auto Assign',
      description: 'Auto assign unassigned leads',
      icon: UserGroupIcon,
      color: 'from-teal-500 to-green-600',
      onClick: autoAssignLeads
    },
    {
      label: 'Bulk Actions',
      description: 'Perform bulk operations',
      icon: ShareIcon,
      color: 'from-purple-500 to-pink-600',
          onClick: () => toast.info('Bulk actions coming soon')
    }
  ];

  const stages = ['new', 'contacted', 'qualified', 'proposal', 'negotiation', 'closed_won', 'closed_lost'];

  // Sortable Lead Card Component
  const SortableLeadCard = ({ lead }) => {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging,
    } = useSortable({ id: lead.id });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
      opacity: isDragging ? 0.5 : 1,
    };

    return (
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-4 border border-gray-100 hover:shadow-md transition-all duration-200 cursor-grab active:cursor-grabbing"
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">
              {lead.name}
            </p>
            <a 
              href={`tel:${lead.phone}`}
              className="text-xs text-blue-600 hover:text-blue-800 truncate hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              {lead.phone}
            </a>
            {lead.notes && (
              <p className="text-xs text-gray-500 truncate flex items-center mt-1">
                <MapPinIcon className="h-3 w-3 mr-1" />
                {lead.notes}
              </p>
            )}
          </div>
          <div className="flex items-center gap-1">
            {getScoreBadge(lead.status)}
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleFavorite(lead.id);
              }}
              className="p-1 text-gray-400 hover:text-red-500 transition-colors"
            >
              {favorites.has(lead.id) ? (
                <HeartSolidIcon className="h-4 w-4 text-red-500" />
              ) : (
                <HeartIcon className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500 flex items-center">
            <ClockIcon className="h-3 w-3 mr-1" />
            {formatDate(lead.created_at)}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                showLeadActivity(lead);
              }}
              className="text-xs text-green-600 hover:text-green-500 font-medium"
              title="View Activity"
            >
              Activity
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                addToComparison(lead);
              }}
              className="text-xs text-purple-600 hover:text-purple-500 font-medium"
              title="Add to Comparison"
            >
              Compare
            </button>
            <Link
              to={`/leads/${lead.id}`}
              className="text-xs text-blue-600 hover:text-blue-500 font-medium"
              onClick={(e) => e.stopPropagation()}
            >
              View →
            </Link>
          </div>
        </div>
      </div>
    );
  };

  if (loading && leads.length === 0 && Object.keys(pipeline).length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 rounded-3xl p-8 text-white shadow-2xl">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold mb-2">Lead Management</h1>
            <p className="text-blue-100 text-lg">
              Track, nurture, and convert your prospects into customers
            </p>
            <div className="flex items-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <UserGroupIcon className="h-5 w-5" />
                <span className="text-sm">{analytics.totalLeads || 0} Total Leads</span>
              </div>
              <div className="flex items-center gap-2">
                <FireIcon className="h-5 w-5" />
                <span className="text-sm">{analytics.hotLeads || 0} Hot Leads</span>
              </div>
              <div className="flex items-center gap-2">
                <TrophyIcon className="h-5 w-5" />
                <span className="text-sm">{analytics.conversionRate || 0}% Conversion</span>
              </div>
              <div className="flex items-center gap-2">
                <StarIcon className="h-5 w-5" />
                <span className="text-sm">{analytics.newLeads || 0} New This Week</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowAnalytics(!showAnalytics)}
              className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl hover:bg-white/30 transition-all duration-200"
              title="Toggle Analytics"
            >
              <ChartBarIcon className="h-6 w-6" />
            </button>
            <button
              onClick={fetchAnalytics}
              className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl hover:bg-white/30 transition-all duration-200"
              title="Refresh Analytics"
            >
              <ArrowPathIcon className="h-6 w-6" />
            </button>
            <button
              onClick={generateAIInsights}
              disabled={aiLoading}
              className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl hover:bg-white/30 transition-all duration-200 disabled:opacity-50"
              title="AI Insights"
            >
              {aiLoading ? (
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
              ) : (
                <CpuChipIcon className="h-6 w-6" />
              )}
            </button>
            {hasPermission('sales_agent') && (
              <>
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="csv-import"
                />
                <label
                  htmlFor="csv-import"
                  className="inline-flex items-center px-6 py-3 bg-white text-green-600 font-semibold rounded-2xl hover:bg-green-50 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 cursor-pointer"
                >
                  <DocumentArrowUpIcon className="h-5 w-5 mr-2" />
                  Import CSV
                </label>
                <Link
                  to="/leads/new"
                  className="inline-flex items-center px-6 py-3 bg-white text-blue-600 font-semibold rounded-2xl hover:bg-blue-50 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                >
                  <PlusIcon className="h-5 w-5 mr-2" />
                  Add Lead
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Analytics Dashboard */}
      {showAnalytics && (
        <div className="space-y-6">
          {analyticsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 animate-pulse">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
                      <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-24"></div>
                    </div>
                    <div className="w-12 h-12 bg-gray-200 rounded-2xl"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Leads</p>
                    <p className="text-3xl font-bold text-gray-900">{analytics.totalLeads || 0}</p>
                    <p className="text-sm text-green-600 flex items-center mt-1">
                      <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
                      All time
                    </p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-2xl">
                    <UserGroupIcon className="h-8 w-8 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">New Leads</p>
                    <p className="text-3xl font-bold text-gray-900">{analytics.newLeads || 0}</p>
                    <p className="text-sm text-blue-600 flex items-center mt-1">
                      <SparklesIcon className="h-4 w-4 mr-1" />
                      {analytics.newLeads > 0 ? 'Recent' : 'None yet'}
                    </p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-2xl">
                    <StarIcon className="h-8 w-8 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Hot Leads</p>
                    <p className="text-3xl font-bold text-gray-900">{analytics.hotLeads || 0}</p>
                    <p className="text-sm text-red-600 flex items-center mt-1">
                      <FireIcon className="h-4 w-4 mr-1" />
                      {analytics.hotLeads > 0 ? 'High priority' : 'No hot leads'}
                    </p>
                  </div>
                  <div className="p-3 bg-red-100 rounded-2xl">
                    <FireIcon className="h-8 w-8 text-red-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                    <p className="text-3xl font-bold text-gray-900">{analytics.conversionRate || 0}%</p>
                    <p className="text-sm text-purple-600 flex items-center mt-1">
                      <TrophyIcon className="h-4 w-4 mr-1" />
                      {analytics.conversionRate > 10 ? 'Good' : analytics.conversionRate > 0 ? 'Improving' : 'No conversions yet'}
                    </p>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-2xl">
                    <TrophyIcon className="h-8 w-8 text-purple-600" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Additional Analytics */}
          {!analyticsLoading && analytics.totalLeads > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Top Sources */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Lead Sources</h3>
                <div className="space-y-3">
                  {analytics.topSources && analytics.topSources.length > 0 ? (
                    (analytics.topSources || []).map((source, index) => (
                      <div key={source.source} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-sm font-semibold">
                            {index + 1}
                          </div>
                          <span className="text-sm font-medium text-gray-900">{source.source}</span>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-semibold text-gray-900">{source.count} leads</div>
                          <div className="text-xs text-gray-500">{source.percentage}%</div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <div className="text-sm text-gray-500">No source data available</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Stage Distribution */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Pipeline Overview</h3>
                <div className="space-y-3">
                  {Object.entries(analytics.stageDistribution || {}).map(([stage, count]) => (
                    <div key={stage} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${
                          stage === 'new' ? 'bg-blue-500' :
                          stage === 'contacted' ? 'bg-yellow-500' :
                          stage === 'qualified' ? 'bg-green-500' :
                          stage === 'proposal' ? 'bg-purple-500' :
                          stage === 'negotiation' ? 'bg-orange-500' :
                          stage === 'closed_won' ? 'bg-green-600' :
                          'bg-red-500'
                        }`}></div>
                        <span className="text-sm font-medium text-gray-900 capitalize">
                          {stage.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="text-sm font-semibold text-gray-900">{count}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : !analyticsLoading && analytics.totalLeads === 0 ? (
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-3xl flex items-center justify-center mx-auto mb-4">
                <ChartBarIcon className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Analytics Data Yet</h3>
              <p className="text-gray-500 mb-6">
                Start adding leads to see detailed analytics and insights about your sales pipeline.
              </p>
              {hasPermission('sales_agent') && (
                <Link 
                  to="/leads/new" 
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-2xl hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                >
                  <PlusIcon className="h-5 w-5 mr-2" />
                  Add Your First Lead
                </Link>
              )}
            </div>
          ) : null}
        </div>
      )}

      {/* Enhanced Controls */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          {/* View Mode Toggle */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-gray-100 rounded-2xl p-1">
              <button
                onClick={() => setViewMode('list')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  viewMode === 'list'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <ListBulletIcon className="h-4 w-4" />
                List
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  viewMode === 'grid'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Squares2X2Icon className="h-4 w-4" />
                Grid
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  viewMode === 'table'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <TableCellsIcon className="h-4 w-4" />
                Table
              </button>
              <button
                onClick={() => setView('pipeline')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  view === 'pipeline'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <ChartBarIcon className="h-4 w-4" />
                Pipeline
              </button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex items-center gap-3 flex-1 max-w-2xl">
            <div className="relative flex-1">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search leads, names, emails, phone numbers..."
                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
              />
            </div>
            
            {/* Saved Filters Dropdown */}
            {savedFilters.length > 0 && (
              <div className="relative">
                <select
                  value={activeFilter?.id || ''}
                  onChange={(e) => {
                    if (e.target.value) {
                      const filter = savedFilters.find(f => f.id === parseInt(e.target.value));
                      if (filter) applySavedFilter(filter);
                    } else {
                      setActiveFilter(null);
                    }
                  }}
                  className="px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white min-w-[150px]"
                >
                  <option value="">Saved Filters</option>
                  {(savedFilters || []).map(filter => (
                    <option key={filter.id} value={filter.id}>
                      {filter.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
            
            {/* Quick Lead Filters */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setStatusFilter(statusFilter === 'new' ? '' : 'new')}
                className={`px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  statusFilter === 'new'
                    ? 'bg-blue-100 text-blue-700 border border-blue-200'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                New
              </button>
              <button
                onClick={() => setStatusFilter(statusFilter === 'contacted' ? '' : 'contacted')}
                className={`px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  statusFilter === 'contacted'
                    ? 'bg-yellow-100 text-yellow-700 border border-yellow-200'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Contacted
              </button>
              <button
                onClick={() => setStatusFilter(statusFilter === 'closed_won' ? '' : 'closed_won')}
                className={`px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  statusFilter === 'closed_won'
                    ? 'bg-green-100 text-green-700 border border-green-200'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Won
              </button>
            </div>
            
            <button
              onClick={() => setShowBulkActions(!showBulkActions)}
              className="p-3 bg-gray-100 hover:bg-gray-200 rounded-2xl transition-all duration-200"
            >
              <AdjustmentsHorizontalIcon className="h-5 w-5 text-gray-600" />
            </button>
            {compareLeads.length > 0 && (
              <button
                onClick={() => setShowComparisonModal(true)}
                className="p-3 bg-purple-100 hover:bg-purple-200 text-purple-600 rounded-2xl transition-all duration-200 relative"
                title="Compare Leads"
              >
                <ChartBarIcon className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {compareLeads.length}
                </span>
              </button>
            )}
            <button
              onClick={autoAssignLeads}
              className="p-3 bg-green-100 hover:bg-green-200 text-green-600 rounded-2xl transition-all duration-200"
              title="Auto Assign Leads"
            >
              <UserGroupIcon className="h-5 w-5" />
            </button>
            <button
              onClick={handleExportLeads}
              className="p-3 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-2xl transition-all duration-200"
            >
              <DocumentArrowDownIcon className="h-5 w-5" />
            </button>
            {(searchTerm || statusFilter || Object.values(filters).some(f => f)) && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('');
                  clearFilters();
                }}
                className="p-3 bg-red-100 hover:bg-red-200 text-red-600 rounded-2xl transition-all duration-200"
                title="Clear all filters"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>

        {/* Bulk Actions Bar */}
        {selectedLeads.length > 0 && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-blue-900">
                  {selectedLeads.length} leads selected
                </span>
                <button
                  onClick={() => setSelectedLeads([])}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <XMarkIcon className="h-4 w-4" />
                </button>
              </div>
              <div className="flex items-center gap-2">
                <select
                  onChange={(e) => e.target.value && handleBulkStageChange(e.target.value)}
                  className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm"
                >
                  <option value="">Change Stage</option>
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="qualified">Qualified</option>
                  <option value="proposal">Proposal</option>
                  <option value="negotiation">Negotiation</option>
                  <option value="closed_won">Closed Won</option>
                  <option value="closed_lost">Closed Lost</option>
                </select>
                <select
                  onChange={(e) => e.target.value && handleBulkAssign(e.target.value)}
                  className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm"
                >
                  <option value="">Assign To</option>
                  {(employees || []).map(emp => (
                    <option key={emp.id} value={emp.id}>
                      {emp.name || `${emp.first_name} ${emp.last_name}`}
                    </option>
                  ))}
                </select>
                <button
                  onClick={handleBulkDelete}
                  className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-all duration-200 text-sm font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Advanced Filter Box */}
      {view !== 'pipeline' && (
        <FilterBox
          filters={filters}
          onFiltersChange={setFilters}
          searchPlaceholder="Search leads, names, emails, phone numbers..."
          customFilters={customFilters}
        />
      )}

      {/* Content */}
      {view === 'pipeline' ? (
        /* Enhanced Pipeline View with Drag & Drop */
        <div className="space-y-6">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
              {(stages || []).map((stage) => (
                <div 
                  key={stage} 
                  className={`bg-white rounded-2xl shadow-lg border-2 border-dashed transition-all duration-200 overflow-hidden ${
                    activeId ? 'border-blue-300 bg-blue-50/30' : 'border-gray-100'
                  }`}
                >
                  <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-gray-900 capitalize">
                        {stage.replace('_', ' ')}
                      </h3>
                      <span className="bg-white text-gray-600 text-xs font-medium px-2 py-1 rounded-full">
                        {pipeline[stage]?.length || 0}
                      </span>
                    </div>
                  </div>
                  <div className="p-4 space-y-3 max-h-96 overflow-y-auto min-h-[200px]">
                    <SortableContext
                      items={(pipeline[stage] || []).map(lead => lead.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      {(pipeline[stage] || []).map((lead) => (
                        <SortableLeadCard key={lead.id} lead={lead} />
                      ))}
                    </SortableContext>
                    {(!pipeline[stage] || pipeline[stage].length === 0) && (
                      <div className="text-center py-8">
                        <div className="p-3 bg-gray-100 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                          <UserGroupIcon className="h-6 w-6 text-gray-400" />
                        </div>
                        <p className="text-sm text-gray-500">No leads in this stage</p>
                        <p className="text-xs text-gray-400 mt-1">Drag leads here to move them</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <DragOverlay>
              {activeId && draggedLead ? (
                <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-4 border border-gray-100 shadow-lg opacity-90">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {draggedLead.first_name} {draggedLead.last_name}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {draggedLead.phone}
                      </p>
                      {draggedLead.notes && (
                        <p className="text-xs text-gray-500 truncate flex items-center mt-1">
                          <MapPinIcon className="h-3 w-3 mr-1" />
                          {draggedLead.notes}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      {getScoreBadge(draggedLead.status)}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 flex items-center">
                      <ClockIcon className="h-3 w-3 mr-1" />
                      {formatDate(draggedLead.created_at)}
                    </span>
                    <span className="text-xs text-blue-600 font-medium">
                      Moving to new stage...
                    </span>
                  </div>
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        </div>
      ) : viewMode === 'grid' ? (
        /* Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {(filteredAndSortedLeads || []).map((lead) => (
            <div key={lead.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-200 group">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold text-lg">
                      {(lead.name || '')[0]}{(lead.name || '')[1] || ''}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {lead.name}
                      </h3>
                      <p className="text-sm text-gray-500">{getScoreBadge(lead.status)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => toggleFavorite(lead.id)}
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      {favorites.has(lead.id) ? (
                        <HeartSolidIcon className="h-5 w-5 text-red-500" />
                      ) : (
                        <HeartIcon className="h-5 w-5" />
                      )}
                    </button>
                    <input
                      type="checkbox"
                      checked={selectedLeads.includes(lead.id)}
                      onChange={() => handleSelectLead(lead.id)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  {lead.phone && (
                    <div className="flex items-center text-sm text-gray-600">
                      <PhoneIcon className="h-4 w-4 mr-2 text-gray-400" />
                      <a 
                        href={`tel:${lead.phone}`}
                        className="text-blue-600 hover:text-blue-800 hover:underline"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {lead.phone}
                      </a>
                    </div>
                  )}
                  {lead.email && (
                    <div className="flex items-center text-sm text-gray-600">
                      <EnvelopeIcon className="h-4 w-4 mr-2 text-gray-400" />
                      <a 
                        href={`mailto:${lead.email}`}
                        className="truncate text-blue-600 hover:text-blue-800 hover:underline"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {lead.email}
                      </a>
                    </div>
                  )}
                  {lead.notes && (
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPinIcon className="h-4 w-4 mr-2 text-gray-400" />
                      <span className="truncate">{lead.notes}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between mb-4">
                  {getStageBadge(lead.status)}
                  <span className="text-xs text-gray-500">
                    {formatDate(lead.created_at)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    {lead.assigned_employee ? (
                      <span className="flex items-center">
                        <UserCircleIcon className="h-4 w-4 mr-1" />
                        {lead.assigned_employee.first_name} {lead.assigned_employee.last_name}
                      </span>
                    ) : (
                      <span className="text-gray-400">Unassigned</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Link
                      to={`/leads/${lead.id}`}
                      className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                    >
                      <EyeIcon className="h-4 w-4" />
                    </Link>
                    {hasPermission('sales_agent') && (
                      <Link
                        to={`/leads/${lead.id}/edit`}
                        className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : viewMode === 'table' ? (
        /* Table View */
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left">
                    <input
                      type="checkbox"
                      checked={selectedLeads.length === leads.length && leads.length > 0}
                      onChange={handleSelectAll}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Source</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Stage</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Score</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Assigned To</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Created</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {(filteredAndSortedLeads || []).map((lead) => (
                  <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedLeads.includes(lead.id)}
                        onChange={() => handleSelectLead(lead.id)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-semibold text-sm">
                          {(lead.name || '')[0]}{(lead.name || '')[1] || ''}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">
                            {lead.name}
                          </div>
                          {lead.notes && (
                            <div className="text-sm text-gray-500 flex items-center">
                              <MapPinIcon className="h-3 w-3 mr-1" />
                              {lead.notes}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        {lead.phone && (
                          <div className="flex items-center text-sm text-gray-600">
                            <PhoneIcon className="h-4 w-4 mr-2" />
                            <a 
                              href={`tel:${lead.phone}`}
                              className="text-blue-600 hover:text-blue-800 hover:underline"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {lead.phone}
                            </a>
                          </div>
                        )}
                        {lead.email && (
                          <div className="flex items-center text-sm text-gray-600">
                            <EnvelopeIcon className="h-4 w-4 mr-2" />
                            <a 
                              href={`mailto:${lead.email}`}
                              className="truncate max-w-32 text-blue-600 hover:text-blue-800 hover:underline"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {lead.email}
                            </a>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-900 capitalize">
                        {lead.source.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4">{getStageBadge(lead.status)}</td>
                    <td className="px-6 py-4">{getScoreBadge(lead.status)}</td>
                    <td className="px-6 py-4">
                      {lead.assigned_employee ? (
                        <span className="text-sm text-gray-900">
                          {lead.assigned_employee.name || `${lead.assigned_employee.first_name} ${lead.assigned_employee.last_name}`}
                        </span>
                      ) : (
                        <span className="text-sm text-gray-500">Unassigned</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-900">
                        {formatDate(lead.created_at)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => toggleFavorite(lead.id)}
                          className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                        >
                          {favorites.has(lead.id) ? (
                            <HeartSolidIcon className="h-4 w-4 text-red-500" />
                          ) : (
                            <HeartIcon className="h-4 w-4" />
                          )}
                        </button>
                        <Link
                          to={`/leads/${lead.id}`}
                          className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                        >
                          <EyeIcon className="h-4 w-4" />
                        </Link>
                        {hasPermission('sales_agent') && (
                          <>
                            <Link
                              to={`/leads/${lead.id}/edit`}
                              className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                            >
                              <PencilIcon className="h-4 w-4" />
                            </Link>
                            {hasPermission('admin') && (
                              <button
                                onClick={() => handleDelete(lead.id)}
                                className="p-1 text-gray-400 hover:text-red-600 transition-colors"
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
      ) : (
        /* List View */
        <div className="space-y-4">
          {(filteredAndSortedLeads || []).map((lead) => (
            <div key={lead.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <input
                    type="checkbox"
                    checked={selectedLeads.includes(lead.id)}
                    onChange={() => handleSelectLead(lead.id)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold text-lg">
                    {(lead.name || '')[0]}{(lead.name || '')[1] || ''}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {lead.name}
                      </h3>
                      {getStageBadge(lead.status)}
                      {getScoreBadge(lead.status)}
                    </div>
                    <div className="flex items-center gap-6 text-sm text-gray-600">
                      {lead.phone && (
                        <div className="flex items-center">
                          <PhoneIcon className="h-4 w-4 mr-2" />
                          <a 
                            href={`tel:${lead.phone}`}
                            className="text-blue-600 hover:text-blue-800 hover:underline"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {lead.phone}
                          </a>
                        </div>
                      )}
                      {lead.email && (
                        <div className="flex items-center">
                          <EnvelopeIcon className="h-4 w-4 mr-2" />
                          <a 
                            href={`mailto:${lead.email}`}
                            className="text-blue-600 hover:text-blue-800 hover:underline"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {lead.email}
                          </a>
                        </div>
                      )}
                      {lead.notes && (
                        <div className="flex items-center">
                          <MapPinIcon className="h-4 w-4 mr-2" />
                          {lead.notes}
                        </div>
                      )}
                      <div className="flex items-center">
                        <ClockIcon className="h-4 w-4 mr-2" />
                        {formatDate(lead.created_at)}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-sm text-gray-600">
                      {lead.assigned_employee ? (
                        <span className="flex items-center">
                          <UserCircleIcon className="h-4 w-4 mr-1" />
                          {lead.assigned_employee.name || `${lead.assigned_employee.first_name} ${lead.assigned_employee.last_name}`}
                        </span>
                      ) : (
                        <span className="text-gray-400">Unassigned</span>
                      )}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Source: {lead.source.replace('_', ' ')}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleFavorite(lead.id)}
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      {favorites.has(lead.id) ? (
                        <HeartSolidIcon className="h-5 w-5 text-red-500" />
                      ) : (
                        <HeartIcon className="h-5 w-5" />
                      )}
                    </button>
                    <Link
                      to={`/leads/${lead.id}`}
                      className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                    >
                      <EyeIcon className="h-5 w-5" />
                    </Link>
                    {hasPermission('sales_agent') && (
                      <>
                        <Link
                          to={`/leads/${lead.id}/edit`}
                          className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </Link>
                        {hasPermission('admin') && (
                          <button
                            onClick={() => handleDelete(lead.id)}
                            className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                          >
                            <TrashIcon className="h-5 w-5" />
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

      {/* Empty State */}
      {filteredAndSortedLeads.length === 0 && !loading && (
        <div className="text-center py-16">
          <div className="mx-auto w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-3xl flex items-center justify-center mb-6">
            <UserPlusIcon className="h-12 w-12 text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No leads found</h3>
          <p className="text-gray-500 mb-8 max-w-md mx-auto">
            {searchTerm || Object.values(filters).some(f => f) 
              ? "No leads match your current filters. Try adjusting your search criteria."
              : "Get started by adding your first lead to begin building your sales pipeline."
            }
          </p>
          {hasPermission('sales_agent') && (
            <div className="flex items-center justify-center gap-4">
              <Link 
                to="/leads/new" 
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-2xl hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Add Lead
              </Link>
              {(searchTerm || Object.values(filters).some(f => f)) && (
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowSaveFilterModal(true)}
                    className="inline-flex items-center px-6 py-3 bg-blue-100 text-blue-700 font-semibold rounded-2xl hover:bg-blue-200 transition-all duration-200"
                  >
                    <BookmarkIcon className="h-5 w-5 mr-2" />
                    Save Filter
                  </button>
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      clearFilters();
                    }}
                    className="inline-flex items-center px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-2xl hover:bg-gray-200 transition-all duration-200"
                  >
                    <XMarkIcon className="h-5 w-5 mr-2" />
                    Clear Filters
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Enhanced Pagination */}
      {pagination.pages > 1 && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Showing {((pagination.page - 1) * pagination.per_page) + 1} to {Math.min(pagination.page * pagination.per_page, pagination.total)} of {pagination.total} leads
            </div>
            <nav className="flex items-center space-x-2">
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                disabled={pagination.page === 1}
                className="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                Previous
              </button>
              
              {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                const page = i + 1;
                return (
                  <button
                    key={page}
                    onClick={() => setPagination(prev => ({ ...prev, page }))}
                    className={`px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200 ${
                      page === pagination.page
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                        : 'text-gray-500 bg-white border border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
              
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                disabled={pagination.page === pagination.pages}
                className="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                Next
              </button>
            </nav>
          </div>
        </div>
      )}

      {/* Floating Add Button */}
      {hasPermission('sales_agent') && (
        <FloatingAddButton
          type="lead"
          onAdd={() => setShowLeadForm(true)}
          quickActions={quickActions}
          label="Add Lead"
        />
      )}

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Import Leads from CSV</h2>
                <button
                  onClick={() => setShowImportModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
              <p className="text-gray-600 mt-2">
                Map your CSV columns to lead fields. {importData.length} rows found.
              </p>
            </div>

            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Field Mapping</h3>
                  <div className="space-y-4">
                    {[
                      { key: 'first_name', label: 'First Name', required: true },
                      { key: 'last_name', label: 'Last Name', required: false },
                      { key: 'email', label: 'Email', required: false },
                      { key: 'phone', label: 'Phone', required: false },
                      { key: 'source', label: 'Source', required: false },
                      { key: 'status', label: 'Status', required: false },
                      { key: 'budget', label: 'Budget', required: false },
                      { key: 'notes', label: 'Notes', required: false },
                    ].map(field => (
                      <div key={field.key} className="flex items-center gap-3">
                        <label className="text-sm font-medium text-gray-700 w-32">
                          {field.label}
                          {field.required && <span className="text-red-500 ml-1">*</span>}
                        </label>
                        <select
                          value={importMapping[field.key] || ''}
                          onChange={(e) => setImportMapping(prev => ({
                            ...prev,
                            [field.key]: e.target.value
                          }))}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">Select column...</option>
                          {(importData || []).length > 0 && Object.keys((importData || [])[0] || {}).map(header => (
                            <option key={header} value={header}>{header}</option>
                          ))}
                        </select>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Preview</h3>
                  <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
                    {((importData || []).slice(0, 5) || []).map((row, index) => (
                      <div key={index} className="mb-3 p-3 bg-white rounded-lg border">
                        <div className="text-sm font-medium text-gray-900 mb-2">
                          Row {index + 1}
                        </div>
                        <div className="space-y-1 text-xs text-gray-600">
                          {importMapping.name && (
                            <div><strong>Name:</strong> {(row || {})[importMapping.name]}</div>
                          )}
                          {importMapping.email && (
                            <div><strong>Email:</strong> {(row || {})[importMapping.email]}</div>
                          )}
                          {importMapping.phone && (
                            <div><strong>Phone:</strong> {(row || {})[importMapping.phone]}</div>
                          )}
                          {importMapping.source && (
                            <div><strong>Source:</strong> {(row || {})[importMapping.source]}</div>
                          )}
                        </div>
                      </div>
                    ))}
                    {(importData || []).length > 5 && (
                      <div className="text-sm text-gray-500 text-center">
                        ... and {(importData || []).length - 5} more rows
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  {importData.filter(row => 
                    row[importMapping.first_name] && 
                    (row[importMapping.email] || row[importMapping.phone])
                  ).length} valid leads will be imported
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowImportModal(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleImportLeads}
                    disabled={importLoading || !importMapping.first_name}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                  >
                    {importLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Importing...
                      </>
                    ) : (
                      <>
                        <DocumentArrowUpIcon className="h-4 w-4" />
                        Import Leads
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Save Filter Modal */}
      {showSaveFilterModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Save Filter Preset</h2>
                <button
                  onClick={() => setShowSaveFilterModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Filter Name
                  </label>
                  <input
                    type="text"
                    value={filterName}
                    onChange={(e) => setFilterName(e.target.value)}
                    placeholder="e.g., Hot Leads, This Month, High Value"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    autoFocus
                  />
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Current Filter Settings:</h3>
                  <div className="space-y-1 text-xs text-gray-600">
                    {searchTerm && <div><strong>Search:</strong> {searchTerm}</div>}
                    {statusFilter && <div><strong>Status:</strong> {statusFilter}</div>}
                    {Object.entries(filters || {}).map(([key, value]) => 
                      value && <div key={key}><strong>{key.replace('_', ' ')}:</strong> {value}</div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center justify-end gap-3">
                <button
                  onClick={() => setShowSaveFilterModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={saveCurrentFilter}
                  disabled={!filterName.trim()}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                >
                  <BookmarkIcon className="h-4 w-4" />
                  Save Filter
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Lead Comparison Modal */}
      {showComparisonModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Lead Comparison</h2>
                <button
                  onClick={() => setShowComparisonModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
              <p className="text-gray-600 mt-2">
                Compare {compareLeads.length} leads side by side
              </p>
            </div>

            <div className="p-6 overflow-y-auto max-h-[70vh]">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(compareLeads || []).map((lead, index) => (
                  <div key={lead.id} className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-6 border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {lead.name}
                      </h3>
                      <button
                        onClick={() => removeFromComparison(lead.id)}
                        className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <XMarkIcon className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Contact Info</label>
                        <div className="mt-1 space-y-1">
                          <div className="flex items-center text-sm text-gray-700">
                            <EnvelopeIcon className="h-4 w-4 mr-2 text-gray-400" />
                            {lead.email ? (
                              <a 
                                href={`mailto:${lead.email}`}
                                className="text-blue-600 hover:text-blue-800 hover:underline"
                                onClick={(e) => e.stopPropagation()}
                              >
                                {lead.email}
                              </a>
                            ) : (
                              'No email'
                            )}
                          </div>
                          <div className="flex items-center text-sm text-gray-700">
                            <PhoneIcon className="h-4 w-4 mr-2 text-gray-400" />
                            {lead.phone ? (
                              <a 
                                href={`tel:${lead.phone}`}
                                className="text-blue-600 hover:text-blue-800 hover:underline"
                                onClick={(e) => e.stopPropagation()}
                              >
                                {lead.phone}
                              </a>
                            ) : (
                              'No phone'
                            )}
                          </div>
                          {lead.notes && (
                            <div className="flex items-center text-sm text-gray-700">
                              <MapPinIcon className="h-4 w-4 mr-2 text-gray-400" />
                              {lead.notes}
                            </div>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Lead Details</label>
                        <div className="mt-1 space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Source:</span>
                            <span className="font-medium">{lead.source}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Stage:</span>
                            <span className="font-medium capitalize">{lead.status.replace('_', ' ')}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Score:</span>
                            <span className="font-medium">{getScoreBadge(lead.status)}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Created:</span>
                            <span className="font-medium">{formatDate(lead.created_at)}</span>
                          </div>
                        </div>
                      </div>

                      {lead.budget && (
                        <div>
                          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Budget</label>
                          <div className="mt-1 text-sm text-gray-700">
                            ₹{lead.budget.toLocaleString()}
                          </div>
                        </div>
                      )}

                      {lead.assigned_employee && (
                        <div>
                          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Assigned To</label>
                          <div className="mt-1 text-sm text-gray-700">
                            {lead.assigned_employee.name || `${lead.assigned_employee.first_name} ${lead.assigned_employee.last_name}`}
                          </div>
                        </div>
                      )}

                      <div className="pt-4 border-t border-gray-200">
                        <Link
                          to={`/leads/${lead.id}`}
                          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-center block text-sm font-medium"
                        >
                          View Full Details
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  {compareLeads.length} leads selected for comparison
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={clearComparison}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    Clear All
                  </button>
                  <button
                    onClick={() => setShowComparisonModal(false)}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI Insights Modal */}
      {showAIModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                    <CpuChipIcon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">AI Lead Insights</h2>
                    <p className="text-gray-600">Intelligent analysis of your lead data</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowAIModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
            </div>

            <div className="p-6 overflow-y-auto max-h-[70vh]">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-blue-600">Total Leads</h3>
                    <UserGroupIcon className="h-5 w-5 text-blue-500" />
                  </div>
                  <p className="text-2xl font-bold text-blue-900">{aiInsights.totalLeads}</p>
                </div>
                
                <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-red-600">Hot Leads</h3>
                    <FireIcon className="h-5 w-5 text-red-500" />
                  </div>
                  <p className="text-2xl font-bold text-red-900">{aiInsights.hotLeads}</p>
                </div>
                
                <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-yellow-600">Warm Leads</h3>
                    <LightBulbIcon className="h-5 w-5 text-yellow-500" />
                  </div>
                  <p className="text-2xl font-bold text-yellow-900">{aiInsights.warmLeads}</p>
                </div>
                
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-gray-600">Cold Leads</h3>
                    <FaceFrownIcon className="h-5 w-5 text-gray-500" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{aiInsights.coldLeads}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Lead Quality Score</h3>
                  <div className="flex items-center gap-4">
                    <div className="relative w-24 h-24">
                      <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 36 36">
                        <path
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="#e5e7eb"
                          strokeWidth="2"
                        />
                        <path
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="#3b82f6"
                          strokeWidth="2"
                          strokeDasharray={`${aiInsights.avgScore}, 100`}
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-lg font-bold text-gray-900">{aiInsights.avgScore}</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Average Lead Score</p>
                      <p className="text-xs text-gray-500">Out of 100 points</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Conversion Probability</h3>
                  <div className="flex items-center gap-4">
                    <div className="relative w-24 h-24">
                      <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 36 36">
                        <path
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="#e5e7eb"
                          strokeWidth="2"
                        />
                        <path
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="#10b981"
                          strokeWidth="2"
                          strokeDasharray={`${aiInsights.conversionProbability}, 100`}
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-lg font-bold text-gray-900">{aiInsights.conversionProbability}%</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Expected Conversion Rate</p>
                      <p className="text-xs text-gray-500">Based on lead quality</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Recommendations</h3>
                <div className="space-y-4">
                  {(aiInsights.recommendations || []).map((rec, index) => (
                    <div key={index} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                      <div className={`p-2 rounded-lg ${
                        rec.impact === 'high' ? 'bg-red-100 text-red-600' :
                        rec.impact === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                        'bg-blue-100 text-blue-600'
                      }`}>
                        {rec.type === 'priority' ? <ExclamationTriangleIcon className="h-5 w-5" /> :
                         rec.type === 'optimization' ? <LightBulbIcon className="h-5 w-5" /> :
                         <RocketLaunchIcon className="h-5 w-5" />}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{rec.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">{rec.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  AI analysis completed • Last updated: {new Date().toLocaleTimeString()}
                </div>
                <button
                  onClick={() => setShowAIModal(false)}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Activity Timeline Modal */}
      {showActivityModal && selectedLeadActivity && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Activity Timeline</h2>
                  <p className="text-gray-600">
                    {selectedLeadActivity.first_name} {selectedLeadActivity.last_name}
                  </p>
                </div>
                <button
                  onClick={() => setShowActivityModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
            </div>

            <div className="p-6 overflow-y-auto max-h-[70vh]">
              <div className="space-y-6">
                {(leadActivities[selectedLeadActivity.id] || []).map((activity, index) => (
                  <div key={activity.id} className="flex items-start gap-4">
                    <div className={`p-2 rounded-full ${
                      activity.color === 'blue' ? 'bg-blue-100 text-blue-600' :
                      activity.color === 'green' ? 'bg-green-100 text-green-600' :
                      activity.color === 'purple' ? 'bg-purple-100 text-purple-600' :
                      activity.color === 'indigo' ? 'bg-indigo-100 text-indigo-600' :
                      activity.color === 'yellow' ? 'bg-yellow-100 text-yellow-600' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {activity.icon === 'UserPlusIcon' ? <UserPlusIcon className="h-4 w-4" /> :
                       activity.icon === 'ArrowRightIcon' ? <ArrowRightIcon className="h-4 w-4" /> :
                       activity.icon === 'PhoneIcon' ? <PhoneIcon className="h-4 w-4" /> :
                       activity.icon === 'EnvelopeIcon' ? <EnvelopeIcon className="h-4 w-4" /> :
                       activity.icon === 'DocumentTextIcon' ? <DocumentTextIcon className="h-4 w-4" /> :
                       <ClockIcon className="h-4 w-4" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium text-gray-900">{activity.title}</h3>
                        <time className="text-xs text-gray-500">
                          {new Date(activity.timestamp).toLocaleDateString()} at {new Date(activity.timestamp).toLocaleTimeString()}
                        </time>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                    </div>
                    {index < leadActivities[selectedLeadActivity.id].length - 1 && (
                      <div className="absolute left-8 top-12 w-0.5 h-6 bg-gray-200"></div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  {leadActivities[selectedLeadActivity.id]?.length || 0} activities recorded
                </div>
                <button
                  onClick={() => setShowActivityModal(false)}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Lead Templates Modal */}
      {showTemplatesModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-lg">
                    <DocumentTextIcon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Lead Templates</h2>
                    <p className="text-gray-600">Quick start with pre-configured lead templates</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowTemplatesModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
            </div>

            <div className="p-6 overflow-y-auto max-h-[70vh]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(leadTemplates || []).map((template) => (
                  <div key={template.id} className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-6 border border-gray-100 hover:shadow-md transition-all duration-200">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">{template.name}</h3>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                        template.template.lead_score === 'hot' ? 'bg-red-100 text-red-600' :
                        template.template.lead_score === 'warm' ? 'bg-yellow-100 text-yellow-600' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {template.template.lead_score}
                      </div>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Source:</span>
                        <span className="font-medium capitalize">{template.template.source.replace('_', ' ')}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Stage:</span>
                        <span className="font-medium capitalize">{template.template.stage.replace('_', ' ')}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Notes:</span>
                        <span className="font-medium text-gray-700">{template.template.notes}</span>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => createLeadFromTemplate(template)}
                      className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                      Use Template
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  {leadTemplates.length} templates available
                </div>
                <button
                  onClick={() => setShowTemplatesModal(false)}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Lead Intelligence Modals */}
      {showLeadIntelligence && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Lead Intelligence Dashboard</h2>
                <button
                  onClick={closeAllLeadModals}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl p-6 text-white">
                  <div className="flex items-center justify-between mb-4">
                    <SparklesIcon className="h-8 w-8" />
                    <span className="text-2xl font-bold">92</span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">AI Lead Score</h3>
                  <p className="text-purple-100">High conversion probability</p>
                </div>
                <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl p-6 text-white">
                  <div className="flex items-center justify-between mb-4">
                    <ChartBarIcon className="h-8 w-8" />
                    <span className="text-2xl font-bold">85%</span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Engagement Score</h3>
                  <p className="text-blue-100">Very active lead</p>
                </div>
                <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-6 text-white">
                  <div className="flex items-center justify-between mb-4">
                    <ArrowTrendingUpIcon className="h-8 w-8" />
                    <span className="text-2xl font-bold">78%</span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Conversion Probability</h3>
                  <p className="text-green-100">Likely to convert</p>
                </div>
              </div>
              <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Behavioral Insights</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Website Visits</span>
                      <span className="font-semibold">1,250</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Page Views</span>
                      <span className="font-semibold">3,400</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Time on Site</span>
                      <span className="font-semibold">8.5 min</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Bounce Rate</span>
                      <span className="font-semibold">35.2%</span>
                    </div>
                  </div>
                </div>
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Next Best Actions</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm">Schedule property viewing</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <span className="text-sm">Send property comparison</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm">Follow up on budget</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Behavioral Analytics Modal */}
      {showBehavioralAnalytics && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Behavioral Analytics</h2>
                <button
                  onClick={closeAllLeadModals}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Traffic Sources</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Organic Search</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-500 h-2 rounded-full" style={{width: '45%'}}></div>
                        </div>
                        <span className="text-sm font-semibold">45%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Direct Traffic</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{width: '30%'}}></div>
                        </div>
                        <span className="text-sm font-semibold">30%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Social Media</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div className="bg-purple-500 h-2 rounded-full" style={{width: '25%'}}></div>
                        </div>
                        <span className="text-sm font-semibold">25%</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Device Usage</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Mobile</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-500 h-2 rounded-full" style={{width: '65%'}}></div>
                        </div>
                        <span className="text-sm font-semibold">65%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Desktop</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{width: '30%'}}></div>
                        </div>
                        <span className="text-sm font-semibold">30%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Tablet</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div className="bg-purple-500 h-2 rounded-full" style={{width: '5%'}}></div>
                        </div>
                        <span className="text-sm font-semibold">5%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-6 bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Interest Categories</h3>
                <div className="flex flex-wrap gap-2">
                  {(['Luxury Apartments', 'Investment Properties', 'Commercial Real Estate', 'Villa Projects', 'Residential Plots'] || []).map((interest, index) => (
                    <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Lead Segmentation Modal */}
      {showLeadSegmentation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Lead Segmentation</h2>
                <button
                  onClick={closeAllLeadModals}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {getLeadSegmentationData().segments.map((segment, index) => (
                  <div key={index} className="bg-white border border-gray-200 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">{segment.name}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold bg-${segment.color}-100 text-${segment.color}-800`}>
                        {segment.count}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{segment.criteria}</p>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Demographics</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">Age Groups</h4>
                      <div className="space-y-2">
                        {Object.entries(getLeadSegmentationData().demographics.ageGroups).map(([age, percentage]) => (
                          <div key={age} className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">{age}</span>
                            <div className="flex items-center space-x-2">
                              <div className="w-20 bg-gray-200 rounded-full h-2">
                                <div className="bg-blue-500 h-2 rounded-full" style={{width: `${percentage}%`}}></div>
                              </div>
                              <span className="text-sm font-semibold">{percentage}%</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Preferences</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">Property Types</h4>
                      <div className="space-y-2">
                        {Object.entries(getLeadSegmentationData().demographics.preferences).map(([type, percentage]) => (
                          <div key={type} className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">{type}</span>
                            <div className="flex items-center space-x-2">
                              <div className="w-20 bg-gray-200 rounded-full h-2">
                                <div className="bg-green-500 h-2 rounded-full" style={{width: `${percentage}%`}}></div>
                              </div>
                              <span className="text-sm font-semibold">{percentage}%</span>
                            </div>
                          </div>
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

      {/* Lead Journey Modal */}
      {showLeadJourney && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Lead Journey Mapping</h2>
                <button
                  onClick={closeAllLeadModals}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Journey Stages</h3>
                <div className="flex space-x-4 overflow-x-auto pb-4">
                  {getLeadJourneyData().stages.map((stage, index) => (
                    <div key={index} className="flex-shrink-0 bg-white border border-gray-200 rounded-xl p-4 min-w-[200px]">
                      <div className="text-center">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                          <span className="text-blue-600 font-bold">{stage.leads}</span>
                        </div>
                        <h4 className="font-semibold text-gray-900 mb-1">{stage.name}</h4>
                        <p className="text-sm text-gray-600 mb-2">{stage.conversion}% conversion</p>
                        <p className="text-xs text-gray-500">Avg: {stage.avgTime}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Touchpoints</h3>
                  <div className="space-y-3">
                    {getLeadJourneyData().touchpoints.map((touchpoint, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span className="text-gray-700">{touchpoint.name}</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-semibold">{touchpoint.count}</span>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            touchpoint.impact === 'Very High' ? 'bg-red-100 text-red-800' :
                            touchpoint.impact === 'High' ? 'bg-orange-100 text-orange-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {touchpoint.impact}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Bottlenecks</h3>
                  <div className="space-y-4">
                    {getLeadJourneyData().bottlenecks.map((bottleneck, index) => (
                      <div key={index} className="border-l-4 border-red-500 pl-4">
                        <h4 className="font-medium text-gray-900">{bottleneck.stage}</h4>
                        <p className="text-sm text-gray-600 mb-1">{bottleneck.dropoff}% dropoff</p>
                        <p className="text-xs text-gray-500">{bottleneck.reason}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Predictive Analytics Modal */}
      {showLeadPredictions && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Predictive Analytics</h2>
                <button
                  onClick={closeAllLeadModals}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Conversion Probability</h3>
                  <div className="space-y-4">
                    {getLeadPredictions().conversionProbability.map((lead, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium text-gray-900">{lead.lead}</h4>
                          <span className="text-lg font-bold text-green-600">{lead.probability}%</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">Expected in: {lead.timeframe}</p>
                        <div className="flex flex-wrap gap-1">
                          {lead.factors.map((factor, factorIndex) => (
                            <span key={factorIndex} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                              {factor}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Churn Risk Analysis</h3>
                  <div className="space-y-4">
                    {getLeadPredictions().churnRisk.map((lead, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium text-gray-900">{lead.lead}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            lead.risk === 'High' ? 'bg-red-100 text-red-800' :
                            lead.risk === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {lead.risk} Risk
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{lead.reason}</p>
                        <p className="text-xs text-blue-600 font-medium">Action: {lead.action}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-6 bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Next Best Actions</h3>
                <div className="space-y-3">
                  {getLeadPredictions().nextBestActions.map((action, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">{action.lead}</h4>
                        <p className="text-sm text-gray-600">{action.action}</p>
                      </div>
                      <div className="text-right">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          action.priority === 'High' ? 'bg-red-100 text-red-800' :
                          action.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {action.priority}
                        </span>
                        <p className="text-xs text-gray-500 mt-1">{action.expectedOutcome}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leads;
