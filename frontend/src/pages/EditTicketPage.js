import React from 'react';
import { useParams } from 'react-router-dom';
import EditTicket from '../components/tickets/EditTicket';
import Navbar from '../components/layout/Navbar';

const EditTicketPage = () => {
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Edit Ticket</h1>
            <p className="text-gray-600">Update your ticket information</p>
          </div>
          <EditTicket ticketId={id} />
        </div>
      </main>
    </div>
  );
};

export default EditTicketPage;