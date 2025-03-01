import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    items: {
      type: Array,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    address: {
      type: Object,
      required: true,
    },
    status: {
      type: String,
      required: true,
      default: "Order Placed",
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    payment: {
      type: Boolean,
      required: true,
      default: false,
    },
    date: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      default: 0,
    },
    delivery_fee: {
      type: Number,
      default: 0,
    },
    note: {
      type: String,
      default: "",
    },
    promoCode: {
      type: String,
      default: null,
    },
    orderCancelNote: {
      type: String,
      default: "",
    },
    review: {
      rating: {
        type: Number,
        min: 1,
        max: 5,
      },
      comment: {
        type: String,
      },
      userName: {
        type: String,
      },
      phone: {
        type: String,
      },
      date: {
        type: Date,
        default: Date.now(),
      },
    },
  },
  { timestamps: true }
);

const orderModel =
  mongoose.models.Order || mongoose.model("Order", orderSchema);

export default orderModel;
