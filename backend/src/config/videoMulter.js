import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import cloudinary from "./cloudinary.js";

/* =========================================================
   CLOUDINARY STORAGE
========================================================= */

const storage = new CloudinaryStorage({
  cloudinary,

  params: async (req, file) => {
    /* ================= VIDEO ================= */

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
      };
    }

    /* ================= POSTER ================= */

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
      };
    }

    throw new Error("Invalid upload field");
  },
});

/* =========================================================
   FILE FILTER
========================================================= */

const fileFilter = (req, file, cb) => {
  /* ================= VIDEO ================= */

  if (file.fieldname === "video") {
    if (!file.mimetype.startsWith("video/")) {
      return cb(
        new Error("Video field must contain a video file"),
        false
      );
    }

    return cb(null, true);
  }

  /* ================= POSTER ================= */

  if (file.fieldname === "poster") {
    if (!file.mimetype.startsWith("image/")) {
      return cb(
        new Error("Poster field must contain an image file"),
        false
      );
    }

    return cb(null, true);
  }

  return cb(new Error("Invalid upload field"), false);
};

/* =========================================================
   MULTER
========================================================= */

export const uploadVideo = multer({
  storage,

  fileFilter,

  limits: {
    // Maximum allowed file size per uploaded file
    fileSize: 200 * 1024 * 1024,
  },
});