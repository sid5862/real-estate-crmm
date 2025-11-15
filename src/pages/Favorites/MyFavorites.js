import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  HeartIcon,
  HeartIcon as HeartIconSolid,
  EyeIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  HomeIcon,
  BuildingOfficeIcon,
  CalendarIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';

const MyFavorites = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('date_added');

  // Mock data for now - will be replaced with API call
  const mockFavorites = [
    {
      id: 1,
      property: {
        id: 1,
        title: "Luxury Villa in Downtown",
        type: "Villa",
        price: 2500000,
        area: 2500,
        bedrooms: 4,
        bathrooms: 3,
        location: "Downtown, City Center",
        image: "/api/placeholder/400/300",
        created_at: "2024-01-15T10:30:00Z"
      },
      added_at: "2024-01-20T14:30:00Z"
    },
    {
      id: 2,
      property: {
        id: 2,
        title: "Modern Apartment Complex",
        type: "Apartment",
        price: 850000,
        area: 1200,
        bedrooms: 2,
        bathrooms: 2,
        location: "Suburban Area",
        image: "/api/placeholder/400/300",
        created_at: "2024-01-10T09:15:00Z"
      },
      added_at: "2024-01-18T16:45:00Z"
    }
  ];

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/favorites', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setFavorites(data.favorites);
      } else {
        console.error('Failed to fetch favorites');
        toast.error('Failed to load favorites');
      }
    } catch (error) {
      console.error('Error fetching favorites:', error);
      toast.error('Failed to load favorites');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavorite = async (propertyId) => {
    try {
      const response = await fetch(`/api/favorites/${propertyId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        setFavorites(favorites.filter(fav => fav.property_id !== propertyId));
        toast.success('Removed from favorites');
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Failed to remove from favorites');
      }
    } catch (error) {
      console.error('Error removing favorite:', error);
      toast.error('Failed to remove from favorites');
    }
  };

  const filteredFavorites = favorites.filter(favorite => {
    const property = favorite.property;
    const matchesSearch = property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         property.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === 'all' || property.type.toLowerCase() === filterType.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  const sortedFavorites = [...filteredFavorites].sort((a, b) => {
    switch (sortBy) {
      case 'price_asc':
        return a.property.price - b.property.price;
      case 'price_desc':
        return b.property.price - a.property.price;
      case 'date_added':
        return new Date(b.added_at) - new Date(a.added_at);
      case 'area':
        return b.property.area - a.property.area;
      default:
        return 0;
    }
  });

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getTimeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="h-48 bg-gray-200"></div>
                  <div className="p-4">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <HeartIconSolid className="h-8 w-8 text-red-500 mr-3" />
                My Favorites
              </h1>
              <p className="text-gray-600 mt-2">
                {favorites.length} {favorites.length === 1 ? 'property' : 'properties'} saved
              </p>
            </div>
            <button
              onClick={() => navigate('/properties')}
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg transition-all duration-200 flex items-center space-x-2 shadow-md hover:shadow-lg"
            >
              <BuildingOfficeIcon className="h-4 w-4" />
              <span>Browse Properties</span>
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search favorites..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Filters */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <FunnelIcon className="h-5 w-5 text-gray-400" />
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Types</option>
                  <option value="villa">Villa</option>
                  <option value="apartment">Apartment</option>
                  <option value="house">House</option>
                  <option value="commercial">Commercial</option>
                </select>
              </div>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="date_added">Recently Added</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="area">Largest Area</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results */}
        {sortedFavorites.length === 0 ? (
          <div className="text-center py-12">
            <HeartIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchQuery || filterType !== 'all' ? 'No matching favorites' : 'No favorites yet'}
            </h3>
            <p className="text-gray-500 mb-6">
              {searchQuery || filterType !== 'all' 
                ? 'Try adjusting your search or filters'
                : 'Start exploring properties and add them to your favorites'
              }
            </p>
            <button
              onClick={() => navigate('/properties')}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
            >
              Browse Properties
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedFavorites.map((favorite) => (
              <div
                key={favorite.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-200 group"
              >
                {/* Property Image */}
                <div className="relative h-48 bg-gray-200">
                  <img
                    src={favorite.property.image}
                    alt={favorite.property.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                  <div className="absolute top-3 right-3">
                    <button
                      onClick={() => handleRemoveFavorite(favorite.property_id)}
                      className="p-2 bg-white/90 hover:bg-white rounded-full shadow-md transition-all duration-200"
                      title="Remove from favorites"
                    >
                      <HeartIconSolid className="h-5 w-5 text-red-500" />
                    </button>
                  </div>
                  <div className="absolute bottom-3 left-3">
                    <span className="px-2 py-1 bg-blue-500 text-white text-xs font-medium rounded-full">
                      {favorite.property.type}
                    </span>
                  </div>
                </div>

                {/* Property Details */}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                      {favorite.property.title}
                    </h3>
                  </div>

                  <div className="flex items-center text-gray-600 mb-3">
                    <MapPinIcon className="h-4 w-4 mr-1 flex-shrink-0" />
                    <span className="text-sm truncate">{favorite.property.location}</span>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <HomeIcon className="h-4 w-4 mr-1" />
                        <span>{favorite.property.bedrooms} bed</span>
                      </div>
                      <div className="flex items-center">
                        <span>{favorite.property.bathrooms} bath</span>
                      </div>
                      <div className="flex items-center">
                        <span>{favorite.property.area} sq ft</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold text-gray-900">
                      {formatPrice(favorite.property.price)}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Link
                        to={`/properties/${favorite.property.id}`}
                        className="p-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors duration-200"
                        title="View Details"
                      >
                        <EyeIcon className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Added {getTimeAgo(favorite.added_at)}</span>
                      <span>Listed {getTimeAgo(favorite.property.created_at)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyFavorites;
