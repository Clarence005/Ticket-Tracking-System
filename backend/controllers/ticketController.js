const { validationResult } = require('express-validator');
const Ticket = require('../models/Ticket');
const pdfService = require('../services/pdfService');



// @desc    Get all tickets (filtered by user role)
// @route   GET /api/tickets

const getTickets = async (req, res) => {
  try {
    let query = {};
    const user = req.admin || req.user;

    // Students can only see their own tickets
    if (user && user.role === 'student') {
      query.createdBy = user._id;
    }
    // Admins can see all tickets (no filter needed)

    const tickets = await Ticket.find(query)
      .populate('createdBy', 'name email studentId')
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 });

    res.json(tickets);
  } catch (error) {
    console.error('Get tickets error:', error);
    res.status(500).json({ message: 'Server error while fetching tickets' });
  }
};

// @desc    Get single ticket by ID
// @route   GET /api/tickets/:id

const getTicketById = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id)
      .populate('createdBy', 'name email studentId')
      .populate('assignedTo', 'name email')
      .populate('comments.author', 'name email');

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    const user = req.admin || req.user;

    // Students can only view their own tickets
    if (user && user.role === 'student' && ticket.createdBy._id.toString() !== user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(ticket);
  } catch (error) {
    console.error('Get ticket error:', error);
    res.status(500).json({ message: 'Server error while fetching ticket' });
  }
};

// @desc    Create new ticket
// @route   POST /api/tickets

const createTicket = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, category, priority } = req.body;
    const user = req.admin || req.user;

    const ticket = new Ticket({
      title,
      description,
      category,
      priority,
      createdBy: user._id
    });

    await ticket.save();

    // Populate the created ticket
    await ticket.populate('createdBy', 'name email studentId');

    res.status(201).json({
      message: 'Ticket created successfully',
      ticket
    });
  } catch (error) {
    console.error('Create ticket error:', error);
    res.status(500).json({ message: 'Server error while creating ticket' });
  }
};

// @desc    Update ticket
// @route   PUT /api/tickets/:id

const updateTicket = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    const user = req.admin || req.user;

    // Students can only update their own tickets
    if (user && user.role === 'student' && ticket.createdBy.toString() !== user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Students cannot update status - only admins can
    const allowedFields = ['title', 'description', 'category', 'priority'];
    const updateData = {};

    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    const updatedTicket = await Ticket.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('createdBy', 'name email studentId');

    res.json({
      message: 'Ticket updated successfully',
      ticket: updatedTicket
    });
  } catch (error) {
    console.error('Update ticket error:', error);
    res.status(500).json({ message: 'Server error while updating ticket' });
  }
};

// @desc    Update ticket status (admin only)
// @route   PUT /api/tickets/:id/status

const updateTicketStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!['open', 'in-progress', 'resolved', 'closed'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    // Update status and related fields
    ticket.status = status;

    if (status === 'resolved') {
      ticket.resolvedAt = new Date();
    }

    if (status === 'closed') {
      ticket.closedAt = new Date();
    }

    await ticket.save();
    await ticket.populate('createdBy', 'name email studentId');

    res.json({
      message: 'Ticket status updated successfully',
      ticket
    });
  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({ message: 'Server error while updating status' });
  }
};



// @desc    Add comment to ticket
// @route   POST /api/tickets/:id/comments

const addComment = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    const user = req.admin || req.user;

    // Students can only comment on their own tickets
    if (user && user.role === 'student' && ticket.createdBy.toString() !== user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    ticket.comments.push({
      text: req.body.text,
      author: user._id
    });

    await ticket.save();
    await ticket.populate('comments.author', 'name email');

    res.json({
      message: 'Comment added successfully',
      comment: ticket.comments[ticket.comments.length - 1]
    });
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({ message: 'Server error while adding comment' });
  }
};





// @desc    Export tickets report as PDF
// @route   GET /api/tickets/export/report/pdf

const exportTicketsReportPDF = async (req, res) => {
  try {
    let query = {};
    const user = req.admin || req.user;

    // Students can only export their own tickets
    if (user && user.role === 'student') {
      query.createdBy = user._id;
    }

    const tickets = await Ticket.find(query)
      .populate('createdBy', 'name email studentId')
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 });

    const pdfBuffer = await pdfService.generateTicketReportPDF(tickets, user);

    const filename = `tickets-report-${new Date().toISOString().split('T')[0]}.pdf`;

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(pdfBuffer);
  } catch (error) {
    console.error('Export report PDF error:', error);
    res.status(500).json({ message: 'Server error while generating report PDF' });
  }
};
// @desc    Get ticket statistics for charts
// @route   GET /api/tickets/stats/analytics

const getTicketAnalytics = async (req, res) => {
  try {
    let query = {};
    const user = req.admin || req.user;

    // Students can only see their own ticket stats
    if (user && user.role === 'student') {
      query.createdBy = user._id;
    }

    const tickets = await Ticket.find(query);

    // Status distribution
    const statusStats = {
      open: tickets.filter(t => t.status === 'open').length,
      'in-progress': tickets.filter(t => t.status === 'in-progress').length,
      resolved: tickets.filter(t => t.status === 'resolved').length,
      closed: tickets.filter(t => t.status === 'closed').length
    };

    // Priority distribution
    const priorityStats = {
      Low: tickets.filter(t => t.priority === 'Low').length,
      Medium: tickets.filter(t => t.priority === 'Medium').length,
      High: tickets.filter(t => t.priority === 'High').length,
      Critical: tickets.filter(t => t.priority === 'Critical').length
    };

    // Category distribution
    const categoryStats = {};
    tickets.forEach(ticket => {
      categoryStats[ticket.category] = (categoryStats[ticket.category] || 0) + 1;
    });

    // Monthly trend (last 6 months)
    const monthlyStats = {};
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    tickets.forEach(ticket => {
      const ticketDate = new Date(ticket.createdAt);
      if (ticketDate >= sixMonthsAgo) {
        const monthKey = ticketDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
        monthlyStats[monthKey] = (monthlyStats[monthKey] || 0) + 1;
      }
    });

    // Resolution time analysis (for resolved tickets)
    const resolvedTickets = tickets.filter(t => t.resolvedAt);
    const resolutionTimes = resolvedTickets.map(ticket => {
      const created = new Date(ticket.createdAt);
      const resolved = new Date(ticket.resolvedAt);
      return Math.ceil((resolved - created) / (1000 * 60 * 60 * 24)); // days
    });

    const avgResolutionTime = resolutionTimes.length > 0
      ? Math.round(resolutionTimes.reduce((a, b) => a + b, 0) / resolutionTimes.length)
      : 0;

    res.json({
      total: tickets.length,
      statusStats,
      priorityStats,
      categoryStats,
      monthlyStats,
      avgResolutionTime,
      resolvedCount: resolvedTickets.length
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({ message: 'Server error while fetching analytics' });
  }
};

module.exports = {
  getTickets,
  getTicketById,
  createTicket,
  updateTicket,
  updateTicketStatus,
  addComment,
  exportTicketsReportPDF,
  getTicketAnalytics
};