const express = require('express');
const { auth, adminAuth } = require('../middleware/auth');
const {
  getTickets,
  getTicketById,
  createTicket,
  updateTicket,
  updateTicketStatus,
  addComment,
  exportTicketsReportPDF,
  getTicketAnalytics
} = require('../controllers/ticketController');
const { ticketValidation } = require('../utils/validation');

const router = express.Router();

// @route   GET /api/tickets
// @desc    Get all tickets (filtered by user role)
// @access  Private
router.get('/', auth, getTickets);

// @route   GET /api/tickets/stats/analytics
// @desc    Get ticket statistics for charts
// @access  Private
router.get('/stats/analytics', auth, getTicketAnalytics);

// @route   GET /api/tickets/export/report/pdf
// @desc    Export tickets report as PDF
// @access  Private
router.get('/export/report/pdf', auth, exportTicketsReportPDF);

// @route   GET /api/tickets/:id
// @desc    Get single ticket by ID
// @access  Private
router.get('/:id', auth, getTicketById);

// @route   POST /api/tickets
// @desc    Create new ticket
// @access  Private
router.post('/', auth, ticketValidation.create, createTicket);

// @route   PUT /api/tickets/:id
// @desc    Update ticket (students can only update their own tickets)
// @access  Private
router.put('/:id', auth, ticketValidation.update, updateTicket);

// @route   PUT /api/tickets/:id/status
// @desc    Update ticket status (admin only)
// @access  Private (Admin)
router.put('/:id/status', [auth, adminAuth], updateTicketStatus);



// @route   POST /api/tickets/:id/comments
// @desc    Add comment to ticket
// @access  Private
router.post('/:id/comments', auth, ticketValidation.comment, addComment);



module.exports = router;