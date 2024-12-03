import userModel from "../models/userModel.js";
import reviewModel from "../models/reviewModel.js";
import validator from "validator";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";
const avatar =
  "https://w7.pngwing.com/pngs/463/441/png-transparent-avatar-human-people-profile-user-web-user-interface-icon.png";

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

const registerUser = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      profilePicture,
      favoriteProducts,
    } = req.body;
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ success: false, message: "Invalid email" });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new userModel({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      profilePicture,
      favoriteProducts,
    });

    const user = await newUser.save();
    const token = createToken(user._id);

    return res
      .status(201)
      .json({ success: true, message: "User created and logged in", token });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Wrong email or password" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res
        .status(400)
        .json({ success: false, message: "Wrong email or password" });
    }

    const token = createToken(user._id);
    return res
      .status(200)
      .json({ success: true, token, message: "Logged in successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const token = jwt.sign(email + password, process.env.JWT_SECRET);
      return res
        .status(200)
        .json({ success: true, token, message: "Logged in successfully" });
    } else {
      return res.status(400).json({
        success: false,
        error: true,
        message: "Wrong email or password",
      });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getCurrentUser = async (req, res) => {
  try {
    const userId = req.user.id;

    // Find user and populate favorite products and reviews
    const user = await userModel
      .findById(userId)
      .populate("favoriteProducts", "name")
      .exec();

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const reviews = await reviewModel
      .find({ userId })
      .populate("productId", "name")
      .exec();

    return res.status(200).json({
      success: true,
      user,
      reviews,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { firstName, lastName, email } = req.body;

    // Fetch the current user
    const user = await userModel.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Update profile fields
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (email) {
      if (!validator.isEmail(email)) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid email" });
      }
      user.email = email;
    }

    // Handle profile picture upload
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        resource_type: "image",
        folder: "avatars",
      });
      user.profilePicture = result.secure_url;
    }

    // Save updated user
    await user.save();
    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        profilePicture: user.profilePicture,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const removeProfilePicture = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await userModel.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (user.profilePicture && user.profilePicture !== avatar) {
      const publicId = user.profilePicture.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(`avatars/${publicId}`);
      user.profilePicture = avatar;
      await user.save();
    } else {
      return res.status(400).json({ message: "No picture to remove" });
    }
    return res
      .status(200)
      .json({ message: "Profile Picture removed successfully", success: true });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const addToFavorites = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.body;
    const user = await userModel.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    if (user.favoriteProducts.includes(productId)) {
      return res
        .status(400)
        .json({ success: false, message: "Product already in favorites" });
    }
    user.favoriteProducts.push(productId);
    await user.save();
    const updatedUser = await userModel
      .findById(userId)
      .populate("favoriteProducts", "name")
      .exec();
    return res
      .status(200)
      .json({ success: true, message: "Product added to favorites" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const removeFromFavorites = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.body;
    const user = await userModel.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    if (!user.favoriteProducts.includes(productId)) {
      return res
        .status(400)
        .json({ success: false, message: "Product not in favorites" });
    }
    user.favoriteProducts = user.favoriteProducts.filter(
      (id) => id !== productId
    );
    await user.save();
    return res
      .status(200)
      .json({ success: true, message: "Product removed from favorites" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export {
  registerUser,
  loginUser,
  adminLogin,
  getCurrentUser,
  updateUserProfile,
  removeProfilePicture,
  addToFavorites,
  removeFromFavorites,
};
