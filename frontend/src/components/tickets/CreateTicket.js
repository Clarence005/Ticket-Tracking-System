import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import TicketForm from './TicketForm';

const CreateTicket = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    setLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('/api/tickets', formData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('Ticket created:', response.data);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error creating ticket:', error);
      // Handle error - you might want to show a toast notification here
      alert(error.response?.data?.message || 'Failed to create ticket');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <button 
          onClick={() => navigate('/dashboard')} 
          className="back-btn"
        >
          ← Back to Dashboard
        </button>
      </div>
      
      <TicketForm
        title="Create New Ticket"
        onSubmit={handleSubmit}
        loading={loading}
        submitText="Create Ticket"
      />
    </div>
  );
};

export default CreateTicket;