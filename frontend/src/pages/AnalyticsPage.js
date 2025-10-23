import React from 'react';
import Analytics from '../components/analytics/Analytics';
import Navbar from '../components/layout/Navbar';

const AnalyticsPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">📊 Analytics & Reports</h1>
            <p className="text-gray-600">View ticket statistics and generate reports</p>
          </div>
          <Analytics />
        </div>
      </main>
    </div>
  );
};

export default AnalyticsPage;