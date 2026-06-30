import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import Admin from "../models/adminModel.js";
import { generateOTP, saveOTP, verifyOTP } from "../config/otp.js";
import { sendOTPEmail } from "../config/emailService.js";

// ── Setup Admin ──
export const setupAdmin = async (req, res) => {
  try {
    const existing = await Admin.findOne();
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Admin already exists",
      });
    }

    const hashed = await bcrypt.hash(req.body.password, 10);

    await Admin.create({
      email: req.body.email.toLowerCase(),
      password: hashed,
    });

    res.status(201).json({
      success: true,
      message: "Admin created successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ── Step 1: Login → OTP send ──
export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email: email.toLowerCase() });
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Wrong password",
      });
    }

    // OTP generate
    const otp = generateOTP();

    // save OTP (temporary store)
    saveOTP(email.toLowerCase(), otp);

    // send email
    await sendOTPEmail(email, otp);

    return res.status(200).json({
      success: true,
      message: "OTP sent to email",
      step: "otp",
    });
  } catch (error) {
    console.log("LOGIN ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Server error during login",
    });
  }
};

// ── Step 2: OTP verify → Token generate ──
export const verifyOTPAndLogin = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const result = verifyOTP(email.toLowerCase(), otp);

    if (!result.valid) {
      return res.status(401).json({
        success: false,
        message: result.message,
      });
    }

    const admin = await Admin.findOne({ email: email.toLowerCase() });

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    const token = jwt.sign(
      { id: admin._id, email: admin.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      success: true,
      token,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ── Token verify middleware response ──
export const verifyToken = async (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Token valid",
  });
};