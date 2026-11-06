import React from 'react'
import './Sidebar.css'
import { NavLink } from 'react-router-dom'
import { assets } from '../../assets/assets'

const Sidebar = () => {
  return (
    <aside className='admin-sidebar'>
      <div className="sidebar-section">
        <span className="sidebar-heading">MAIN MENU</span>

        <div className="sidebar-options">
          <NavLink to='/orders' className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
            <span className="sidebar-icon">📦</span>
            <div className="sidebar-text">
              <span className="sidebar-label">Customer Orders</span>
              <small className="sidebar-sub">Live Orders & Status</small>
            </div>
          </NavLink>

          <NavLink to='/add' className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
            <span className="sidebar-icon">➕</span>
            <div className="sidebar-text">
              <span className="sidebar-label">Add New Item</span>
              <small className="sidebar-sub">Upload Dish & Price</small>
            </div>
          </NavLink>

          <NavLink to='/list' className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
            <span className="sidebar-icon">🍽️</span>
            <div className="sidebar-text">
              <span className="sidebar-label">Food Menu List</span>
              <small className="sidebar-sub">Manage & Remove</small>
            </div>
          </NavLink>
        </div>
      </div>

      <div className="sidebar-footer-card">
        <div className="card-badge">✨ NukkadEats Pro</div>
        <p>Admin panel is connected to MongoDB database & API.</p>
      </div>
    </aside>
  )
}

export default Sidebar
