import React, { useContext, useState, useEffect } from 'react'
import axios from 'axios'
import './PlaceOrder.css'
import { StoreContext } from '../../components/context/StoreContext'
import { useNavigate } from 'react-router-dom'

const PlaceOrder = () => {

  const { getTotalCartAmount, token, food_list, cartItems, setCartItems, url } = useContext(StoreContext)
  const navigate = useNavigate()

  const [paymentMethod, setPaymentMethod] = useState("COD")
  const [loading, setLoading] = useState(false)

  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: ""
  })

  const onChangeHandler = (event) => {
    const name = event.target.name
    const value = event.target.value
    setData(prev => ({ ...prev, [name]: value }))
  }

  const placeOrder = async (event) => {
    event.preventDefault()
    setLoading(true)

    try {
      let orderItems = []

      food_list.forEach((item) => {
        if (cartItems[item._id] > 0) {
          orderItems.push({
            ...item,
            quantity: cartItems[item._id]
          })
        }
      })

      if (orderItems.length === 0) {
        alert("Your cart is empty!")
        setLoading(false)
        navigate('/cart')
        return
      }

      const orderData = {
        address: data,
        items: orderItems,
        amount: getTotalCartAmount() + 2
      }

      // 🟢 CASH ON DELIVERY
      if (paymentMethod === "COD") {
        const response = await axios.post(
          url + "/api/orders/cod",
          orderData,
          { headers: { token } }
        )

        if (response.data.success) {
          if (setCartItems) setCartItems({})
          navigate("/verify?success=cod&orderId=" + (response.data.orderId || ""))
        } else {
          alert(response.data.message || "Error placing order")
        }
      }

      // 🔵 ONLINE PAYMENT (Stripe)
      if (paymentMethod === "ONLINE") {
        const response = await axios.post(
          url + "/api/orders/place",
          orderData,
          { headers: { token } }
        )

        if (response.data.success && response.data.session_url) {
          if (setCartItems) setCartItems({})
          window.location.replace(response.data.session_url)
        } else {
          alert(response.data.message || "Stripe payment unavailable. Please try Cash on Delivery.")
        }
      }
    } catch (error) {
      console.error("Place Order Error:", error)
      alert("Something went wrong while placing your order. Please check your connection and try again.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!token) {
      alert("Please sign in first to place your order.")
      navigate('/cart')
    } else if (getTotalCartAmount() === 0) {
      navigate('/cart')
    }
  }, [token])

  return (
    <form onSubmit={placeOrder} className='place-order'>

      <div className="place-order-left">
        <p className="title">Delivery Information</p>

        <div className="multi-fields">
          <input required name='firstName' onChange={onChangeHandler} value={data.firstName} placeholder='First name' />
          <input required name='lastName' onChange={onChangeHandler} value={data.lastName} placeholder='Last name' />
        </div>

        <input required name='email' onChange={onChangeHandler} value={data.email} type="email" placeholder='Email address' />
        <input required name='street' onChange={onChangeHandler} value={data.street} placeholder='Street address' />

        <div className="multi-fields">
          <input required name='city' onChange={onChangeHandler} value={data.city} placeholder='City' />
          <input required name='state' onChange={onChangeHandler} value={data.state} placeholder='State' />
        </div>

        <div className="multi-fields">
          <input required name='zipcode' onChange={onChangeHandler} value={data.zipcode} placeholder='Zip code' />
          <input required name='country' onChange={onChangeHandler} value={data.country} placeholder='Country' />
        </div>

        <input required name='phone' onChange={onChangeHandler} value={data.phone} type="tel" placeholder='Phone number' />
      </div>

      <div className="place-order-right">
        <div className="cart-total">
          <h2>Cart Totals</h2>

          <div className="cart-total-details">
            <p>Subtotal</p>
            <p>₹{getTotalCartAmount()}</p>
          </div>

          <div className="cart-total-details">
            <p>Delivery Fee</p>
            <p>₹2</p>
          </div>

          <div className="cart-total-details total">
            <b>Total</b>
            <b>₹{getTotalCartAmount() + 2}</b>
          </div>

          <div className="payment-method">
            <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", marginBottom: "8px" }}>
              <input
                type="radio"
                value="COD"
                checked={paymentMethod === "COD"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <span>💵 Cash on Delivery (Recommended)</span>
            </label>

            <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
              <input
                type="radio"
                value="ONLINE"
                checked={paymentMethod === "ONLINE"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <span>💳 Online Payment (Stripe)</span>
            </label>
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "PLACING ORDER..." : "PROCEED TO ORDER"}
          </button>
        </div>
      </div>

    </form>
  )
}

export default PlaceOrder
