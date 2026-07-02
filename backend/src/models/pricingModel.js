import mongoose from "mongoose";

const pricingSchema = new mongoose.Schema({

  // ── Simple Booking Prices ──
groomPrice: { type: Number, required: true, min: 0 },
extraDayPrice: { type: Number, required: true, min: 0 },
memberPrice: { type: Number, required: true, min: 0 },
engagementPrice: { type: Number, required: true, min: 0 },
travelPricePerKm: { type: Number, required: true, min: 0 },
freeTravelKm: { type: Number, required: true, min: 0 },
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