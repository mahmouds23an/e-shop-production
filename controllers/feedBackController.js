import feedBackModel from "../models/feedBackModel.js";

const userCreateFeedBack = async (req, res) => {
  try {
    const feedback = await feedBackModel.create(req.body);
    return res.status(200).json({ success: true, message: "Feedback created" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const adminGetAllFeedBacks = async (req, res) => {
  try {
    const feedbacks = await feedBackModel.find();
    return res
      .status(200)
      .json({ success: true, count: feedbacks.length, feedbacks });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const deleteFeedBack = async (req, res) => {
  try {
    const { id } = req.body;
    const deletedFeedback = await feedBackModel.findByIdAndDelete(id);
    if (!deletedFeedback) {
      return res
        .status(404)
        .json({ success: false, message: "Feedback not found." });
    }
    return res
      .status(200)
      .json({ success: true, message: "Feedback deleted successfully." });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

export { userCreateFeedBack, adminGetAllFeedBacks, deleteFeedBack };
