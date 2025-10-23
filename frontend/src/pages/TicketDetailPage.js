import React from 'react';
import { useParams } from 'react-router-dom';
import TicketDetail from '../components/tickets/TicketDetail';
import Navbar from '../components/layout/Navbar';

const TicketDetailPage = () => {
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <TicketDetail ticketId={id} />
        </div>
      </main>
    </div>
  );
};

export default TicketDetailPage;