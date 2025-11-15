import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { propertiesAPI, leadsAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import {
  ArrowLeftIcon,
  PencilIcon,
  TrashIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  HomeIcon,
  BuildingOfficeIcon,
  EyeIcon,
  EyeSlashIcon,
  ShareIcon,
  HeartIcon,
  StarIcon,
  PhoneIcon,
  EnvelopeIcon,
  CalendarIcon,
  ClockIcon,
  UserIcon,
  DocumentTextIcon,
  DocumentCheckIcon,
  PhotoIcon,
  WifiIcon,
  CarIcon,
  ShieldCheckIcon,
  SparklesIcon,
  FireIcon,
  TrophyIcon,
  CheckCircleIcon,
  XCircleIcon,
  InformationCircleIcon,
  PlusIcon,
  MinusIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  MagnifyingGlassIcon,
  PrinterIcon,
  ArrowDownTrayIcon,
  Bars3Icon,
  XMarkIcon,
  UserGroupIcon,
  PhoneIcon as PhoneIconOutline,
  EnvelopeIcon as EnvelopeIconOutline,
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { hasPermission } = useAuth();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [leads, setLeads] = useState([]);
  const [leadsLoading, setLeadsLoading] = useState(false);
  const [showLeads, setShowLeads] = useState(false);

  useEffect(() => {
    fetchProperty();
    checkFavoriteStatus();
    fetchLeads();
  }, [id]);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fetchProperty = async () => {
    try {
      const response = await propertiesAPI.getProperty(id);
      setProperty(response.data.property);
    } catch (error) {
      console.error('Error fetching property:', error);
      toast.error('Failed to fetch property details');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      try {
        await propertiesAPI.deleteProperty(id);
        toast.success('Property deleted successfully');
        navigate('/properties');
      } catch (error) {
        console.error('Error deleting property:', error);
        toast.error('Failed to delete property');
      }
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: property.title,
          text: property.description,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const fetchLeads = async () => {
    try {
      setLeadsLoading(true);
      const response = await leadsAPI.getLeadsForProperty(id, { per_page: 5 });
      setLeads(response.data.leads);
    } catch (error) {
      console.error('Error fetching leads:', error);
      // Don't show error toast as this is not critical
    } finally {
      setLeadsLoading(false);
    }
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleCreateLead = () => {
    // Navigate to create lead form with property pre-filled
    const leadData = {
      property_id: property.id,
      property_title: property.title,
      property_location: property.location,
      property_price: property.price,
      source: 'Property Details Page'
    };
    
    // Store in sessionStorage for the lead form to pick up
    sessionStorage.setItem('prefilledLeadData', JSON.stringify(leadData));
    
    // Navigate to leads page
    navigate('/leads/new');
    toast.success('Redirecting to create lead for this property');
  };

  const handleViewLeads = () => {
    // Navigate to leads page filtered by this property
    navigate(`/leads?property_id=${property.id}`);
    toast.success('Viewing leads for this property');
  };

  const handleCreatePostSale = () => {
    // Navigate to create post-sale form with property pre-filled
    const postSaleData = {
      property_id: property.id,
      property_title: property.title,
      property_price: property.price
    };
    
    // Store in sessionStorage for the post-sale form to pick up
    sessionStorage.setItem('prefilledPostSaleData', JSON.stringify(postSaleData));
    
    // Navigate to post-sales page
    navigate('/post-sales/new');
    toast.success('Redirecting to create post-sale record');
  };

  const handleViewPostSales = () => {
    // Navigate to post-sales page filtered by this property
    navigate(`/post-sales?property_id=${property.id}`);
    toast.success('Viewing post-sales for this property');
  };

  const handleDownloadBrochure = () => {
    // Generate a simple brochure content
    const brochureContent = `
PROPERTY BROCHURE
================

${property.title}
${property.location}

PROPERTY DETAILS:
- Type: ${property.property_type}
- Area: ${property.area} sq ft
- Bedrooms: ${property.bedrooms}
- Bathrooms: ${property.bathrooms}
- Price: ${formatPrice(property.price)}

${property.description}

AMENITIES:
${property.amenities ? property.amenities.join(', ') : 'Not specified'}

CONTACT INFORMATION:
${property.contact_person ? `Contact Person: ${property.contact_person}` : ''}
${property.contact_phone ? `Phone: ${property.contact_phone}` : ''}
${property.contact_email ? `Email: ${property.contact_email}` : ''}

Generated on: ${new Date().toLocaleDateString()}
    `;

    // Create and download text file
    const blob = new Blob([brochureContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${property.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_brochure.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    toast.success('Brochure downloaded successfully');
  };

  const handleSaveAsPDF = () => {
    // Use browser's print functionality to save as PDF
    const printWindow = window.open('', '_blank');
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${property.title} - Property Details</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .section { margin-bottom: 20px; }
            .section h3 { color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 5px; }
            .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
            .info-item { display: flex; justify-content: space-between; padding: 8px; background: #f3f4f6; border-radius: 4px; }
            .price { font-size: 24px; font-weight: bold; color: #059669; }
            @media print { body { margin: 0; } }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${property.title}</h1>
            <p>${property.location}</p>
            <div class="price">${formatPrice(property.price)}</div>
          </div>
          
          <div class="section">
            <h3>Property Details</h3>
            <div class="info-grid">
              <div class="info-item"><span>Type:</span><span>${property.property_type}</span></div>
              <div class="info-item"><span>Area:</span><span>${property.area} sq ft</span></div>
              <div class="info-item"><span>Bedrooms:</span><span>${property.bedrooms}</span></div>
              <div class="info-item"><span>Bathrooms:</span><span>${property.bathrooms}</span></div>
              <div class="info-item"><span>Status:</span><span>${property.status}</span></div>
            </div>
          </div>
          
          ${property.description ? `
          <div class="section">
            <h3>Description</h3>
            <p>${property.description}</p>
          </div>
          ` : ''}
          
          ${property.amenities && property.amenities.length > 0 ? `
          <div class="section">
            <h3>Amenities</h3>
            <p>${property.amenities.join(', ')}</p>
          </div>
          ` : ''}
          
          <div class="section">
            <h3>Contact Information</h3>
            <div class="info-grid">
              ${property.contact_person ? `<div class="info-item"><span>Contact Person:</span><span>${property.contact_person}</span></div>` : ''}
              ${property.contact_phone ? `<div class="info-item"><span>Phone:</span><span>${property.contact_phone}</span></div>` : ''}
              ${property.contact_email ? `<div class="info-item"><span>Email:</span><span>${property.contact_email}</span></div>` : ''}
            </div>
          </div>
          
          <div style="margin-top: 30px; text-align: center; color: #6b7280;">
            <p>Generated on ${new Date().toLocaleDateString()}</p>
          </div>
        </body>
      </html>
    `;
    
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();
    
    // Wait for content to load then print
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
    
    toast.success('Opening print dialog to save as PDF');
  };

  const handleShareProperty = () => {
    if (navigator.share) {
      navigator.share({
        title: property.title,
        text: `Check out this property: ${property.title} at ${property.location}`,
        url: window.location.href,
      }).catch((error) => {
        console.log('Error sharing:', error);
        fallbackShare();
      });
    } else {
      fallbackShare();
    }
  };

  const fallbackShare = () => {
    const shareText = `Check out this property: ${property.title} at ${property.location}\nPrice: ${formatPrice(property.price)}\n\nView details: ${window.location.href}`;
    navigator.clipboard.writeText(shareText).then(() => {
      toast.success('Property details copied to clipboard!');
    }).catch(() => {
      toast.error('Unable to copy to clipboard');
    });
  };

  const checkFavoriteStatus = async () => {
    try {
      const response = await fetch(`/api/favorites/check/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setIsFavorite(data.is_favorited);
      }
    } catch (error) {
      console.error('Error checking favorite status:', error);
    }
  };

  const handleAddToFavorites = async () => {
    if (favoriteLoading) return;
    
    setFavoriteLoading(true);
    try {
      const response = await fetch(`/api/favorites/toggle/${id}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setIsFavorite(data.is_favorited);
        toast.success(data.message);
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Failed to update favorites');
      }
    } catch (error) {
      console.error('Error updating favorites:', error);
      toast.error('Failed to update favorites');
    } finally {
      setFavoriteLoading(false);
    }
  };

  const getPropertyTypeIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'apartment':
      case 'flat':
        return HomeIcon;
      case 'villa':
        return BuildingOfficeIcon;
      case 'house':
        return HomeIcon;
      case 'plot':
        return MapPinIcon;
      case 'commercial':
        return BuildingOfficeIcon;
      default:
        return HomeIcon;
    }
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      'available': 'bg-green-100 text-green-800 border-green-200',
      'sold': 'bg-red-100 text-red-800 border-red-200',
      'reserved': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'under_construction': 'bg-blue-100 text-blue-800 border-blue-200',
    };
    
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${statusClasses[status] || 'bg-gray-100 text-gray-800 border-gray-200'}`}>
        {status}
      </span>
    );
  };

  const getPriorityBadge = (priority) => {
    const priorityClasses = {
      'high': 'bg-red-100 text-red-800 border-red-200',
      'medium': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'low': 'bg-green-100 text-green-800 border-green-200',
    };
    
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${priorityClasses[priority] || 'bg-gray-100 text-gray-800 border-gray-200'}`}>
        {priority} Priority
      </span>
    );
  };

  const formatPrice = (price) => {
    if (!price) return 'Price not available';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-4 border-gray-200 border-t-blue-500 mx-auto"></div>
          <p className="mt-6 text-xl text-gray-800 font-medium">Loading property details...</p>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <BuildingOfficeIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Property not found</h3>
          <p className="mt-1 text-sm text-gray-500">
            The property you're looking for doesn't exist.
          </p>
          <div className="mt-6">
            <Link to="/properties" className="btn-primary">
              Back to Properties
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden opacity-5">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full filter blur-xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full filter blur-xl animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-500 rounded-full filter blur-xl animate-pulse" style={{animationDelay: '4s'}}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Header */}
        <div className="bg-gradient-to-r from-white via-blue-50/80 to-purple-50/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 p-6 mb-6 sticky top-4 z-30">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-3 lg:space-y-0">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => navigate('/properties')}
                className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
              >
                <ArrowLeftIcon className="h-4 w-4 text-gray-600" />
              </button>
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                  {React.createElement(getPropertyTypeIcon(property.property_type), { className: "h-5 w-5 text-white" })}
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{property.title}</h1>
                  <div className="flex items-center space-x-3 mt-1">
                    <div className="flex items-center text-gray-600">
                      <MapPinIcon className="h-3 w-3 mr-1" />
                      <span className="text-xs">{property.location}</span>
                    </div>
                    <span className="text-gray-400">•</span>
                    <span className="text-xs text-gray-600 capitalize">{property.property_type}</span>
                    {property.priority && getPriorityBadge(property.priority)}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {getStatusBadge(property.status)}
              <button
                onClick={handleAddToFavorites}
                disabled={favoriteLoading}
                className={`p-2 rounded-lg transition-colors ${
                  isFavorite ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                } ${favoriteLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              >
                <HeartIcon className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
              </button>
              
              {hasPermission('sales_agent') && (
                <>
                  <Link
                    to={`/properties/${property.id}/edit`}
                    className="px-3 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg transition-all duration-200 flex items-center space-x-1 shadow-md hover:shadow-lg"
                  >
                    <PencilIcon className="h-4 w-4" />
                    <span className="text-sm">Edit</span>
                  </Link>
                  
                  <button
                    onClick={handleDelete}
                    className="px-3 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg transition-all duration-200 flex items-center space-x-1 shadow-md hover:shadow-lg"
                  >
                    <TrashIcon className="h-4 w-4" />
                    <span className="text-sm">Delete</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions Bar - Desktop Only */}
        <div className="hidden lg:block mb-6">
          <div className="bg-gradient-to-r from-white via-green-50/80 to-blue-50/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 p-3">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-gray-900">Quick Actions</h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleCreateLead}
                  className="flex items-center px-3 py-1.5 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg transition-all duration-200 text-sm shadow-md hover:shadow-lg"
                >
                  <UserIcon className="h-3 w-3 mr-1.5" />
                  Create Lead
                </button>
                <button
                  onClick={handleViewLeads}
                  className="flex items-center px-3 py-1.5 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white rounded-lg transition-all duration-200 text-sm shadow-md hover:shadow-lg"
                >
                  <MagnifyingGlassIcon className="h-3 w-3 mr-1.5" />
                  View Leads
                </button>
                <button
                  onClick={handleCreatePostSale}
                  className="flex items-center px-3 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg transition-all duration-200 text-sm shadow-md hover:shadow-lg"
                >
                  <CheckCircleIcon className="h-3 w-3 mr-1.5" />
                  Create Sale
                </button>
                <button
                  onClick={handleShareProperty}
                  className="flex items-center px-3 py-1.5 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-lg transition-all duration-200 text-sm shadow-md hover:shadow-lg"
                >
                  <ShareIcon className="h-3 w-3 mr-1.5" />
                  Share
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Icon-Only Floating Action Button with Tooltips */}
        <div className="fixed right-6 bottom-32 z-40 hidden lg:block">
          <div className="flex flex-col space-y-3">
            
            {/* Quick Actions */}
            <div className="flex flex-col space-y-2">
              <button
                onClick={handleCreateLead}
                className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center group relative"
                title="Create Lead"
              >
                <UserIcon className="h-4 w-4" />
                <span className="absolute right-12 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                  Create Lead
                </span>
              </button>
              
              <button
                onClick={handleViewLeads}
                className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center group relative"
                title="View Leads"
              >
                <MagnifyingGlassIcon className="h-4 w-4" />
                <span className="absolute right-12 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                  View Leads
                </span>
              </button>
              
              <button
                onClick={handleCreatePostSale}
                className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center group relative"
                title="Create Sale"
              >
                <CheckCircleIcon className="h-4 w-4" />
                <span className="absolute right-12 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                  Create Sale
                </span>
              </button>
              
              <button
                onClick={handleShareProperty}
                className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center group relative"
                title="Share Property"
              >
                <ShareIcon className="h-4 w-4" />
                <span className="absolute right-12 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                  Share Property
                </span>
              </button>
            </div>
            
            {/* Navigation Actions */}
            <div className="flex flex-col space-y-2">
              <button
                onClick={() => scrollToSection('gallery')}
                className="w-10 h-10 bg-gradient-to-br from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center group relative"
                title="Gallery"
              >
                <PhotoIcon className="h-4 w-4" />
                <span className="absolute right-12 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                  Gallery
                </span>
              </button>
              
              <button
                onClick={() => scrollToSection('description')}
                className="w-10 h-10 bg-gradient-to-br from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center group relative"
                title="Description"
              >
                <DocumentTextIcon className="h-4 w-4" />
                <span className="absolute right-12 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                  Description
                </span>
              </button>
              
              <button
                onClick={() => scrollToSection('pricing')}
                className="w-10 h-10 bg-gradient-to-br from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center group relative"
                title="Pricing"
              >
                <CurrencyDollarIcon className="h-4 w-4" />
                <span className="absolute right-12 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                  Pricing
                </span>
              </button>
              
              <button
                onClick={() => scrollToSection('leads')}
                className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center group relative"
                title="Property Leads"
              >
                <UserGroupIcon className="h-4 w-4" />
                <span className="absolute right-12 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                  Leads
                </span>
              </button>
              
              <button
                onClick={() => scrollToSection('location')}
                className="w-10 h-10 bg-gradient-to-br from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center group relative"
                title="Location"
              >
                <MapPinIcon className="h-4 w-4" />
                <span className="absolute right-12 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                  Location
                </span>
              </button>
              
              <button
                onClick={() => navigate('/properties')}
                className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center group relative"
                title="Back to Properties"
              >
                <ArrowLeftIcon className="h-4 w-4" />
                <span className="absolute right-12 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                  Back to Properties
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Sticky Quick Actions Bar - Mobile & Tablet */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-t border-gray-200 shadow-lg">
          <div className="px-4 py-3">
            <div className="flex items-center justify-between space-x-2">
              <button
                onClick={handleCreateLead}
                className="flex-1 flex items-center justify-center px-3 py-2 bg-green-600 text-white rounded-lg text-sm font-medium"
              >
                <UserIcon className="h-4 w-4 mr-1" />
                Create Lead
              </button>
              <button
                onClick={handleViewLeads}
                className="flex-1 flex items-center justify-center px-3 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium"
              >
                <MagnifyingGlassIcon className="h-4 w-4 mr-1" />
                View Leads
              </button>
              <button
                onClick={handleViewPostSales}
                className="flex-1 flex items-center justify-center px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium"
              >
                <TrophyIcon className="h-4 w-4 mr-1" />
                View Sales
              </button>
              <button
                onClick={handleShareProperty}
                className="flex-1 flex items-center justify-center px-3 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium"
              >
                <ShareIcon className="h-4 w-4 mr-1" />
                Share
              </button>
            </div>
          </div>
        </div>

        {/* Back to Top Button */}
        {showBackToTop && (
          <button
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 z-50 p-3 bg-gray-600 text-white rounded-full shadow-lg hover:bg-gray-700 transition-colors"
          >
            <ChevronRightIcon className="h-6 w-6 rotate-[-90deg]" />
          </button>
        )}

        {/* Main Content */}
        <div className="space-y-6 pb-20 lg:pb-8">
          {/* Gallery and Pricing Side by Side */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Property Gallery - Takes 2/3 of the space */}
            <div id="gallery" className="lg:col-span-2 bg-gradient-to-br from-white via-purple-50/80 to-pink-50/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 overflow-hidden">
              <div className="p-4 border-b border-gray-200/50">
                <h3 className="text-lg font-bold text-gray-900 flex items-center">
                  <PhotoIcon className="h-5 w-5 mr-2 text-purple-600" />
                  Property Gallery
                </h3>
                {property.images && property.images.length > 0 && (
                  <span className="text-xs text-gray-500">
                    {property.images.length} {property.images.length === 1 ? 'photo' : 'photos'}
                  </span>
                )}
              </div>
              <div className="p-4">
                {property.images && property.images.length > 0 ? (
                  <div className="space-y-3">
                    {/* Main Image */}
                    <div className="relative group">
                      <img
                        src={property.images[selectedImageIndex].startsWith('blob:') 
                          ? property.images[selectedImageIndex] 
                          : `http://localhost:5000${property.images[selectedImageIndex]}`
                        }
                        alt={`${property.title} ${selectedImageIndex + 1}`}
                        className="w-full h-48 object-cover rounded-lg cursor-pointer transition-transform duration-300 group-hover:scale-105"
                        onClick={() => setShowImageModal(true)}
                      />
                    </div>
                    
                    {/* Thumbnail Grid */}
                    {property.images.length > 1 && (
                      <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                        {property.images.map((image, index) => (
                          <button
                            key={index}
                            onClick={() => setSelectedImageIndex(index)}
                            className={`relative overflow-hidden rounded-md transition-all duration-200 ${
                              selectedImageIndex === index 
                                ? 'ring-2 ring-blue-500 ring-offset-1' 
                                : 'hover:ring-2 hover:ring-gray-300'
                            }`}
                          >
                            <img
                              src={image.startsWith('blob:') 
                                ? image 
                                : `http://localhost:5000${image}`
                              }
                              alt={`${property.title} ${index + 1}`}
                              className="w-full h-12 object-cover"
                              onError={(e) => {
                                e.target.src = '/api/placeholder/80/80';
                              }}
                            />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <PhotoIcon className="mx-auto h-8 w-8 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No images available</h3>
                    <p className="mt-1 text-xs text-gray-500">
                      Images will appear here once they are uploaded.
                    </p>
                    {hasPermission('sales_agent') && (
                      <Link
                        to={`/properties/${property.id}/edit`}
                        className="inline-flex items-center px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 text-sm mt-2"
                      >
                        <PlusIcon className="h-3 w-3 mr-1" />
                        Add Images
                      </Link>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Pricing - Takes 1/3 of the space */}
            <div id="pricing" className="bg-gradient-to-br from-white via-green-50/80 to-emerald-50/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 overflow-hidden">
              <div className="p-4 border-b border-gray-200/50">
                <h3 className="text-lg font-bold text-gray-900 flex items-center">
                  <CurrencyDollarIcon className="h-5 w-5 mr-2 text-green-600" />
                  Price
                </h3>
                {property.featured && (
                  <div className="flex items-center bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-bold mt-2">
                    <StarIcon className="h-3 w-3 mr-1 fill-current" />
                    Featured
                  </div>
                )}
              </div>
              <div className="p-4">
                <div className="text-2xl font-bold mb-2">
                  {formatPrice(property.price)}
                </div>
                {property.price_per_sqft && (
                  <div className="text-blue-600 text-sm">
                    ₹{property.price_per_sqft} per sq ft
                  </div>
                )}
                <div className="mt-4 space-y-2">
                  {property.area && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Area</span>
                      <span className="font-medium">{property.area} sq ft</span>
                    </div>
                  )}
                  {property.bedrooms && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Bedrooms</span>
                      <span className="font-medium">{property.bedrooms}</span>
                    </div>
                  )}
                  {property.bathrooms && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Bathrooms</span>
                      <span className="font-medium">{property.bathrooms}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Property Leads */}
          <div id="leads" className="bg-gradient-to-br from-white via-orange-50/80 to-amber-50/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 overflow-hidden">
            <div className="p-4 border-b border-gray-200/50">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900 flex items-center">
                  <UserGroupIcon className="h-5 w-5 mr-2 text-orange-600" />
                  Property Leads
                </h3>
                <div className="flex items-center space-x-2">
                  {leads.length > 0 && (
                    <span className="bg-orange-100 text-orange-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      {leads.length} lead{leads.length !== 1 ? 's' : ''}
                    </span>
                  )}
                  <button
                    onClick={() => setShowLeads(!showLeads)}
                    className="text-orange-600 hover:text-orange-700 transition-colors"
                  >
                    {showLeads ? (
                      <ChevronDownIcon className="h-5 w-5" />
                    ) : (
                      <ChevronRightIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>
            
            {showLeads && (
              <div className="p-4">
                {leadsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
                    <span className="ml-2 text-gray-600">Loading leads...</span>
                  </div>
                ) : leads.length > 0 ? (
                  <div className="space-y-3">
                    {leads.map((lead) => (
                      <div key={lead.id} className="bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-gray-200/50 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3">
                              <div className="p-2 bg-orange-100 rounded-lg">
                                <UserIcon className="h-4 w-4 text-orange-600" />
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-900 text-sm">
                                  {lead.first_name} {lead.last_name}
                                </h4>
                                <div className="flex items-center space-x-4 text-xs text-gray-600">
                                  <span className="flex items-center">
                                    <PhoneIconOutline className="h-3 w-3 mr-1" />
                                    {lead.phone}
                                  </span>
                                  {lead.email && (
                                    <span className="flex items-center">
                                      <EnvelopeIconOutline className="h-3 w-3 mr-1" />
                                      {lead.email}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              lead.stage === 'new' ? 'bg-blue-100 text-blue-800' :
                              lead.stage === 'contacted' ? 'bg-yellow-100 text-yellow-800' :
                              lead.stage === 'site_visit_scheduled' ? 'bg-purple-100 text-purple-800' :
                              lead.stage === 'negotiation' ? 'bg-orange-100 text-orange-800' :
                              lead.stage === 'closed_won' ? 'bg-green-100 text-green-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {lead.stage.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </span>
                            <Link
                              to={`/leads/${lead.id}`}
                              className="p-1.5 text-orange-600 hover:text-orange-700 hover:bg-orange-100 rounded-lg transition-colors"
                              title="View Lead Details"
                            >
                              <EyeIcon className="h-4 w-4" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {leads.length >= 5 && (
                      <div className="pt-3 border-t border-gray-200/50">
                        <button
                          onClick={handleViewLeads}
                          className="w-full text-center text-orange-600 hover:text-orange-700 text-sm font-medium py-2 hover:bg-orange-50 rounded-lg transition-colors"
                        >
                          View All Leads for This Property →
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <UserGroupIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 text-sm mb-4">No leads interested in this property yet.</p>
                    <button
                      onClick={handleCreateLead}
                      className="inline-flex items-center px-4 py-2 bg-orange-600 text-white text-sm font-medium rounded-lg hover:bg-orange-700 transition-colors"
                    >
                      <PlusIcon className="h-4 w-4 mr-2" />
                      Create Lead
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Enhanced Description */}
          <div id="description" className="bg-gradient-to-br from-white via-blue-50/80 to-indigo-50/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 overflow-hidden">
            <div className="p-4 border-b border-gray-200/50">
              <h3 className="text-lg font-bold text-gray-900 flex items-center">
                <DocumentTextIcon className="h-5 w-5 mr-2 text-blue-600" />
                Property Description
              </h3>
            </div>
            <div className="p-4">
              {property.description ? (
                <div className="prose prose-gray max-w-none">
                  <p className={`text-sm text-gray-700 leading-relaxed ${!showFullDescription && property.description.length > 200 ? 'line-clamp-4' : ''}`}>
                    {property.description}
                  </p>
                  {property.description.length > 200 && (
                    <button
                      onClick={() => setShowFullDescription(!showFullDescription)}
                      className="mt-3 text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
                    >
                      {showFullDescription ? 'Show Less' : 'Read More'}
                    </button>
                  )}
                </div>
              ) : (
                <p className="text-gray-500 italic">No description available for this property.</p>
              )}
            </div>
          </div>

          {/* Property Specifications */}
          <div id="specifications" className="bg-gradient-to-br from-white via-purple-50/80 to-violet-50/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 overflow-hidden">
            <div className="p-6 border-b border-gray-200/50">
              <h3 className="text-xl font-bold text-gray-900 flex items-center">
                <BuildingOfficeIcon className="h-6 w-6 mr-2 text-purple-600" />
                Property Specifications
              </h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {property.area && (
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-600">Area</span>
                    <span className="text-sm font-bold text-gray-900">{property.area} sq ft</span>
                  </div>
                )}
                
                {property.bedrooms && (
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-600">Bedrooms</span>
                    <span className="text-sm font-bold text-gray-900">{property.bedrooms}</span>
                  </div>
                )}
                
                {property.bathrooms && (
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-600">Bathrooms</span>
                    <span className="text-sm font-bold text-gray-900">{property.bathrooms}</span>
                  </div>
                )}
                
                {property.floors && (
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-600">Floors</span>
                    <span className="text-sm font-bold text-gray-900">{property.floors}</span>
                  </div>
                )}
                
                {property.direction && (
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-600">Direction</span>
                    <span className="text-sm font-bold text-gray-900 capitalize">{property.direction}</span>
                  </div>
                )}

                {property.built_up_area && (
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-600">Built-up Area</span>
                    <span className="text-sm font-bold text-gray-900">{property.built_up_area} sq ft</span>
                  </div>
                )}
                
                {property.carpet_area && (
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-600">Carpet Area</span>
                    <span className="text-sm font-bold text-gray-900">{property.carpet_area} sq ft</span>
                  </div>
                )}
                
                {property.super_built_up_area && (
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-600">Super Built-up Area</span>
                    <span className="text-sm font-bold text-gray-900">{property.super_built_up_area} sq ft</span>
                  </div>
                )}
                
                {property.balconies && (
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-600">Balconies</span>
                    <span className="text-sm font-bold text-gray-900">{property.balconies}</span>
                  </div>
                )}
                
                {property.total_floors && (
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-600">Total Floors in Building</span>
                    <span className="text-sm font-bold text-gray-900">{property.total_floors}</span>
                  </div>
                )}
                
                {property.floor_number && (
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-600">Floor Number</span>
                    <span className="text-sm font-bold text-gray-900">{property.floor_number}</span>
                  </div>
                )}
                
                {property.age_of_property && (
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-600">Age of Property</span>
                    <span className="text-sm font-bold text-gray-900">{property.age_of_property}</span>
                  </div>
                )}
                
                {property.furnishing_status && (
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-600">Furnishing Status</span>
                    <span className="text-sm font-bold text-gray-900">{property.furnishing_status}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Pricing & Financial Details */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 overflow-hidden">
            <div className="p-6 border-b border-gray-200/50">
              <h3 className="text-xl font-bold text-gray-900 flex items-center">
                <CurrencyDollarIcon className="h-6 w-6 mr-2 text-green-600" />
                Pricing & Financial Details
              </h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {property.maintenance_charges && (
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-600">Maintenance Charges</span>
                    <span className="text-sm font-bold text-gray-900">₹{property.maintenance_charges}</span>
                  </div>
                )}
                
                {property.booking_amount && (
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-600">Booking Amount</span>
                    <span className="text-sm font-bold text-gray-900">₹{property.booking_amount}</span>
                  </div>
                )}
                
                {property.registration_charges && (
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-600">Registration Charges</span>
                    <span className="text-sm font-bold text-gray-900">₹{property.registration_charges}</span>
                  </div>
                )}
                
                {property.stamp_duty && (
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-600">Stamp Duty</span>
                    <span className="text-sm font-bold text-gray-900">₹{property.stamp_duty}</span>
                  </div>
                )}
                
                {property.gst && (
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-600">GST</span>
                    <span className="text-sm font-bold text-gray-900">₹{property.gst}</span>
                  </div>
                )}
                
                {property.possession_date && (
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-600">Possession Date</span>
                    <span className="text-sm font-bold text-gray-900">{new Date(property.possession_date).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Legal & Documents */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 overflow-hidden">
            <div className="p-6 border-b border-gray-200/50">
              <h3 className="text-xl font-bold text-gray-900 flex items-center">
                <CheckCircleIcon className="h-6 w-6 mr-2 text-green-600" />
                Legal & Documents
              </h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {property.ownership_type && (
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-600">Ownership Type</span>
                    <span className="text-sm font-bold text-gray-900">{property.ownership_type}</span>
                  </div>
                )}
                
                {property.legal_status && (
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-600">Legal Status</span>
                    <span className="text-sm font-bold text-gray-900">{property.legal_status}</span>
                  </div>
                )}
                
                {property.rera_registration && (
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-600">RERA Registration</span>
                    <span className="text-sm font-bold text-gray-900">{property.rera_registration}</span>
                  </div>
                )}
                
                {property.khata_certificate && (
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-600">Khata Certificate</span>
                    <span className="text-sm font-bold text-gray-900">{property.khata_certificate}</span>
                  </div>
                )}
                
                {property.encumbrance_certificate && (
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-600">Encumbrance Certificate</span>
                    <span className="text-sm font-bold text-gray-900">{property.encumbrance_certificate}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Amenities & Features */}
          <div id="amenities" className="bg-gradient-to-br from-white via-orange-50/80 to-yellow-50/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 overflow-hidden">
            <div className="p-4 border-b border-gray-200/50">
              <h3 className="text-lg font-bold text-gray-900 flex items-center">
                <InformationCircleIcon className="h-5 w-5 mr-2 text-indigo-600" />
                Amenities & Features
              </h3>
            </div>
            <div className="p-4">
              {/* Amenities List */}
              {property.amenities && property.amenities.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Amenities</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                    {property.amenities.map((amenity, index) => (
                      <div key={index} className="flex items-center p-2 bg-gray-50 rounded-lg">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2 flex-shrink-0"></div>
                        <span className="text-xs text-gray-700">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Property Features */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {property.parking && (
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                    <span className="text-xs font-medium text-gray-600">Parking</span>
                    <span className="text-xs font-bold text-gray-900">{property.parking}</span>
                  </div>
                )}
                
                {property.power_backup && (
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                    <span className="text-xs font-medium text-gray-600">Power Backup</span>
                    <span className="text-xs font-bold text-gray-900">{property.power_backup}</span>
                  </div>
                )}
                
                {property.water_supply && (
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                    <span className="text-xs font-medium text-gray-600">Water Supply</span>
                    <span className="text-xs font-bold text-gray-900">{property.water_supply}</span>
                  </div>
                )}
                
                {property.security && (
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                    <span className="text-xs font-medium text-gray-600">Security</span>
                    <span className="text-xs font-bold text-gray-900">{property.security}</span>
                  </div>
                )}
                
                {property.internet_connectivity && (
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                    <span className="text-xs font-medium text-gray-600">Internet Connectivity</span>
                    <span className="text-xs font-bold text-gray-900">{property.internet_connectivity}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Location & Connectivity */}
          <div id="location" className="bg-gradient-to-br from-white via-teal-50/80 to-cyan-50/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 overflow-hidden">
            <div className="p-6 border-b border-gray-200/50">
              <h3 className="text-xl font-bold text-gray-900 flex items-center">
                <MapPinIcon className="h-6 w-6 mr-2 text-red-600" />
                Location & Connectivity
              </h3>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                {/* Address */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Address</h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-start">
                      <MapPinIcon className="h-5 w-5 text-gray-400 mt-0.5 mr-3 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-bold text-gray-900">{property.location}</p>
                        {property.address && (
                          <p className="text-sm text-gray-600 mt-1">{property.address}</p>
                        )}
                        {property.city && (
                          <p className="text-sm text-gray-500 mt-1">{property.city}, {property.state} {property.pincode}</p>
                        )}
                      </div>
                    </div>
                    
                    {property.landmark && (
                      <div className="p-3 bg-blue-50 rounded-lg mt-3">
                        <p className="text-sm font-medium text-blue-900">Near {property.landmark}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Connectivity */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Connectivity</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {property.nearby_schools && (
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm font-medium text-gray-600">Nearby Schools</span>
                        <span className="text-sm font-bold text-gray-900">{property.nearby_schools}</span>
                      </div>
                    )}
                    
                    {property.nearby_hospitals && (
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm font-medium text-gray-600">Nearby Hospitals</span>
                        <span className="text-sm font-bold text-gray-900">{property.nearby_hospitals}</span>
                      </div>
                    )}
                    
                    {property.nearby_malls && (
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm font-medium text-gray-600">Nearby Malls</span>
                        <span className="text-sm font-bold text-gray-900">{property.nearby_malls}</span>
                      </div>
                    )}
                    
                    {property.nearby_metro && (
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm font-medium text-gray-600">Nearby Metro Station</span>
                        <span className="text-sm font-bold text-gray-900">{property.nearby_metro}</span>
                      </div>
                    )}
                    
                    {property.nearby_bus_stop && (
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm font-medium text-gray-600">Nearby Bus Stop</span>
                        <span className="text-sm font-bold text-gray-900">{property.nearby_bus_stop}</span>
                      </div>
                    )}
                    
                    {property.distance_to_airport && (
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm font-medium text-gray-600">Distance to Airport</span>
                        <span className="text-sm font-bold text-gray-900">{property.distance_to_airport} km</span>
                      </div>
                    )}
                    
                    {property.distance_to_railway && (
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm font-medium text-gray-600">Distance to Railway Station</span>
                        <span className="text-sm font-bold text-gray-900">{property.distance_to_railway} km</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-gradient-to-br from-white via-rose-50/80 to-pink-50/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 overflow-hidden">
            <div className="p-6 border-b border-gray-200/50">
              <h3 className="text-xl font-bold text-gray-900 flex items-center">
                <UserIcon className="h-6 w-6 mr-2 text-blue-600" />
                Contact Information
              </h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {property.contact_person && (
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-600">Contact Person</span>
                    <span className="text-sm font-bold text-gray-900">{property.contact_person}</span>
                  </div>
                )}
                
                {property.contact_phone && (
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-600">Contact Phone</span>
                    <span className="text-sm font-bold text-gray-900">{property.contact_phone}</span>
                  </div>
                )}
                
                {property.contact_email && (
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-600">Contact Email</span>
                    <span className="text-sm font-bold text-gray-900">{property.contact_email}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Assigned Agent */}
          {property.assigned_agent && (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 overflow-hidden">
              <div className="p-6 border-b border-gray-200/50">
                <h3 className="text-xl font-bold text-gray-900 flex items-center">
                  <UserIcon className="h-6 w-6 mr-2 text-green-600" />
                  Assigned Agent
                </h3>
              </div>
              <div className="p-6">
                <div className="flex items-center p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                    <span className="text-sm font-bold text-white">
                      {property.assigned_agent.first_name[0]}{property.assigned_agent.last_name[0]}
                    </span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-bold text-gray-900">
                      {property.assigned_agent.first_name} {property.assigned_agent.last_name}
                    </p>
                    <p className="text-sm text-gray-600 capitalize">
                      {property.assigned_agent.role.replace('_', ' ')}
                    </p>
                  </div>
                </div>
                
                <div className="mt-4 flex space-x-2">
                  <button className="flex-1 flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200">
                    <PhoneIcon className="h-4 w-4 mr-2" />
                    Call
                  </button>
                  <button className="flex-1 flex items-center justify-center px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors duration-200">
                    <EnvelopeIcon className="h-4 w-4 mr-2" />
                    Email
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Property Statistics & Additional Actions */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 overflow-hidden">
            <div className="p-6 border-b border-gray-200/50">
              <h3 className="text-xl font-bold text-gray-900 flex items-center">
                <TrophyIcon className="h-6 w-6 mr-2 text-yellow-600" />
                Property Statistics
              </h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-lg font-bold text-gray-900">{property.area || 'N/A'}</div>
                  <div className="text-xs text-gray-600">Sq Ft</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-lg font-bold text-gray-900">{property.bedrooms || 'N/A'}</div>
                  <div className="text-xs text-gray-600">Bedrooms</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-lg font-bold text-gray-900">{property.bathrooms || 'N/A'}</div>
                  <div className="text-xs text-gray-600">Bathrooms</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-lg font-bold text-gray-900">{property.amenities?.length || 0}</div>
                  <div className="text-xs text-gray-600">Amenities</div>
                </div>
              </div>
              
              {/* Additional Actions */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <button 
                  onClick={handleDownloadBrochure}
                  className="flex items-center justify-center px-3 py-2 bg-purple-100 text-purple-700 hover:bg-purple-200 rounded-lg transition-all duration-200"
                >
                  <DocumentTextIcon className="h-4 w-4 mr-1" />
                  <span className="text-sm">Download Brochure</span>
                </button>
                
                <button 
                  onClick={handleSaveAsPDF}
                  className="flex items-center justify-center px-3 py-2 bg-orange-100 text-orange-700 hover:bg-orange-200 rounded-lg transition-all duration-200"
                >
                  <ArrowDownTrayIcon className="h-4 w-4 mr-1" />
                  <span className="text-sm">Save as PDF</span>
                </button>
                
                <button 
                  onClick={handleAddToFavorites}
                  disabled={favoriteLoading}
                  className={`flex items-center justify-center px-3 py-2 rounded-lg transition-all duration-200 ${
                    isFavorite 
                      ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  } ${favoriteLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <HeartIcon className={`h-4 w-4 mr-1 ${isFavorite ? 'fill-current' : ''}`} />
                  <span className="text-sm">{isFavorite ? 'Favorited' : 'Favorite'}</span>
                </button>
                
                <button 
                  onClick={handlePrint}
                  className="flex items-center justify-center px-3 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg transition-all duration-200"
                >
                  <PrinterIcon className="h-4 w-4 mr-1" />
                  <span className="text-sm">Print</span>
                </button>
              </div>
              
              {/* Contact Actions */}
              {(property.contact_phone || property.contact_email) && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">Contact Actions</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {property.contact_phone && (
                      <a 
                        href={`tel:${property.contact_phone}`}
                        className="flex items-center justify-center px-3 py-2 bg-green-100 text-green-700 hover:bg-green-200 rounded-lg transition-all duration-200"
                      >
                        <PhoneIcon className="h-4 w-4 mr-1" />
                        <span className="text-sm">Call {property.contact_phone}</span>
                      </a>
                    )}
                    
                    {property.contact_email && (
                      <a 
                        href={`mailto:${property.contact_email}?subject=Inquiry about ${property.title}`}
                        className="flex items-center justify-center px-3 py-2 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-lg transition-all duration-200"
                      >
                        <EnvelopeIcon className="h-4 w-4 mr-1" />
                        <span className="text-sm">Email</span>
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {showImageModal && property.images && property.images.length > 0 && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={() => setShowImageModal(false)}
              className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
            >
              <XMarkIcon className="h-8 w-8" />
            </button>
            <img
              src={property.images[selectedImageIndex].startsWith('blob:') 
                ? property.images[selectedImageIndex] 
                : `http://localhost:5000${property.images[selectedImageIndex]}`
              }
              alt={`${property.title} ${selectedImageIndex + 1}`}
              className="max-w-full max-h-full object-contain rounded-lg"
            />
            {property.images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {property.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      selectedImageIndex === index ? 'bg-white' : 'bg-white bg-opacity-50'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyDetails;
