import Video from "../models/videoModel.js";
import cloudinary from "../config/cloudinary.js";
import fs from "fs";

/* =========================================================
   HELPER - DELETE TEMP FILE SAFELY
========================================================= */
const deleteTempFile = (filePath) => {
  if (!filePath) return;

  fs.unlink(filePath, (err) => {
    if (err && err.code !== "ENOENT") {
      console.log("Temp file delete error:", err);
    }
  });
};

/* =========================================================
   UPLOAD VIDEO + POSTER
========================================================= */
export const uploadVideoFile = async (req, res) => {
  let videoResult = null;
  let posterResult = null;

  try {
    /* -----------------------------------------------------
       Get files from multer
    ----------------------------------------------------- */

    const videoFile = req.files?.video?.[0];
    const posterFile = req.files?.poster?.[0];

    if (!videoFile) {
      return res.status(400).json({
        success: false,
        message: "Video file is required",
      });
    }

    if (!posterFile) {
      deleteTempFile(videoFile.path);

      return res.status(400).json({
        success: false,
        message: "Poster image is required",
      });
    }

    /* -----------------------------------------------------
       Upload VIDEO to Cloudinary
    ----------------------------------------------------- */

    videoResult = await cloudinary.uploader.upload(videoFile.path, {
      resource_type: "video",
      folder: "turban-culture-videos",
    });

    if (!videoResult.secure_url || !videoResult.public_id) {
      throw new Error("Video upload to Cloudinary failed");
    }

    /* -----------------------------------------------------
       Upload POSTER to Cloudinary
    ----------------------------------------------------- */

    posterResult = await cloudinary.uploader.upload(posterFile.path, {
      resource_type: "image",
      folder: "turban-culture-video-posters",
    });

    if (!posterResult.secure_url || !posterResult.public_id) {
      throw new Error("Poster upload to Cloudinary failed");
    }

    /* -----------------------------------------------------
       Save both in MongoDB
    ----------------------------------------------------- */

    const video = new Video({
      videoUrl: videoResult.secure_url,
      publicId: videoResult.public_id,

      posterUrl: posterResult.secure_url,
      posterPublicId: posterResult.public_id,
    });

    await video.save();

    /* -----------------------------------------------------
       Delete temporary local files
    ----------------------------------------------------- */

    deleteTempFile(videoFile.path);
    deleteTempFile(posterFile.path);

    /* -----------------------------------------------------
       Response
    ----------------------------------------------------- */

    return res.status(201).json({
      success: true,
      message: "Video and poster uploaded successfully",
      video,
    });
  } catch (error) {
    console.log("UPLOAD ERROR:", error);

    /* -----------------------------------------------------
       Delete temporary files if request failed
    ----------------------------------------------------- */

    const videoFile = req.files?.video?.[0];
    const posterFile = req.files?.poster?.[0];

    deleteTempFile(videoFile?.path);
    deleteTempFile(posterFile?.path);

    /*
      If video uploaded successfully but something later failed,
      remove it from Cloudinary to avoid orphan files.
    */

    if (videoResult?.public_id) {
      try {
        await cloudinary.uploader.destroy(videoResult.public_id, {
          resource_type: "video",
        });
      } catch (cleanupError) {
        console.log(
          "Cloudinary video cleanup error:",
          cleanupError
        );
      }
    }

    /*
      Same cleanup for poster.
    */

    if (posterResult?.public_id) {
      try {
        await cloudinary.uploader.destroy(posterResult.public_id, {
          resource_type: "image",
        });
      } catch (cleanupError) {
        console.log(
          "Cloudinary poster cleanup error:",
          cleanupError
        );
      }
    }

    return res.status(500).json({
      success: false,
      message: error.message || "Upload failed",
    });
  }
};

/* =========================================================
   GET VIDEOS
========================================================= */
export const getVideos = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10);

    let query = Video.find().sort({
      createdAt: -1,
    });

    if (limit && !isNaN(limit)) {
      query = query.limit(limit);
    }

    const videos = await query;

    return res.status(200).json({
      success: true,
      count: videos.length,
      videos,
    });
  } catch (error) {
    console.log("GET VIDEOS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =========================================================
   DELETE VIDEO + POSTER
========================================================= */
export const deleteVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);

    if (!video) {
      return res.status(404).json({
        success: false,
        message: "Video not found",
      });
    }

    /* -----------------------------------------------------
       Delete VIDEO from Cloudinary
    ----------------------------------------------------- */

    if (video.publicId) {
      await cloudinary.uploader.destroy(video.publicId, {
        resource_type: "video",
      });
    }

    /* -----------------------------------------------------
       Delete POSTER from Cloudinary
    ----------------------------------------------------- */

    if (video.posterPublicId) {
      await cloudinary.uploader.destroy(video.posterPublicId, {
        resource_type: "image",
      });
    }

    /* -----------------------------------------------------
       Delete MongoDB document
    ----------------------------------------------------- */

    await Video.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Video and poster deleted successfully",
    });
  } catch (error) {
    console.log("DELETE VIDEO ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};