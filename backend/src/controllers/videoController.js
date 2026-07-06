import Video from "../models/videoModel.js";
import cloudinary from "../config/cloudinary.js";

// UPLOAD VIDEO
export const uploadVideoFile = async (req, res) => {
  try {
    const videoUrl = req.file.path;

    const video = new Video({
      videoUrl,
    });

    await video.save();

    res.status(201).json({
      success: true,
      video,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET VIDEOS
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

// DELETE VIDEO
export const deleteVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);

    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    await Video.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: "Video deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};