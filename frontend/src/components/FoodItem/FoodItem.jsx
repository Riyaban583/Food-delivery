import React, { useContext } from 'react'
import './FoodItem.css'
import { assets } from '../../assets/assets'
import { StoreContext } from '../context/StoreContext'

const FoodItem = ({ id, name, price, description, image }) => {

  const { cartItems, addToCart, removeFromCart, url } = useContext(StoreContext)

  // Smart image resolver: handles Vite imported assets, external URLs, and backend upload filenames
  const getFoodImage = (img) => {
    if (!img) return assets.food_1
    if (typeof img !== 'string') return img
    if (
      img.startsWith('http://') ||
      img.startsWith('https://') ||
      img.startsWith('data:') ||
      img.startsWith('blob:') ||
      img.startsWith('/') ||
      img.includes('assets/')
    ) {
      return img
    }
    return `${url}/images/${img}`
  }

  return (
    <div className='food-item'>
      <div className="food-item-img-container">
        <img
          className='food-item-image'
          src={getFoodImage(image)}
          alt={name}
          onError={(e) => {
            e.target.onerror = null
            e.target.src = assets.food_1
          }}
        />

        {!cartItems || !cartItems[id] ? (
          <img
            className='add'
            onClick={() => addToCart(id)}
            src={assets.add_icon_white}
            alt="Add to cart"
            title="Add to cart"
          />
        ) : (
          <div className='food-item-counter'>
            <img
              src={assets.remove_icon_red}
              onClick={() => removeFromCart(id)}
              alt="Decrease quantity"
            />
            <p>{cartItems[id]}</p>
            <img
              src={assets.add_icon_green}
              onClick={() => addToCart(id)}
              alt="Increase quantity"
            />
          </div>
        )}
      </div>

      <div className="food-item-info">
        <div className="food-item-name-rating">
          <p>{name}</p>
          <img src={assets.rating_starts} alt="Rating" />
        </div>

        <p className="food-item-desc">{description}</p>
        <p className="food-item-price">{price}</p>
      </div>
    </div>
  )
}

export default FoodItem
