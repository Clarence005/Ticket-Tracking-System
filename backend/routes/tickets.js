const express = require('express');
const { auth, adminAuth, checkAdminPermission, flexibleAuth } = require('../middleware/auth');
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
// @desc    Get tickets (users see their own, admins see all)
// @access  Private (User/Admin)
router.get('/', flexibleAuth, getTickets);

// @route   GET /api/tickets/stats/analytics
// @desc    Get ticket statistics for charts
// @access  Private (User/Admin)
router.get('/stats/analytics', flexibleAuth, getTicketAnalytics);

// @route   GET /api/tickets/export/report/pdf
// @desc    Export tickets report as PDF
// @access  Private (User/Admin)
router.get('/export/report/pdf', flexibleAuth, exportTicketsReportPDF);

// @route   GET /api/tickets/:id
// @desc    Get single ticket by ID
// @access  Private (User/Admin)
router.get('/:id', flexibleAuth, getTicketById);

// @route   POST /api/tickets
// @desc    Create new ticket
// @access  Private (User/Admin)
router.post('/', flexibleAuth, ticketValidation.create, createTicket);

// @route   PUT /api/tickets/:id
// @desc    Update ticket (students can only update their own tickets)
// @access  Private (User/Admin)
router.put('/:id', flexibleAuth, ticketValidation.update, updateTicket);

// @route   PUT /api/tickets/:id/status
// @desc    Update ticket status (admin only)
// @access  Private (Admin)
router.put('/:id/status', adminAuth, checkAdminPermission('canManageTickets'), updateTicketStatus);

// @route   POST /api/tickets/:id/comments
// @desc    Add comment to ticket
// @access  Private (User/Admin)
router.post('/:id/comments', flexibleAuth, ticketValidation.comment, addComment);



module.exports = router;