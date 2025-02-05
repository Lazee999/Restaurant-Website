import React, { useContext, useState, useEffect } from 'react';
import './PlaceOrder.scss';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PlaceOrder = () => {
    const { getTotalCartAmount, token, food_list, healthy_food, cartItems, url } = useContext(StoreContext);

    const [data, setData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        street: "",
        city: "",
        state: "",
        zipCode: "",
        country: "",
        phone: ""
    });

    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData(data => ({ ...data, [name]: value }));
    };

    const getAllOrderItems = () => {
        let orderItems = [];

        // Add food items
        food_list.forEach((item) => {
            if (cartItems[item._id] > 0) {
                orderItems.push({
                    ...item,
                    quantity: cartItems[item._id]
                });
            }
        });

        // Add healthy food items
        healthy_food.forEach((item) => {
            if (cartItems[item._id] > 0) {
                orderItems.push({
                    ...item,
                    quantity: cartItems[item._id]
                });
            }
        });

        return orderItems;
    };

    const placeOrder = async (event) => {
        event.preventDefault();
        setIsLoading(true);

        try {
            // Get all items 
            const orderItems = getAllOrderItems();

            // Prepare order data
            const orderData = {
                userId: token,
                address: data,
                items: orderItems,
                amount: getTotalCartAmount() + 1,
            };

            // Place the order
            const response = await axios.post(
                `${url}/api/order/place`,
                orderData,
                { headers: { token } }
            );

            if (response.data.success && response.data.session_url) {
                window.location.href = response.data.session_url;
            } else {
                alert("Error placing order: " + (response.data.message || "Unknown error"));
                setIsLoading(false);
            }
        } catch (error) {
            console.error("Error placing order:", error);
            alert("Error placing order: " + (error.response?.data?.message || error.message));
            setIsLoading(false);
        }
    };

    useEffect(() => {

        if (!token) {
            navigate('/login');
            return;
        }

        if (getTotalCartAmount() === 0) {
            navigate('/cart');
            return;
        }


        const urlParams = new URLSearchParams(window.location.search);
        const success = urlParams.get('success');
        const orderId = urlParams.get('orderId');

        if (success && orderId) {

            const verifyPayment = async () => {
                try {
                    const response = await axios.get(
                        `${url}/api/order/verify?success=${success}&orderId=${orderId}`,
                        { headers: { token } }
                    );

                    if (response.data.success) {
                        navigate('/myorders');
                    } else {
                        navigate('/');
                    }
                } catch (error) {
                    console.error("Payment verification error:", error);
                    navigate('/');
                }
            };

            verifyPayment();
        }
    }, [token, getTotalCartAmount(), navigate]);

    return (
        <form onSubmit={placeOrder} className="place-order">
            <div className="place-order-left">
                <p className="title">Delivery Information</p>
                <div className="multi-fields">
                    <input required name="firstName" onChange={onChangeHandler} value={data.firstName} type="text" placeholder="First Name" />
                    <input required name="lastName" onChange={onChangeHandler} value={data.lastName} type="text" placeholder="Last Name" />
                </div>
                <input required name='email' onChange={onChangeHandler} value={data.email} type="email" placeholder="Email address" />
                <input required name='street' onChange={onChangeHandler} value={data.street} type="text" placeholder="Street " />
                <div className="multi-fields">
                    <input required name='city' onChange={onChangeHandler} value={data.city} type="text" placeholder="City" />
                    <input required name='state' onChange={onChangeHandler} value={data.state} type="text" placeholder="State" />
                </div>
                <div className="multi-fields">
                    <input required name='zipCode' onChange={onChangeHandler} value={data.zipCode} type="text" placeholder="Zip Code" />
                    <input required name='country' onChange={onChangeHandler} value={data.country} type="text" placeholder="Country" />
                </div>
                <input required name='phone' onChange={onChangeHandler} value={data.phone} type="text" placeholder="Phone" />
            </div>

            <div className="place-order-right">
                <div className="cart-total">
                    <h2>Cart Totals</h2>
                    <div>
                        <div className="cart-total-details">
                            <p>Subtotal:</p>
                            <p>${getTotalCartAmount()}</p>
                        </div>
                        <div className="cart-total-details">
                            <p>Delivery Fee</p>
                            <p>${getTotalCartAmount() === 0 ? 0 : 1}</p>
                        </div>
                        <div className="cart-total-details">
                            <p>Total</p>
                            <p>${getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 1}</p>
                        </div>
                    </div>
                    <button type='submit' disabled={isLoading}>
                        {isLoading ? 'PROCESSING...' : 'PROCEED TO PAYMENT'}
                    </button>
                </div>
            </div>
        </form>
    );
};

export default PlaceOrder;


