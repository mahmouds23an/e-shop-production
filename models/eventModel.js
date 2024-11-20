import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  linkText: {
    type: String,
    default: "Shop Now",
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  endDate: {
    type: Date,
  },
});

const eventModel =
  mongoose.models.Event || mongoose.model("Event", eventSchema);
export default eventModel;
