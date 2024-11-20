import express from "express";
import {
  placeOrder,
  placeOrderStripe,
  allOrders,
  userOrders,
  updateStatus,
  reviewDeliveredOrder,
  getOrdersReviews,
  deleteAllOrdersReviews,
  getOrderById,
} from "../controllers/orderController.js";
import adminAuth from "../middleware/adminAuth.js";
import authUser from "../middleware/auth.js";

const orderRouter = express.Router();

// Admin Features
orderRouter.post("/list", adminAuth, allOrders);
orderRouter.post("/status", adminAuth, updateStatus);
orderRouter.get("/reviews", adminAuth, getOrdersReviews);
orderRouter.post("/delete-all-reviews", adminAuth, deleteAllOrdersReviews);

// User and Payment Features
orderRouter.post("/place", authUser, placeOrder);
orderRouter.post("/stripe", authUser, placeOrderStripe);
orderRouter.post("/user-orders", authUser, userOrders);
orderRouter.post("/review", authUser, reviewDeliveredOrder);
orderRouter.get("/:orderId", authUser, getOrderById);

export default orderRouter;
