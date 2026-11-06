import React, { useEffect, useState } from "react"
import "./Orders.css"
import axios from "axios"
import { toast } from "react-toastify"
import { assets } from "../../assets/assets"

const Orders = ({ url = "http://localhost:4000" }) => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("All")

  const fetchAllOrders = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${url}/api/orders/list`)
      if (response.data.success) {
        setOrders(response.data.data.reverse())
      } else {
        toast.error("Error loading orders")
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error)
      toast.error("Could not connect to server")
    } finally {
      setLoading(false)
    }
  }

  const statusHandler = async (event, orderId) => {
    const newStatus = event.target.value
    try {
      const response = await axios.post(`${url}/api/orders/status`, {
        orderId,
        status: newStatus
      })
      if (response.data.success) {
        toast.success(`Order status updated to: ${newStatus}`)
        await fetchAllOrders()
      } else {
        toast.error("Failed to update status")
      }
    } catch (error) {
      console.error("Status update error:", error)
      toast.error("Error updating order status")
    }
  }

  useEffect(() => {
    fetchAllOrders()
  }, [])

  // Calculations for stats
  const totalOrders = orders.length
  const processingCount = orders.filter(o => o.status === "Food Processing").length
  const outForDeliveryCount = orders.filter(o => o.status === "Out for Delivery").length
  const deliveredCount = orders.filter(o => o.status === "Delivered").length

  const filteredOrders = filter === "All" 
    ? orders 
    : orders.filter(o => o.status === filter)

  return (
    <div className="orders-container">
      {/* Page Header */}
      <div className="orders-header">
        <div>
          <h1 className="page-title">Orders Management</h1>
          <p className="page-subtitle">Track, update and fulfill customer food orders in real-time.</p>
        </div>

        <button onClick={fetchAllOrders} className="btn-refresh" title="Reload orders">
          <span>🔄</span> Refresh Orders
        </button>
      </div>

      {/* Top Stat Cards */}
      <div className="orders-stats-grid">
        <div className="stat-card" onClick={() => setFilter("All")}>
          <span className="stat-icon stat-all">📦</span>
          <div className="stat-data">
            <span className="stat-number">{totalOrders}</span>
            <span className="stat-title">Total Orders</span>
          </div>
        </div>

        <div className="stat-card" onClick={() => setFilter("Food Processing")}>
          <span className="stat-icon stat-processing">👨‍🍳</span>
          <div className="stat-data">
            <span className="stat-number">{processingCount}</span>
            <span className="stat-title">Processing</span>
          </div>
        </div>

        <div className="stat-card" onClick={() => setFilter("Out for Delivery")}>
          <span className="stat-icon stat-delivery">🚚</span>
          <div className="stat-data">
            <span className="stat-number">{outForDeliveryCount}</span>
            <span className="stat-title">Out for Delivery</span>
          </div>
        </div>

        <div className="stat-card" onClick={() => setFilter("Delivered")}>
          <span className="stat-icon stat-delivered">✅</span>
          <div className="stat-data">
            <span className="stat-number">{deliveredCount}</span>
            <span className="stat-title">Delivered</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="filter-tabs">
        {["All", "Food Processing", "Out for Delivery", "Delivered", "Cancelled"].map((tab) => (
          <button
            key={tab}
            className={`filter-tab ${filter === tab ? "active" : ""}`}
            onClick={() => setFilter(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Orders List */}
      {loading ? (
        <div className="orders-empty-state">
          <div className="spinner"></div>
          <p>Loading real-time orders...</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="orders-empty-state">
          <img src={assets.parcel_icon} alt="No orders" className="empty-icon" />
          <h3>No Orders Found</h3>
          <p>
            {filter === "All" 
              ? "No customer orders have been placed yet." 
              : `There are currently no orders in "${filter}" status.`}
          </p>
        </div>
      ) : (
        <div className="orders-list">
          {filteredOrders.map((order) => (
            <div key={order._id} className="order-item-card">
              <div className="order-card-icon-wrap">
                <img src={assets.parcel_icon} alt="Parcel" className="order-parcel-img" />
                <span className="order-id-badge">#{order._id.slice(-6).toUpperCase()}</span>
              </div>

              <div className="order-details-col">
                <div className="order-items-text">
                  {order.items?.map((item, i) => (
                    <span key={i} className="food-tag">
                      {item.name} <strong>x{item.quantity}</strong>
                      {i < order.items.length - 1 ? ", " : ""}
                    </span>
                  ))}
                </div>

                <div className="order-customer-box">
                  <div className="customer-row">
                    <span className="detail-icon">👤</span>
                    <strong>
                      {order.address?.firstName ? `${order.address.firstName} ${order.address.lastName}` : "Customer"}
                    </strong>
                    <span className="phone-badge">📞 {order.address?.phone || "No phone"}</span>
                  </div>

                  <div className="address-row">
                    <span className="detail-icon">📍</span>
                    <span>
                      {order.address
                        ? `${order.address.street}, ${order.address.city}, ${order.address.state} - ${order.address.zipcode}`
                        : "Address not available"}
                    </span>
                  </div>
                </div>

                <div className="order-footer-row">
                  <span className="order-date-text">
                    🕒 {order.date ? new Date(order.date).toLocaleString() : "Recent"}
                  </span>
                  <span className="order-items-count">
                    Items: <strong>{order.items?.length || 0}</strong>
                  </span>
                </div>
              </div>

              <div className="order-pricing-col">
                <span className="order-total-amount">₹{order.amount}.00</span>
                <span className={`payment-pill ${order.payment ? "paid" : "cod"}`}>
                  {order.payment ? "✓ Paid Online" : "💵 Cash on Delivery"}
                </span>

                <div className="status-selector-wrap">
                  <label>Update Status:</label>
                  <select
                    onChange={(e) => statusHandler(e, order._id)}
                    value={order.status}
                    className={`order-status-select status-${order.status.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    <option value="Food Processing">Food Processing</option>
                    <option value="Out for Delivery">Out for Delivery</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Orders
