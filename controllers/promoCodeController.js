import promoCodeModel from "../models/promoCodeModel.js";

const addPromoCode = async (req, res) => {
  try {
    const { code, discountPercentage, endDate, isActive, useManyTimes } =
      req.body;

    // Check if promo code already exists
    const existingCode = await promoCodeModel.findOne({ code });
    if (existingCode) {
      return res
        .status(400)
        .json({ success: false, message: "Promo code already exists." });
    }

    // If useManyTimes is false, set endDate to one month from now
    const finalEndDate =
      useManyTimes === false
        ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        : endDate;

    // Create new promo code
    const newPromoCode = new promoCodeModel({
      code,
      discountPercentage,
      endDate: finalEndDate,
      isActive,
      useManyTimes,
    });

    await newPromoCode.save();
    return res.status(201).json({
      message: "Promo code created successfully.",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

const getAllPromoCodes = async (req, res) => {
  try {
    const promoCodes = await promoCodeModel.find();
    if (!promoCodes) {
      return res
        .status(404)
        .json({ success: false, message: "No promo codes found." });
    }
    if (promoCodes.length === 0) {
      return res
        .status(200)
        .json({ success: true, message: "No promo codes found." });
    }
    return res.status(200).json(promoCodes);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const updatePromoCode = async (req, res) => {
  try {
    const { code, discountPercentage, endDate, isActive, id } = req.body;

    const updatedPromoCode = await promoCodeModel.findByIdAndUpdate(
      id,
      { code, discountPercentage, endDate, isActive },
      { new: true }
    );

    if (!updatedPromoCode) {
      return res
        .status(404)
        .json({ success: false, message: "Promo code not found." });
    }

    return res.status(200).json({
      message: "Promo code updated successfully.",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

const deletePromoCode = async (req, res) => {
  try {
    const { id } = req.body;

    const deletedPromoCode = await promoCodeModel.findByIdAndDelete(id);
    if (!deletedPromoCode) {
      return res
        .status(404)
        .json({ success: false, message: "Promo code not found." });
    }

    return res
      .status(200)
      .json({ success: true, message: "Promo code deleted successfully." });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

const markPromoCodeAsUsed = async (req, res) => {
  try {
    const { id } = req.body;

    const updatedPromoCode = await promoCodeModel.findByIdAndUpdate(
      id,
      { used: true, isActive: false }, // Mark as used and deactivate
      { new: true }
    );

    if (!updatedPromoCode) {
      return res
        .status(404)
        .json({ success: false, message: "Promo code not found." });
    }

    return res.status(200).json({
      message: "Promo code marked as used.",
      success: true,
      promoCode: updatedPromoCode,
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

export {
  addPromoCode,
  getAllPromoCodes,
  updatePromoCode,
  deletePromoCode,
  markPromoCodeAsUsed,
};
