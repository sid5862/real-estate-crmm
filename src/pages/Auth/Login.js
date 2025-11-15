import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  BuildingOfficeIcon, 
  EyeIcon, 
  EyeSlashIcon,
  CheckCircleIcon,
  XCircleIcon,
  SparklesIcon,
  HomeIcon,
  UserGroupIcon,
  ChartBarIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';
import { 
  BuildingOfficeIcon as BuildingOfficeSolid,
  HomeIcon as HomeSolid,
  UserGroupIcon as UserGroupSolid,
  ChartBarIcon as ChartBarSolid,
  CurrencyDollarIcon as CurrencyDollarSolid
} from '@heroicons/react/24/solid';
import toast from 'react-hot-toast';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [emailValid, setEmailValid] = useState(null);
  const [passwordValid, setPasswordValid] = useState(null);
  const [currentFeature, setCurrentFeature] = useState(0);
  const { login, user } = useAuth();
  const navigate = useNavigate();

  // Feature showcase data
  const features = [
    {
      icon: HomeSolid,
      title: "Property Management",
      description: "Manage your entire property portfolio with ease",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: UserGroupSolid,
      title: "Lead Tracking",
      description: "Convert more leads with our advanced CRM system",
      color: "from-green-500 to-green-600"
    },
    {
      icon: ChartBarSolid,
      title: "Analytics & Reports",
      description: "Make data-driven decisions with comprehensive insights",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: CurrencyDollarSolid,
      title: "Sales Pipeline",
      description: "Track deals and boost your sales performance",
      color: "from-orange-500 to-orange-600"
    }
  ];

  // Auto-rotate features
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [features.length]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Real-time validation
    if (name === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      setEmailValid(value.length > 0 ? emailRegex.test(value) : null);
    } else if (name === 'password') {
      setPasswordValid(value.length > 0 ? value.length >= 6 : null);
    }
  };

  const fillDemoCredentials = () => {
    setFormData({
      email: 'admin@realestate.com',
      password: 'admin123'
    });
    setEmailValid(true);
    setPasswordValid(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await login(formData.email, formData.password);
      
      if (result.success) {
        toast.success('Login successful!');
        // Redirect based on user role
        if (result.user && result.user.role === 'admin') {
          navigate('/dashboard');
        } else {
          // All employees go to profile
          navigate('/profile');
        }
      } else {
        console.error('Login failed:', result.error);
        toast.error(result.error || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Feature Showcase */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full animate-pulse"></div>
          <div className="absolute top-40 right-32 w-24 h-24 bg-white/5 rounded-full animate-bounce"></div>
          <div className="absolute bottom-32 left-32 w-40 h-40 bg-white/10 rounded-full animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 right-20 w-28 h-28 bg-white/5 rounded-full animate-bounce delay-500"></div>
        </div>

        {/* Feature Showcase */}
        <div className="relative z-10 flex flex-col justify-center items-center text-white p-12">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-6">
              <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm">
                <BuildingOfficeIcon className="h-12 w-12 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold mb-4">Real Estate CRM</h1>
            <p className="text-xl text-blue-100">Transform your real estate business</p>
          </div>

          {/* Feature Cards */}
          <div className="w-full max-w-md">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 transition-all duration-500">
              <div className="flex items-center mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-r ${features[currentFeature].color} mr-4`}>
                  {(() => {
                    const IconComponent = features[currentFeature].icon;
                    return <IconComponent className="h-6 w-6 text-white" />;
                  })()}
                </div>
                <h3 className="text-lg font-semibold">{features[currentFeature].title}</h3>
              </div>
              <p className="text-blue-100">{features[currentFeature].description}</p>
            </div>

            {/* Feature Indicators */}
            <div className="flex justify-center mt-6 space-x-2">
              {features.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentFeature(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentFeature ? 'bg-white' : 'bg-white/30'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
                <BuildingOfficeIcon className="h-8 w-8 text-white" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Real Estate CRM</h1>
          </div>

          {/* Login Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back</h2>
              <p className="text-gray-600">Sign in to continue to your dashboard</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                      emailValid === true 
                        ? 'border-green-300 bg-green-50' 
                        : emailValid === false 
                        ? 'border-red-300 bg-red-50' 
                        : 'border-gray-300'
                    }`}
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                  {emailValid !== null && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      {emailValid ? (
                        <CheckCircleIcon className="h-5 w-5 text-green-500" />
                      ) : (
                        <XCircleIcon className="h-5 w-5 text-red-500" />
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 pr-12 ${
                      passwordValid === true 
                        ? 'border-green-300 bg-green-50' 
                        : passwordValid === false 
                        ? 'border-red-300 bg-red-50' 
                        : 'border-gray-300'
                    }`}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                  {passwordValid !== null && (
                    <div className="absolute right-10 top-1/2 transform -translate-y-1/2">
                      {passwordValid ? (
                        <CheckCircleIcon className="h-5 w-5 text-green-500" />
                      ) : (
                        <XCircleIcon className="h-5 w-5 text-red-500" />
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Demo Credentials Button */}
              <div className="text-center">
                <button
                  type="button"
                  onClick={fillDemoCredentials}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center justify-center mx-auto"
                >
                  <SparklesIcon className="h-4 w-4 mr-1" />
                  Use Demo Credentials
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || emailValid === false || passwordValid === false}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 active:scale-95"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Signing In...
                  </div>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            {/* Demo Info */}
            <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
              <div className="flex items-start">
                <SparklesIcon className="h-5 w-5 text-blue-600 mt-0.5 mr-2" />
                <div>
                  <p className="text-sm font-medium text-blue-900">Demo Account</p>
                  <p className="text-xs text-blue-700 mt-1">
                    Email: admin@realestate.com<br />
                    Password: admin123
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
