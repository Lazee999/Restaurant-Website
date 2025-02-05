import healthyFoodModel from "../models/healthyfoodModel.js";
import fs from "fs";

const addHealthyFood = async (req, res) => {
    let image_filename = req.file?.filename || "";
    const healthyFood = new healthyFoodModel({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        category: req.body.category,
        image: image_filename,

    });

    try {
        await healthyFood.save();
        res.json({ success: true, message: "Healthy Food Added" });
    } catch (error) {
        console.error("Error adding healthy food:", error);
        res.json({ success: false, message: "Healthy Food Not Added", error: error.message });
    }
};

// all healthy food list
const listHealthyFood = async (req, res) => {
    try {
        const healthyFoods = await healthyFoodModel.find({});
        res.json({ success: true, data: healthyFoods });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error fetching healthy food items" });
    }
};


//remove food item

const removeHealthyFood = async (req, res) => {
    try {
        const healthyFood = await healthyFoodModel.findById(req.body.id);
        fs.unlink(`uploads/${healthyFood.image}`, () => { });
        await healthyFoodModel.findByIdAndDelete(req.body.id);
        res.json({ success: true, message: "Healthy Food Deleted" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error deleting healthy food item" });
    }
};

export { addHealthyFood, listHealthyFood, removeHealthyFood };