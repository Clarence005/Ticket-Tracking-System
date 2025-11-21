const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Admin = require('../models/Admin');
const AdminFactory = require('../factories/AdminFactory');
const connectDB = require('../config/database');

// Load environment variables
dotenv.config();

const listAdmins = async () => {
  try {
    const admins = await Admin.find({}).select('-password').sort({ createdAt: -1 });
    
    if (admins.length === 0) {
      console.log('📭 No admins found in the database.');
      return;
    }

    console.log(`📋 Found ${admins.length} admin(s):\n`);
    
    admins.forEach((admin, index) => {
      console.log(`${index + 1}. ${admin.name}`);
      console.log(`   Email: ${admin.email}`);
      console.log(`   Role: ${admin.role}`);
      console.log(`   Status: ${admin.isActive ? '✅ Active' : '❌ Inactive'}`);
      console.log(`   Last Login: ${admin.lastLogin ? admin.lastLogin.toLocaleString() : 'Never'}`);
      console.log(`   Created: ${admin.createdAt.toLocaleString()}`);
      console.log(`   ID: ${admin._id}`);
      console.log('');
    });
  } catch (error) {
    console.error('❌ Error listing admins:', error.message);
  }
};

const deactivateAdmin = async (email) => {
  try {
    const admin = await Admin.findOne({ email: email.toLowerCase() });
    
    if (!admin) {
      console.log(`❌ Admin with email "${email}" not found.`);
      return;
    }

    if (!admin.isActive) {
      console.log(`⚠️  Admin "${admin.name}" is already inactive.`);
      return;
    }

    admin.isActive = false;
    await admin.save();

    console.log(`✅ Admin "${admin.name}" has been deactivated.`);
  } catch (error) {
    console.error('❌ Error deactivating admin:', error.message);
  }
};

const activateAdmin = async (email) => {
  try {
    const admin = await Admin.findOne({ email: email.toLowerCase() });
    
    if (!admin) {
      console.log(`❌ Admin with email "${email}" not found.`);
      return;
    }

    if (admin.isActive) {
      console.log(`⚠️  Admin "${admin.name}" is already active.`);
      return;
    }

    admin.isActive = true;
    await admin.save();

    console.log(`✅ Admin "${admin.name}" has been activated.`);
  } catch (error) {
    console.error('❌ Error activating admin:', error.message);
  }
};

const deleteAdmin = async (email) => {
  try {
    const admin = await Admin.findOne({ email: email.toLowerCase() });
    
    if (!admin) {
      console.log(`❌ Admin with email "${email}" not found.`);
      return;
    }

    // Prevent deletion of the last super-admin
    if (admin.role === 'super-admin') {
      const superAdminCount = await Admin.countDocuments({ role: 'super-admin', isActive: true });
      if (superAdminCount <= 1) {
        console.log('❌ Cannot delete the last active super-admin. Create another super-admin first.');
        return;
      }
    }

    await Admin.findByIdAndDelete(admin._id);
    console.log(`✅ Admin "${admin.name}" has been deleted permanently.`);
  } catch (error) {
    console.error('❌ Error deleting admin:', error.message);
  }
};

const resetPassword = async (email, newPassword) => {
  try {
    const admin = await Admin.findOne({ email: email.toLowerCase() });
    
    if (!admin) {
      console.log(`❌ Admin with email "${email}" not found.`);
      return;
    }

    admin.password = newPassword;
    await admin.save();

    console.log(`✅ Password reset for admin "${admin.name}".`);
    console.log(`🔑 New password: ${newPassword}`);
    console.log('⚠️  Please ask the admin to change this password after login.');
  } catch (error) {
    console.error('❌ Error resetting password:', error.message);
  }
};

const showHelp = () => {
  console.log('🛠️  Admin Management Script');
  console.log('===========================\n');
  console.log('Usage: node scripts/manageAdmins.js <command> [options]\n');
  console.log('Commands:');
  console.log('  list                     List all admins');
  console.log('  deactivate <email>       Deactivate an admin');
  console.log('  activate <email>         Activate an admin');
  console.log('  delete <email>           Delete an admin permanently');
  console.log('  reset-password <email> <password>  Reset admin password');
  console.log('  help                     Show this help message\n');
  console.log('Examples:');
  console.log('  node scripts/manageAdmins.js list');
  console.log('  node scripts/manageAdmins.js deactivate admin@helpdesk.com');
  console.log('  node scripts/manageAdmins.js reset-password admin@helpdesk.com newpass123');
};

const main = async () => {
  try {
    // Connect to database
    await connectDB();

    const command = process.argv[2];
    const arg1 = process.argv[3];
    const arg2 = process.argv[4];

    switch (command) {
      case 'list':
        await listAdmins();
        break;
      
      case 'deactivate':
        if (!arg1) {
          console.log('❌ Please provide admin email to deactivate.');
          break;
        }
        await deactivateAdmin(arg1);
        break;
      
      case 'activate':
        if (!arg1) {
          console.log('❌ Please provide admin email to activate.');
          break;
        }
        await activateAdmin(arg1);
        break;
      
      case 'delete':
        if (!arg1) {
          console.log('❌ Please provide admin email to delete.');
          break;
        }
        console.log('⚠️  This will permanently delete the admin. Are you sure?');
        await deleteAdmin(arg1);
        break;
      
      case 'reset-password':
        if (!arg1 || !arg2) {
          console.log('❌ Please provide admin email and new password.');
          break;
        }
        await resetPassword(arg1, arg2);
        break;
      
      case 'help':
      default:
        showHelp();
        break;
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
};

// Handle script execution
if (require.main === module) {
  main();
}

module.exports = {
  listAdmins,
  deactivateAdmin,
  activateAdmin,
  deleteAdmin,
  resetPassword
};