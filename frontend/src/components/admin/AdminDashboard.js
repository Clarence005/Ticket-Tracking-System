import React, { useState, useEffect, useCallback } from 'react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import AdminLayout from './AdminLayout';
import TicketList from './TicketList';
import TicketDetails from './TicketDetails';
import axios from 'axios';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [stats, setStats] = useState(null);
  const [selectedTickets, setSelectedTickets] = useState([]);
  const [bulkActionLoading, setBulkActionLoading] = useState(false);
  const { adminUser } = useAdminAuth();

  const fetchTickets = useCallback(async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.get('/api/tickets', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setTickets(response.data);
      
      // Update selected ticket if it exists
      if (selectedTicket) {
        const updatedTicket = response.data.find(t => t._id === selectedTicket._id);
        if (updatedTicket) {
          setSelectedTicket(updatedTicket);
        }
      }
    } catch (error) {
      console.error('Error fetching tickets:', error);
      alert('Failed to fetch tickets');
    } finally {
      setLoading(false);
    }
  }, [selectedTicket]);

  const fetchStats = useCallback(async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.get('/api/tickets/stats/analytics', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  }, []);

  useEffect(() => {
    fetchTickets();
    fetchStats();
  }, [fetchTickets, fetchStats]);



  const handleBulkStatusChange = async (newStatus) => {
    if (selectedTickets.length === 0) return;
    
    setBulkActionLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      await Promise.all(
        selectedTickets.map(ticketId =>
          axios.put(`/api/tickets/${ticketId}/status`, 
            { status: newStatus },
            { headers: { 'Authorization': `Bearer ${token}` } }
          )
        )
      );
      
      await fetchTickets();
      setSelectedTickets([]);
      alert(`Successfully updated ${selectedTickets.length} tickets to ${newStatus}`);
    } catch (error) {
      console.error('Error updating tickets:', error);
      alert('Failed to update tickets');
    } finally {
      setBulkActionLoading(false);
    }
  };

  const handleSelectTicket = (ticketId) => {
    setSelectedTickets(prev => 
      prev.includes(ticketId) 
        ? prev.filter(id => id !== ticketId)
        : [...prev, ticketId]
    );
  };

  const handleExportPDF = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.get('/api/tickets/export/report/pdf', {
        headers: { 'Authorization': `Bearer ${token}` },
        responseType: 'blob'
      });
      
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `admin-tickets-report-${new Date().toISOString().split('T')[0]}.pdf`;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting PDF:', error);
      alert('Failed to export PDF');
    }
  };

  const filteredTickets = tickets.filter(ticket => {
    const statusMatch = statusFilter === 'all' || ticket.status === statusFilter;
    const priorityMatch = priorityFilter === 'all' || ticket.priority === priorityFilter;
    const searchMatch = searchQuery === '' || 
      ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (ticket.createdBy?.name && ticket.createdBy.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      ticket.ticketId.toString().includes(searchQuery);
    
    return statusMatch && priorityMatch && searchMatch;
  });

  const handleSelectAll = () => {
    if (selectedTickets.length === filteredTickets.length) {
      setSelectedTickets([]);
    } else {
      setSelectedTickets(filteredTickets.map(t => t._id));
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading admin dashboard...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="admin-dashboard-content">
        {/* Stats Overview */}
        {stats && (
          <div className="stats-overview">
            <div className="stat-card">
              <div className="stat-number">{stats.total}</div>
              <div className="stat-label">Total Tickets</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{stats.statusStats.open}</div>
              <div className="stat-label">Open</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{stats.statusStats['in-progress']}</div>
              <div className="stat-label">In Progress</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{stats.statusStats.resolved}</div>
              <div className="stat-label">Resolved</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{stats.avgResolutionTime}</div>
              <div className="stat-label">Avg Resolution (days)</div>
            </div>
          </div>
        )}

        {/* Tickets List */}
        <div className="tickets-container">
          <TicketList
            tickets={filteredTickets}
            selectedTickets={selectedTickets}
            onBulkSelectTicket={handleSelectTicket}
            onSelectAll={handleSelectAll}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            priorityFilter={priorityFilter}
            onPriorityFilterChange={setPriorityFilter}
            onExportPDF={handleExportPDF}
            onRefresh={fetchTickets}
            onBulkStatusChange={handleBulkStatusChange}
            bulkActionLoading={bulkActionLoading}
          />
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;