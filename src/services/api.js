import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.status, error.response?.data);
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API endpoints
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (profileData) => api.put('/auth/profile', profileData),
  changePassword: (passwordData) => api.post('/auth/change-password', passwordData),
  getUsers: () => api.get('/auth/users'),
  updateUser: (userId, userData) => api.put(`/auth/users/${userId}`, userData),
};

export const propertiesAPI = {
  getProperties: (params) => api.get('/properties', { params }),
  getProperty: (id) => api.get(`/properties/${id}`),
  createProperty: (propertyData) => api.post('/properties', propertyData),
  updateProperty: (id, propertyData) => api.put(`/properties/${id}`, propertyData),
  deleteProperty: (id) => api.delete(`/properties/${id}`),
  getPropertyTypes: () => api.get('/properties/types'),
  getLocations: () => api.get('/properties/locations'),
  getWebsiteVisible: () => api.get('/properties/website-visible'),
  bulkUpload: (propertiesData) => api.post('/properties/bulk-upload', propertiesData),
};

export const leadsAPI = {
  getLeads: (params) => api.get('/leads', { params }),
  getLead: (id) => api.get(`/leads/${id}`),
  createLead: (leadData) => api.post('/leads', leadData),
  updateLead: (id, leadData) => api.put(`/leads/${id}`, leadData),
  deleteLead: (id) => api.delete(`/leads/${id}`),
  addCommunication: (leadId, communicationData) => api.post(`/leads/${leadId}/communications`, communicationData),
  getStages: () => api.get('/leads/stages'),
  getSources: () => api.get('/leads/sources'),
  getPipeline: () => api.get('/leads/pipeline'),
  createFromWebsite: (leadData) => api.post('/leads/website-form', leadData),
  getLeadsForProperty: (propertyId, params) => api.get(`/leads/property/${propertyId}`, { params }),
};

export const employeesAPI = {
  getEmployees: (params) => api.get('/employees', { params }),
  getEmployee: (id) => api.get(`/employees/${id}`),
  createEmployee: (employeeData) => api.post('/employees', employeeData),
  updateEmployee: (id, employeeData) => api.put(`/employees/${id}`, employeeData),
  deleteEmployee: (id) => api.delete(`/employees/${id}`),
  getPerformance: (id) => api.get(`/employees/${id}/performance`),
  getRoles: () => api.get('/employees/roles'),
  getEmployeeLeads: (id, params) => api.get(`/employees/${id}/leads`, { params }),
  getEmployeeProperties: (id, params) => api.get(`/employees/${id}/properties`, { params }),
};

export const postSalesAPI = {
  getPostSales: (params) => api.get('/post-sales', { params }),
  getPostSale: (id) => api.get(`/post-sales/${id}`),
  createPostSale: (postSaleData) => api.post('/post-sales', postSaleData),
  updatePostSale: (id, postSaleData) => api.put(`/post-sales/${id}`, postSaleData),
  addPayment: (postSaleId, paymentData) => api.post(`/post-sales/${postSaleId}/payments`, paymentData),
  updatePayment: (postSaleId, paymentId, paymentData) => api.put(`/post-sales/${postSaleId}/payments/${paymentId}`, paymentData),
  createSupportTicket: (postSaleId, ticketData) => api.post(`/post-sales/${postSaleId}/support-tickets`, ticketData),
  updateSupportTicket: (postSaleId, ticketId, ticketData) => api.put(`/post-sales/${postSaleId}/support-tickets/${ticketId}`, ticketData),
  getPaymentTypes: () => api.get('/post-sales/payment-types'),
};

export const reportsAPI = {
  getDashboard: (params) => api.get('/reports/dashboard', { params }),
  getSalesPerformance: (params) => api.get('/reports/sales-performance', { params }),
  getLeadSources: () => api.get('/reports/lead-sources'),
  getEmployeeProductivity: (params) => api.get('/reports/employee-productivity', { params }),
  getInventory: () => api.get('/reports/inventory'),
  getLeads: () => api.get('/reports/leads'),
  generateCustom: (reportData) => api.post('/reports/custom', reportData),
};

export const dashboardAPI = {
  getOverview: (params) => api.get('/dashboard/overview', { params }),
  getNotifications: () => api.get('/dashboard/notifications'),
  getSalesPerformanceChart: (params) => api.get('/dashboard/charts/sales-performance', { params }),
  getLeadSourcesChart: () => api.get('/dashboard/charts/lead-sources'),
  getEmployeeProductivityChart: (params) => api.get('/dashboard/charts/employee-productivity', { params }),
  getQuickActions: () => api.get('/dashboard/quick-actions'),
};

export const shortcodesAPI = {
  getShortcodes: () => api.get('/shortcodes'),
  createShortcode: (shortcodeData) => api.post('/shortcodes', shortcodeData),
  updateShortcode: (id, shortcodeData) => api.put(`/shortcodes/${id}`, shortcodeData),
  deleteShortcode: (id) => api.delete(`/shortcodes/${id}`),
  getEmbedData: (shortcode) => api.get(`/embed/${shortcode}`),
  getEmbedWidget: (shortcode) => api.get(`/embed/${shortcode}/widget`),
};

export const notificationsAPI = {
  getNotifications: (params) => api.get('/notifications', { params }),
  markAsRead: (notificationId) => api.put(`/notifications/${notificationId}/read`),
  markAllAsRead: () => api.put('/notifications/mark-all-read'),
  deleteNotification: (notificationId) => api.delete(`/notifications/${notificationId}`),
  getFollowUpReminders: () => api.get('/notifications/follow-up-reminders'),
};

export default api;
