import mongoose from "mongoose";

const gallerySchema = new mongoose.Schema({
  imageUrl: { type: String, required: true },
  publicId: { type: String, required: true },
  title: { type: String, default: "", trim: true},
}, { timestamps: true });

export default mongoose.model("Gallery", gallerySchema);