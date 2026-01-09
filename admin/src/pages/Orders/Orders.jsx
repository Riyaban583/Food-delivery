import React, { useEffect, useState } from "react"
import "./Orders.css"

const Orders = () => {
  const [orders, setOrders] = useState([])

  // 🔥 DEMO ORDERS
  useEffect(() => {
    setOrders([
      {
        _id: "1",
        items: [
          { name: "Burger", quantity: 2 },
          { name: "Fries", quantity: 1 }
        ],
        address: {
          street: "MG Road",
          city: "Delhi",
          state: "Delhi",
          country: "India",
          zip: "110001",
          phone: "9876543210"
        },
        amount: 450,
        status: "Food Processing",
        date: "2025-12-22T10:30:00Z",
        image:
          "https://cdn-icons-png.flaticon.com/512/679/679720.png"
      },
      {
        _id: "2",
        items: [
          { name: "Pizza", quantity: 1 },
          { name: "Cold Drink", quantity: 2 }
        ],
        address: {
          street: "Sector 15",
          city: "Noida",
          state: "UP",
          country: "India",
          zip: "201301",
          phone: "9123456789"
        },
        amount: 620,
        status: "Out for Delivery",
        date: "2025-12-21T18:15:00Z",
        image:
          "https://cdn-icons-png.flaticon.com/512/3595/3595455.png"
      }
    ])
  }, [])

  return (
    <div className="orders-page">
      <h2>Order Page (Demo)</h2>

      {orders.map((order) => (
        <div key={order._id} className="order-card">

          {/* ✅ IMAGE URL */}
          <img src={order.image} alt="order" className="order-icon" />

          <div className="order-info">

            {/* ITEMS */}
            <p className="order-items">
              {order.items.map((item, i) =>
                i === order.items.length - 1
                  ? `${item.name} x ${item.quantity}`
                  : `${item.name} x ${item.quantity}, `
              )}
            </p>

            {/* ADDRESS */}
            <p>{order.address.street}</p>
            <p>
              {order.address.city}, {order.address.state},{" "}
              {order.address.country} - {order.address.zip}
            </p>

            {/* PHONE */}
            <p>{order.address.phone}</p>

            {/* META */}
            <p>Items : {order.items.length}</p>
            <p>₹{order.amount}</p>

            {/* ✅ DATE */}
            <p>
              Date: {new Date(order.date).toLocaleDateString()}
            </p>

            {/* STATUS */}
            <select
              value={order.status}
              className="status-dropdown"
            >
              <option value="Food Processing">Food Processing</option>
              <option value="Out for Delivery">Out for Delivery</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>

          </div>
        </div>
      ))}
    </div>
  )
}

export default Orders