import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import cloudinary from "./cloudinary.js";

/* =========================================================
   CLOUDINARY STORAGE
========================================================= */

const storage = new CloudinaryStorage({
  cloudinary,

  params: async (req, file) => {
    /* =====================================================
       VIDEO
    ===================================================== */

    if (file.fieldname === "video") {
      return {
        folder: "turban-culture-videos",

        resource_type: "video",

        allowed_formats: [
          "mp4",
          "mov",
          "avi",
          "mkv",
          "webm",
        ],

        // Optimize / compress uploaded video
        transformation: [
          {
            width: 1920,
            height: 1080,
            crop: "limit",
            quality: "auto",
          },
        ],
      };
    }

    /* =====================================================
       VIDEO POSTER
    ===================================================== */

    if (file.fieldname === "poster") {
      return {
        folder: "turban-culture-video-posters",

        resource_type: "image",

        allowed_formats: [
          "jpg",
          "jpeg",
          "png",
          "webp",
        ],

        // Optimize / compress poster image
        transformation: [
          {
            width: 1920,
            height: 1080,
            crop: "limit",
            quality: "auto:good",
            fetch_format: "auto",
          },
        ],
      };
    }

    /* =====================================================
       INVALID FIELD
    ===================================================== */

    throw new Error("Invalid upload field");
  },
});

/* =========================================================
   FILE FILTER
========================================================= */

const fileFilter = (req, file, cb) => {
  /* =====================================================
     VIDEO VALIDATION
  ===================================================== */

  if (file.fieldname === "video") {
    if (!file.mimetype.startsWith("video/")) {
      return cb(
        new Error("Video field must contain a video file"),
        false
      );
    }

    return cb(null, true);
  }

  /* =====================================================
     POSTER VALIDATION
  ===================================================== */

  if (file.fieldname === "poster") {
    if (!file.mimetype.startsWith("image/")) {
      return cb(
        new Error("Poster field must contain an image file"),
        false
      );
    }

    return cb(null, true);
  }

  /* =====================================================
     INVALID FIELD
  ===================================================== */

  return cb(
    new Error("Invalid upload field"),
    false
  );
};

/* =========================================================
   MULTER UPLOAD
========================================================= */

export const uploadVideo = multer({
  storage,

  fileFilter,

  limits: {
    // Maximum file size allowed per uploaded file = 200MB
    fileSize: 200 * 1024 * 1024,
  },
});