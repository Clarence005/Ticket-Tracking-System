import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { TicketCard } from '../tickets';
import './Dashboard.css';

const Dashboard = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/tickets', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setTickets(response.data);
    } catch (error) {
      console.error('Error fetching tickets:', error);
      alert('Failed to fetch tickets');
    } finally {
      setLoading(false);
    }
  };

  const getFilteredTickets = () => {
    let filtered = tickets;

    // Filter by status
    if (filter !== 'all') {
      filtered = filtered.filter(ticket => ticket.status === filter);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(ticket =>
        ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  };

  const getStatusCounts = () => {
    return {
      all: tickets.length,
      open: tickets.filter(t => t.status === 'open').length,
      'in-progress': tickets.filter(t => t.status === 'in-progress').length,
      resolved: tickets.filter(t => t.status === 'resolved').length,
      closed: tickets.filter(t => t.status === 'closed').length,
    };
  };

  const filteredTickets = getFilteredTickets();
  const statusCounts = getStatusCounts();

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="header-content">
          <h1>Welcome back, {user?.name}! 👋</h1>
          <p>Manage your tickets and track their progress</p>
        </div>
        <div className="header-actions">
          <Link to="/create-ticket" className="btn btn-primary">
            ➕ Create Ticket
          </Link>
          <Link to="/analytics" className="btn btn-outline">
            📊 Analytics
          </Link>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="quick-stats">
        <div className="stat-card">
          <div className="stat-number">{statusCounts.all}</div>
          <div className="stat-label">Total Tickets</div>
        </div>
        <div className="stat-card pending">
          <div className="stat-number">{statusCounts.open}</div>
          <div className="stat-label">Open</div>
        </div>
        <div className="stat-card in-progress">
          <div className="stat-number">{statusCounts['in-progress']}</div>
          <div className="stat-label">In Progress</div>
        </div>
        <div className="stat-card resolved">
          <div className="stat-number">{statusCounts.resolved}</div>
          <div className="stat-label">Resolved</div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="dashboard-controls">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search tickets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="filter-tabs">
          {Object.entries(statusCounts).map(([status, count]) => {
            const getStatusLabel = (status) => {
              switch (status) {
                case 'all': return 'All';
                case 'open': return 'Open';
                case 'in-progress': return 'In Progress';
                case 'resolved': return 'Resolved';
                case 'closed': return 'Closed';
                default: return status;
              }
            };
            
            return (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`filter-tab ${filter === status ? 'active' : ''}`}
              >
                {getStatusLabel(status)} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Tickets List */}
      <div className="tickets-section">
        {filteredTickets.length > 0 ? (
          <div className="tickets-grid">
            {filteredTickets.map(ticket => (
              <TicketCard key={ticket._id} ticket={ticket} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            {searchTerm || filter !== 'all' ? (
              <>
                <div className="empty-icon">🔍</div>
                <h3>No tickets found</h3>
                <p>Try adjusting your search or filter criteria</p>
                <button 
                  onClick={() => {
                    setSearchTerm('');
                    setFilter('all');
                  }}
                  className="btn btn-outline"
                >
                  Clear Filters
                </button>
              </>
            ) : (
              <>
                <div className="empty-icon">🎫</div>
                <h3>No tickets yet</h3>
                <p>Create your first ticket to get started</p>
                <Link to="/create-ticket" className="btn btn-primary">
                  Create Your First Ticket
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;