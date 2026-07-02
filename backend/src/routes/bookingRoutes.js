import express from "express";
import {
  createBooking,
  getBookings,
   getBookingById,
  createOrder,
  verifyPayment,
  calculateDistance
  // downloadReceipt
} from "../controllers/bookingController.js";

const router = express.Router();

router.post("/", createBooking);
router.get("/bookings", getBookings);

router.post("/create-order", createOrder);
router.post("/verify-payment", verifyPayment);
router.post("/calculate-distance", calculateDistance);
router.get("/bookings/:id", getBookingById);
// router.get("/receipt/:id", downloadReceipt);

export default router;