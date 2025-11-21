const mongoose = require('mongoose');
const dotenv = require('dotenv');
const AdminFactory = require('../factories/AdminFactory');
const connectDB = require('../config/database');

// Load environment variables
dotenv.config();

const createAdmin = async () => {
  try {
    // Connect to database
    await connectDB();
    console.log('Connected to database');

    // Get admin details from command line arguments or use defaults
    const args = process.argv.slice(2);
    
    let adminData = {
      name: 'Super Admin',
      email: 'admin@helpdesk.com',
      password: 'admin123',
      role: 'super-admin',
      permissions: {
        canManageTickets: true,
        canManageUsers: true,
        canViewAnalytics: true,
        canExportData: true
      }
    };

    // Parse command line arguments
    for (let i = 0; i < args.length; i += 2) {
      const key = args[i];
      const value = args[i + 1];
      
      switch (key) {
        case '--name':
          adminData.name = value;
          break;
        case '--email':
          adminData.email = value;
          break;
        case '--password':
          adminData.password = value;
          break;
        case '--role':
          adminData.role = value;
          break;
      }
    }

    console.log('\n🔧 Creating admin with the following details:');
    console.log(`Name: ${adminData.name}`);
    console.log(`Email: ${adminData.email}`);
    console.log(`Role: ${adminData.role}`);
    console.log(`Password: ${'*'.repeat(adminData.password.length)}`);

    // Check if admin already exists
    const existingAdmin = await AdminFactory.getAdminByEmail(adminData.email);
    if (existingAdmin) {
      console.log('\n❌ Admin with this email already exists!');
      console.log('Use a different email or delete the existing admin first.');
      process.exit(1);
    }

    // Create the admin
    const admin = await AdminFactory.createAdmin(adminData);

    console.log('\n✅ Admin created successfully!');
    console.log('\n📋 Admin Details:');
    console.log(`ID: ${admin._id}`);
    console.log(`Name: ${admin.name}`);
    console.log(`Email: ${admin.email}`);
    console.log(`Role: ${admin.role}`);
    console.log(`Created: ${admin.createdAt}`);
    console.log('\n🔑 Login Credentials:');
    console.log(`Email: ${admin.email}`);
    console.log(`Password: ${adminData.password}`);
    console.log('\n⚠️  Please change the password after first login!');

  } catch (error) {
    console.error('\n❌ Error creating admin:', error.message);
    process.exit(1);
  } finally {
    // Close database connection
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
    process.exit(0);
  }
};

// Handle script execution
if (require.main === module) {
  console.log('🚀 Admin Creation Script');
  console.log('========================\n');
  
  // Show usage if help is requested
  if (process.argv.includes('--help') || process.argv.includes('-h')) {
    console.log('Usage: node scripts/createAdmin.js [options]');
    console.log('\nOptions:');
    console.log('  --name <name>         Admin name (default: "Super Admin")');
    console.log('  --email <email>       Admin email (default: "admin@helpdesk.com")');
    console.log('  --password <password> Admin password (default: "admin123")');
    console.log('  --role <role>         Admin role: admin|super-admin (default: "super-admin")');
    console.log('  --help, -h            Show this help message');
    console.log('\nExamples:');
    console.log('  node scripts/createAdmin.js');
    console.log('  node scripts/createAdmin.js --name "John Doe" --email "john@company.com" --password "securepass123"');
    console.log('  node scripts/createAdmin.js --email "admin2@helpdesk.com" --role "admin"');
    process.exit(0);
  }

  createAdmin();
}

module.exports = { createAdmin };