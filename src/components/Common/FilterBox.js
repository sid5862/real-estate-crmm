import React, { useState } from 'react';
import { 
  MagnifyingGlassIcon, 
  FunnelIcon, 
  XMarkIcon,
  AdjustmentsHorizontalIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  MapPinIcon,
  UserIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline';

const FilterBox = ({ 
  filters = {}, 
  onFiltersChange, 
  searchPlaceholder = "Search...",
  showAdvanced = true,
  customFilters = []
}) => {
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(filters.search || '');

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onFiltersChange({ ...filters, search: value });
  };

  const handleFilterChange = (key, value) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    setSearchTerm('');
    onFiltersChange({});
  };

  const hasActiveFilters = Object.keys(filters).length > 0 && Object.values(filters).some(v => v !== '' && v !== null && v !== undefined);

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200/50 p-6 mb-6">
      {/* Main Search and Quick Filters */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
        {/* Search Bar */}
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder={searchPlaceholder}
            className="w-full pl-10 pr-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-sm"
          />
        </div>

        {/* Quick Filter Buttons */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleFilterChange('date_range', filters.date_range === 'today' ? '' : 'today')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              filters.date_range === 'today' 
                ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Today
          </button>
          <button
            onClick={() => handleFilterChange('date_range', filters.date_range === 'this_week' ? '' : 'this_week')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              filters.date_range === 'this_week' 
                ? 'bg-purple-100 text-purple-700 border border-purple-200' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            This Week
          </button>
          <button
            onClick={() => handleFilterChange('date_range', filters.date_range === 'this_month' ? '' : 'this_month')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              filters.date_range === 'this_month' 
                ? 'bg-green-100 text-green-700 border border-green-200' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            This Month
          </button>
          <button
            onClick={() => handleFilterChange('date_range', filters.date_range === 'this_year' ? '' : 'this_year')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              filters.date_range === 'this_year' 
                ? 'bg-orange-100 text-orange-700 border border-orange-200' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            This Year
          </button>
        </div>

        {/* Advanced Filters Toggle */}
        {showAdvanced && (
          <button
            onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              isAdvancedOpen || hasActiveFilters
                ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <AdjustmentsHorizontalIcon className="h-4 w-4" />
            Advanced
            {hasActiveFilters && (
              <span className="bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {Object.keys(filters).filter(k => filters[k] !== '' && filters[k] !== null && filters[k] !== undefined).length}
              </span>
            )}
          </button>
        )}

        {/* Clear Filters */}
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 transition-all duration-200"
          >
            <XMarkIcon className="h-4 w-4" />
            Clear
          </button>
        )}
      </div>

      {/* Advanced Filters Panel */}
      {isAdvancedOpen && (
        <div className="mt-6 pt-6 border-t border-gray-200/50">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Date Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <CalendarIcon className="h-4 w-4 inline mr-1" />
                Date Range
              </label>
              <select
                value={filters.date_range || ''}
                onChange={(e) => handleFilterChange('date_range', e.target.value)}
                className="w-full px-3 py-2 bg-white/50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-sm"
              >
                <option value="">All Time</option>
                <option value="today">Today</option>
                <option value="yesterday">Yesterday</option>
                <option value="this_week">This Week</option>
                <option value="last_week">Last Week</option>
                <option value="this_month">This Month</option>
                <option value="last_month">Last Month</option>
                <option value="this_year">This Year</option>
              </select>
            </div>

            {/* Status - Only show if not using custom filters */}
            {customFilters.length === 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <UserIcon className="h-4 w-4 inline mr-1" />
                  Status
                </label>
                <select
                  value={filters.status || ''}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="w-full px-3 py-2 bg-white/50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-sm"
                >
                  <option value="">All Status</option>
                  <option value="available">Available</option>
                  <option value="sold">Sold</option>
                  <option value="rented">Rented</option>
                  <option value="leased">Leased</option>
                  <option value="upcoming">Upcoming</option>
                </select>
              </div>
            )}

            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <CurrencyDollarIcon className="h-4 w-4 inline mr-1" />
                Price Range
              </label>
              <select
                value={filters.price_range || ''}
                onChange={(e) => handleFilterChange('price_range', e.target.value)}
                className="w-full px-3 py-2 bg-white/50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-sm"
              >
                <option value="">All Prices</option>
                <option value="0-500000">₹0 - ₹5L</option>
                <option value="500000-1000000">₹5L - ₹10L</option>
                <option value="1000000-2500000">₹10L - ₹25L</option>
                <option value="2500000-5000000">₹25L - ₹50L</option>
                <option value="5000000+">₹50L+</option>
              </select>
            </div>

            {/* Property Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <BuildingOfficeIcon className="h-4 w-4 inline mr-1" />
                Property Type
              </label>
              <select
                value={filters.type || ''}
                onChange={(e) => handleFilterChange('type', e.target.value)}
                className="w-full px-3 py-2 bg-white/50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-sm"
              >
                <option value="">All Types</option>
                <option value="apartment">Apartment</option>
                <option value="house">House</option>
                <option value="villa">Villa</option>
                <option value="plot">Plot</option>
                <option value="commercial">Commercial</option>
              </select>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPinIcon className="h-4 w-4 inline mr-1" />
                Location
              </label>
              <input
                type="text"
                value={filters.location || ''}
                onChange={(e) => handleFilterChange('location', e.target.value)}
                placeholder="Enter location..."
                className="w-full px-3 py-2 bg-white/50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-sm"
              />
            </div>

            {/* Custom Filters */}
            {customFilters.map((filter, index) => (
              <div key={index}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {filter.icon && <filter.icon className="h-4 w-4 inline mr-1" />}
                  {filter.label}
                </label>
                {filter.type === 'select' ? (
                  <select
                    value={filters[filter.key] || ''}
                    onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                    className="w-full px-3 py-2 bg-white/50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-sm"
                  >
                    <option value="">All {filter.label}</option>
                    {filter.options?.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={filter.type || 'text'}
                    value={filters[filter.key] || ''}
                    onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                    placeholder={filter.placeholder}
                    className="w-full px-3 py-2 bg-white/50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-sm"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterBox;
