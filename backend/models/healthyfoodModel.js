
import mongoose from "mongoose";

const healthyFoodSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    category: { type: String, required: true },
});

const healthyFoodModel = mongoose.models.healthyFood || mongoose.model("healthyFood", healthyFoodSchema);

export default healthyFoodModel;
