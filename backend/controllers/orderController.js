import dotenv from "dotenv";
dotenv.config();

import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";

const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;

// ================= ONLINE PAYMENT ORDER =================
const placeOrder = async (req, res) => {
    const frontend_url = process.env.FRONTEND_URL || "https://food-delivery-eosin-theta.vercel.app";

    try {
        if (!stripe) {
            return res.json({ success: false, message: "Stripe key not configured on server" });
        }

        const newOrder = new orderModel({
            userId: req.body.userId,
            items: req.body.items,
            amount: req.body.amount,
            address: req.body.address,
            payment: false
        });

        await newOrder.save();
        await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

        const line_items = req.body.items.map((item) => ({
            price_data: {
                currency: "inr",
                product_data: {
                    name: item.name
                },
                unit_amount: Math.round(item.price * 100)
            },
            quantity: item.quantity
        }));

        line_items.push({
            price_data: {
                currency: "inr",
                product_data: {
                    name: "Delivery Charges"
                },
                unit_amount: 2 * 100
            },
            quantity: 1
        });

        const session = await stripe.checkout.sessions.create({
            line_items,
            mode: "payment",
            success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
        });

        res.json({ success: true, session_url: session.url, orderId: newOrder._id });

    } catch (error) {
        console.log("Place Order Error:", error);
        res.json({ success: false, message: error.message || "Error placing order" });
    }
};

// ================= CASH ON DELIVERY ORDER =================
const placeOrderCOD = async (req, res) => {
    try {
        const newOrder = new orderModel({
            userId: req.body.userId,
            items: req.body.items,
            amount: req.body.amount,
            address: req.body.address,
            payment: false,
            status: "Food Processing"
        });

        await newOrder.save();
        await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

        res.json({
            success: true,
            message: "Order placed successfully with Cash on Delivery",
            orderId: newOrder._id
        });

    } catch (error) {
        console.log("COD Order Error:", error);
        res.json({ success: false, message: error.message || "Error placing order" });
    }
};

// ================= VERIFY ONLINE / COD PAYMENT =================
const verifyOrder = async (req, res) => {
    const { orderId, success } = req.body;

    try {
        if (!orderId) {
            return res.json({ success: false, message: "Order ID is required" });
        }

        if (success === "true" || success === "cod") {
            await orderModel.findByIdAndUpdate(orderId, { payment: true });
            return res.json({ success: true, message: "Payment verified successfully" });
        } else {
            await orderModel.findByIdAndUpdate(orderId, { payment: false });
            return res.json({ success: false, message: "Payment failed or cancelled" });
        }
    } catch (error) {
        console.log("Verify Error:", error);
        res.json({ success: false, message: error.message });
    }
};

// ================= USER ORDERS =================
const userOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({ userId: req.body.userId }).sort({ date: -1 });
        res.json({ success: true, data: orders });
    } catch (error) {
        console.log("User Orders Error:", error);
        res.json({ success: false, message: error.message });
    }
};

// ================= ADMIN ORDERS =================
const listOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({}).sort({ date: -1 });
        res.json({ success: true, data: orders });
    } catch (error) {
        console.log("List Orders Error:", error);
        res.json({ success: false, message: error.message });
    }
};

// ================= UPDATE ORDER STATUS =================
const updateStatus = async (req, res) => {
    try {
        await orderModel.findByIdAndUpdate(
            req.body.orderId,
            { status: req.body.status }
        );
        res.json({ success: true, message: "Status Updated" });
    } catch (error) {
        console.log("Update Status Error:", error);
        res.json({ success: false, message: error.message });
    }
};

export {
    placeOrder,
    placeOrderCOD,
    verifyOrder,
    userOrders,
    listOrders,
    updateStatus
};
