// models/sliderModel.js
import mongoose from "mongoose";

const sliderSchema = new mongoose.Schema(
  {
    imageUrl: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      default: "",
      trim: true,
    },
    subtitle: {
      type: String,
      default: "", // e.g. "2020-2023 · 3 Seasons"
      trim: true,
    },
    rating: {
      type: Number,
      min: 0,
      max: 10,
    },
    logoUrl: {
      type: String,
      default: "", // small network/provider badge shown top-left on the card
    },
    order: {
      type: Number,
      default: 1,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Slider", sliderSchema);