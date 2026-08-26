import express from "express";
import {
  calcPrice,
  createQuickBooking,
  downloadReceipt,
} from "../controllers/quickBookingController.js";

const router = express.Router();

router.post("/calc-price", calcPrice);
router.post("/", createQuickBooking);
router.get("/receipt/:id", downloadReceipt);

export default router;
