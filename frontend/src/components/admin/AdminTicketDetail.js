import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AdminLayout from './AdminLayout';
import './AdminTicketDetail.css';

const AdminTicketDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);

  useEffect(() => {
    fetchTicket();
  }, [id]);

  const fetchTicket = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.get(`/api/tickets/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setTicket(response.data);
    } catch (error) {
      console.error('Error fetching ticket:', error);
      if (error.response?.status === 404) {
        alert('Ticket not found');
        navigate('/admin/dashboard');
      } else {
        alert('Failed to fetch ticket details');
      }
    } finally {
      setLoading(false);
    }
  };

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

      // Refresh ticket data
      await fetchTicket();
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
      await fetchTicket();
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

  if (loading) {
    return (
      <AdminLayout>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading ticket details...</p>
        </div>
      </AdminLayout>
    );
  }

  if (!ticket) {
    return (
      <AdminLayout>
        <div className="error-container">
          <h2>Ticket Not Found</h2>
          <p>The requested ticket could not be found.</p>
          <button
            onClick={() => navigate('/admin/dashboard')}
            className="back-btn"
          >
            Back to Dashboard
          </button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="admin-ticket-detail">
        {/* Header with Back Button */}
        <div className="ticket-detail-header">
          <button
            onClick={() => navigate('/admin/dashboard')}
            className="back-btn"
          >
            ← Back to Dashboard
          </button>
          <div className="ticket-title-section">
            <h1>Ticket #{ticket.ticketId}</h1>
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
        </div>

        {/* Main Content */}
        <div className="ticket-detail-content">
          {/* Status Management */}
          <div className="status-management-section">
            <h3>Status Management</h3>
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

          {/* Ticket Information Grid */}
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
                  <label>Status:</label>
                  <span>{ticket.status}</span>
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
                  <span>{ticket.createdBy?.name || 'Unknown User'}</span>
                </div>
                <div className="info-item">
                  <label>Email:</label>
                  <span>{ticket.createdBy?.email || 'N/A'}</span>
                </div>
                <div className="info-item">
                  <label>Student ID:</label>
                  <span>{ticket.createdBy?.studentId || 'N/A'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="description-section">
            <h3>Description</h3>
            <div className="description-content">
              {ticket.description}
            </div>
          </div>

          {/* Comments Section */}
          <div className="comments-section">
            <h3>Comments & Responses ({ticket.comments?.length || 0})</h3>

            {/* Add Comment Form */}
            <form onSubmit={handleAddComment} className="comment-form">
              <h4>Add Admin Response</h4>
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Type your response to this ticket..."
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

            {/* Comments List */}
            <div className="comments-list">
              {ticket.comments?.length > 0 ? (
                ticket.comments.map((comment, index) => (
                  <div key={index} className="comment">
                    <div className="comment-header">
                      <div className="comment-author-info">
                        <span className="comment-author">
                          {comment.author?.name || 'Unknown User'}
                        </span>
                        <span className="comment-role">
                          {comment.author?.role === 'admin' ? '(Admin)' : '(User)'}
                        </span>
                      </div>
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
    </AdminLayout>
  );
};

export default AdminTicketDetail;