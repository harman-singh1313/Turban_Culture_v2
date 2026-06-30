import crypto from "crypto";
import bcrypt from "bcrypt";
import User from "../models/userModel.js";
import PasswordReset from "../models/passwordResetModel.js";

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });

  const token = crypto.randomBytes(32).toString("hex");

  await PasswordReset.create({
    email,
    token,
    expireAt: Date.now() + 15 * 60 * 1000, // 15 min
  });

  const resetLink = `http://turbanculture.com/reset-password/${token}`;
  ...
  console.log("RESET LINK:", resetLink);

  res.json({ message: "Reset link generated", resetLink });
};

export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  const record = await PasswordReset.findOne({
    token,
    expireAt: { $gt: Date.now() },
  });

  if (!record) {
    return res.status(400).json({ message: "Invalid or expired token" });
  }

  const hashed = await bcrypt.hash(newPassword, 10);

  await User.updateOne({ email: record.email }, { $set: { password: hashed } });

  await PasswordReset.deleteOne({ token });

  res.json({ message: "Password reset successful" });
};
