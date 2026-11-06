import React, { useContext, useEffect, useState } from 'react'
import './MyOrders.css'
import { StoreContext } from '../../components/context/StoreContext'
import axios from 'axios'
import { assets } from '../../assets/assets'
import { useNavigate } from 'react-router-dom'

const MyOrders = () => {

    const { url, token } = useContext(StoreContext)
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    const fetchOrders = async () => {
        try {
            setLoading(true)
            const response = await axios.post(
                url + "/api/orders/userorders",
                {},
                { headers: { token } }
            )
            if (response.data && response.data.success) {
                setData(response.data.data || [])
            }
        } catch (error) {
            console.error("Failed to load user orders:", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (token) {
            fetchOrders()
        } else {
            setLoading(false)
        }
    }, [token])

    return (
        <div className='my-orders'>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2>My Orders</h2>
                {token && (
                    <button
                        onClick={fetchOrders}
                        style={{
                            padding: '8px 16px',
                            backgroundColor: '#FF4C24',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontWeight: '600'
                        }}
                    >
                        🔄 Refresh
                    </button>
                )}
            </div>

            {!token ? (
                <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                    <p style={{ fontSize: '18px', color: '#666', marginBottom: '16px' }}>
                        Please sign in to view your orders.
                    </p>
                </div>
            ) : loading ? (
                <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                    <p style={{ fontSize: '18px', color: '#666' }}>Loading your orders...</p>
                </div>
            ) : data.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                    <img src={assets.parcel_icon} alt="No orders" style={{ width: '80px', opacity: 0.6, marginBottom: '16px' }} />
                    <p style={{ fontSize: '18px', color: '#666', marginBottom: '16px' }}>
                        You haven't placed any orders yet.
                    </p>
                    <button
                        onClick={() => navigate('/')}
                        style={{
                            padding: '10px 24px',
                            backgroundColor: '#FF4C24',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '15px',
                            fontWeight: '600'
                        }}
                    >
                        Explore Menu
                    </button>
                </div>
            ) : (
                <div className="container">
                    {data.map((order, index) => {
                        const address = order.address
                            ? `${order.address.street || ''}, ${order.address.city || ''}, ${order.address.state || ''}, ${order.address.country || ''}`
                            : 'Delivery Address'

                        return (
                            <div key={order._id || index} className='my-orders-order'>
                                <img src={assets.parcel_icon} alt="Parcel" />

                                <p>
                                    {order.items &&
                                        order.items.map((item, i) =>
                                            i === order.items.length - 1
                                                ? `${item.name} x ${item.quantity}`
                                                : `${item.name} x ${item.quantity}, `
                                        )}
                                </p>

                                <p>₹{order.amount}.00</p>
                                <p>Items: {order.items ? order.items.length : 0}</p>

                                <p className="order-status">
                                    <span>&#x25cf;</span> <b>{order.status}</b>
                                </p>

                                {/* Order Map */}
                                <div className="order-map">
                                    <iframe
                                        title={`Order Map ${index}`}
                                        src={`https://maps.google.com/maps?q=${encodeURIComponent(address)}&output=embed`}
                                        loading="lazy"
                                    ></iframe>
                                </div>

                                <button onClick={fetchOrders}>Track Order</button>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}

export default MyOrders
