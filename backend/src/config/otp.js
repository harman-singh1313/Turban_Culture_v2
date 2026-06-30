const otpStore = new Map();

// ── Generate OTP ──
export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// ── Save OTP ──
export const saveOTP = (email, otp) => {
  const cleanEmail = email.toLowerCase().trim();

  otpStore.set(cleanEmail, {
    otp: String(otp).trim(),
    expires: Date.now() + 5 * 60 * 1000, // 5 min
  });
};

// ── Verify OTP ──
export const verifyOTP = (email, inputOtp) => {
  const cleanEmail = email.toLowerCase().trim();

  const data = otpStore.get(cleanEmail);

  if (!data) {
    return { valid: false, message: "OTP not found" };
  }

  if (Date.now() > data.expires) {
    otpStore.delete(cleanEmail);
    return { valid: false, message: "OTP expired" };
  }

  if (data.otp !== String(inputOtp).trim()) {
    return { valid: false, message: "Invalid OTP" };
  }

  otpStore.delete(cleanEmail);
  return { valid: true };
};

// ── Optional: clear all OTPs (for testing) ──
export const clearAllOTPs = () => {
  otpStore.clear();
};