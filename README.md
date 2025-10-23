# 🎫 Ticket Raising Platform - MERN Stack

A comprehensive full-stack web application for managing support tickets with advanced features including email notifications, PDF exports, and data visualization.

## ✨ Features

### 👨‍🎓 Student Features
- **Ticket Management**: Create, edit, view, and delete support tickets
- **Real-time Tracking**: Monitor ticket status with timeline view
- **PDF Export**: Export individual tickets or comprehensive reports
- **Analytics Dashboard**: Visual insights with charts and statistics
- **Search & Filter**: Advanced filtering by status, category, and priority
- **Comments System**: Add comments and track conversations

### 👨‍💼 Admin Features
- **Global Ticket Management**: View and manage all tickets across the platform
- **Status Management**: Update ticket status (Pending → In Progress → Resolved → Closed)
- **User Management**: Oversee all student accounts and their tickets
- **Advanced Analytics**: Comprehensive reporting with data visualization
- **Bulk Operations**: Export reports with custom filters

## 🛠️ Tech Stack
- **Frontend**: React.js 18+ with Hooks, Chart.js for visualization
- **Backend**: Node.js + Express.js with RESTful APIs
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT tokens with role-based access control
- **PDF Generation**: Puppeteer for server-side PDF creation
- **File Handling**: File-saver for client-side downloads
- **Styling**: Modern CSS3 with responsive design

## 🏗️ Architecture
```
Frontend (React + Charts) → API Layer (Express + Middleware) → Database (MongoDB)
                          ↓
Email Service (Nodemailer) + PDF Service (Puppeteer)
```

## 🚀 Setup Instructions

### Prerequisites
- **Node.js** (v16+ recommended)
- **MongoDB** (local installation or MongoDB Atlas)
- **npm** or **yarn** package manager
- **Git** for version control

### 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ticket-raising-platform
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   ```

4. **Environment Configuration**
   
   Create `.env` file in the `backend` directory:
   ```env
   # Database
   MONGODB_URI=mongodb://localhost:27017/ticketplatform
   
   # Authentication
   JWT_SECRET=your_super_secret_jwt_key_change_in_production
   
   # Server
   PORT=5000
   NODE_ENV=development
   
   # Email Configuration (for notifications)
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password
   EMAIL_FROM=Ticket Platform <noreply@ticketplatform.com>
   ```

5. **Start the Application**
   
   **Backend** (Terminal 1):
   ```bash
   cd backend
   npm run dev
   ```
   
   **Frontend** (Terminal 2):
   ```bash
   cd frontend
   npm start
   ```

6. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 📡 API Endpoints

### 🔐 Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login  
- `GET /api/auth/me` - Get current user profile

### 🎫 Ticket Management
- `GET /api/tickets` - Get tickets (filtered by user role)
- `POST /api/tickets` - Create new ticket
- `GET /api/tickets/:id` - Get single ticket details
- `PUT /api/tickets/:id` - Update ticket (students: own tickets only)
- `DELETE /api/tickets/:id` - Delete ticket
- `PUT /api/tickets/:id/status` - Update ticket status (admin only)
- `POST /api/tickets/:id/comments` - Add comment to ticket

### 📊 Analytics & Reports
- `GET /api/tickets/stats/analytics` - Get ticket statistics and analytics
- `GET /api/tickets/:id/export/pdf` - Export single ticket as PDF
- `GET /api/tickets/export/report/pdf` - Export tickets report as PDF

### 📧 Email Notifications
- Automatic email notifications for:
  - New ticket creation
  - Status updates
  - New comments
  - Ticket resolution

## 👤 Demo Credentials

### Student Account
- **Email**: student@example.com
- **Password**: password123
- **Student ID**: STU001

### Admin Account  
- **Email**: admin@example.com
- **Password**: admin123

## Project Structure
```
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.js
│   └── public/
└── README.md
```
## 📧 Em
ail Configuration

To enable email notifications, configure your email settings in the `.env` file:

### Gmail Setup (Recommended)
1. Enable 2-Factor Authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account Settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
3. Use the generated password in `EMAIL_PASS`

### Other Email Providers
Update the `EMAIL_HOST` and `EMAIL_PORT` according to your provider:
- **Outlook**: smtp-mail.outlook.com:587
- **Yahoo**: smtp.mail.yahoo.com:587
- **Custom SMTP**: Use your provider's settings

## 📊 Analytics Features

### Dashboard Visualizations
- **Status Distribution**: Pie chart showing ticket status breakdown
- **Priority Analysis**: Bar chart of tickets by priority level
- **Category Insights**: Distribution across different categories
- **Monthly Trends**: Line chart showing ticket creation over time
- **Resolution Metrics**: Average resolution time and success rate

### Export Options
- **Individual Ticket PDF**: Detailed report with comments and timeline
- **Comprehensive Report**: Multi-ticket analysis with statistics
- **Filtered Exports**: Custom reports based on status, category, or date range

## 🎨 UI/UX Features

### Responsive Design
- Mobile-first approach with responsive breakpoints
- Touch-friendly interface for mobile devices
- Optimized layouts for tablets and desktops

### Interactive Elements
- Real-time form validation with error handling
- Dynamic status badges with color coding
- Smooth transitions and hover effects
- Loading states and progress indicators

### Accessibility
- Semantic HTML structure
- Keyboard navigation support
- Screen reader compatible
- High contrast color schemes

## 🔧 Development Features

### Code Quality
- **Modular Architecture**: Clean separation of concerns
- **Error Handling**: Comprehensive error management
- **Input Validation**: Both client and server-side validation
- **Security**: JWT authentication, input sanitization
- **Performance**: Optimized queries and lazy loading

### Design Patterns
- **MVC Pattern**: Model-View-Controller architecture
- **Repository Pattern**: Database abstraction layer
- **Middleware Pattern**: Authentication and validation
- **Observer Pattern**: Email notification system

## 🚀 Deployment

### Production Setup
1. **Environment Variables**: Update `.env` with production values
2. **Database**: Use MongoDB Atlas for cloud database
3. **Email Service**: Configure production email service
4. **Build Frontend**: `npm run build` in frontend directory
5. **Process Manager**: Use PM2 for Node.js process management

### Docker Deployment (Optional)
```bash
# Build and run with Docker Compose
docker-compose up --build
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation for common solutions

---

**Built with ❤️ using the MERN Stack**