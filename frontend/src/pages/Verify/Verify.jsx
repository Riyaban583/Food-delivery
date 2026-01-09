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
    const response = await axios.post(
      url + "/api/order/verify",
      { success, orderId }
    )

    if (response.data.success) {
      setPaymentStatus("success")
    } else {
      setPaymentStatus("failed")
      setTimeout(() => navigate("/"), 3000)
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
          <h3>Processing Payment...</h3>
        </div>
      )}

      {paymentStatus === "success" && (
        <div className="verify-card success">
          <div className="checkmark">✓</div>
          <h2>Payment Successful</h2>
          <p>Your order has been placed successfully 🎉</p>

          {/* ✅ NEW BUTTONS */}
          <div className="verify-actions">
            <button onClick={() => navigate("/myorders")}>
              My Orders
            </button>

            <button className="secondary" onClick={() => navigate("/")}>
              Go to Dashboard
            </button>
          </div>
        </div>
      )}

      {paymentStatus === "failed" && (
        <div className="verify-card failed">
          <div className="cross">✕</div>
          <h2>Payment Failed</h2>
          <p>Something went wrong. Please try again.</p>
        </div>
      )}
    </div>
  )
}

export default Verify
