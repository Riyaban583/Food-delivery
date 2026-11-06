import React, { useContext, useEffect, useState } from 'react'
import './Verify.css'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { StoreContext } from '../../components/context/StoreContext'
import axios from 'axios'

const Verify = () => {

  const [searchParams] = useSearchParams()
  const success = searchParams.get("success")
  const orderId = searchParams.get("orderId")
  const { url } = useContext(StoreContext)
  const navigate = useNavigate()

  const [paymentStatus, setPaymentStatus] = useState("processing")

  const verifyPayment = async () => {
    // 🟢 CASH ON DELIVERY
    if (success === "cod") {
      setPaymentStatus("success")
      return
    }

    // 🔵 ONLINE PAYMENT
    try {
      const response = await axios.post(
        url + "/api/orders/verify",
        { success, orderId }
      )

      if (response.data && response.data.success) {
        setPaymentStatus("success")
      } else {
        setPaymentStatus("failed")
      }
    } catch (error) {
      console.error("Payment verification error:", error)
      setPaymentStatus("failed")
    }
  }

  useEffect(() => {
    verifyPayment()
  }, [])

  return (
    <div className="verify-container">

      {paymentStatus === "processing" && (
        <div className="verify-card">
          <div className="spinner"></div>
          <h3>Processing Order...</h3>
        </div>
      )}

      {paymentStatus === "success" && (
        <div className="verify-card success">
          <div className="checkmark">✓</div>
          <h2>Order Confirmed!</h2>
          <p>
            {success === "cod"
              ? "Your Cash on Delivery order has been successfully placed 🎉"
              : "Your payment was successful and your order is placed 🎉"}
          </p>

          <div className="verify-actions">
            <button onClick={() => navigate("/myorders")}>
              View My Orders
            </button>

            <button className="secondary" onClick={() => navigate("/")}>
              Back to Home
            </button>
          </div>
        </div>
      )}

      {paymentStatus === "failed" && (
        <div className="verify-card failed">
          <div className="cross">✕</div>
          <h2>Payment Failed</h2>
          <p>We could not process your payment. Please try again or choose Cash on Delivery.</p>
          <div className="verify-actions" style={{ marginTop: '20px' }}>
            <button onClick={() => navigate("/cart")}>
              Return to Cart
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Verify
