import userModel from "../models/userModel.js";
import reviewModel from "../models/reviewModel.js";
import validator from "validator";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
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
      name,
      email,
      password: hashedPassword,
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
    const user = await userModel.findById(userId);
    const reviews = await reviewModel
      .find({ userId })
      .populate("productId", "name")
      .exec();
    return res.status(200).json({ success: true, user, reviews });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export { registerUser, loginUser, adminLogin, getCurrentUser };