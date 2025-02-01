import express from "express";
import {
  addProduct,
  listProducts,
  removeProduct,
  updateProduct,
  singleProduct,
  getPaginatedProducts,
  newCollection,
} from "../controllers/productController.js";
import upload from "../middleware/multer.js";
import adminAuth from "../middleware/adminAuth.js";

const productRouter = express.Router();

productRouter.post(
  "/add-product",
  adminAuth,
  upload.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
    { name: "image4", maxCount: 1 },
  ]),
  addProduct
);
productRouter.get("/get-products", listProducts);
productRouter.get("/get-product", singleProduct);
productRouter.post("/delete-product", adminAuth, removeProduct);
productRouter.post("/update-product", adminAuth, updateProduct);
productRouter.get("/get-paginated-products", getPaginatedProducts);
productRouter.get("/new-collection", newCollection);

export default productRouter;
