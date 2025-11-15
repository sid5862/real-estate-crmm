import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import Layout from './components/Layout/Layout';
import ProtectedRoute from './components/Common/ProtectedRoute';
import Login from './pages/Auth/Login';
import Properties from './pages/Properties/Properties';
import PropertyForm from './pages/Properties/PropertyForm';
import PropertyEditForm from './pages/Properties/PropertyEditForm';
import PropertyDetails from './pages/Properties/PropertyDetails';
import Leads from './pages/Leads/Leads';
import LeadForm from './pages/Leads/LeadForm';
import LeadDetails from './pages/Leads/LeadDetails';
import Employees from './pages/Employees/Employees';
import EmployeeForm from './pages/Employees/EmployeeForm';
import PostSales from './pages/PostSales/PostSales';
import PostSaleDetails from './pages/PostSales/PostSaleDetails';
import Reports from './pages/Reports/Reports';
import Settings from './pages/Settings/Settings';
import ProfileWrapper from './components/Common/ProfileWrapper';
import DashboardWrapper from './components/Common/DashboardWrapper';
import RootRedirect from './components/Common/RootRedirect';
import MyFavorites from './pages/Favorites/MyFavorites';


// Public Route Component (redirect to dashboard if already logged in)
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }
  
  return user ? <Navigate to="/dashboard" /> : children;
};

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <Router>
        <div className="App">
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
            }}
          />
          
          <Routes>
            {/* Public Routes */}
            <Route 
              path="/login" 
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              } 
            />
            
            {/* Protected Routes */}
            <Route 
              path="/" 
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route index element={<RootRedirect />} />
              <Route path="dashboard" element={
                <ProtectedRoute requiredTab="dashboard">
                  <DashboardWrapper />
                </ProtectedRoute>
              } />
              
              {/* Properties Routes */}
              <Route path="properties" element={
                <ProtectedRoute requiredTab="properties">
                  <Properties />
                </ProtectedRoute>
              } />
              <Route path="properties/new" element={
                <ProtectedRoute requiredTab="properties">
                  <PropertyForm />
                </ProtectedRoute>
              } />
              <Route path="properties/:id" element={
                <ProtectedRoute requiredTab="properties">
                  <PropertyDetails />
                </ProtectedRoute>
              } />
              <Route path="properties/:id/edit" element={
                <ProtectedRoute requiredTab="properties">
                  <PropertyEditForm />
                </ProtectedRoute>
              } />
              
              {/* Leads Routes */}
              <Route path="leads" element={
                <ProtectedRoute requiredTab="leads">
                  <Leads />
                </ProtectedRoute>
              } />
              <Route path="leads/new" element={
                <ProtectedRoute requiredTab="leads">
                  <LeadForm />
                </ProtectedRoute>
              } />
              <Route path="leads/:id" element={
                <ProtectedRoute requiredTab="leads">
                  <LeadDetails />
                </ProtectedRoute>
              } />
              <Route path="leads/:id/edit" element={
                <ProtectedRoute requiredTab="leads">
                  <LeadForm />
                </ProtectedRoute>
              } />
              
              {/* Employees Routes */}
              <Route path="employees" element={
                <ProtectedRoute requiredTab="employees">
                  <Employees />
                </ProtectedRoute>
              } />
              <Route path="employees/new" element={
                <ProtectedRoute requiredTab="employees">
                  <EmployeeForm />
                </ProtectedRoute>
              } />
              <Route path="employees/:id/edit" element={
                <ProtectedRoute requiredTab="employees">
                  <EmployeeForm />
                </ProtectedRoute>
              } />
              
              {/* Post Sales Routes */}
              <Route path="post-sales" element={
                <ProtectedRoute requiredTab="post_sales">
                  <PostSales />
                </ProtectedRoute>
              } />
              <Route path="post-sales/:id" element={
                <ProtectedRoute requiredTab="post_sales">
                  <PostSaleDetails />
                </ProtectedRoute>
              } />
              
              {/* Reports Routes */}
              <Route path="reports" element={
                <ProtectedRoute requiredTab="reports">
                  <Reports />
                </ProtectedRoute>
              } />
              
              {/* Settings Routes */}
              <Route path="settings" element={
                <ProtectedRoute requiredTab="settings">
                  <Settings />
                </ProtectedRoute>
              } />
              <Route path="profile" element={<ProfileWrapper />} />
              
              {/* Favorites Routes */}
              <Route path="favorites" element={
                <ProtectedRoute requiredTab="properties">
                  <MyFavorites />
                </ProtectedRoute>
              } />
            </Route>
            
            {/* Catch all route */}
            <Route path="*" element={<RootRedirect />} />
          </Routes>
        </div>
        </Router>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
