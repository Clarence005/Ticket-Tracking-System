import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AdminAuthContext = createContext();

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within AdminAuthProvider');
  }
  return context;
};

export const AdminAuthProvider = ({ children }) => {
  const [adminUser, setAdminUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAdminAuth = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const storedAdmin = localStorage.getItem('adminUser');

      if (token && storedAdmin) {
        const admin = JSON.parse(storedAdmin);
        // Verify token is still valid with admin endpoint
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const response = await axios.get('/api/auth/admin/verify');
        
        setAdminUser(response.data.admin);
      }
    } catch (error) {
      console.error('Admin auth check failed:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAdminAuth();
  }, []);

  const login = async (email, password) => {
    try {
      console.log('🔐 AdminAuthContext - Attempting login...');
      const response = await axios.post('/api/auth/admin/login', {
        email,
        password
      });

      console.log('✅ AdminAuthContext - Login response:', response.data);
      const { token, admin } = response.data;
      
      localStorage.setItem('adminToken', token);
      localStorage.setItem('adminUser', JSON.stringify(admin));
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      console.log('👤 AdminAuthContext - Setting admin user:', admin);
      setAdminUser(admin);
      return { success: true };
    } catch (error) {
      console.error('❌ AdminAuthContext - Login error:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Login failed'
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    delete axios.defaults.headers.common['Authorization'];
    setAdminUser(null);
  };

  const value = {
    adminUser,
    loading,
    login,
    logout,
    isAuthenticated: !!adminUser
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
};