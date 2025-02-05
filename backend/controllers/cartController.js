import userModel from "../models/userModel.js";
import bcrypt from "bcrypt";
const addToCart = async (req, res) => {
    try {
        let userData = await userModel.findOne({ _id: req.body.userId });
        let cartData = await userData.cartData;
        if (!cartData[req.body.itemId]) {

            cartData[req.body.itemId] = 1;
        }
        else {
            cartData[req.body.itemId] += 1;
        }
        await userModel.findByIdAndUpdate(req.body.userId, { cartData });
        res.json({ success: true, message: "Item added to cart" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error adding item to cart" });
    }
}
// remove items from user cart
const removeFromCart = async (req, res) => {
    try {
        let userData = await userModel.findOne({ _id: req.body.userId });
        let cartData = await userData.cartData;
        if (cartData[req.body.itemId] > 1) {
            cartData[req.body.itemId] -= 1;
        }
        await userModel.findByIdAndUpdate(req.body.userId, { cartData });
        res.json({ success: true, message: "Item removed from cart" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error removing item from cart" });
    }

}
// fetch user cart data
const getCart = async (req, res) => {
    try {
        let userData = await userModel.findOne({ _id: req.body.userId });
        let cartData = await userData.cartData;
        res.json({ success: true, cartData });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error fetching cart data" });
    }
}

export { addToCart, removeFromCart, getCart };