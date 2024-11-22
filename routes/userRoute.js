import express from "express";
import {
  registerUser,
  loginUser,
  adminLogin,
  getCurrentUser,
  updateUserProfile,
} from "../controllers/userController.js";
import authUser from "../middleware/auth.js";
import upload from "../middleware/multer.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/admin-login", adminLogin);
userRouter.get("/current-user", authUser, getCurrentUser);
userRouter.post(
  "/update-profile",
  authUser,
  upload.single("profilePicture"),
  updateUserProfile
);

export default userRouter;
