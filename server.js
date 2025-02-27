import express from "express";
import cors from "cors";
import "dotenv/config";

// Another Imports
import connectCloudinary from "./config/cloudinary.js";
import userRouter from "./routes/userRoute.js";
import productRouter from "./routes/productRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";
import promoCodeRouter from "./routes/promoCodeRoute.js";
import feedBackRouter from "./routes/feedBackRoute.js";
import reviewRouter from "./routes/reviewRoute.js";

// App Config
const app = express();
const port = process.env.PORT || 3000;

// Middlewares
app.use(express.json());
app.use(cors());

// API Endpoints
app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);
app.use("/api/promo", promoCodeRouter);
app.use("/api/feedBack", feedBackRouter);
app.use("/api/review", reviewRouter);

// DB Config
import connectDB from "./config/mongodb.js";
connectDB();

// Cloudinary Config
connectCloudinary();

// Listener
app.listen(port, () => console.log(`Server working on port ${port}`));
