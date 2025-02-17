import express from "express";
import {
  registerUser,
  loginUser,
  adminLogin,
  getCurrentUser,
  updateUserProfile,
  removeProfilePicture,
  addToFavorites,
  removeFromFavorites,
  getAllUsers,
} from "../controllers/userController.js";
import authUser from "../middleware/auth.js";
import uploadProfileImage from "../middleware/multer.js";
import adminAuth from "../middleware/adminAuth.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/admin-login", adminLogin);
userRouter.get("/current-user", authUser, getCurrentUser);
userRouter.post(
  "/update-profile",
  authUser,
  uploadProfileImage.single("profilePicture"),
  updateUserProfile
);
userRouter.post("/remove-profile-picture", authUser, removeProfilePicture);
userRouter.post("/add-to-favorites", authUser, addToFavorites);
userRouter.post("/remove-from-favorites", authUser, removeFromFavorites);
userRouter.get("/all-users", adminAuth, getAllUsers);

export default userRouter;
