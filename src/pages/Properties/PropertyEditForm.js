import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { propertiesAPI, employeesAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import ImageUpload from '../../components/ImageUpload';
import {
  ArrowLeftIcon,
  PhotoIcon,
  XMarkIcon,
  HomeIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  BuildingOfficeIcon,
  UserIcon,
  CalendarIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const PropertyEditForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [activeSection, setActiveSection] = useState('basic-info');
  const [dataLoading, setDataLoading] = useState(true);
  const [formData, setFormData] = useState({
    // Basic Information
    title: '',
    description: '',
    property_type: '',
    sub_type: '',
    location: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    landmark: '',
    
    // Pricing & Financial
    price: '',
    price_per_sqft: '',
    maintenance_charges: '',
    booking_amount: '',
    registration_charges: '',
    stamp_duty: '',
    gst: '',
    possession_date: '',
    
    // Property Specifications
    area: '',
    built_up_area: '',
    carpet_area: '',
    super_built_up_area: '',
    bedrooms: '',
    bathrooms: '',
    balconies: '',
    floors: '',
    total_floors: '',
    floor_number: '',
    direction: '',
    age_of_property: '',
    furnishing_status: '',
    
    // Legal & Documentation
    ownership_type: '',
    property_documents: [],
    legal_status: '',
    rera_registration: '',
    khata_certificate: '',
    encumbrance_certificate: '',
    
    // Amenities & Features
    amenities: [],
    parking: '',
    power_backup: '',
    water_supply: '',
    security: '',
    internet_connectivity: '',
    
    // Location & Connectivity
    nearby_schools: '',
    nearby_hospitals: '',
    nearby_malls: '',
    nearby_metro: '',
    nearby_bus_stop: '',
    distance_to_airport: '',
    distance_to_railway: '',
    
    // Status & Visibility
    status: 'available',
    listing_type: 'sale',
    priority: 'normal',
    featured: false,
    images: [],
    floor_plans: [],
    virtual_tour: '',
    
    // Contact Information
    contact_person: '',
    contact_phone: '',
    contact_email: '',
  });

  const inputRefs = useRef({});

  useEffect(() => {
    fetchProperty();
    fetchEmployees();
  }, [id]);

  // Track active section for navigation highlighting
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['basic-info', 'pricing-info', 'specifications', 'legal-docs', 'amenities', 'location', 'media', 'status-contact'];
      
      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fetchProperty = async () => {
    try {
      setDataLoading(true);
      const response = await propertiesAPI.getProperty(id);
      const property = response.data.property; // The API returns {property: {...}}
      
      // Map the property data to form data
      setFormData({
        title: property.title || '',
        description: property.description || '',
        property_type: property.property_type || '',
        sub_type: property.sub_type || '',
        location: property.location || '',
        address: property.address || '',
        city: property.city || '',
        state: property.state || '',
        pincode: property.pincode || '',
        landmark: property.landmark || '',
        price: property.price || '',
        price_per_sqft: property.price_per_sqft || '',
        maintenance_charges: property.maintenance_charges || '',
        booking_amount: property.booking_amount || '',
        registration_charges: property.registration_charges || '',
        stamp_duty: property.stamp_duty || '',
        gst: property.gst || '',
        possession_date: property.possession_date || '',
        area: property.area || '',
        built_up_area: property.built_up_area || '',
        carpet_area: property.carpet_area || '',
        super_built_up_area: property.super_built_up_area || '',
        bedrooms: property.bedrooms || '',
        bathrooms: property.bathrooms || '',
        balconies: property.balconies || '',
        floors: property.floors || '',
        total_floors: property.total_floors || '',
        floor_number: property.floor_number || '',
        direction: property.direction || '',
        age_of_property: property.age_of_property || '',
        furnishing_status: property.furnishing_status || '',
        ownership_type: property.ownership_type || '',
        property_documents: property.property_documents || [],
        legal_status: property.legal_status || '',
        rera_registration: property.rera_registration || '',
        khata_certificate: property.khata_certificate || '',
        encumbrance_certificate: property.encumbrance_certificate || '',
        amenities: property.amenities || [],
        parking: property.parking || '',
        power_backup: property.power_backup || '',
        water_supply: property.water_supply || '',
        security: property.security || '',
        internet_connectivity: property.internet_connectivity || '',
        nearby_schools: property.nearby_schools || '',
        nearby_hospitals: property.nearby_hospitals || '',
        nearby_malls: property.nearby_malls || '',
        nearby_metro: property.nearby_metro || '',
        nearby_bus_stop: property.nearby_bus_stop || '',
        distance_to_airport: property.distance_to_airport || '',
        distance_to_railway: property.distance_to_railway || '',
        status: property.status || 'available',
        listing_type: property.listing_type || 'sale',
        priority: property.priority || 'normal',
        featured: property.featured || false,
        images: property.images || [],
        floor_plans: property.floor_plans || [],
        virtual_tour: property.virtual_tour || '',
        contact_person: property.contact_person || '',
        contact_phone: property.contact_phone || '',
        contact_email: property.contact_email || '',
      });
    } catch (error) {
      console.error('Failed to fetch property:', error);
      toast.error('Failed to load property details');
    } finally {
      setDataLoading(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await employeesAPI.getEmployees();
      setEmployees(response.data.employees);
    } catch (error) {
      console.error('Failed to fetch employees:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const submitData = {
        ...formData,
        price: formData.price ? parseFloat(formData.price) : null,
        price_per_sqft: formData.price_per_sqft ? parseFloat(formData.price_per_sqft) : null,
        maintenance_charges: formData.maintenance_charges ? parseFloat(formData.maintenance_charges) : null,
        booking_amount: formData.booking_amount ? parseFloat(formData.booking_amount) : null,
        registration_charges: formData.registration_charges ? parseFloat(formData.registration_charges) : null,
        stamp_duty: formData.stamp_duty ? parseFloat(formData.stamp_duty) : null,
        gst: formData.gst ? parseFloat(formData.gst) : null,
        area: formData.area ? parseFloat(formData.area) : null,
        built_up_area: formData.built_up_area ? parseFloat(formData.built_up_area) : null,
        carpet_area: formData.carpet_area ? parseFloat(formData.carpet_area) : null,
        super_built_up_area: formData.super_built_up_area ? parseFloat(formData.super_built_up_area) : null,
        bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : null,
        bathrooms: formData.bathrooms ? parseInt(formData.bathrooms) : null,
        balconies: formData.balconies ? parseInt(formData.balconies) : null,
        floors: formData.floors ? parseInt(formData.floors) : null,
        total_floors: formData.total_floors ? parseInt(formData.total_floors) : null,
        floor_number: formData.floor_number ? parseInt(formData.floor_number) : null,
        distance_to_airport: formData.distance_to_airport ? parseFloat(formData.distance_to_airport) : null,
        distance_to_railway: formData.distance_to_railway ? parseFloat(formData.distance_to_railway) : null,
      };

      await propertiesAPI.updateProperty(id, submitData);
      toast.success('Property updated successfully');
      navigate('/properties');
    } catch (error) {
      toast.error('Failed to update property');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate('/properties')}
            className="p-2 text-gray-400 hover:text-gray-600"
          >
            <ArrowLeftIcon className="h-6 w-6" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Edit Property
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Update property information
            </p>
          </div>
        </div>

        {dataLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="spinner mx-auto mb-4"></div>
              <p className="text-gray-600">Loading property data...</p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex gap-6">
            {/* Main Form Content */}
            <div className="flex-1 space-y-6">
              {/* Basic Information Section */}
              <div id="basic-info" className="bg-white shadow rounded-lg">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900 flex items-center">
                    <HomeIcon className="h-5 w-5 mr-2 text-blue-600" />
                    Basic Information
                  </h3>
                </div>
                <div className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="form-label">Property Title *</label>
                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        className="form-input"
                        placeholder="Enter property title"
                      />
                    </div>
                    
                    <div>
                      <label className="form-label">Property Type *</label>
                      <select
                        name="property_type"
                        value={formData.property_type}
                        onChange={handleChange}
                        required
                        className="form-select"
                      >
                        <option value="">Select property type</option>
                        <option value="Residential">Residential</option>
                        <option value="Commercial">Commercial</option>
                        <option value="Industrial">Industrial</option>
                        <option value="Land">Land</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="form-label">Sub Type</label>
                      <input
                        type="text"
                        name="sub_type"
                        value={formData.sub_type}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="e.g., Apartment, Villa, Office"
                      />
                    </div>
                    
                    <div>
                      <label className="form-label">Location *</label>
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        required
                        className="form-input"
                        placeholder="Enter location"
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="form-label">Address *</label>
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        required
                        rows={3}
                        className="form-textarea"
                        placeholder="Enter complete address"
                      />
                    </div>
                    
                    <div>
                      <label className="form-label">City</label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="Enter city"
                      />
                    </div>
                    
                    <div>
                      <label className="form-label">State</label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="Enter state"
                      />
                    </div>
                    
                    <div>
                      <label className="form-label">Pincode</label>
                      <input
                        type="text"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="Enter pincode"
                      />
                    </div>
                    
                    <div>
                      <label className="form-label">Landmark</label>
                      <input
                        type="text"
                        name="landmark"
                        value={formData.landmark}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="Enter nearby landmark"
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="form-label">Description</label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={4}
                        className="form-textarea"
                        placeholder="Enter property description"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Pricing & Financial Section */}
              <div id="pricing-info" className="bg-white shadow rounded-lg">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900 flex items-center">
                    <CurrencyDollarIcon className="h-5 w-5 mr-2 text-green-600" />
                    Pricing & Financial
                  </h3>
                </div>
                <div className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="form-label">Price *</label>
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        required
                        className="form-input"
                        placeholder="Enter price"
                      />
                    </div>
                    
                    <div>
                      <label className="form-label">Price per Sq Ft</label>
                      <input
                        type="number"
                        name="price_per_sqft"
                        value={formData.price_per_sqft}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="Enter price per sq ft"
                      />
                    </div>
                    
                    <div>
                      <label className="form-label">Maintenance Charges</label>
                      <input
                        type="number"
                        name="maintenance_charges"
                        value={formData.maintenance_charges}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="Enter maintenance charges"
                      />
                    </div>
                    
                    <div>
                      <label className="form-label">Booking Amount</label>
                      <input
                        type="number"
                        name="booking_amount"
                        value={formData.booking_amount}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="Enter booking amount"
                      />
                    </div>
                    
                    <div>
                      <label className="form-label">Registration Charges</label>
                      <input
                        type="number"
                        name="registration_charges"
                        value={formData.registration_charges}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="Enter registration charges"
                      />
                    </div>
                    
                    <div>
                      <label className="form-label">Stamp Duty</label>
                      <input
                        type="number"
                        name="stamp_duty"
                        value={formData.stamp_duty}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="Enter stamp duty"
                      />
                    </div>
                    
                    <div>
                      <label className="form-label">GST</label>
                      <input
                        type="number"
                        name="gst"
                        value={formData.gst}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="Enter GST"
                      />
                    </div>
                    
                    <div>
                      <label className="form-label">Possession Date</label>
                      <input
                        type="date"
                        name="possession_date"
                        value={formData.possession_date}
                        onChange={handleChange}
                        className="form-input"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Property Specifications Section */}
              <div id="specifications" className="bg-white shadow rounded-lg">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900 flex items-center">
                    <BuildingOfficeIcon className="h-5 w-5 mr-2 text-purple-600" />
                    Property Specifications
                  </h3>
                </div>
                <div className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div>
                      <label className="form-label">Total Area (sq ft)</label>
                      <input
                        type="number"
                        name="area"
                        value={formData.area}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="Total area"
                      />
                    </div>
                    
                    <div>
                      <label className="form-label">Built-up Area (sq ft)</label>
                      <input
                        type="number"
                        name="built_up_area"
                        value={formData.built_up_area}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="Built-up area"
                      />
                    </div>
                    
                    <div>
                      <label className="form-label">Carpet Area (sq ft)</label>
                      <input
                        type="number"
                        name="carpet_area"
                        value={formData.carpet_area}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="Carpet area"
                      />
                    </div>
                    
                    <div>
                      <label className="form-label">Super Built-up Area (sq ft)</label>
                      <input
                        type="number"
                        name="super_built_up_area"
                        value={formData.super_built_up_area}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="Super built-up area"
                      />
                    </div>
                    
                    <div>
                      <label className="form-label">Bedrooms</label>
                      <select
                        name="bedrooms"
                        value={formData.bedrooms}
                        onChange={handleChange}
                        className="form-select"
                      >
                        <option value="">Select bedrooms</option>
                        {[1,2,3,4,5,6,7,8,9,10].map(num => (
                          <option key={num} value={num}>{num}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="form-label">Bathrooms</label>
                      <select
                        name="bathrooms"
                        value={formData.bathrooms}
                        onChange={handleChange}
                        className="form-select"
                      >
                        <option value="">Select bathrooms</option>
                        {[1,2,3,4,5,6,7,8,9,10].map(num => (
                          <option key={num} value={num}>{num}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="form-label">Balconies</label>
                      <select
                        name="balconies"
                        value={formData.balconies}
                        onChange={handleChange}
                        className="form-select"
                      >
                        <option value="">Select balconies</option>
                        {[0,1,2,3,4,5].map(num => (
                          <option key={num} value={num}>{num}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="form-label">Floors</label>
                      <input
                        type="number"
                        name="floors"
                        value={formData.floors}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="Number of floors"
                      />
                    </div>
                    
                    <div>
                      <label className="form-label">Total Floors in Building</label>
                      <input
                        type="number"
                        name="total_floors"
                        value={formData.total_floors}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="Total floors in building"
                      />
                    </div>
                    
                    <div>
                      <label className="form-label">Floor Number</label>
                      <input
                        type="number"
                        name="floor_number"
                        value={formData.floor_number}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="Floor number"
                      />
                    </div>
                    
                    <div>
                      <label className="form-label">Direction</label>
                      <select
                        name="direction"
                        value={formData.direction}
                        onChange={handleChange}
                        className="form-select"
                      >
                        <option value="">Select direction</option>
                        <option value="North">North</option>
                        <option value="South">South</option>
                        <option value="East">East</option>
                        <option value="West">West</option>
                        <option value="North-East">North-East</option>
                        <option value="North-West">North-West</option>
                        <option value="South-East">South-East</option>
                        <option value="South-West">South-West</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="form-label">Age of Property</label>
                      <select
                        name="age_of_property"
                        value={formData.age_of_property}
                        onChange={handleChange}
                        className="form-select"
                      >
                        <option value="">Select age</option>
                        <option value="Under Construction">Under Construction</option>
                        <option value="0-1 years">0-1 years</option>
                        <option value="1-5 years">1-5 years</option>
                        <option value="5-10 years">5-10 years</option>
                        <option value="10-20 years">10-20 years</option>
                        <option value="20+ years">20+ years</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="form-label">Furnishing Status</label>
                      <select
                        name="furnishing_status"
                        value={formData.furnishing_status}
                        onChange={handleChange}
                        className="form-select"
                      >
                        <option value="">Select furnishing</option>
                        <option value="Fully Furnished">Fully Furnished</option>
                        <option value="Semi Furnished">Semi Furnished</option>
                        <option value="Unfurnished">Unfurnished</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Legal & Documents Section */}
              <div id="legal-docs" className="bg-white shadow rounded-lg">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900 flex items-center">
                    <CheckCircleIcon className="h-5 w-5 mr-2 text-green-600" />
                    Legal & Documents
                  </h3>
                </div>
                <div className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="form-label">Ownership Type</label>
                      <select
                        name="ownership_type"
                        value={formData.ownership_type}
                        onChange={handleChange}
                        className="form-select"
                      >
                        <option value="">Select ownership type</option>
                        <option value="Freehold">Freehold</option>
                        <option value="Leasehold">Leasehold</option>
                        <option value="Co-operative Society">Co-operative Society</option>
                        <option value="Power of Attorney">Power of Attorney</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="form-label">Legal Status</label>
                      <select
                        name="legal_status"
                        value={formData.legal_status}
                        onChange={handleChange}
                        className="form-select"
                      >
                        <option value="">Select legal status</option>
                        <option value="Clear">Clear</option>
                        <option value="Pending">Pending</option>
                        <option value="Disputed">Disputed</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="form-label">RERA Registration</label>
                      <input
                        type="text"
                        name="rera_registration"
                        value={formData.rera_registration}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="RERA registration number"
                      />
                    </div>
                    
                    <div>
                      <label className="form-label">Khata Certificate</label>
                      <select
                        name="khata_certificate"
                        value={formData.khata_certificate}
                        onChange={handleChange}
                        className="form-select"
                      >
                        <option value="">Select status</option>
                        <option value="Available">Available</option>
                        <option value="Not Available">Not Available</option>
                        <option value="Applied">Applied</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="form-label">Encumbrance Certificate</label>
                      <select
                        name="encumbrance_certificate"
                        value={formData.encumbrance_certificate}
                        onChange={handleChange}
                        className="form-select"
                      >
                        <option value="">Select status</option>
                        <option value="Available">Available</option>
                        <option value="Not Available">Not Available</option>
                        <option value="Applied">Applied</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Amenities & Features Section */}
              <div id="amenities" className="bg-white shadow rounded-lg">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900 flex items-center">
                    <InformationCircleIcon className="h-5 w-5 mr-2 text-indigo-600" />
                    Amenities & Features
                  </h3>
                </div>
                <div className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="form-label">Parking</label>
                      <select
                        name="parking"
                        value={formData.parking}
                        onChange={handleChange}
                        className="form-select"
                      >
                        <option value="">Select parking</option>
                        <option value="No Parking">No Parking</option>
                        <option value="1 Wheeler">1 Wheeler</option>
                        <option value="2 Wheeler">2 Wheeler</option>
                        <option value="4 Wheeler">4 Wheeler</option>
                        <option value="Multiple">Multiple</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="form-label">Power Backup</label>
                      <select
                        name="power_backup"
                        value={formData.power_backup}
                        onChange={handleChange}
                        className="form-select"
                      >
                        <option value="">Select power backup</option>
                        <option value="No Backup">No Backup</option>
                        <option value="Partial Backup">Partial Backup</option>
                        <option value="Full Backup">Full Backup</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="form-label">Water Supply</label>
                      <select
                        name="water_supply"
                        value={formData.water_supply}
                        onChange={handleChange}
                        className="form-select"
                      >
                        <option value="">Select water supply</option>
                        <option value="Municipal">Municipal</option>
                        <option value="Borewell">Borewell</option>
                        <option value="Both">Both</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="form-label">Security</label>
                      <select
                        name="security"
                        value={formData.security}
                        onChange={handleChange}
                        className="form-select"
                      >
                        <option value="">Select security</option>
                        <option value="24/7 Security">24/7 Security</option>
                        <option value="Day Security">Day Security</option>
                        <option value="No Security">No Security</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="form-label">Internet Connectivity</label>
                      <select
                        name="internet_connectivity"
                        value={formData.internet_connectivity}
                        onChange={handleChange}
                        className="form-select"
                      >
                        <option value="">Select connectivity</option>
                        <option value="Available">Available</option>
                        <option value="Not Available">Not Available</option>
                        <option value="Can be Arranged">Can be Arranged</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Location & Connectivity Section */}
              <div id="location" className="bg-white shadow rounded-lg">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900 flex items-center">
                    <MapPinIcon className="h-5 w-5 mr-2 text-red-600" />
                    Location & Connectivity
                  </h3>
                </div>
                <div className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="form-label">Nearby Schools</label>
                      <input
                        type="text"
                        name="nearby_schools"
                        value={formData.nearby_schools}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="Nearby schools"
                      />
                    </div>
                    
                    <div>
                      <label className="form-label">Nearby Hospitals</label>
                      <input
                        type="text"
                        name="nearby_hospitals"
                        value={formData.nearby_hospitals}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="Nearby hospitals"
                      />
                    </div>
                    
                    <div>
                      <label className="form-label">Nearby Malls</label>
                      <input
                        type="text"
                        name="nearby_malls"
                        value={formData.nearby_malls}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="Nearby malls"
                      />
                    </div>
                    
                    <div>
                      <label className="form-label">Nearby Metro Station</label>
                      <input
                        type="text"
                        name="nearby_metro"
                        value={formData.nearby_metro}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="Nearby metro station"
                      />
                    </div>
                    
                    <div>
                      <label className="form-label">Nearby Bus Stop</label>
                      <input
                        type="text"
                        name="nearby_bus_stop"
                        value={formData.nearby_bus_stop}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="Nearby bus stop"
                      />
                    </div>
                    
                    <div>
                      <label className="form-label">Distance to Airport (km)</label>
                      <input
                        type="number"
                        name="distance_to_airport"
                        value={formData.distance_to_airport}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="Distance to airport"
                      />
                    </div>
                    
                    <div>
                      <label className="form-label">Distance to Railway Station (km)</label>
                      <input
                        type="number"
                        name="distance_to_railway"
                        value={formData.distance_to_railway}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="Distance to railway station"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Media Section */}
              <div id="media" className="bg-white shadow rounded-lg">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900 flex items-center">
                    <PhotoIcon className="h-5 w-5 mr-2 text-purple-600" />
                    Media & Images
                  </h3>
                </div>
                <div className="p-6">
                  <ImageUpload
                    images={formData.images}
                    onImagesChange={(images) => setFormData(prev => ({ ...prev, images }))}
                    maxImages={20}
                  />
                </div>
              </div>

              {/* Status & Contact Section */}
              <div id="status-contact" className="bg-white shadow rounded-lg">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900 flex items-center">
                    <UserIcon className="h-5 w-5 mr-2 text-indigo-600" />
                    Status & Contact
                  </h3>
                </div>
                <div className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="form-label">Status</label>
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="form-select"
                      >
                        <option value="available">Available</option>
                        <option value="sold">Sold</option>
                        <option value="rented">Rented</option>
                        <option value="under_construction">Under Construction</option>
                        <option value="coming_soon">Coming Soon</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="form-label">Listing Type</label>
                      <select
                        name="listing_type"
                        value={formData.listing_type}
                        onChange={handleChange}
                        className="form-select"
                      >
                        <option value="sale">Sale</option>
                        <option value="rent">Rent</option>
                        <option value="both">Both</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="form-label">Priority</label>
                      <select
                        name="priority"
                        value={formData.priority}
                        onChange={handleChange}
                        className="form-select"
                      >
                        <option value="low">Low</option>
                        <option value="normal">Normal</option>
                        <option value="high">High</option>
                        <option value="urgent">Urgent</option>
                      </select>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name="featured"
                        checked={formData.featured}
                        onChange={handleChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label className="ml-2 block text-sm text-gray-900">
                        Featured Property
                      </label>
                    </div>
                    
                    <div>
                      <label className="form-label">Contact Person</label>
                      <input
                        type="text"
                        name="contact_person"
                        value={formData.contact_person}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="Contact person name"
                      />
                    </div>
                    
                    <div>
                      <label className="form-label">Contact Phone</label>
                      <input
                        type="tel"
                        name="contact_phone"
                        value={formData.contact_phone}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="Contact phone number"
                      />
                    </div>
                    
                    <div>
                      <label className="form-label">Contact Email</label>
                      <input
                        type="email"
                        name="contact_email"
                        value={formData.contact_email}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="Contact email"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side Navigation Panel */}
            <div className="w-64 flex-shrink-0">
              <div className="fixed top-20 right-8 w-64 max-h-[calc(100vh-6rem)] overflow-y-auto z-10">
                <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-4">Quick Navigation</h4>
                  <nav className="space-y-2">
                    <button
                      type="button"
                      onClick={() => document.getElementById('basic-info')?.scrollIntoView({ behavior: 'smooth' })}
                      className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors duration-200 flex items-center ${
                        activeSection === 'basic-info' 
                          ? 'text-blue-600 bg-blue-50 border-l-2 border-blue-600' 
                          : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                      }`}
                    >
                      <HomeIcon className="h-4 w-4 mr-2" />
                      Basic Information
                    </button>
                    <button
                      type="button"
                      onClick={() => document.getElementById('pricing-info')?.scrollIntoView({ behavior: 'smooth' })}
                      className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors duration-200 flex items-center ${
                        activeSection === 'pricing-info' 
                          ? 'text-blue-600 bg-blue-50 border-l-2 border-blue-600' 
                          : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                      }`}
                    >
                      <CurrencyDollarIcon className="h-4 w-4 mr-2" />
                      Pricing & Financial
                    </button>
                    <button
                      type="button"
                      onClick={() => document.getElementById('specifications')?.scrollIntoView({ behavior: 'smooth' })}
                      className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors duration-200 flex items-center ${
                        activeSection === 'specifications' 
                          ? 'text-blue-600 bg-blue-50 border-l-2 border-blue-600' 
                          : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                      }`}
                    >
                      <BuildingOfficeIcon className="h-4 w-4 mr-2" />
                      Specifications
                    </button>
                    <button
                      type="button"
                      onClick={() => document.getElementById('legal-docs')?.scrollIntoView({ behavior: 'smooth' })}
                      className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors duration-200 flex items-center ${
                        activeSection === 'legal-docs' 
                          ? 'text-blue-600 bg-blue-50 border-l-2 border-blue-600' 
                          : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                      }`}
                    >
                      <CheckCircleIcon className="h-4 w-4 mr-2" />
                      Legal & Documents
                    </button>
                    <button
                      type="button"
                      onClick={() => document.getElementById('amenities')?.scrollIntoView({ behavior: 'smooth' })}
                      className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors duration-200 flex items-center ${
                        activeSection === 'amenities' 
                          ? 'text-blue-600 bg-blue-50 border-l-2 border-blue-600' 
                          : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                      }`}
                    >
                      <InformationCircleIcon className="h-4 w-4 mr-2" />
                      Amenities & Features
                    </button>
                    <button
                      type="button"
                      onClick={() => document.getElementById('location')?.scrollIntoView({ behavior: 'smooth' })}
                      className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors duration-200 flex items-center ${
                        activeSection === 'location' 
                          ? 'text-blue-600 bg-blue-50 border-l-2 border-blue-600' 
                          : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                      }`}
                    >
                      <MapPinIcon className="h-4 w-4 mr-2" />
                      Location & Connectivity
                    </button>
                    <button
                      type="button"
                      onClick={() => document.getElementById('media')?.scrollIntoView({ behavior: 'smooth' })}
                      className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors duration-200 flex items-center ${
                        activeSection === 'media' 
                          ? 'text-blue-600 bg-blue-50 border-l-2 border-blue-600' 
                          : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                      }`}
                    >
                      <PhotoIcon className="h-4 w-4 mr-2" />
                      Media & Images
                    </button>
                    <button
                      type="button"
                      onClick={() => document.getElementById('status-contact')?.scrollIntoView({ behavior: 'smooth' })}
                      className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors duration-200 flex items-center ${
                        activeSection === 'status-contact' 
                          ? 'text-blue-600 bg-blue-50 border-l-2 border-blue-600' 
                          : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                      }`}
                    >
                      <UserIcon className="h-4 w-4 mr-2" />
                      Status & Contact
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => navigate('/properties')}
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
              Update Property
            </button>
          </div>
        </form>
        )}
      </div>
    </div>
  );
};

export default PropertyEditForm;
