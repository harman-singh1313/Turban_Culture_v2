import express from "express";
import {
  getAllBookings,
  updateBookingStatus,
  deleteBooking,
} from "../controllers/adminBookingController.js";

const router = express.Router();

router.get("/all", getAllBookings);

router.put("/status/:id", updateBookingStatus);

router.delete("/:id", deleteBooking);

export default router;