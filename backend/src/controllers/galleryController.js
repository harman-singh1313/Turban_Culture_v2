import Gallery from "../models/galleryModel.js";
import cloudinary from "../config/cloudinary.js";

// ── Get All Images ──
export const getGallery = async (req, res) => {
  try {
    const images = await Gallery.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, images });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── Upload Image ──
export const uploadImage = async (req, res) => {
  try {
    const { title } = req.body;
    const imageUrl = req.file.path;
    const publicId = req.file.filename;

    const image = await Gallery.create({ imageUrl, publicId, title });
    res.status(201).json({ success: true, image });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── Delete Image ──
export const deleteImage = async (req, res) => {
  try {
    const image = await Gallery.findById(req.params.id);
    if (!image) return res.status(404).json({ success: false, message: "Image not found" });

    await cloudinary.uploader.destroy(image.publicId);
    await Gallery.findByIdAndDelete(req.params.id);

    res.status(200).json({ success: true, message: "Image deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};