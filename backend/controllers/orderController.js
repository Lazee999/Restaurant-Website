import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";
import { json } from "express";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const placeOrder = async (req, res) => {
    const frontend_url = "http://localhost:5173";


    try {
        const newOrder = new orderModel({
            userId: req.body.userId,
            items: req.body.items,
            amount: req.body.amount,
            address: req.body.address,
        });
        await newOrder.save();


        await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

        const line_items = req.body.items.map((item) => ({
            price_data: {
                currency: "usd",
                product_data: {
                    name: item.name,
                },
                unit_amount: item.price * 100,
            },
            quantity: item.quantity,
        }));

        line_items.push({
            price_data: {
                currency: "usd",
                product_data: {
                    name: "Delivery Charges",
                },
                unit_amount: 1 * 100,
            },
            quantity: 1,
        });


        const session = await stripe.checkout.sessions.create({
            line_items: line_items,
            mode: "payment",
            success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
        });

        res.json({ success: true, session_url: session.url });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error placing order" });
    }
};


const verifyOrder = async (req, res) => {
    const { orderId, success } = req.body;  // Changed from req.query to req.body

    if (!orderId) {
        return res.status(400).json({
            success: false,
            message: "Order ID is required"
        });
    }

    try {
        if (success === "true") {
            const order = await orderModel.findByIdAndUpdate(
                orderId,
                {
                    payment: true,
                    status: 'Processing'
                },
                { new: true }
            );

            if (!order) {
                return res.status(404).json({
                    success: false,
                    message: "Order not found"
                });
            }

            // Clear cart data
            if (order.userId) {
                await userModel.findByIdAndUpdate(order.userId, { cartData: {} });
            }

            return res.json({
                success: true,
                message: "Payment Successful",
                redirect: '/myorders'
            });
        } else {
            // If payment failed, delete the order
            await orderModel.findByIdAndDelete(orderId);

            return res.json({
                success: false,
                message: "Payment Cancelled",
                redirect: '/'
            });
        }
    } catch (error) {
        console.error("Verification error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            redirect: '/'
        });
    }
};


const userOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({ userId: req.body.userId, payment: true });
        res.json({ success: true, orders });
    } catch (error) {
        console.log("Error fetching orders:", error);
        res.json({ success: false, message: "Error fetching orders" });
    }
};

const cancelOrder = async (req, res) => {
    const { orderId } = req.body;

    try {
        const order = await orderModel.findById(orderId);
        if (!order) {
            return res.json({ success: false, message: "Order not found" });
        }

        if (order.status !== 'Processing') {
            return res.json({ success: false, message: "Order cannot be cancelled" });
        }

        await orderModel.findByIdAndUpdate(orderId, { status: 'Cancelled' });

        res.json({ success: true, message: "Order cancelled successfully" });
    } catch (error) {
        console.error("Error cancelling order:", error);
        res.json({ success: false, message: "Error cancelling order" });
    }
};


const listOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({});
        res.json({ success: true, data: orders });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error fetching orders" });
    }
};

const updateStatus = async (req, res) => {
    try {
        await orderModel.findByIdAndUpdate(req.body.orderId, { status: req.body.status });
        res.json({ success: true, message: "Status updated" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error updating status" });
    }
};

export { placeOrder, verifyOrder, userOrders, listOrders, updateStatus, cancelOrder };



