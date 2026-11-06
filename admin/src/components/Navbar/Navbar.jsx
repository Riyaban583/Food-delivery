import React from 'react'
import './Navbar.css'
import { assets } from '../../assets/assets'

const Navbar = () => {
  return (
    <header className='admin-navbar'>
      <div className="navbar-brand">
        <img className='admin-logo' src={assets.logo} alt="NukkadEats Admin" />
        <span className="admin-badge">PORTAL</span>
      </div>

      <div className="navbar-actions">
        <a 
          href="http://localhost:5173" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="btn-visit-site"
          title="Open Customer Website in a new tab"
        >
          <span className="globe-icon">🌐</span>
          <span>View Live Website</span>
        </a>

        <div className="server-status-pill">
          <span className="status-dot"></span>
          <span>API Connected (Port 4000)</span>
        </div>

        <div className="admin-profile-section">
          <img className='admin-avatar' src={assets.profile_image} alt="Admin Profile" />
          <div className="admin-user-details">
            <span className="admin-name">Store Manager</span>
            <span className="admin-role">Admin</span>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Navbar
