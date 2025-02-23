import express from "express";
import {
  addPromoCode,
  getAllPromoCodes,
  updatePromoCode,
  deletePromoCode,
  markPromoCodeAsUsed,
} from "../controllers/promoCodeController.js";
import adminAuth from "../middleware/adminAuth.js";

const promoCodeRouter = express.Router();

promoCodeRouter.post("/add", adminAuth, addPromoCode);
promoCodeRouter.get("/get", getAllPromoCodes);
promoCodeRouter.post("/update", adminAuth, updatePromoCode);
promoCodeRouter.post("/delete", adminAuth, deletePromoCode);
promoCodeRouter.post("/mark-as-used", markPromoCodeAsUsed);

export default promoCodeRouter;
