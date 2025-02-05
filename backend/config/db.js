import mongoose from "mongoose";

export const connectDB = async () => {
    await mongoose.connect("mongodb+srv://lasithbhanuka:9920016688@cluster0.hirjc.mongodb.net/food-del").then(() => console.log("Database Connected"))
}


