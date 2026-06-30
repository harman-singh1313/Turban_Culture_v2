import express from "express";
import {
  getDashboardStats,
  getRecentBookings,
  getAllBookings,
} from "../controllers/dashboardController.js";

const router = express.Router();

router.get("/stats", getDashboardStats);
router.get("/recent", getRecentBookings);
router.get("/all-bookings", getAllBookings);

export default router;