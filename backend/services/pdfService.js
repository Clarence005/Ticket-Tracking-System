const puppeteer = require('puppeteer');
const handlebars = require('handlebars');
const fs = require('fs').promises;
const path = require('path');

// Register Handlebars helpers
handlebars.registerHelper('eq', function (a, b) {
  return a === b;
});

class PDFService {

  async generateTicketReportPDF(tickets, user) {
    let browser;
    try {
      // Load report template
      const templatePath = path.join(__dirname, '../templates', 'ticket-report-pdf.hbs');
      const templateContent = await fs.readFile(templatePath, 'utf8');
      const template = handlebars.compile(templateContent);

      // Calculate statistics
      const stats = {
        total: tickets.length,
        byStatus: {
          open: tickets.filter(t => t.status === 'open').length,
          'in-progress': tickets.filter(t => t.status === 'in-progress').length,
          resolved: tickets.filter(t => t.status === 'resolved').length,
          closed: tickets.filter(t => t.status === 'closed').length
        },
        byCategory: {},
        byPriority: {}
      };

      // Group by category
      tickets.forEach(ticket => {
        stats.byCategory[ticket.category] = (stats.byCategory[ticket.category] || 0) + 1;
        stats.byPriority[ticket.priority] = (stats.byPriority[ticket.priority] || 0) + 1;
      });

      // Prepare data for template
      const templateData = {
        tickets: tickets.map(ticket => ({
          ticketId: ticket.ticketId,
          title: ticket.title,
          description: ticket.description,
          category: ticket.category,
          priority: ticket.priority,
          status: ticket.status,
          createdBy: ticket.createdBy,
          assignedTo: ticket.assignedTo,
          createdAt: new Date(ticket.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          }),
          resolvedAt: ticket.resolvedAt ? new Date(ticket.resolvedAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          }) : '-'
        })),
        user,
        stats,
        generatedAt: new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      };

      const html = template(templateData);

      // Generate PDF
      browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });

      const page = await browser.newPage();
      await page.setContent(html, { waitUntil: 'networkidle0' });

      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: {
          top: '20px',
          right: '20px',
          bottom: '20px',
          left: '20px'
        }
      });

      return pdfBuffer;
    } catch (error) {
      console.error('Error generating report PDF:', error);
      throw error;
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  }
}

module.exports = new PDFService();