import React, { useState } from 'react';
import axios from 'axios';
import './TicketDetails.css';

const TicketDetails = ({ ticket, onTicketUpdate }) => {
  const [commentText, setCommentText] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);

  const handleStatusChange = async (newStatus) => {
    setStatusLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      await axios.put(`/api/tickets/${ticket._id}/status`,
        { status: newStatus },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      onTicketUpdate();
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update ticket status');
    } finally {
      setStatusLoading(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setCommentLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      await axios.post(`/api/tickets/${ticket._id}/comments`,
        { text: commentText },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      setCommentText('');
      onTicketUpdate();
    } catch (error) {
      console.error('Error adding comment:', error);
      alert('Failed to add comment');
    } finally {
      setCommentLoading(false);
    }
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

  if (!ticket) {
    return (
      <div className="ticket-details-container">
        <div className="no-selection">
          <div className="no-selection-icon">🎫</div>
          <h2>Select a Ticket</h2>
          <p>Choose a ticket from the list to view details and manage it.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="ticket-details-container">
      <div className="ticket-details-header">
        <div className="ticket-info-header">
          <h2>Ticket #{ticket.ticketId}</h2>
          <div className="ticket-status-badges">
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

        <div className="status-actions">
          <label>Update Status:</label>
          <div className="status-buttons">
            {[
              { label: 'Open', value: 'open' },
              { label: 'In Progress', value: 'in-progress' },
              { label: 'Resolved', value: 'resolved' },
              { label: 'Closed', value: 'closed' }
            ].map(({ label, value }) => (
              <button
                key={value}
                onClick={() => handleStatusChange(value)}
                disabled={statusLoading || ticket.status === value}
                className={`status-btn ${ticket.status === value ? 'active' : ''}`}
                style={{
                  backgroundColor: ticket.status === value ? getStatusColor(value) : '#f8f9fa',
                  color: ticket.status === value ? 'white' : '#333'
                }}
              >
                {statusLoading && ticket.status === value ? 'Updating...' : label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="ticket-details-content">
        <div className="ticket-info-grid">
          <div className="info-section">
            <h3>Ticket Information</h3>
            <div className="info-items">
              <div className="info-item">
                <label>Title:</label>
                <span>{ticket.title}</span>
              </div>
              <div className="info-item">
                <label>Category:</label>
                <span>{ticket.category}</span>
              </div>
              <div className="info-item">
                <label>Priority:</label>
                <span>{ticket.priority}</span>
              </div>
              <div className="info-item">
                <label>Created:</label>
                <span>{formatDate(ticket.createdAt)}</span>
              </div>
              {ticket.resolvedAt && (
                <div className="info-item">
                  <label>Resolved:</label>
                  <span>{formatDate(ticket.resolvedAt)}</span>
                </div>
              )}
            </div>
          </div>

          <div className="user-section">
            <h3>User Information</h3>
            <div className="info-items">
              <div className="info-item">
                <label>Name:</label>
                <span>{ticket.createdBy.name}</span>
              </div>
              <div className="info-item">
                <label>Email:</label>
                <span>{ticket.createdBy.email}</span>
              </div>
              <div className="info-item">
                <label>Student ID:</label>
                <span>{ticket.createdBy.studentId}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="description-section">
          <h3>Description</h3>
          <div className="description-content">
            {ticket.description}
          </div>
        </div>

        <div className="comments-section">
          <h3>Comments ({ticket.comments?.length || 0})</h3>

          <form onSubmit={handleAddComment} className="comment-form">
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Add your response to this ticket..."
              rows={4}
              maxLength={500}
              className="comment-input"
              required
            />
            <div className="comment-form-footer">
              <span className="char-count">{commentText.length}/500</span>
              <button
                type="submit"
                disabled={!commentText.trim() || commentLoading}
                className="comment-submit-btn"
              >
                {commentLoading ? 'Adding Response...' : 'Add Response'}
              </button>
            </div>
          </form>

          <div className="comments-list">
            {ticket.comments?.length > 0 ? (
              ticket.comments.map((comment, index) => (
                <div key={index} className="comment">
                  <div className="comment-header">
                    <span className="comment-author">{comment.author.name}</span>
                    <span className="comment-date">{formatDate(comment.createdAt)}</span>
                  </div>
                  <div className="comment-text">{comment.text}</div>
                </div>
              ))
            ) : (
              <div className="no-comments">
                <p>No comments yet. Be the first to respond to this ticket!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketDetails;