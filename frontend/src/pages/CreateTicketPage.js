import React from 'react';
import CreateTicket from '../components/tickets/CreateTicket';
import Navbar from '../components/layout/Navbar';

const CreateTicketPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Create New Ticket</h1>
            <p className="text-gray-600">Submit a new support request or issue</p>
          </div>
          <CreateTicket />
        </div>
      </main>
    </div>
  );
};

export default CreateTicketPage;