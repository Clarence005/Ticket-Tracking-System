import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import './TicketDetail.css';

const TicketDetail = () => {
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

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
      setLoading(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setCommentLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`/api/tickets/${id}/comments`, 
        { text: commentText },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      // Refresh ticket to get updated comments
      await fetchTicket();
      setCommentText('');
    } catch (error) {
      console.error('Error adding comment:', error);
      alert('Failed to add comment');
    } finally {
      setCommentLoading(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    setStatusLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.put(`/api/tickets/${id}/status`, 
        { status: newStatus },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      // Refresh ticket to get updated status
      await fetchTicket();
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
    } finally {
      setStatusLoading(false);
    }
  };

  const handleExportPDF = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`/api/tickets/${id}/export/pdf`, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        responseType: 'blob'
      });
      
      // Create blob link to download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `ticket-${ticket.ticketId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error exporting PDF:', error);
      alert('Failed to export PDF');
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
        <button onClick={() => navigate('/dashboard')} className="back-btn">
          ← Back to Dashboard
        </button>
        <div className="header-actions">
          <button onClick={handleExportPDF} className="btn btn-outline">
            📄 Export PDF
          </button>
          {user?.role === 'student' && ticket.createdBy._id === user.id && (
            <Link to={`/edit-ticket/${id}`} className="btn btn-primary">
              ✏️ Edit Ticket
            </Link>
          )}
        </div>
      </div>

      <div className="ticket-detail-container">
        <div className="ticket-header">
          <div className="ticket-title-section">
            <h1>{ticket.title}</h1>
            <div className="ticket-meta">
              <span className="ticket-id">#{ticket.ticketId}</span>
              <span className="ticket-date">Created {formatDate(ticket.createdAt)}</span>
            </div>
          </div>
          
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

        <div className="ticket-content">
          <div className="ticket-info-grid">
            <div className="info-item">
              <label>Category</label>
              <span>{ticket.category}</span>
            </div>
            <div className="info-item">
              <label>Created by</label>
              <span>{ticket.createdBy.name} ({ticket.createdBy.studentId})</span>
            </div>
            <div className="info-item">
              <label>Last Updated</label>
              <span>{formatDate(ticket.updatedAt)}</span>
            </div>
            {ticket.resolvedAt && (
              <div className="info-item">
                <label>Resolved</label>
                <span>{formatDate(ticket.resolvedAt)}</span>
              </div>
            )}
          </div>

          <div className="ticket-description">
            <h3>Description</h3>
            <div className="description-content">
              {ticket.description}
            </div>
          </div>

          {user?.role === 'admin' && (
            <div className="admin-actions">
              <h3>Admin Actions</h3>
              <div className="status-buttons">
                {['Pending', 'In Progress', 'Resolved', 'Closed'].map(status => (
                  <button
                    key={status}
                    onClick={() => handleStatusChange(status)}
                    disabled={statusLoading || ticket.status === status}
                    className={`status-btn ${ticket.status === status ? 'active' : ''}`}
                    style={{ 
                      backgroundColor: ticket.status === status ? getStatusColor(status) : '#f8f9fa',
                      color: ticket.status === status ? 'white' : '#333'
                    }}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="comments-section">
            <h3>Comments ({ticket.comments?.length || 0})</h3>
            
            <form onSubmit={handleAddComment} className="comment-form">
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Add a comment..."
                rows={3}
                maxLength={500}
                className="comment-input"
              />
              <div className="comment-form-footer">
                <span className="char-count">{commentText.length}/500</span>
                <button 
                  type="submit" 
                  disabled={!commentText.trim() || commentLoading}
                  className="btn btn-primary"
                >
                  {commentLoading ? 'Adding...' : 'Add Comment'}
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
                  No comments yet. Be the first to add one!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketDetail;