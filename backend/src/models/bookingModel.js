import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      required: true,
    },

    email: {
      type: String,
    },

    eventType: {
      type: String,
      required: true,
    },

    customEvent: {
      type: String,
    },

    days: {
      type: Number,
      default: 1,
    },

    startDate: {
      type: Date,
      required: true,
    },

    endDate: {
      type: Date,
    },

    location: {
      type: String,
      required: true,
    },

    bookingFor: {
      type: Array,
      required: true,
    },

    paggMembers: {
      type: Number,
      default: 1,
    },

    paggStyle: {
      type: String,
      required: true,
    },

    paggTime: {
      type: String,
      required: true,
    },

    preferredTime: {
      type: String,
    },

    totalPrice: {
      type: Number,
      default: 0,
    },

    totalAmount: {
  type: Number,
  default: 0,
},
    // ── NEW PAYMENT FIELDS ──
    paidAmount: {
      type: Number,
      default: 0,
    },

    paymentMode: {
      type: String,
      enum: ["online", "cash"],
      default: "online",
    },

    travelCharge: {
      type: Number,
      default: 0,
    },

    distanceKm: {
      type: Number,
      default: 0,
    },

    travelChargeIncludedOnline: {
      type: Boolean,
      default: false,
    },

    travelChargePaymentStatus: {
      type: String,
      enum: ["PAID", "PAY_LATER"],
      default: "PAY_LATER",
    },

    // PAYMENT DETAILS
onlinePaid: {
  type: Number,
  default: 0,
},

cashAmount: {
  type: Number,
  default: 0,
},

pendingAmount: {
  type: Number,
  default: 0,
},



    // ────────────────────────

    paymentId: {
      type: String,
    },

    orderId: {
      type: String,
    },

    paymentStatus: {
      type: String,
      default: "PENDING",
    },

    bookingStatus: {
      type: String,
      enum: ["PENDING", "CONFIRMED", "DONE", "CANCELLED"],
      default: "PENDING",
    },

    formId: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Booking", bookingSchema);
