import React from 'react';
import { useNavigate } from 'react-router-dom';
import './TicketCard.css';

const TicketCard = ({ 
  ticket, 
  isBulkSelected, 
  onBulkSelect 
}) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/admin/ticket/${ticket._id}`);
  };
  const getStatusColor = (status) => {
    switch (status) {
      case 'open': return '#ffc107';
      case 'in-progress': return '#007bff';
      case 'resolved': return '#28a745';
      case 'closed': return '#6c757d';
      default: return '#6c757d';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Low': return '#17a2b8';
      case 'Medium': return '#ffc107';
      case 'High': return '#fd7e14';
      case 'Critical': return '#dc3545';
      default: return '#6c757d';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={`ticket-card ${isBulkSelected ? 'bulk-selected' : ''}`}>
      <div className="ticket-checkbox">
        <input
          type="checkbox"
          checked={isBulkSelected}
          onChange={(e) => {
            e.stopPropagation();
            onBulkSelect();
          }}
        />
      </div>
      
      <div className="ticket-content" onClick={handleCardClick}>
        <div className="ticket-header">
          <span className="ticket-id">#{ticket.ticketId}</span>
          <div className="ticket-badges">
            <span 
              className="status-badge" 
              style={{ backgroundColor: getStatusColor(ticket.status) }}
            >
              {ticket.status}
            </span>
            <span 
              className="priority-badge" 
              style={{ backgroundColor: getPriorityColor(ticket.priority) }}
            >
              {ticket.priority}
            </span>
          </div>
        </div>
        
        <h3 className="ticket-title">{ticket.title}</h3>
        
        <div className="ticket-meta">
          <div className="meta-item">
            <span className="meta-label">By:</span>
            <span className="meta-value">{ticket.createdBy?.name || 'Unknown User'}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">Category:</span>
            <span className="meta-value">{ticket.category}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">Created:</span>
            <span className="meta-value">{formatDate(ticket.createdAt)}</span>
          </div>
          {ticket.comments && ticket.comments.length > 0 && (
            <div className="meta-item">
              <span className="meta-label">Comments:</span>
              <span className="meta-value">{ticket.comments.length}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TicketCard;