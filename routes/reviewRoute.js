import express from "express";
import {
  addReview,
  getReviewsByProductId,
  editReview,
  deleteYourOwnReview,
} from "../controllers/reviewController.js";
import authUser from "../middleware/auth.js";

const reviewRouter = express.Router();

reviewRouter.post("/add", authUser, addReview);
reviewRouter.get("/get/:productId", getReviewsByProductId);
reviewRouter.post("/edit/:reviewId", authUser, editReview);
reviewRouter.post("/delete/:reviewId", authUser, deleteYourOwnReview);

export default reviewRouter;
