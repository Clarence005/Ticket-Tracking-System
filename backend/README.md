# Ticket Platform Backend

A well-organized Node.js/Express backend for the Ticket Raising Platform following MVC architecture.

## 📁 Project Structure

```
backend/
├── config/
│   ├── database.js          # Database connection configuration
│   └── constants.js         # Application constants and enums
├── controllers/
│   ├── authController.js    # Authentication logic
│   └── ticketController.js  # Ticket management logic
├── middleware/
│   └── auth.js             # Authentication middleware
├── models/
│   ├── User.js             # User model schema
│   └── Ticket.js           # Ticket model schema
├── routes/
│   ├── auth.js             # Authentication routes
│   └── tickets.js          # Ticket management routes
├── services/
│   └── pdfService.js       # PDF generation service
├── templates/
│   ├── ticket-pdf.hbs      # Single ticket PDF template
│   └── ticket-report-pdf.hbs # Tickets report PDF template
├── utils/
│   ├── responseHelper.js   # Standardized API responses
│   └── validation.js       # Validation rules and helpers
├── seeders/
│   └── demoData.js         # Database seeding script
├── .env                    # Environment variables
├── server.js               # Application entry point
└── package.json            # Dependencies and scripts
```

## 🏗️ Architecture

### MVC Pattern
- **Models**: Database schemas and data logic (`models/`)
- **Views**: PDF templates (`templates/`)
- **Controllers**: Business logic (`controllers/`)
- **Routes**: API endpoints (`routes/`)

### Additional Layers
- **Config**: Configuration files (`config/`)
- **Middleware**: Request processing (`middleware/`)
- **Services**: External services and utilities (`services/`)
- **Utils**: Helper functions (`utils/`)

## 🚀 Getting Started

### Prerequisites
- Node.js (v16+)
- MongoDB
- npm or yarn

### Installation
```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Seed demo data (optional)
npm run seed

# Start development server
npm run dev
```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Tickets
- `GET /api/tickets` - Get all tickets (filtered by role)
- `GET /api/tickets/:id` - Get single ticket
- `POST /api/tickets` - Create new ticket
- `PUT /api/tickets/:id` - Update ticket
- `PUT /api/tickets/:id/status` - Update ticket status (admin only)
- `DELETE /api/tickets/:id` - Delete ticket
- `POST /api/tickets/:id/comments` - Add comment to ticket

### Analytics & Reports
- `GET /api/tickets/stats/analytics` - Get ticket analytics
- `GET /api/tickets/export/report/pdf` - Export tickets report as PDF

## 🔧 Configuration

### Environment Variables
```env
MONGODB_URI=mongodb://localhost:27017/ticketplatform
JWT_SECRET=your_super_secret_jwt_key
PORT=5000
NODE_ENV=development
```

### Constants
All application constants are centralized in `config/constants.js`:
- Ticket categories, priorities, and statuses
- User roles
- Validation limits

## 🛡️ Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Input validation and sanitization
- Role-based access control
- Request rate limiting ready
- CORS configuration

## 📊 Features

### Core Features
- User authentication and authorization
- Ticket CRUD operations
- Comment system
- Role-based permissions (Student/Admin)
- Real-time status updates

### Advanced Features
- PDF export (single ticket & reports)
- Analytics and statistics
- Data visualization ready
- Comprehensive error handling
- Standardized API responses

## 🧪 Testing

```bash
# Run tests (when implemented)
npm test

# Run with coverage
npm run test:coverage
```

## 📝 Scripts

```bash
npm start          # Start production server
npm run dev        # Start development server with nodemon
npm run seed       # Seed database with demo data
npm run lint       # Run ESLint (when configured)
npm run format     # Format code with Prettier (when configured)
```

## 🔄 Development Workflow

1. **Models First**: Define data schemas in `models/`
2. **Controllers**: Implement business logic in `controllers/`
3. **Routes**: Define API endpoints in `routes/`
4. **Middleware**: Add request processing in `middleware/`
5. **Services**: External integrations in `services/`
6. **Utils**: Helper functions in `utils/`

## 📚 Dependencies

### Core Dependencies
- **express**: Web framework
- **mongoose**: MongoDB ODM
- **bcryptjs**: Password hashing
- **jsonwebtoken**: JWT authentication
- **express-validator**: Input validation
- **cors**: Cross-origin resource sharing
- **dotenv**: Environment variables

### PDF Generation
- **puppeteer**: Headless Chrome for PDF generation
- **handlebars**: Template engine for PDF content

### Development
- **nodemon**: Development server with auto-reload

## 🤝 Contributing

1. Follow the established folder structure
2. Use the standardized response helpers
3. Implement proper error handling
4. Add validation for all inputs
5. Document new endpoints
6. Follow naming conventions

## 📄 License

This project is licensed under the MIT License.