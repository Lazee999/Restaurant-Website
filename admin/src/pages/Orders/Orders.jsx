import React, { useState, useEffect } from 'react';
import './Orders.scss';
import toast from 'react-hot-toast';
import axios from 'axios';
import { assets } from '../../assets/assets';

const Orders = ({ url }) => {
    const [orders, setOrders] = useState([]);
    const [filter, setFilter] = useState('all'); // 'all' or 'month'
    const [analytics, setAnalytics] = useState({
        totalOrders: 0,
        totalRevenue: 0,
        averageOrderValue: 0,
    });

    const fetchAllOrders = async () => {
        try {
            const response = await axios.get(url + '/api/order/list');
            if (response.data.success) {
                const sortedOrders = response.data.data.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)).reverse();
                setOrders(sortedOrders);
                updateAnalytics(sortedOrders, filter);
            } else {
                toast.error("Error fetching orders");
            }
        } catch (error) {
            toast.error("Error fetching orders");
            console.error("Error fetching orders:", error);
        }
    };

    // Update analytics based on filter
    const updateAnalytics = (data, filterType) => {
        const now = new Date();
        const oneMonthAgo = new Date(now.setMonth(now.getMonth() - 1));

        const filteredOrders = filterType === 'month'
            ? data.filter(order => new Date(order.createdAt) >= oneMonthAgo)
            : data;

        const totalOrders = filteredOrders.length;
        const totalRevenue = filteredOrders.reduce((sum, order) => sum + order.amount, 0);
        const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

        setAnalytics({
            totalOrders,
            totalRevenue,
            averageOrderValue,
        });
    };

    // Handle status change
    const statusHandler = async (event, orderId) => {
        try {
            const response = await axios.post(url + "/api/order/status", {
                orderId,
                status: event.target.value
            });
            if (response.data.success) {
                await fetchAllOrders(); // Refresh orders after status update
            }
        } catch (error) {
            toast.error("Error updating order status");
            console.error("Error updating order status:", error);
        }
    };

    // Poll for new orders every minute
    useEffect(() => {
        fetchAllOrders(); // Initial fetch
        const intervalId = setInterval(fetchAllOrders, 60000); // Poll every minute
        return () => clearInterval(intervalId); // Cleanup interval on unmount
    }, []);

    // Handle filter toggle
    const handleFilterChange = (newFilter) => {
        setFilter(newFilter);
        updateAnalytics(orders, newFilter);
    };

    return (
        <div className='order add'>
            <h3>Order Page</h3>

            {/* Analytics Dashboard */}
            <div className="analytics">
                <h4>Monthly Analysis</h4>
                <div className="filter-buttons">
                    <button onClick={() => handleFilterChange('all')} className={filter === 'all' ? 'active' : ''}>
                        All Time
                    </button>
                    <button onClick={() => handleFilterChange('month')} className={filter === 'month' ? 'active' : ''}>
                        Past Month
                    </button>
                </div>
                <p>Total Orders: {analytics.totalOrders}</p>
                <p>Total Revenue: ${analytics.totalRevenue.toFixed(2)}</p>
                <p>Average Order Value: ${analytics.averageOrderValue.toFixed(2)}</p>
            </div>

            {/* Order List */}
            <div className="order-list">
                {orders.map((order, index) => (
                    <div key={index} className="order-item">
                        <img src={assets.parcel_icon} alt="Parcel Icon" />
                        <div>
                            <p className='order-item-food'>
                                {order.items.map((item, itemIndex) => (
                                    <span key={itemIndex}>
                                        {item.name} x {item.quantity}{itemIndex !== order.items.length - 1 ? ', ' : ''}
                                    </span>
                                ))}
                            </p>
                            <p className='order-item-name'>{order.address.firstName + " " + order.address.lastName}</p>
                            <div className='order-item-address'>
                                <p>{order.address.street + ", "}</p>
                                <p>{order.address.city + ", " + order.address.state + ", " + order.address.country + ", " + order.address.zipCode}</p>
                            </div>
                            <p className='order-item-phone'>{order.address.phone}</p>
                        </div>
                        <p>Items: {order.items.length}</p>
                        <p>${order.amount}</p>
                        <select onChange={(event) => statusHandler(event, order._id)} value={order.status}>
                            <option value="Food processing">Food Processing</option>
                            <option value="Out for delivery">Out for Delivery</option>
                            <option value="Delivered">Delivered</option>
                        </select>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Orders;