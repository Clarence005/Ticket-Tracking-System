class TicketObserver {
    constructor() {
        this.observers = [];
    }

    // Add observer
    subscribe(observer) {
        this.observers.push(observer);
    }

    // Remove observer
    unsubscribe(observer) {
        this.observers = this.observers.filter(obs => obs !== observer);
    }

    // Notify all observers
    notify(event, data) {
        this.observers.forEach(observer => {
            if (observer[event]) {
                observer[event](data);
            }
        });
    }
}

// Simple notification handlers
class ConsoleNotifier {
    onTicketCreated(ticket) {
        console.log(`📝 New ticket created: ${ticket.title} by ${ticket.createdBy}`);
    }

    onTicketUpdated(ticket) {
        console.log(`✏️ Ticket updated: ${ticket.title} - Status: ${ticket.status}`);
    }

    onTicketResolved(ticket) {
        console.log(`✅ Ticket resolved: ${ticket.title}`);
    }
}

class LogNotifier {
    onTicketCreated(ticket) {
        // Could write to log file
        console.log(`[LOG] Ticket created: ID ${ticket._id}`);
    }

    onTicketUpdated(ticket) {
        console.log(`[LOG] Ticket updated: ID ${ticket._id}`);
    }

    onTicketResolved(ticket) {
        console.log(`[LOG] Ticket resolved: ID ${ticket._id}`);
    }
}

// Create singleton instance
const ticketObserver = new TicketObserver();

// Add default observers
ticketObserver.subscribe(new ConsoleNotifier());
ticketObserver.subscribe(new LogNotifier());

module.exports = ticketObserver;