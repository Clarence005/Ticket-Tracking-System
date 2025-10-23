import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';

// Components
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/dashboard/Dashboard';
import { CreateTicket, EditTicket, TicketDetail } from './components/tickets';
import Analytics from './components/analytics/Analytics';
import Navbar from './components/layout/Navbar';

// Context
import { AuthProvider, useAuth } from './context/AuthContext';

// Set axios defaults
axios.defaults.baseURL = 'http://localhost:5000';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <AppContent />
        </div>
      </Router>
    </AuthProvider>
  );
}

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <>
      {user && <Navbar />}
      <Routes>
        <Route 
          path="/login" 
          element={!user ? <Login /> : <Navigate to="/dashboard" />} 
        />
        <Route 
          path="/register" 
          element={!user ? <Register /> : <Navigate to="/dashboard" />} 
        />
        <Route 
          path="/dashboard" 
          element={user ? <Dashboard /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/create-ticket" 
          element={user ? <CreateTicket /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/edit-ticket/:id" 
          element={user ? <EditTicket /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/ticket/:id" 
          element={user ? <TicketDetail /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/analytics" 
          element={user ? <Analytics /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/" 
          element={<Navigate to={user ? "/dashboard" : "/login"} />} 
        />
      </Routes>
    </>
  );
}

export default App;