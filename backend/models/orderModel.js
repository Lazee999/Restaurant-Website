import mongoose from "mongoose";
import userModel from '../models/userModel.js';

const orderSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    items: { type: Array, required: true },
    amount: { type: Number, required: true },
    address: { type: Object, required: true },
    status: { type: String, default: "Food Processing" },
    date: { type: Date, default: Date.now },
    payment: { type: Boolean, default: false }
});

orderSchema.methods.updateStatus = async function (newStatus) {
    this.status = newStatus;
    return await this.save();
};

orderSchema.methods.markAsPaid = async function () {
    this.payment = true;
    return await this.save();
};


orderSchema.index({ userId: 1, date: -1 });
orderSchema.index({ status: 1 });

const orderModel = mongoose.models.order || mongoose.model("order", orderSchema);

export default orderModel;