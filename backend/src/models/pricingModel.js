import mongoose from "mongoose";

const pricingSchema = new mongoose.Schema({

  // ── Simple Booking Prices ──
  groomPrice: { type: Number, default: 4100 },
  extraDayPrice: { type: Number, default: 1000 },
  memberPrice: { type: Number, default: 300 },
  engagementPrice: { type: Number, default: 2100 },
  travelPricePerKm: { type: Number, default: 20 },
  freeTravelKm: { type: Number, default: 30 },

  // ── Packages ──
  packages: [
    {
      name: { type: String, required: true },        // "Gold Royal"
      tag: { type: String, default: "" },            // "Gold Package"
       badge: { type: String, default: "" },        // ← naya
    desc: { type: String, default: "" },         // ← naya
    stepText: { type: String, default: "" },     // ← naya
     theme: { type: String, default: "silver" },  // ← ye bhi add karo agar nahi hai
      icon: { type: String, default: "👑" },
      price: { type: Number, required: true },
      features: [{ type: String }],                  // ["Groom Styling", "5 Members", ...]
      isActive: { type: Boolean, default: true },    // show/hide package
      isFeatured: { type: Boolean, default: false }, // featured badge
    }
  ],

}, { timestamps: true });

export default mongoose.model("Pricing", pricingSchema);