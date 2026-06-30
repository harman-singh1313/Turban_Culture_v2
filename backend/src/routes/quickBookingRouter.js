import express from "express";
import {
  calcPrice,
  createQuickBooking,
  verifyQuickBookingPayment,
  downloadReceipt,
} from "../controllers/quickBookingController.js";

const router = express.Router();

router.post("/calc-price", calcPrice);
router.post("/", createQuickBooking);
router.post("/verify-payment", verifyQuickBookingPayment);
router.get("/receipt/:id", downloadReceipt);

export default router;