import React from 'react';
import { AdminAuthProvider } from '../context/AdminAuthContext';
import AdminProtectedRoute from '../components/admin/AdminProtectedRoute';
import AdminDashboard from '../components/admin/AdminDashboard';

const AdminDashboardPage = () => {
  return (
    <AdminAuthProvider>
      <AdminProtectedRoute>
        <AdminDashboard />
      </AdminProtectedRoute>
    </AdminAuthProvider>
  );
};

export default AdminDashboardPage;