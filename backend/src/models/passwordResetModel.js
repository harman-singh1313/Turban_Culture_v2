import mongoose from "mongoose";

const passwordResetSchema = new mongoose.Schema({
  email: String,
  token: String,
  expireAt: Date
});

export default mongoose.model("PasswordReset", passwordResetSchema);