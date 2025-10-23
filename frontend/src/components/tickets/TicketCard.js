import React from 'react';
import { Link } from 'react-router-dom';
import './TicketCard.css';

const TicketCard = ({ ticket }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return '#ffc107';
      case 'In Progress': return '#007bff';
      case 'Resolved': return '#28a745';
      case 'Closed': return '#6c757d';
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
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="ticket-card">
      <div className="ticket-card-header">
        <div className="ticket-id">#{ticket.ticketId}</div>
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
      
      <div className="ticket-card-body">
        <h3 className="ticket-title">{ticket.title}</h3>
        <p className="ticket-description">
          {ticket.description.length > 100 
            ? `${ticket.description.substring(0, 100)}...` 
            : ticket.description
          }
        </p>
        
        <div className="ticket-meta">
          <div className="ticket-category">
            <i className="icon-category"></i>
            {ticket.category}
          </div>
          <div className="ticket-date">
            <i className="icon-calendar"></i>
            {formatDate(ticket.createdAt)}
          </div>
        </div>
      </div>
      
      <div className="ticket-card-footer">
        <div className="ticket-author">
          Created by: {ticket.createdBy?.name}
        </div>
        <Link to={`/ticket/${ticket._id}`} className="view-ticket-btn">
          View Details
        </Link>
      </div>
    </div>
  );
};

export default TicketCard;