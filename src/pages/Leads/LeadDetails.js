import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { leadsAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import {
  ArrowLeftIcon,
  PencilIcon,
  TrashIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  UserIcon,
  CalendarIcon,
  PlusIcon,
  ChatBubbleLeftRightIcon,
  BuildingOfficeIcon,
  HomeIcon,
  InformationCircleIcon,
  EyeIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  StarIcon,
  HeartIcon,
  DocumentTextIcon,
  LinkIcon,
  GlobeAltIcon,
  BellIcon,
  ChatBubbleBottomCenterTextIcon,
  CalendarDaysIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const LeadDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { hasPermission } = useAuth();
  const [lead, setLead] = useState(null);
  const [communications, setCommunications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddCommunication, setShowAddCommunication] = useState(false);
  const [showDetailedInfo, setShowDetailedInfo] = useState(false);
  const [showFollowUpModal, setShowFollowUpModal] = useState(false);
  const [showQuickNote, setShowQuickNote] = useState(false);
  const [newCommunication, setNewCommunication] = useState({
    type: 'call',
    subject: '',
    content: '',
    direction: 'outbound',
  });
  const [followUpDate, setFollowUpDate] = useState('');
  const [quickNote, setQuickNote] = useState('');
  const [showEmailTemplate, setShowEmailTemplate] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [emailContent, setEmailContent] = useState('');
  const [showScoreModal, setShowScoreModal] = useState(false);
  const [newScore, setNewScore] = useState('');
  const [showMeetingModal, setShowMeetingModal] = useState(false);
  const [meetingData, setMeetingData] = useState({
    type: 'site_visit',
    date: '',
    time: '',
    location: '',
    notes: ''
  });
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    fetchLeadDetails();
  }, [id]);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const fetchLeadDetails = async () => {
    try {
      const response = await leadsAPI.getLead(id);
      setLead(response.data.lead);
      setCommunications(response.data.communications || []);
    } catch (error) {
      toast.error('Failed to fetch lead details');
      navigate('/leads');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this lead?')) {
      return;
    }

    try {
      await leadsAPI.deleteLead(id);
      toast.success('Lead deleted successfully');
      navigate('/leads');
    } catch (error) {
      toast.error('Failed to delete lead');
    }
  };

  const handleAddCommunication = async (e) => {
    e.preventDefault();
    
    try {
      await leadsAPI.addCommunication(id, newCommunication);
      toast.success('Communication added successfully');
      setNewCommunication({
        type: 'call',
        subject: '',
        content: '',
        direction: 'outbound',
      });
      setShowAddCommunication(false);
      fetchLeadDetails();
    } catch (error) {
      toast.error('Failed to add communication');
    }
  };

  const handleSetFollowUp = async (e) => {
    e.preventDefault();
    
    try {
      // Convert datetime-local format to ISO format for backend
      const isoDate = followUpDate ? new Date(followUpDate).toISOString() : null;
      
      const response = await leadsAPI.updateLead(id, { next_follow_up: isoDate });
      toast.success('Follow-up date set successfully');
      setShowFollowUpModal(false);
      setFollowUpDate('');
      fetchLeadDetails();
    } catch (error) {
      toast.error('Failed to set follow-up date: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleAddQuickNote = async (e) => {
    e.preventDefault();
    
    try {
      const noteCommunication = {
        type: 'note',
        subject: 'Quick Note',
        content: quickNote,
        direction: 'outbound',
      };
      await leadsAPI.addCommunication(id, noteCommunication);
      toast.success('Note added successfully');
      setShowQuickNote(false);
      setQuickNote('');
      fetchLeadDetails();
    } catch (error) {
      toast.error('Failed to add note');
    }
  };

  const handleSendEmail = async (e) => {
    e.preventDefault();
    
    try {
      const emailCommunication = {
        type: 'email',
        subject: selectedTemplate,
        content: emailContent,
        direction: 'outbound',
      };
      await leadsAPI.addCommunication(id, emailCommunication);
      toast.success('Email sent successfully');
      setShowEmailTemplate(false);
      setSelectedTemplate('');
      setEmailContent('');
      fetchLeadDetails();
    } catch (error) {
      toast.error('Failed to send email');
    }
  };

  const handleUpdateScore = async (e) => {
    e.preventDefault();
    
    try {
      await leadsAPI.updateLead(id, { lead_score: newScore });
      toast.success('Lead score updated successfully');
      setShowScoreModal(false);
      setNewScore('');
      fetchLeadDetails();
    } catch (error) {
      toast.error('Failed to update lead score');
    }
  };

  const handleScheduleMeeting = async (e) => {
    e.preventDefault();
    
    try {
      const meetingCommunication = {
        type: 'meeting',
        subject: `${meetingData.type === 'site_visit' ? 'Site Visit' : 'Meeting'} Scheduled`,
        content: `Meeting Type: ${meetingData.type === 'site_visit' ? 'Site Visit' : 'Meeting'}
Date: ${meetingData.date}
Time: ${meetingData.time}
Location: ${meetingData.location}
Notes: ${meetingData.notes}`,
        direction: 'outbound',
      };
      await leadsAPI.addCommunication(id, meetingCommunication);
      toast.success('Meeting scheduled successfully');
      setShowMeetingModal(false);
      setMeetingData({
        type: 'site_visit',
        date: '',
        time: '',
        location: '',
        notes: ''
      });
      fetchLeadDetails();
    } catch (error) {
      toast.error('Failed to schedule meeting');
    }
  };

  // Email templates
  const emailTemplates = {
    'Initial Contact': `Dear ${lead?.first_name || 'Customer'},

Thank you for your interest in our properties. I'm excited to help you find your perfect home.

Based on your inquiry, I have some excellent options that match your requirements. I would love to schedule a call to discuss your needs in detail.

Please let me know a convenient time for you.

Best regards,
[Your Name]`,
    
    'Property Details': `Dear ${lead?.first_name || 'Customer'},

As requested, here are the detailed information about the property you inquired about:

[Property Details]

I've also attached some additional properties that might interest you. Please let me know if you'd like to schedule a site visit.

Best regards,
[Your Name]`,
    
    'Follow-up': `Dear ${lead?.first_name || 'Customer'},

I wanted to follow up on our previous conversation about your property requirements. 

Have you had a chance to review the information I sent? I'm here to answer any questions you might have.

I also have some new properties that just came on the market that might be perfect for you.

Please let me know if you'd like to discuss further.

Best regards,
[Your Name]`,
    
    'Site Visit Reminder': `Dear ${lead?.first_name || 'Customer'},

This is a friendly reminder about your scheduled site visit tomorrow at [Time].

The property address is: [Address]

Please bring a valid ID and let me know if you have any questions or need to reschedule.

Looking forward to showing you the property!

Best regards,
[Your Name]`,
    
    'Thank You': `Dear ${lead?.first_name || 'Customer'},

Thank you for taking the time to visit our property today. It was a pleasure meeting you.

I hope you found the property interesting. Please don't hesitate to reach out if you have any questions or would like to see additional properties.

I'll send you some more options that match your requirements shortly.

Best regards,
[Your Name]`
  };

  const getStageBadge = (stage) => {
    const stageClasses = {
      new: 'bg-blue-100 text-blue-800',
      contacted: 'bg-yellow-100 text-yellow-800',
      qualified: 'bg-purple-100 text-purple-800',
      proposal: 'bg-indigo-100 text-indigo-800',
      negotiation: 'bg-orange-100 text-orange-800',
      closed_won: 'bg-green-100 text-green-800',
      closed_lost: 'bg-red-100 text-red-800',
    };
    
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${stageClasses[stage] || 'bg-gray-100 text-gray-800'}`}>
        {(stage || 'unknown').replace('_', ' ')}
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
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${scoreClasses[score] || 'bg-gray-100 text-gray-800'}`}>
        {score}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Check if follow-up is overdue
  const isFollowUpOverdue = (followUpDate) => {
    if (!followUpDate) return false;
    return new Date(followUpDate) < new Date();
  };

  // Get follow-up status
  const getFollowUpStatus = (followUpDate) => {
    if (!followUpDate) return { status: 'none', color: 'gray', text: 'No follow-up set' };
    
    const followUp = new Date(followUpDate);
    const now = new Date();
    const diffDays = Math.ceil((followUp - now) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return { status: 'overdue', color: 'red', text: `${Math.abs(diffDays)} days overdue` };
    } else if (diffDays === 0) {
      return { status: 'today', color: 'orange', text: 'Due today' };
    } else if (diffDays <= 2) {
      return { status: 'soon', color: 'yellow', text: `Due in ${diffDays} days` };
    } else {
      return { status: 'scheduled', color: 'green', text: `Due in ${diffDays} days` };
    }
  };

  // Format activity timeline
  const formatActivityTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffMins < 60) {
      return `${diffMins} minutes ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hours ago`;
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  // Parse customer details from notes
  const parseCustomerDetails = (notes) => {
    if (!notes) return {};
    
    const details = {};
    const parts = notes.split(' | ');
    
    parts.forEach(part => {
      if (part.includes('Customer City:')) {
        details.city = part.replace('Customer City:', '').trim();
      } else if (part.includes('Alternate Phone:')) {
        details.alternatePhone = part.replace('Alternate Phone:', '').trim();
      } else if (part.includes('Message:')) {
        details.message = part.replace('Message:', '').trim();
      } else if (part.includes('Property:')) {
        details.propertyTitle = part.replace('Property:', '').trim();
      } else if (part.includes('Property Price:')) {
        details.propertyPrice = part.replace('Property Price:', '').trim();
      } else if (part.includes('Property Location:')) {
        details.propertyLocation = part.replace('Property Location:', '').trim();
      } else if (part.includes('via ')) {
        details.contactMethod = part.split('via ')[1].split('.')[0];
      }
    });
    
    return details;
  };

  // Get source badge with icon
  const getSourceBadge = (source) => {
    const sourceConfig = {
      'Website Embed': { 
        color: 'bg-blue-100 text-blue-800', 
        icon: GlobeAltIcon,
        label: 'Website'
      },
      'Manual': { 
        color: 'bg-gray-100 text-gray-800', 
        icon: UserIcon,
        label: 'Manual'
      },
      'Referral': { 
        color: 'bg-green-100 text-green-800', 
        icon: HeartIcon,
        label: 'Referral'
      },
    };
    
    const config = sourceConfig[source] || sourceConfig['Manual'];
    const IconComponent = config.icon;
    
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
        <IconComponent className="h-3 w-3 mr-1" />
        {config.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="text-center py-12">
        <UserIcon className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">Lead not found</h3>
        <p className="mt-1 text-sm text-gray-500">
          The lead you're looking for doesn't exist.
        </p>
        <div className="mt-6">
          <Link to="/leads" className="btn-primary">
            Back to Leads
          </Link>
        </div>
      </div>
    );
  }

  const customerDetails = parseCustomerDetails(lead.notes);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Enhanced Header */}
      <div className="bg-gray-800 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/leads')}
              className="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-lg transition-colors"
            >
              <ArrowLeftIcon className="h-6 w-6" />
            </button>
            <div>
              <h1 className="text-3xl font-bold">
                {lead.name}
              </h1>
              <div className="flex items-center space-x-4 mt-2">
                <div className="flex items-center space-x-2">
                  <PhoneIcon className="h-4 w-4" />
                  <span className="text-white/90">{lead.phone}</span>
                </div>
                {lead.email && (
                  <div className="flex items-center space-x-2">
                    <EnvelopeIcon className="h-4 w-4" />
                    <span className="text-white/90">{lead.email}</span>
                  </div>
                )}
                <div className="flex items-center space-x-2">
                  <CalendarIcon className="h-4 w-4" />
                  <span className="text-white/90">Created {formatDate(lead.created_at)}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            {getStageBadge(lead.status)}
            {getScoreBadge(lead.source === 'website' ? 'hot' : 'warm')}
            {hasPermission('sales_agent') && (
              <>
                <Link
                  to={`/leads/${lead.id}/edit`}
                  className="bg-white/20 hover:bg-white/30 text-white border border-white/30 px-4 py-2 rounded-lg flex items-center transition-colors"
                >
                  <PencilIcon className="h-4 w-4 mr-2" />
                  Edit
                </Link>
                {hasPermission('admin') && (
                  <button
                    onClick={handleDelete}
                    className="bg-red-500/20 hover:bg-red-500/30 text-white border border-red-400/30 px-4 py-2 rounded-lg flex items-center transition-colors"
                  >
                    <TrashIcon className="h-4 w-4 mr-2" />
                    Delete
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6 pb-20 lg:pb-8">
          {/* Customer Information Card */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200/50 overflow-hidden">
            <div className="bg-gray-50 p-6 border-b border-gray-200/50">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                  <UserIcon className="h-6 w-6 mr-3 text-blue-600" />
                  Customer Information
                </h3>
                <button
                  onClick={() => setShowDetailedInfo(!showDetailedInfo)}
                  className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors"
                >
                  <EyeIcon className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    {showDetailedInfo ? 'Hide Details' : 'Show All Details'}
                  </span>
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* First Row */}
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <UserIcon className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Full Name</label>
                    <p className="text-base font-semibold text-gray-900">{lead.first_name} {lead.last_name}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <PhoneIcon className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Primary Phone</label>
                    <p className="text-base font-semibold text-gray-900">{lead.phone}</p>
                  </div>
                </div>
                
                {/* Second Row */}
                {lead.email && (
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <EnvelopeIcon className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Email</label>
                      <p className="text-base font-semibold text-gray-900">{lead.email}</p>
                    </div>
                  </div>
                )}
                
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <MapPinIcon className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">City</label>
                    <p className="text-base font-semibold text-gray-900">
                      {customerDetails.city || 'Not specified'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Customer Information */}
          {showDetailedInfo && (customerDetails.city || customerDetails.alternatePhone || customerDetails.message) && (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200/50 overflow-hidden">
              <div className="bg-gray-50 p-6 border-b border-gray-200/50">
                <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                  <InformationCircleIcon className="h-6 w-6 mr-3 text-green-600" />
                  Additional Customer Details
                </h3>
                <p className="text-sm text-gray-600 mt-1">Information captured from website form</p>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {customerDetails.city && (
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <MapPinIcon className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Customer City</label>
                        <p className="text-base font-semibold text-gray-900">{customerDetails.city}</p>
                      </div>
                    </div>
                  )}
                  
                  {customerDetails.alternatePhone && (
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <PhoneIcon className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Alternate Phone</label>
                        <p className="text-base font-semibold text-gray-900">{customerDetails.alternatePhone}</p>
                      </div>
                    </div>
                  )}
                  
                </div>
                
                {customerDetails.message && (
                  <div className="mt-6">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="p-2 bg-yellow-100 rounded-lg">
                        <DocumentTextIcon className="h-5 w-5 text-yellow-600" />
                      </div>
                      <label className="text-sm font-medium text-gray-500">Customer Requirements & Message</label>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-gray-900 leading-relaxed">{customerDetails.message}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Property Interest */}
          {(customerDetails.propertyTitle || customerDetails.propertyPrice || customerDetails.propertyLocation) && (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200/50 overflow-hidden">
              <div className="bg-gray-50 p-6 border-b border-gray-200/50">
                <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                  <BuildingOfficeIcon className="h-6 w-6 mr-3 text-orange-600" />
                  Property Interest
                </h3>
                <p className="text-sm text-gray-600 mt-1">Property details from customer inquiry</p>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {customerDetails.propertyTitle && (
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-orange-100 rounded-lg">
                        <HomeIcon className="h-5 w-5 text-orange-600" />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Property Title</label>
                        <p className="text-base font-semibold text-gray-900">{customerDetails.propertyTitle}</p>
                      </div>
                    </div>
                  )}
                  
                  {customerDetails.propertyPrice && (
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <CurrencyDollarIcon className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Property Price</label>
                        <p className="text-base font-semibold text-gray-900">{customerDetails.propertyPrice}</p>
                      </div>
                    </div>
                  )}
                  
                  {customerDetails.propertyLocation && (
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <MapPinIcon className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Property Location</label>
                        <p className="text-base font-semibold text-gray-900">{customerDetails.propertyLocation}</p>
                      </div>
                    </div>
                  )}
                </div>
                
                {lead.property_id && (
                  <div className="mt-6">
                    <Link
                      to={`/properties/${lead.property_id}`}
                      className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium"
                    >
                      <EyeIcon className="h-4 w-4" />
                      <span>View Full Property Details</span>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Activity Timeline */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200/50 overflow-hidden">
            <div className="bg-gray-50 p-6 border-b border-gray-200/50">
              <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                <ClockIcon className="h-6 w-6 mr-3 text-blue-600" />
                Activity Timeline
              </h3>
              <p className="text-sm text-gray-600 mt-1">All interactions and activities with this lead</p>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                {communications.length > 0 ? (
                  communications.map((comm, index) => (
                    <div key={comm.id} className="flex items-start space-x-4">
                      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                        comm.type === 'call' ? 'bg-green-100' :
                        comm.type === 'email' ? 'bg-blue-100' :
                        comm.type === 'note' ? 'bg-yellow-100' :
                        comm.type === 'follow_up' ? 'bg-orange-100' :
                        'bg-gray-100'
                      }`}>
                        {comm.type === 'call' ? (
                          <PhoneIcon className="h-4 w-4 text-green-600" />
                        ) : comm.type === 'email' ? (
                          <EnvelopeIcon className="h-4 w-4 text-blue-600" />
                        ) : comm.type === 'note' ? (
                          <DocumentTextIcon className="h-4 w-4 text-yellow-600" />
                        ) : comm.type === 'follow_up' ? (
                          <CalendarDaysIcon className="h-4 w-4 text-orange-600" />
                        ) : (
                          <ChatBubbleLeftRightIcon className="h-4 w-4 text-gray-600" />
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium text-gray-900 capitalize">
                              {comm.type === 'follow_up' ? 'Follow-up' : (comm.type || 'unknown').replace('_', ' ')}
                            </span>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              comm.direction === 'inbound' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                            }`}>
                              {comm.direction}
                            </span>
                          </div>
                          <span className="text-xs text-gray-500">
                            {formatActivityTime(comm.created_at)}
                          </span>
                        </div>
                        
                        {comm.subject && (
                          <p className="text-sm font-medium text-gray-900 mt-1">{comm.subject}</p>
                        )}
                        
                        <p className="text-sm text-gray-700 mt-1">{comm.content}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <ClockIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-500">No activities yet</p>
                    <p className="text-xs text-gray-400">Start by adding a communication or note</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Communications */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Communications</h3>
                {hasPermission('sales_agent') && (
                  <button
                    onClick={() => setShowAddCommunication(!showAddCommunication)}
                    className="btn-primary flex items-center"
                  >
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Add Communication
                  </button>
                )}
              </div>

              {/* Add Communication Form */}
              {showAddCommunication && (
                <form onSubmit={handleAddCommunication} className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="form-label">Type</label>
                      <select
                        value={newCommunication.type}
                        onChange={(e) => setNewCommunication(prev => ({ ...prev, type: e.target.value }))}
                        className="form-input"
                      >
                        <option value="call">Call</option>
                        <option value="email">Email</option>
                        <option value="sms">SMS</option>
                        <option value="meeting">Meeting</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="form-label">Direction</label>
                      <select
                        value={newCommunication.direction}
                        onChange={(e) => setNewCommunication(prev => ({ ...prev, direction: e.target.value }))}
                        className="form-input"
                      >
                        <option value="outbound">Outbound</option>
                        <option value="inbound">Inbound</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <label className="form-label">Subject</label>
                    <input
                      type="text"
                      value={newCommunication.subject}
                      onChange={(e) => setNewCommunication(prev => ({ ...prev, subject: e.target.value }))}
                      className="form-input"
                      placeholder="Enter subject"
                    />
                  </div>
                  
                  <div className="mt-4">
                    <label className="form-label">Content</label>
                    <textarea
                      value={newCommunication.content}
                      onChange={(e) => setNewCommunication(prev => ({ ...prev, content: e.target.value }))}
                      rows={3}
                      className="form-input"
                      placeholder="Enter communication details"
                      required
                    />
                  </div>
                  
                  <div className="mt-4 flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setShowAddCommunication(false)}
                      className="btn-secondary"
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn-primary">
                      Add Communication
                    </button>
                  </div>
                </form>
              )}

              {/* Communications List */}
              <div className="space-y-4">
                {communications.length > 0 ? (
                  communications.map((comm) => (
                    <div key={comm.id} className={`border-l-4 pl-4 py-2 ${
                      comm.type === 'follow_up' ? 'border-orange-500' : 'border-blue-500'
                    }`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-gray-900 capitalize">
                            {comm.type === 'follow_up' ? 'Follow-up' : comm.type.replace('_', ' ')}
                          </span>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            comm.direction === 'inbound' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                          }`}>
                            {comm.direction}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500">
                          {formatDate(comm.created_at)}
                        </span>
                      </div>
                      {comm.subject && (
                        <p className="text-sm font-medium text-gray-900 mt-1">{comm.subject}</p>
                      )}
                      <p className="text-sm text-gray-700 mt-1">{comm.content}</p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <ChatBubbleLeftRightIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-500">No communications yet</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Sidebar */}
        <div className="space-y-6">

          {/* Lead Summary */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200/50 overflow-hidden">
            <div className="bg-gray-50 p-6 border-b border-gray-200/50">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <InformationCircleIcon className="h-5 w-5 mr-2 text-purple-600" />
                Lead Summary
              </h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Source</span>
                  {getSourceBadge(lead.source)}
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Stage</span>
                  {getStageBadge(lead.status)}
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Score</span>
                  {getScoreBadge(lead.source === 'website' ? 'hot' : 'warm')}
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Created</span>
                  <span className="text-sm font-medium text-gray-900">{formatDate(lead.created_at)}</span>
                </div>
                
                {customerDetails.contactMethod && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Contact Method</span>
                    <span className="text-sm font-medium text-gray-900 capitalize">{customerDetails.contactMethod}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Lead Score Management */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200/50 overflow-hidden">
            <div className="bg-gray-50 p-6 border-b border-gray-200/50">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <StarIcon className="h-5 w-5 mr-2 text-yellow-600" />
                Lead Score
              </h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Current Score</span>
                  <span className={`text-sm font-medium px-3 py-1 rounded-full ${
                    lead.source === 'website' ? 'bg-red-100 text-red-800' :
                    lead.source === 'referral' ? 'bg-orange-100 text-orange-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {(lead.source === 'website' ? 'HOT' : lead.source === 'referral' ? 'WARM' : 'COLD')}
                  </span>
                </div>
                
                <div className="text-sm text-gray-600">
                  {lead.source === 'website' && '🔥 High priority - Immediate attention required'}
                  {lead.source === 'referral' && '🌡️ Medium priority - Good potential'}
                  {lead.source !== 'website' && lead.source !== 'referral' && '❄️ Low priority - Needs nurturing'}
                </div>
                
                <button
                  onClick={() => setShowScoreModal(true)}
                  className="w-full flex items-center justify-center px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg shadow-sm text-sm font-medium transition-colors"
                >
                  <StarIcon className="h-4 w-4 mr-2" />
                  Update Score
                </button>
              </div>
            </div>
          </div>

          {/* Follow-up Management */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200/50 overflow-hidden">
            <div className="bg-gray-50 p-6 border-b border-gray-200/50">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <BellIcon className="h-5 w-5 mr-2 text-orange-600" />
                Follow-up Management
              </h3>
            </div>
            <div className="p-6">
              {lead.next_follow_up ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Next Follow-up</span>
                    <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                      getFollowUpStatus(lead.next_follow_up).color === 'red' ? 'bg-red-100 text-red-800' :
                      getFollowUpStatus(lead.next_follow_up).color === 'orange' ? 'bg-orange-100 text-orange-800' :
                      getFollowUpStatus(lead.next_follow_up).color === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {getFollowUpStatus(lead.next_follow_up).text}
                    </span>
                  </div>
                  <div className="text-sm text-gray-900">
                    {formatDate(lead.next_follow_up)}
                  </div>
                  <button
                    onClick={() => setShowFollowUpModal(true)}
                    className="w-full flex items-center justify-center px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg shadow-sm text-sm font-medium transition-colors"
                  >
                    <CalendarDaysIcon className="h-4 w-4 mr-2" />
                    Update Follow-up
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <ExclamationCircleIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500 mb-4">No follow-up scheduled</p>
                  <button
                    onClick={() => setShowFollowUpModal(true)}
                    className="w-full flex items-center justify-center px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg shadow-sm text-sm font-medium transition-colors"
                  >
                    <CalendarDaysIcon className="h-4 w-4 mr-2" />
                    Set Follow-up
                  </button>
                </div>
              )}
            </div>
          </div>


          {/* Property Link */}
          {lead.property_id && (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200/50 overflow-hidden">
              <div className="bg-gray-50 p-6 border-b border-gray-200/50">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <BuildingOfficeIcon className="h-5 w-5 mr-2 text-orange-600" />
                  Related Property
                </h3>
              </div>
              <div className="p-6">
                <Link
                  to={`/properties/${lead.property_id}`}
                  className="w-full flex items-center justify-center px-4 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg shadow-sm text-sm font-medium transition-colors"
                >
                  <EyeIcon className="h-4 w-4 mr-2" />
                  View Property Details
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-50 p-3 bg-gray-600 text-white rounded-full shadow-lg hover:bg-gray-700 transition-colors"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      )}

      {/* Floating Action Button */}
      <div className="fixed right-6 top-1/2 transform -translate-y-1/2 z-40 hidden lg:block">
        <div className="flex flex-col space-y-3">
          {/* Quick Actions */}
          <div className="flex flex-col space-y-2">
            <button
              onClick={() => setShowQuickNote(true)}
              className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center group relative"
              title="Add Quick Note"
            >
              <DocumentTextIcon className="h-5 w-5" />
              <span className="absolute right-14 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                Add Quick Note
              </span>
            </button>
            
            <button
              onClick={() => setShowMeetingModal(true)}
              className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center group relative"
              title="Schedule Meeting"
            >
              <CalendarIcon className="h-5 w-5" />
              <span className="absolute right-14 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                Schedule Meeting
              </span>
            </button>
            
            <button 
              onClick={() => window.open(`tel:${lead.phone}`, '_self')}
              className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center group relative"
              title="Call Lead"
            >
              <PhoneIcon className="h-5 w-5" />
              <span className="absolute right-14 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                Call Lead
              </span>
            </button>
            
            {lead.email && (
              <button 
                onClick={() => setShowEmailTemplate(true)}
                className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center group relative"
                title="Send Email"
              >
                <EnvelopeIcon className="h-5 w-5" />
                <span className="absolute right-14 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                  Send Email
                </span>
              </button>
            )}
            
            {customerDetails.alternatePhone && (
              <button 
                onClick={() => window.open(`tel:${customerDetails.alternatePhone}`, '_self')}
                className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center group relative"
                title="Call Alternate"
              >
                <PhoneIcon className="h-5 w-5" />
                <span className="absolute right-14 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                  Call Alternate
                </span>
              </button>
            )}
            
            {hasPermission('sales_agent') && (
              <Link
                to={`/leads/${lead.id}/edit`}
                className="w-12 h-12 bg-gradient-to-br from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center group relative"
                title="Edit Lead"
              >
                <PencilIcon className="h-5 w-5" />
                <span className="absolute right-14 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                  Edit Lead
                </span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Quick Actions Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-t border-gray-200 shadow-lg">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between space-x-2">
            <button
              onClick={() => setShowQuickNote(true)}
              className="flex-1 flex items-center justify-center px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium"
            >
              <DocumentTextIcon className="h-4 w-4 mr-1" />
              Add Note
            </button>
            <button
              onClick={() => setShowMeetingModal(true)}
              className="flex-1 flex items-center justify-center px-3 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium"
            >
              <CalendarIcon className="h-4 w-4 mr-1" />
              Schedule
            </button>
            <button 
              onClick={() => window.open(`tel:${lead.phone}`, '_self')}
              className="flex-1 flex items-center justify-center px-3 py-2 bg-green-600 text-white rounded-lg text-sm font-medium"
            >
              <PhoneIcon className="h-4 w-4 mr-1" />
              Call
            </button>
            {lead.email && (
              <button 
                onClick={() => setShowEmailTemplate(true)}
                className="flex-1 flex items-center justify-center px-3 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium"
              >
                <EnvelopeIcon className="h-4 w-4 mr-1" />
                Email
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Follow-up Modal */}
      {showFollowUpModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-gray-900">Set Follow-up Date</h3>
                <button
                  onClick={() => setShowFollowUpModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <form onSubmit={handleSetFollowUp}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Follow-up Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    value={followUpDate}
                    onChange={(e) => setFollowUpDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    required
                  />
                </div>
                
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowFollowUpModal(false)}
                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors font-medium"
                  >
                    Set Follow-up
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Quick Note Modal */}
      {showQuickNote && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-gray-900">Add Quick Note</h3>
                <button
                  onClick={() => setShowQuickNote(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <form onSubmit={handleAddQuickNote}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Note
                  </label>
                  <textarea
                    value={quickNote}
                    onChange={(e) => setQuickNote(e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Add a quick note about this lead..."
                    required
                  />
                </div>
                
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowQuickNote(false)}
                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
                  >
                    Add Note
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Email Template Modal */}
      {showEmailTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-gray-900">Send Email</h3>
                <button
                  onClick={() => setShowEmailTemplate(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <form onSubmit={handleSendEmail}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Template
                  </label>
                  <select
                    value={selectedTemplate}
                    onChange={(e) => {
                      setSelectedTemplate(e.target.value);
                      setEmailContent(emailTemplates[e.target.value] || '');
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select a template</option>
                    {Object.keys(emailTemplates).map(template => (
                      <option key={template} value={template}>{template}</option>
                    ))}
                  </select>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Content
                  </label>
                  <textarea
                    value={emailContent}
                    onChange={(e) => setEmailContent(e.target.value)}
                    rows={12}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Select a template or write your own email..."
                    required
                  />
                </div>
                
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowEmailTemplate(false)}
                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
                  >
                    Send Email
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Lead Score Modal */}
      {showScoreModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-gray-900">Update Lead Score</h3>
                <button
                  onClick={() => setShowScoreModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <form onSubmit={handleUpdateScore}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Lead Score
                  </label>
                  <select
                    value={newScore}
                    onChange={(e) => setNewScore(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    required
                  >
                    <option value="">Select a score</option>
                    <option value="hot">🔥 Hot - High priority</option>
                    <option value="warm">🌡️ Warm - Medium priority</option>
                    <option value="cold">❄️ Cold - Low priority</option>
                  </select>
                </div>
                
                <div className="mb-4 p-3 bg-gray-50 rounded-md">
                  <p className="text-sm text-gray-600">
                    <strong>Hot:</strong> Ready to buy, immediate attention required<br/>
                    <strong>Warm:</strong> Interested, good potential<br/>
                    <strong>Cold:</strong> Early stage, needs nurturing
                  </p>
                </div>
                
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowScoreModal(false)}
                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors font-medium"
                  >
                    Update Score
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Meeting Scheduler Modal */}
      {showMeetingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-gray-900">Schedule Meeting</h3>
                <button
                  onClick={() => setShowMeetingModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <form onSubmit={handleScheduleMeeting}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meeting Type
                  </label>
                  <select
                    value={meetingData.type}
                    onChange={(e) => setMeetingData({...meetingData, type: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  >
                    <option value="site_visit">🏠 Site Visit</option>
                    <option value="office_meeting">🏢 Office Meeting</option>
                    <option value="video_call">📹 Video Call</option>
                    <option value="phone_call">📞 Phone Call</option>
                  </select>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    value={meetingData.date}
                    onChange={(e) => setMeetingData({...meetingData, date: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Time
                  </label>
                  <input
                    type="time"
                    value={meetingData.time}
                    onChange={(e) => setMeetingData({...meetingData, time: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    value={meetingData.location}
                    onChange={(e) => setMeetingData({...meetingData, location: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Property address or meeting location"
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes
                  </label>
                  <textarea
                    value={meetingData.notes}
                    onChange={(e) => setMeetingData({...meetingData, notes: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Additional notes or agenda items..."
                  />
                </div>
                
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowMeetingModal(false)}
                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors font-medium"
                  >
                    Schedule Meeting
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadDetails;