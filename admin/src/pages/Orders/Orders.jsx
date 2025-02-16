import React, { useState, useEffect } from 'react';
import './Orders.scss';
import toast from 'react-hot-toast';
import axios from 'axios';
import { assets } from '../../assets/assets';

const Orders = ({ url }) => {
    const [orders, setOrders] = useState([]);
    const [filter, setFilter] = useState('all'); // 'all' or 'month'
    const [sortOrder, setSortOrder] = useState('desc'); // 'asc' or 'desc'
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const ordersPerPage = 5;

    const [analytics, setAnalytics] = useState({
        totalOrders: 0,
        totalRevenue: 0,
        averageOrderValue: 0,
    });

    // Fetch orders
    const fetchAllOrders = async () => {
        try {
            const response = await axios.get(url + '/api/order/list');
            if (response.data.success) {
                let sortedOrders = response.data.data.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
                if (sortOrder === 'asc') sortedOrders.reverse();

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

    // Update analytics
    const updateAnalytics = (data, filterType) => {
        const now = new Date();
        const oneMonthAgo = new Date(now.setMonth(now.getMonth() - 1));

        const filteredOrders = filterType === 'month'
            ? data.filter(order => new Date(order.createdAt) >= oneMonthAgo)
            : data;

        const totalOrders = filteredOrders.length;
        const totalRevenue = filteredOrders.reduce((sum, order) => sum + order.amount, 0);
        const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

        setAnalytics({ totalOrders, totalRevenue, averageOrderValue });
    };

    // Update order status
    const statusHandler = async (event, orderId) => {
        try {
            const response = await axios.post(url + "/api/order/status", {
                orderId,
                status: event.target.value
            });
            if (response.data.success) {
                await fetchAllOrders();
            }
        } catch (error) {
            toast.error("Error updating order status");
            console.error("Error updating order status:", error);
        }
    };

    // Auto-refresh orders every 30 seconds
    useEffect(() => {
        fetchAllOrders();
        const intervalId = setInterval(fetchAllOrders, 30000);
        return () => clearInterval(intervalId);
    }, [sortOrder]);

    // Handle filter change
    const handleFilterChange = (newFilter) => {
        setFilter(newFilter);
        updateAnalytics(orders, newFilter);
    };

    // Filtered search results
    const filteredOrders = orders.filter(order =>
        order.address.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.address.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.items.some(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    // Pagination
    const paginatedOrders = filteredOrders.slice((currentPage - 1) * ordersPerPage, currentPage * ordersPerPage);

    return (
        <div className='orders-container'>
            <h3>Order Management</h3>

            {/* Search Bar */}
            <input
                type="text"
                placeholder="Search orders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-bar"
            />

            {/* Sorting & Filters */}
            <div className="controls">
                <button onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}>
                    Sort: {sortOrder === 'asc' ? 'Oldest First' : 'Newest First'}
                </button>
                <button onClick={() => handleFilterChange('all')} className={filter === 'all' ? 'active' : ''}>
                    All Time
                </button>
                <button onClick={() => handleFilterChange('month')} className={filter === 'month' ? 'active' : ''}>
                    Past Month
                </button>
            </div>

            {/* Analytics */}
            <div className="analytics">
                <h4>Order Summary</h4>
                <p>Total Orders: {analytics.totalOrders}</p>
                <p>Total Revenue: ${analytics.totalRevenue.toFixed(2)}</p>
                <p>Average Order Value: ${analytics.averageOrderValue.toFixed(2)}</p>
            </div>

            {/* Order List */}
            <div className="order-list">
                {paginatedOrders.map((order, index) => (
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
                            <p className='order-item-name'>{order.address.firstName} {order.address.lastName}</p>
                            <p className='order-item-phone'>{order.address.phone}</p>
                        </div>
                        <p>Items: {order.items.length}</p>
                        <p>${order.amount}</p>
                        <p className={`order-status ${order.status.replace(/\s+/g, '-').toLowerCase()}`}>
                            {order.status}
                        </p>
                        <select onChange={(event) => statusHandler(event, order._id)} value={order.status}>
                            <option value="Food processing">Food Processing</option>
                            <option value="Out for delivery">Out for Delivery</option>
                            <option value="Delivered">Delivered</option>
                        </select>
                    </div>
                ))}
            </div>

            {/* Pagination Controls */}
            <div className="pagination">
                <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>Prev</button>
                <span>Page {currentPage}</span>
                <button disabled={currentPage * ordersPerPage >= filteredOrders.length} onClick={() => setCurrentPage(currentPage + 1)}>Next</button>
            </div>
        </div>
    );
};

export default Orders;
