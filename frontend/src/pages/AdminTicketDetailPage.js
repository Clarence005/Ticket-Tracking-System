import React from 'react';
import { AdminAuthProvider } from '../context/AdminAuthContext';
import AdminProtectedRoute from '../components/admin/AdminProtectedRoute';
import AdminTicketDetail from '../components/admin/AdminTicketDetail';

const AdminTicketDetailPage = () => {
  return (
    <AdminAuthProvider>
      <AdminProtectedRoute>
        <AdminTicketDetail />
      </AdminProtectedRoute>
    </AdminAuthProvider>
  );
};

export default AdminTicketDetailPage;