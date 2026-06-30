import Razorpay from "razorpay";
import crypto from "crypto";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const generateFormId = () => {
  return `FORM-${Date.now().toString(36).toUpperCase()}-${crypto.randomUUID().split("-")[0].toUpperCase()}`;
};

export const createOrderService = async (amount, formId) => {
  return await razorpay.orders.create({
    amount: amount * 100,
    currency: "INR",
    receipt: formId,
    notes: { formId }
  });
};

export const verifyPaymentService = (orderId, paymentId, signature) => {
  const body = orderId + "|" + paymentId;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest("hex");

  return expectedSignature === signature;
};