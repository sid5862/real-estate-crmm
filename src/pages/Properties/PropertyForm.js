import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
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

const PropertyForm = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);
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
    fetchEmployees();
  }, []);

  // Auto-focus to next input when Enter is pressed
  const handleKeyPress = (e, nextFieldName) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (nextFieldName && inputRefs.current[nextFieldName]) {
        inputRefs.current[nextFieldName].focus();
      }
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

      await propertiesAPI.createProperty(submitData);
      toast.success('Property created successfully');
      navigate('/properties');
    } catch (error) {
      toast.error('Failed to create property');
    } finally {
      setLoading(false);
    }
  };

  // Form steps configuration
  const steps = [
    { id: 1, title: 'Basic Info', icon: HomeIcon },
    { id: 2, title: 'Pricing', icon: CurrencyDollarIcon },
    { id: 3, title: 'Specifications', icon: BuildingOfficeIcon },
    { id: 4, title: 'Location', icon: MapPinIcon },
    { id: 5, title: 'Amenities', icon: InformationCircleIcon },
    { id: 6, title: 'Media', icon: PhotoIcon },
    { id: 7, title: 'Review', icon: CheckCircleIcon },
  ];

  const nextStep = () => {
    if (currentStep < steps.length) {
      if (validateStep(currentStep)) {
        setCurrentStep(currentStep + 1);
      } else {
        toast.error('Please fill in all required fields before proceeding');
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (stepId) => {
    // Allow going to previous steps or current step
    if (stepId <= currentStep) {
      setCurrentStep(stepId);
    }
  };

  const validateStep = (step) => {
    switch (step) {
      case 1:
        return formData.title && formData.property_type && formData.location && formData.address;
      case 2:
        return formData.price;
      case 3:
        return true; // Specifications are optional
      case 4:
        return true; // Location details are optional
      case 5:
        return true; // Amenities are optional
      case 6:
        return true; // Media is optional
      case 7:
        return true; // Review step
      default:
        return true;
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
              Add New Property
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Create a comprehensive property listing
            </p>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="overflow-x-auto">
            <div className="flex items-center min-w-max space-x-2">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center flex-shrink-0">
                  <button
                    onClick={() => goToStep(step.id)}
                    disabled={step.id > currentStep + 1}
                    className={`flex items-center space-x-2 p-2 rounded-lg transition-all duration-200 ${
                      currentStep >= step.id 
                        ? 'bg-blue-50 hover:bg-blue-100 cursor-pointer' 
                        : step.id === currentStep + 1
                        ? 'bg-gray-50 hover:bg-gray-100 cursor-pointer'
                        : 'bg-gray-50 cursor-not-allowed opacity-60'
                    }`}
                  >
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                      currentStep >= step.id 
                        ? 'bg-blue-600 border-blue-600 text-white' 
                        : 'border-gray-300 text-gray-400'
                    }`}>
                      <step.icon className="h-4 w-4" />
                    </div>
                    <div className="hidden sm:block">
                      <p className={`text-xs font-medium ${
                        currentStep >= step.id ? 'text-blue-600' : 'text-gray-500'
                      }`}>
                        {step.title}
                      </p>
                    </div>
                  </button>
                  {index < steps.length - 1 && (
                    <div className={`w-8 h-0.5 mx-2 ${
                      currentStep > step.id ? 'bg-blue-600' : 'bg-gray-300'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>
          
          {/* Current Step Indicator */}
          <div className="mt-3 text-center">
            <p className="text-sm text-gray-600">
              Step {currentStep} of {steps.length}: <span className="font-medium text-blue-600">{steps[currentStep - 1]?.title}</span>
            </p>
            <div className="mt-2 flex justify-center">
              <div className="flex space-x-1">
                {steps.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full ${
                      index + 1 <= currentStep ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <div className="bg-white shadow rounded-lg">
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
                      onKeyPress={(e) => handleKeyPress(e, 'property_type')}
                      ref={(el) => inputRefs.current['title'] = el}
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
                      onKeyPress={(e) => handleKeyPress(e, 'sub_type')}
                      ref={(el) => inputRefs.current['property_type'] = el}
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
                      onKeyPress={(e) => handleKeyPress(e, 'location')}
                      ref={(el) => inputRefs.current['sub_type'] = el}
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
                      onKeyPress={(e) => handleKeyPress(e, 'address')}
                      ref={(el) => inputRefs.current['location'] = el}
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
                      ref={(el) => inputRefs.current['address'] = el}
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
          )}

          {/* Step 2: Pricing & Financial */}
          {currentStep === 2 && (
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 flex items-center">
                  <CurrencyDollarIcon className="h-5 w-5 mr-2 text-blue-600" />
                  Pricing & Financial Details
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
          )}

          {/* Step 3: Property Specifications */}
          {currentStep === 3 && (
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 flex items-center">
                  <BuildingOfficeIcon className="h-5 w-5 mr-2 text-blue-600" />
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
          )}

          {/* Step 4: Location & Connectivity */}
          {currentStep === 4 && (
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 flex items-center">
                  <MapPinIcon className="h-5 w-5 mr-2 text-blue-600" />
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
          )}

          {/* Step 5: Amenities & Features */}
          {currentStep === 5 && (
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 flex items-center">
                  <InformationCircleIcon className="h-5 w-5 mr-2 text-blue-600" />
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
          )}

          {/* Step 6: Media & Documents */}
          {currentStep === 6 && (
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 flex items-center">
                  <PhotoIcon className="h-5 w-5 mr-2 text-blue-600" />
                  Media & Documents
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
          )}

          {/* Step 7: Review & Submit */}
          {currentStep === 7 && (
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 flex items-center">
                  <InformationCircleIcon className="h-5 w-5 mr-2 text-blue-600" />
                  Review & Submit
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
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            {currentStep < steps.length ? (
              <button
                type="button"
                onClick={nextStep}
                className="btn-primary"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="btn-primary"
              >
                {loading ? (
                  <div className="spinner mr-2"></div>
                ) : null}
                Create Property
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default PropertyForm;