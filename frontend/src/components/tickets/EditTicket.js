import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import TicketForm from './TicketForm';

const EditTicket = () => {
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    fetchTicket();
  }, [id]);

  const fetchTicket = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`/api/tickets/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setTicket(response.data);
    } catch (error) {
      console.error('Error fetching ticket:', error);
      alert('Failed to fetch ticket details');
      navigate('/dashboard');
    } finally {
      setFetchLoading(false);
    }
  };

  const handleSubmit = async (formData) => {
    setLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`/api/tickets/${id}`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('Ticket updated:', response.data);
      navigate(`/ticket/${id}`);
    } catch (error) {
      console.error('Error updating ticket:', error);
      alert(error.response?.data?.message || 'Failed to update ticket');
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="page-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading ticket details...</p>
        </div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="page-container">
        <div className="error-container">
          <h2>Ticket not found</h2>
          <button onClick={() => navigate('/dashboard')} className="btn btn-primary">
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <button 
          onClick={() => navigate(`/ticket/${id}`)} 
          className="back-btn"
        >
          ← Back to Ticket
        </button>
      </div>
      
      <TicketForm
        title={`Edit Ticket #${ticket.ticketId}`}
        initialData={ticket}
        onSubmit={handleSubmit}
        loading={loading}
        submitText="Update Ticket"
      />
    </div>
  );
};

export default EditTicket;