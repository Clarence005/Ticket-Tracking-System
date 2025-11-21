import React from 'react';
import TicketCard from './TicketCard';
import './TicketList.css';

const TicketList = ({
  tickets,
  selectedTickets,
  onBulkSelectTicket,
  onSelectAll,
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  priorityFilter,
  onPriorityFilterChange,
  onExportPDF,
  onRefresh,
  onBulkStatusChange,
  bulkActionLoading
}) => {
  return (
    <div className="ticket-list-container">
      <div className="ticket-list-header">
        <h2>All Tickets ({tickets.length})</h2>

        {/* Search and Filters */}
        <div className="ticket-controls">
          <div className="search-section">
            <input
              type="text"
              placeholder="Search tickets..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="filter-section">
            <select
              value={statusFilter}
              onChange={(e) => onStatusFilterChange(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Status</option>
              <option value="open">Open</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>

            <select
              value={priorityFilter}
              onChange={(e) => onPriorityFilterChange(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Priority</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </select>
          </div>

          <div className="action-section">
            <button onClick={onExportPDF} className="action-btn">
              📄 Export PDF
            </button>
            <button onClick={onRefresh} className="action-btn">
              🔄 Refresh
            </button>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedTickets.length > 0 && (
          <div className="bulk-actions">
            <div className="bulk-info">
              {selectedTickets.length} ticket(s) selected
            </div>
            <div className="bulk-buttons">
              <button
                onClick={() => onBulkStatusChange('open')}
                disabled={bulkActionLoading}
                className="bulk-btn open"
              >
                Mark Open
              </button>
              <button
                onClick={() => onBulkStatusChange('in-progress')}
                disabled={bulkActionLoading}
                className="bulk-btn in-progress"
              >
                Mark In Progress
              </button>
              <button
                onClick={() => onBulkStatusChange('resolved')}
                disabled={bulkActionLoading}
                className="bulk-btn resolved"
              >
                Mark Resolved
              </button>
              <button
                onClick={() => onBulkStatusChange('closed')}
                disabled={bulkActionLoading}
                className="bulk-btn closed"
              >
                Mark Closed
              </button>
            </div>
          </div>
        )}

        {/* Select All */}
        <div className="select-all-section">
          <label className="select-all-label">
            <input
              type="checkbox"
              checked={selectedTickets.length === tickets.length && tickets.length > 0}
              onChange={onSelectAll}
            />
            Select All ({tickets.length})
          </label>
        </div>
      </div>

      {/* Tickets List */}
      <div className="tickets-scroll-container">
        {tickets.length > 0 ? (
          tickets.map(ticket => (
            <TicketCard
              key={ticket._id}
              ticket={ticket}
              isBulkSelected={selectedTickets.includes(ticket._id)}
              onBulkSelect={() => onBulkSelectTicket(ticket._id)}
            />
          ))
        ) : (
          <div className="no-tickets">
            <p>No tickets found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TicketList;