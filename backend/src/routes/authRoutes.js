import express from "express";
import {
  setupAdmin,
  loginAdmin,
  verifyOTPAndLogin,
  verifyToken,
} from "../controllers/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/setup", setupAdmin);
router.post("/login", loginAdmin);           // Step 1 — password check + OTP bhejo
router.post("/verify-otp", verifyOTPAndLogin); // Step 2 — OTP verify + token do
router.get("/verify", authMiddleware, verifyToken);

export default router;