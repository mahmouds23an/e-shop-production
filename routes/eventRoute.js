import express from "express";
import {
  createEvent,
  getEvents,
  updateEvent,
  deleteEvent,
} from "../controllers/eventController.js";
import adminAuth from "../middleware/adminAuth.js";

const eventRouter = express.Router();

eventRouter.post("/create", adminAuth, createEvent);
eventRouter.get("/get", getEvents);
eventRouter.post("/update", adminAuth, updateEvent);
eventRouter.post("/delete", adminAuth, deleteEvent);

export default eventRouter;
