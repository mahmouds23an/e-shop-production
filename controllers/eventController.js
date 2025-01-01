import eventModel from "../models/eventModel.js";

const createEvent = async (req, res) => {
  try {
    const { title, description, linkText, endDate, imageUrl, isActive } =
      req.body;
    const newEvent = new eventModel({
      title,
      description,
      linkText,
      endDate,
      imageUrl,
      isActive,
    });

    await newEvent.save();
    return res.status(200).json({ success: true, message: "Event created" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getEvents = async (req, res) => {
  try {
    const events = await eventModel.find();
    if (!events) {
      return res
        .status(404)
        .json({ success: false, message: "No events found" });
    }
    if (events.length === 0) {
      return res
        .status(200)
        .json({ success: true, message: "No events found" });
    }
    return res.status(200).json({ success: true, events });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const updateEvent = async (req, res) => {
  try {
    const { id, title, description, linkText, endDate, imageUrl, isActive } =
      req.body;
    await eventModel.findByIdAndUpdate(
      id,
      {
        title,
        description,
        linkText,
        endDate,
        imageUrl,
        isActive,
      },
      {
        new: true,
      }
    );
    return res
      .status(200)
      .json({ success: true, message: "Event status changed" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const deleteEvent = async (req, res) => {
  try {
    const { id } = req.body;
    await eventModel.findByIdAndDelete(id);
    return res.status(200).json({ success: true, message: "Event deleted" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export { createEvent, getEvents, updateEvent, deleteEvent };
