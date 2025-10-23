import React from 'react';
import Dashboard from '../components/dashboard/Dashboard';
import Navbar from '../components/layout/Navbar';

const DashboardPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="py-6">
        <Dashboard />
      </main>
    </div>
  );
};

export default DashboardPage;