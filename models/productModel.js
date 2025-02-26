import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    discountedPrice: {
      type: Number,
      required: false,
    },
    costPrice: {
      type: Number,
      required: true,
    },
    image: {
      type: Array,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    subCategory: {
      type: String,
      required: true,
    },
    sizes: {
      type: Array,
      required: true,
    },
    bestSeller: {
      type: Boolean,
    },
    date: {
      type: Number,
      required: true,
    },
    discountStatus: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    collection: {
      type: String,
      enum: ["Winter", "Summer", "Others"],
      default: "Others",
    },
  },
  { timestamps: true }
);

const productModel =
  mongoose.models.Product || mongoose.model("Product", productSchema);
export default productModel;
