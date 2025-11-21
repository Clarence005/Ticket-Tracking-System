const Admin = require('../models/Admin');

class AdminFactory {
  /**
   * Create a new admin user
   * @param {Object} adminData - Admin user data
   * @returns {Promise<Admin>} Created admin user
   */
  static async createAdmin(adminData) {
    try {
      const admin = new Admin(adminData);
      await admin.save();
      return admin;
    } catch (error) {
      throw new Error(`Failed to create admin: ${error.message}`);
    }
  }

  /**
   * Create default super admin if none exists
   * @returns {Promise<Admin|null>} Created admin or null if already exists
   */
  static async createDefaultSuperAdmin() {
    try {
      // Check if any super admin exists
      const existingSuperAdmin = await Admin.findOne({ role: 'super-admin' });
      
      if (existingSuperAdmin) {
        console.log('Super admin already exists');
        return null;
      }

      // Create default super admin
      const defaultSuperAdmin = await this.createAdmin({
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
      });

      console.log('Default super admin created successfully');
      console.log('Email: admin@helpdesk.com');
      console.log('Password: admin123');
      console.log('Please change the default password after first login!');
      
      return defaultSuperAdmin;
    } catch (error) {
      console.error('Error creating default super admin:', error.message);
      throw error;
    }
  }

  /**
   * Create multiple admin users
   * @param {Array} adminsData - Array of admin data objects
   * @returns {Promise<Array>} Array of created admin users
   */
  static async createMultipleAdmins(adminsData) {
    try {
      const createdAdmins = [];
      
      for (const adminData of adminsData) {
        const admin = await this.createAdmin(adminData);
        createdAdmins.push(admin);
      }
      
      return createdAdmins;
    } catch (error) {
      throw new Error(`Failed to create multiple admins: ${error.message}`);
    }
  }

  /**
   * Get admin by email
   * @param {string} email - Admin email
   * @returns {Promise<Admin|null>} Admin user or null
   */
  static async getAdminByEmail(email) {
    try {
      return await Admin.findOne({ email: email.toLowerCase() });
    } catch (error) {
      throw new Error(`Failed to get admin by email: ${error.message}`);
    }
  }

  /**
   * Update admin permissions
   * @param {string} adminId - Admin ID
   * @param {Object} permissions - New permissions
   * @returns {Promise<Admin>} Updated admin
   */
  static async updateAdminPermissions(adminId, permissions) {
    try {
      const admin = await Admin.findByIdAndUpdate(
        adminId,
        { permissions },
        { new: true, runValidators: true }
      );
      
      if (!admin) {
        throw new Error('Admin not found');
      }
      
      return admin;
    } catch (error) {
      throw new Error(`Failed to update admin permissions: ${error.message}`);
    }
  }

  /**
   * Deactivate admin user
   * @param {string} adminId - Admin ID
   * @returns {Promise<Admin>} Updated admin
   */
  static async deactivateAdmin(adminId) {
    try {
      const admin = await Admin.findByIdAndUpdate(
        adminId,
        { isActive: false },
        { new: true }
      );
      
      if (!admin) {
        throw new Error('Admin not found');
      }
      
      return admin;
    } catch (error) {
      throw new Error(`Failed to deactivate admin: ${error.message}`);
    }
  }
}

module.exports = AdminFactory;