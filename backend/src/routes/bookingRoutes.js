import express from "express";
import {
  createBooking,
  getBookings,
  getBookingById,
  calculateDistance
} from "../controllers/bookingController.js";

const router = express.Router();

router.post("/", createBooking);
router.get("/bookings", getBookings);

router.post("/calculate-distance", calculateDistance);
router.get("/bookings/:id", getBookingById);

export default router;