#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🎫 Ticket Platform Setup Script');
console.log('================================\n');

// Check if Node.js version is compatible
const nodeVersion = process.version;
const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);

if (majorVersion < 16) {
  console.error('❌ Node.js version 16 or higher is required');
  console.error(`Current version: ${nodeVersion}`);
  process.exit(1);
}

console.log('✅ Node.js version check passed');

// Function to run commands
function runCommand(command, cwd = process.cwd()) {
  try {
    console.log(`🔄 Running: ${command}`);
    execSync(command, { cwd, stdio: 'inherit' });
    console.log('✅ Command completed successfully\n');
  } catch (error) {
    console.error(`❌ Command failed: ${command}`);
    console.error(error.message);
    process.exit(1);
  }
}

// Check if directories exist
const backendDir = path.join(__dirname, 'backend');
const frontendDir = path.join(__dirname, 'frontend');

if (!fs.existsSync(backendDir)) {
  console.error('❌ Backend directory not found');
  process.exit(1);
}

if (!fs.existsSync(frontendDir)) {
  console.error('❌ Frontend directory not found');
  process.exit(1);
}

console.log('✅ Project structure verified\n');

// Install backend dependencies
console.log('📦 Installing backend dependencies...');
runCommand('npm install', backendDir);

// Install frontend dependencies
console.log('📦 Installing frontend dependencies...');
runCommand('npm install', frontendDir);

// Check if .env file exists, create if not
const envPath = path.join(backendDir, '.env');
if (!fs.existsSync(envPath)) {
  console.log('📝 Creating .env file...');
  const envContent = `# Database Configuration
MONGODB_URI=mongodb://localhost:27017/ticketplatform

# Authentication
JWT_SECRET=your_super_secret_jwt_key_change_in_production

# Server Configuration
PORT=5000
NODE_ENV=development
`;
  
  fs.writeFileSync(envPath, envContent);
  console.log('✅ .env file created\n');
} else {
  console.log('✅ .env file already exists\n');
}

// Create start scripts
const startScript = `#!/bin/bash

echo "🎫 Starting Ticket Platform..."
echo "=============================="

# Check if MongoDB is running
if ! pgrep -x "mongod" > /dev/null; then
    echo "⚠️  MongoDB is not running. Please start MongoDB first."
    echo "   - macOS: brew services start mongodb-community"
    echo "   - Ubuntu: sudo systemctl start mongod"
    echo "   - Windows: net start MongoDB"
    exit 1
fi

echo "✅ MongoDB is running"

# Start backend in background
echo "🚀 Starting backend server..."
cd backend && npm run dev &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 3

# Start frontend
echo "🚀 Starting frontend server..."
cd frontend && npm start &
FRONTEND_PID=$!

echo ""
echo "🎉 Ticket Platform is starting up!"
echo "=================================="
echo "Frontend: http://localhost:3000"
echo "Backend:  http://localhost:5000"
echo ""
echo "Demo Credentials:"
echo "Student - Email: student@example.com, Password: password123"
echo "Admin   - Email: admin@example.com, Password: admin123"
echo ""
echo "Press Ctrl+C to stop all services"

# Wait for user interrupt
trap 'echo ""; echo "🛑 Stopping services..."; kill $BACKEND_PID $FRONTEND_PID; exit 0' INT
wait
`;

fs.writeFileSync('start.sh', startScript);
fs.chmodSync('start.sh', '755');

// Create Windows batch file
const startBat = `@echo off
echo 🎫 Starting Ticket Platform...
echo ==============================

echo 🚀 Starting backend server...
cd backend
start "Backend" cmd /k "npm run dev"

timeout /t 3 /nobreak > nul

echo 🚀 Starting frontend server...
cd ../frontend
start "Frontend" cmd /k "npm start"

echo.
echo 🎉 Ticket Platform is starting up!
echo ==================================
echo Frontend: http://localhost:3000
echo Backend:  http://localhost:5000
echo.
echo Demo Credentials:
echo Student - Email: student@example.com, Password: password123
echo Admin   - Email: admin@example.com, Password: admin123
echo.
echo Press any key to exit...
pause > nul
`;

fs.writeFileSync('start.bat', startBat);

console.log('🎉 Setup completed successfully!');
console.log('================================\n');

console.log('📋 Next Steps:');
console.log('1. Make sure MongoDB is running on your system');
console.log('2. Run the application:');
console.log('   - Linux/macOS: ./start.sh');
console.log('   - Windows: start.bat');
console.log('   - Manual: npm run dev (backend) + npm start (frontend)');
console.log('');
console.log('🌐 Application URLs:');
console.log('   - Frontend: http://localhost:3000');
console.log('   - Backend API: http://localhost:5000');
console.log('');
console.log('👤 Demo Credentials:');
console.log('   - Student: student@example.com / password123');
console.log('   - Admin: admin@example.com / admin123');
console.log('');
console.log('📚 For more information, check the README.md file');
console.log('');
console.log('Happy coding! 🚀');