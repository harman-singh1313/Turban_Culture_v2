import mongoose from "mongoose";

const quickBookingSchema = new mongoose.Schema(
  {
    // ───────── CUSTOMER ─────────
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String },
    address: { type: String, required: true },

    // ───────── BOOKING ─────────
    date: { type: Date, required: true },
    session: { type: String, required: true },
    time: { type: String, required: true },

    // ───────── DISTANCE ─────────
    distanceKm: { type: Number, default: 0 },
    distanceCharge: { type: Number, default: 0 },

    // ───────── TRAVEL (UPDATED CLEAN LOGIC) ─────────
    travelIncludedOnline: { type: Boolean, default: false },
    travelCharge: { type: Number, default: 0 },
    travelChargePaymentStatus: {
      type: String,
      enum: ["PAID", "PAY_LATER"],
      default: "PAY_LATER",
    },

    // ───────── PAYMENT ─────────
    formId: { type: String },
    paymentId: { type: String },
    orderId: { type: String },

    paymentStatus: {
      type: String,
      enum: ["PENDING", "SUCCESS", "FAILED"],
      default: "PENDING",
    },

    totalPrice: { type: Number, default: 0 },

    paidAmount: { type: Number, default: 0 },

    // Amount received online
    onlinePaid: {
      type: Number,
      default: 0,
    },
    // Remaining amount customer will pay
    cashAmount: {
      type: Number,
      default: 0,
    },

    // Pending amount
    pendingAmount: {
      type: Number,
      default: 0,
    },

    // Full payment completed?
    paymentCompleted: {
      type: Boolean,
      default: false,
    },

    //booking status
    bookingStatus: {
  type: String,
  enum: ["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"],
  default: "PENDING",
},
    // ───────── PACKAGE ─────────
    packageName: { type: String },
    packagePrice: { type: Number },
    packageTheme: { type: String },
    packageBadge: { type: String },
    packageDesc: { type: String },
    packageIcon: { type: String },
    packagePopular: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("QuickBooking", quickBookingSchema);