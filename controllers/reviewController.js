import reviewModel from "../models/reviewModel.js";

const addReview = async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;
    const userId = req.user.id;

    const existingReview = await reviewModel.findOne({ productId, userId });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this product",
      });
    }

    const newReview = new reviewModel({
      productId,
      userId,
      rating,
      comment,
      userName: req.user.firstName + " " + req.user.lastName,
      userPicture: req.user.profilePicture,
      createdAt: Date.now(),
    });

    await newReview.save();
    return res.status(201).json({ success: true, message: "Review added" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const editReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { content, rating } = req.body;

    const userId = req.user.id;

    const review = await ReviewModel.findOne({ _id: reviewId, userId });
    if (!review) {
      return res.status(404).json({
        success: false,
        message:
          "Review not found or you are not authorized to edit this review",
      });
    }

    review.content = content || review.content;
    review.rating = rating || review.rating;

    await review.save();

    return res
      .status(200)
      .json({ success: true, message: "Review updated successfully", review });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const deleteYourOwnReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const userId = req.user.id;

    const review = await reviewModel.findOneAndDelete({
      _id: reviewId,
      userId,
    });
    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found or not authorized to delete",
      });
    }

    return res
      .status(200)
      .json({ success: true, message: "Review deleted successfully", review });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getReviewsByProductId = async (req, res) => {
  try {
    const { productId } = req.params;
    const reviews = await reviewModel
      .find({ productId })
      .populate("userId", "firstName lastName profilePicture");
    return res.status(200).json({ success: true, reviews });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export { addReview, getReviewsByProductId, editReview, deleteYourOwnReview };
