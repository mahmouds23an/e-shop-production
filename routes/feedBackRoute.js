import express from "express";
import {
  userCreateFeedBack,
  adminGetAllFeedBacks,
  deleteFeedBack,
} from "../controllers/feedBackController.js";
import adminAuth from "../middleware/adminAuth.js";

const feedBackRouter = express.Router();

feedBackRouter.post("/add", userCreateFeedBack);
feedBackRouter.get("/get", adminAuth, adminGetAllFeedBacks);
feedBackRouter.post("/delete", adminAuth, deleteFeedBack);

export default feedBackRouter;
