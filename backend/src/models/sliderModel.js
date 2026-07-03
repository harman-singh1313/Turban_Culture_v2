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