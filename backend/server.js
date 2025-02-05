import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';
import foodRouter from './routes/foodRoute.js';
import healthyFoodRouter from './routes/healthyFoodRoute.js';
import userRouter from './routes/userRoute.js';
import cartRouter from './routes/cartRoute.js';
import orderRouter from './routes/orderRoute.js';


const app = express();
const port = 4000;

app.use(express.json());
app.use(cors());

// Database connection MongoDB
connectDB();

app.use("/api/food", foodRouter);
app.use("/api/healthyFood", healthyFoodRouter);
app.use("/images", express.static('uploads'));
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);


app.get("/", (req, res) => {
    res.send("Hello World");
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ success: false, message: "Internal Server Error" });
});


app.listen(port, () => {
    console.log(`Server Started on http://localhost:${port}`);
});