import React, { useState, useEffect } from 'react'
import './Navbar.css'
import { assets } from '../../assets/assets'

const Navbar = () => {
  const frontendUrl = import.meta.env.VITE_FRONTEND_URL || "https://food-delivery-eosin-theta.vercel.app"
  const apiUrl = import.meta.env.VITE_API_URL || "https://food-delivery-9lr0.onrender.com"
  const [serverOnline, setServerOnline] = useState(null)

  useEffect(() => {
    let isMounted = true
    const checkServer = async () => {
      try {
        const res = await fetch(`${apiUrl}/`, { method: 'GET' })
        if (isMounted) {
          setServerOnline(res.ok)
        }
      } catch (e) {
        if (isMounted) {
          setServerOnline(false)
        }
      }
    }
    checkServer()
    const interval = setInterval(checkServer, 30000)
    return () => {
      isMounted = false
      clearInterval(interval)
    }
  }, [apiUrl])

  return (
    <header className='admin-navbar'>
      <div className="navbar-brand">
        <img className='admin-logo' src={assets.logo} alt="NukkadEats Admin" />
        <span className="admin-badge">PORTAL</span>
      </div>

      <div className="navbar-actions">
        <a 
          href={frontendUrl} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="btn-visit-site"
          title="Open Customer Website in a new tab"
        >
          <span className="globe-icon">🌐</span>
          <span>View Live Website</span>
        </a>

        <div 
          className="server-status-pill"
          style={{
            borderColor: serverOnline === true ? "#10b981" : serverOnline === false ? "#ef4444" : "#f59e0b"
          }}
          title={serverOnline === true ? "Backend server is online and responding" : serverOnline === false ? "Cannot connect to backend server" : "Checking backend status..."}
        >
          <span 
            className="status-dot"
            style={{
              backgroundColor: serverOnline === true ? "#10b981" : serverOnline === false ? "#ef4444" : "#f59e0b",
              boxShadow: serverOnline === true ? "0 0 6px #10b981" : serverOnline === false ? "0 0 6px #ef4444" : "0 0 6px #f59e0b"
            }}
          ></span>
          <span>{serverOnline === true ? "API Online" : serverOnline === false ? "API Offline" : "Connecting..."}</span>
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
