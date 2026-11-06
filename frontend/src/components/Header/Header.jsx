import React from 'react'
import './Header.css'
import { assets } from '../../assets/assets'
import { useNavigate } from 'react-router-dom'

const Header = () => {
  const navigate = useNavigate()

  const scrollToMenu = () => {
    const menuSection = document.getElementById('explore-menu')
    if (menuSection) {
      menuSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className='hero-section'>
      <div className="hero-left">
        <div className="hero-tag">
          <span>✨ Fresh & Fast Delivery</span>
        </div>
        <h1 className="hero-title">
          <span className="highlight-orange">Quick and Tasty</span><br />
          Food Delivered with a<br />
          <span className="highlight-orange">Dash of</span> Speed
        </h1>
        <p className="hero-description">
          Craving authentic delicacies and mouthwatering dishes? Savor hand-crafted meals prepared with the finest ingredients, delivered hot and fresh from our favorite food corners straight to your doorstep.
        </p>
        <div className="hero-buttons">
          <button onClick={scrollToMenu} className="btn-order-now">
            Order Now
          </button>
          <button onClick={() => navigate('/myorders')} className="btn-track-order">
            Track Order
          </button>
        </div>
      </div>

      <div className="hero-right">
        <div className="hero-image-wrapper">
          <img
            src={assets.hero_thali || "/hero_thali.png"}
            alt="Delicious Food Platter"
            className="hero-platter-img"
          />
          <div className="floating-badge badge-top">
            <span className="badge-icon">🔥</span>
            <div>
              <strong>Super Fast</strong>
              <small>30 Mins Delivery</small>
            </div>
          </div>
          <div className="floating-badge badge-bottom">
            <span className="badge-icon">⭐</span>
            <div>
              <strong>4.9 Rating</strong>
              <small>15k+ Happy Foodies</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Header
