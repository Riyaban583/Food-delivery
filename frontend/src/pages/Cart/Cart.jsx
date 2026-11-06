import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import './Cart.css'
import { StoreContext } from "../../components/context/StoreContext"
import { assets } from '../../assets/assets'

const Cart = () => {

  const { cartItems, food_list, removeFromCart, getTotalCartAmount, url } =
    useContext(StoreContext)

  const navigate = useNavigate()

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

  const hasItems = cartItems && Object.values(cartItems).some(qty => qty > 0)

  return (
    <div className='cart'>
      {!hasItems ? (
        <div style={{ textAlign: 'center', padding: '80px 20px' }}>
          <img src={assets.basket_icon} alt="Empty Cart" style={{ width: '80px', opacity: 0.5, marginBottom: '20px' }} />
          <h2 style={{ color: '#333', marginBottom: '10px' }}>Your Cart is Empty</h2>
          <p style={{ color: '#777', marginBottom: '24px' }}>Looks like you haven't added anything to your cart yet.</p>
          <button
            onClick={() => navigate('/')}
            style={{
              padding: '12px 30px',
              backgroundColor: '#FF5E2B',
              color: 'white',
              border: 'none',
              borderRadius: '999px',
              fontSize: '15px',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            Explore Menu
          </button>
        </div>
      ) : (
        <>
          <div className="cart-items">
            <div className="cart-items-title">
              <p>Items</p>
              <p>Title</p>
              <p>Price</p>
              <p>Quantity</p>
              <p>Total</p>
              <p>Remove</p>
            </div>

            <hr />

            {food_list.map((item) => {
              if (cartItems && cartItems[item._id] > 0) {
                return (
                  <div key={item._id}>
                    <div className='cart-items-title cart-items-item'>
                      <img
                        src={getFoodImage(item.image)}
                        alt={item.name}
                        onError={(e) => {
                          e.target.onerror = null
                          e.target.src = assets.food_1
                        }}
                      />
                      <p>{item.name}</p>
                      <p>₹{item.price}</p>
                      <p>{cartItems[item._id]}</p>
                      <p>₹{item.price * cartItems[item._id]}</p>
                      <p
                        onClick={() => removeFromCart(item._id)}
                        className='cross'
                        title="Remove item"
                      >
                        ✕
                      </p>
                    </div>
                    <hr />
                  </div>
                )
              }
              return null
            })}
          </div>

          <div className="cart-bottom">
            <div className="cart-total">
              <h2>Cart Totals</h2>

              <div>
                <div className="cart-total-details">
                  <p>Subtotal</p>
                  <p>₹{getTotalCartAmount()}</p>
                </div>

                <hr />

                <div className="cart-total-details">
                  <p>Delivery Fee</p>
                  <p>₹{getTotalCartAmount() === 0 ? 0 : 2}</p>
                </div>

                <hr />

                <div className="cart-total-details">
                  <p>Total</p>
                  <p>₹{getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 2}</p>
                </div>
              </div>

              <button onClick={() => navigate('/order')}>
                PROCEED TO CHECKOUT
              </button>
            </div>

            <div className="cart-promocode">
              <div>
                <p>If you have a promo code, Enter it here</p>
                <div className='cart-promocode-input'>
                  <input type="text" placeholder='promo code' />
                  <button>Submit</button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default Cart
