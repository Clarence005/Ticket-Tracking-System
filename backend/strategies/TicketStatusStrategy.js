// Different strategies for handling ticket status changes
class TicketStatusStrategy {
  static getStrategy(status) {
    const strategies = {
      'open': new OpenStrategy(),
      'in-progress': new InProgressStrategy(),
      'resolved': new ResolvedStrategy(),
      'closed': new ClosedStrategy()
    };
    
    return strategies[status] || new OpenStrategy();
  }
}

class OpenStrategy {
  handle(ticket) {
    ticket.status = 'open';
    ticket.statusHistory = ticket.statusHistory || [];
    ticket.statusHistory.push({
      status: 'open',
      changedAt: new Date(),
      note: 'Ticket opened'
    });
    return ticket;
  }
}

class InProgressStrategy {
  handle(ticket) {
    ticket.status = 'in-progress';
    ticket.statusHistory = ticket.statusHistory || [];
    ticket.statusHistory.push({
      status: 'in-progress',
      changedAt: new Date(),
      note: 'Work started on ticket'
    });
    return ticket;
  }
}

class ResolvedStrategy {
  handle(ticket) {
    ticket.status = 'resolved';
    ticket.resolvedAt = new Date();
    ticket.statusHistory = ticket.statusHistory || [];
    ticket.statusHistory.push({
      status: 'resolved',
      changedAt: new Date(),
      note: 'Ticket resolved'
    });
    return ticket;
  }
}

class ClosedStrategy {
  handle(ticket) {
    ticket.status = 'closed';
    ticket.closedAt = new Date();
    ticket.statusHistory = ticket.statusHistory || [];
    ticket.statusHistory.push({
      status: 'closed',
      changedAt: new Date(),
      note: 'Ticket closed'
    });
    return ticket;
  }
}

module.exports = TicketStatusStrategy;