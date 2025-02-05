import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import './MyOrders.scss';
import { StoreContext } from '../../context/StoreContext';
import { assets } from '../../assets/assets';
import { useNavigate } from 'react-router-dom';

const MyOrders = () => {
    const { url, token } = useContext(StoreContext);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const fetchUserOrders = async () => {
        try {
            setLoading(true);
            const response = await axios.post(
                `${url}/api/order/userorders`,
                {},
                {
                    headers: {
                        token,
                        'Cache-Control': 'no-cache',
                    },
                }
            );

            if (response.data.success) {
                setOrders(response.data.orders);
                setError(null);
            } else {
                toast.error("Failed to fetch your orders");
                setError("Failed to fetch orders");
            }
        } catch (error) {
            console.error("Error fetching orders:", error);
            setError("Error loading orders");
            toast.error("Error fetching orders");
        } finally {
            setLoading(false);
        }
    };

    const handleCancelOrder = async (orderId) => {
        const confirmCancel = window.confirm("Are you sure you want to cancel this order?");
        if (!confirmCancel) return;

        try {
            const response = await axios.post(
                `${url}/api/order/cancel`,
                { orderId },
                {
                    headers: { token },
                }
            );

            if (response.data.success) {
                toast.success("Order cancelled successfully!");
                // Update the orders list to reflect the cancellation
                setOrders((prevOrders) =>
                    prevOrders.map((order) =>
                        order._id === orderId ? { ...order, status: 'Cancelled' } : order
                    )
                );
            } else {
                toast.error(response.data.message || "Failed to cancel order");
            }
        } catch (error) {
            console.error("Error cancelling order:", error);
            toast.error("Error cancelling order");
        }
    };

    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }

        fetchUserOrders();

        const intervalId = setInterval(fetchUserOrders, 30000);

        return () => clearInterval(intervalId);
    }, [token, url]);


    useEffect(() => {
        if (orders.length > 0) {
            console.log("Orders:", orders);
        }
    }, [orders]);

    if (loading) {
        return (
            <div className='my-orders loading'>
                <div className="spinner"></div>
                <p>Loading your orders...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className='my-orders error'>
                <p>{error}</p>
                <button onClick={fetchUserOrders}>Try Again</button>
            </div>
        );
    }

    return (
        <div className='my-orders'>
            <h2>My Orders</h2>
            <div className="orders-container">
                {orders.length > 0 ? (
                    orders.map((order) => (
                        <div key={order._id} className="my-orders-order">
                            <img src={assets.parcel_icon} alt="Parcel Icon" />
                            <div className="order-details">
                                <p className="order-items">
                                    {order.items.map((item, itemIndex) => (
                                        <span key={itemIndex}>
                                            {item.name} x {item.quantity}
                                            {itemIndex !== order.items.length - 1 ? ', ' : ''}
                                        </span>
                                    ))}
                                </p>
                                <p className="order-amount">${order.amount}.00</p>
                                <p className="order-count">Items: {order.items.length}</p>
                                <p className="order-status">
                                    <span className={`status-dot ${order.status.toLowerCase()}`}>●</span>
                                    <b>{order.status}</b>
                                </p>
                            </div>
                            <div className="order-actions">
                                <button
                                    className="track-button"
                                    onClick={() => toast.success(`Order status: ${order.status}`)}
                                >
                                    Track Order
                                </button>
                                {order.status.toLowerCase() === 'processing' && (
                                    <button
                                        className="cancel-button"
                                        onClick={() => handleCancelOrder(order._id)}
                                    >
                                        Cancel Order
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="no-orders">
                        <p>No orders found.</p>
                        <button onClick={() => navigate('/')}>Start Ordering</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyOrders;