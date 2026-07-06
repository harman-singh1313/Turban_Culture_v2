import Video from "../models/videoModel.js";
import cloudinary from "../config/cloudinary.js";
import fs from "fs";


// ================= UPLOAD VIDEO =================
export const uploadVideoFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: "video",
      folder: "turban-culture-videos",
    });

    // safety check
    if (!result.secure_url || !result.public_id) {
      return res.status(500).json({
        success: false,
        message: "Cloudinary upload failed",
      });
    }

    const video = new Video({
      videoUrl: result.secure_url,
      publicId: result.public_id,
    });

    await video.save();

    // cleanup temp file
    fs.unlink(req.file.path, (err) => {
      if (err) console.log("Temp file delete error:", err);
    });

    res.status(201).json({
      success: true,
      video,
    });

  } catch (error) {
    console.log("UPLOAD ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ================= GET VIDEOS =================
export const getVideos = async (req, res) => {
  try {
    const videos = await Video.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      videos,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ================= DELETE VIDEO =================
export const deleteVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);

    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    // delete from cloudinary safely
    if (video.publicId) {
      await cloudinary.uploader.destroy(video.publicId, {
        resource_type: "video",
      });
    }

    await Video.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Video deleted",
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};