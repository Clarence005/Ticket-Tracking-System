import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-content">
          <div className="navbar-brand">
            <Link to="/dashboard">
              <h3>🎫 Ticket Platform</h3>
            </Link>
          </div>
          
          <div className="navbar-menu">
            <Link 
              to="/dashboard" 
              className={`nav-link ${isActive('/dashboard')}`}
            >
              Dashboard
            </Link>
            <Link 
              to="/create-ticket" 
              className={`nav-link ${isActive('/create-ticket')}`}
            >
              Create Ticket
            </Link>
            <Link 
              to="/analytics" 
              className={`nav-link ${isActive('/analytics')}`}
            >
              Analytics
            </Link>
          </div>
          
          <div className="navbar-user">
            <div className="user-info">
              <span className="user-name">{user?.name}</span>
              <span className="user-role">
                {user?.role === 'student' ? `ID: ${user?.studentId}` : user?.role}
              </span>
            </div>
            <button onClick={handleLogout} className="btn btn-secondary btn-sm">
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;