import express from "express";
import { verifyQuickBookingPayment } from "../controllers/quickBookingController.js";
const router = express.Router();

router.post("/verify-quick-booking-payment", verifyQuickBookingPayment);

export default router;