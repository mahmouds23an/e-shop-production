import mongoose from "mongoose";

const feedBackSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    phone: {
      type: String,
    },
    feedBack: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const feedBackModel =
  mongoose.models.FeedBack || mongoose.model("FeedBack", feedBackSchema);

export default feedBackModel;
