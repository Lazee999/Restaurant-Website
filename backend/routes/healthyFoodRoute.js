import express from "express";
import { addHealthyFood, listHealthyFood, removeHealthyFood } from "../controllers/healthyFoodController.js";
import multer from "multer";

const healthyFoodRouter = express.Router();

const storage = multer.diskStorage({

    destination: "uploads",

    filename: (req, file, cb) => {
        return cb(null, `${Date.now()}${file.originalname}`);
    }
});

const upload = multer({ storage: storage });


healthyFoodRouter.post("/add", upload.single("image"), addHealthyFood);
healthyFoodRouter.get("/list", listHealthyFood);
healthyFoodRouter.post("/remove", removeHealthyFood);

export default healthyFoodRouter;
