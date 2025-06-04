import React from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css';
import logo from '../../assets/salawat-logo.png';

const Navbar = ({ isLoggedIn, username, onLogout, user }) => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <img src={logo} alt="Logo" />
      </div>

      {isLoggedIn && user?.role === 'admin' && (
        <div className="navbar-links">
          <NavLink to="/tokenmanagement" end className={({ isActive }) => isActive ? "active-link" : ""}>Token Dashboard</NavLink>
          <NavLink to="/coremembermanagement" end className={({ isActive }) => isActive ? "active-link" : ""}>Admin Dashboard</NavLink>
          <NavLink to="/communitybuildermanagement" end className={({ isActive }) => isActive ? "active-link" : ""}>Core Member Dashboard</NavLink>
          <NavLink to="/communitymembermanagement" end className={({ isActive }) => isActive ? "active-link" : ""}>Builder Dashboard</NavLink>
          <NavLink to="/communitymember" end className={({ isActive }) => isActive ? "active-link" : ""}>Member Dashboard</NavLink>


          
        </div>
      )}

      {isLoggedIn && (
        <div className="navbar-profile">
          <span className="username">{username}</span>
          <button className="logout-btn" onClick={onLogout}>
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
