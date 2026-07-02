// models/sliderModel.js
import mongoose from "mongoose";

const sliderSchema = new mongoose.Schema({
  imageUrl: String,
  title: String,
  order: Number,
  active: {
    type: Boolean,
    default: true,
  },
});

export default mongoose.model("Slider", sliderSchema);