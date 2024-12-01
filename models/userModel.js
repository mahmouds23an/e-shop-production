import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    profilePicture: {
      type: String,
    },
    cartData: {
      type: Object,
      default: {},
    },
  },
  { minimize: false }
);

const userModel = mongoose.models.User || mongoose.model("User", userSchema);
export default userModel;
