import React, { useContext, useEffect, useState } from 'react'
import './MyOrders.css'
import { StoreContext } from '../../components/context/StoreContext'
import axios from 'axios'
import { assets } from '../../assets/assets'

const MyOrders = () => {

    const { url, token } = useContext(StoreContext)
    const [data, setData] = useState([])

    const fetchOrders = async () => {
        const response = await axios.post(
            url + "/api/orders/userorders",
            {},
            { headers: { token } }
        )
        setData(response.data.data)
    }

    useEffect(() => {
        if (token) {
            fetchOrders()
        }
    }, [token])

    return (
        <div className='my-orders'>
            <h2>My Orders</h2>

            <div className="container">
                {data.map((order, index) => {

                    const address = `${order.address.street}, ${order.address.city}, ${order.address.state}, ${order.address.country}, ${order.address.zipcode}`

                    return (
                        <div key={index} className='my-orders-order'>

                            <img src={assets.parcel_icon} alt="" />

                            <p>
                                {order.items.map((item, i) =>
                                    i === order.items.length - 1
                                        ? `${item.name} x ${item.quantity}`
                                        : `${item.name} x ${item.quantity}, `
                                )}
                            </p>

                            <p>₹{order.amount}.00</p>
                            <p>Items: {order.items.length}</p>

                            <p className="order-status">
                                <span>&#x25cf;</span> {order.status}
                            </p>

                            {/* ✅ MAP ADDED */}
                            <div className="order-map">
                                <iframe
                                    title="Order Location"
                                    src={`https://maps.google.com/maps?q=${encodeURIComponent(address)}&output=embed`}
                                    loading="lazy"
                                ></iframe>
                            </div>

                            <button onClick={fetchOrders}>Refresh Order</button>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default MyOrders
