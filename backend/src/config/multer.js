import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import cloudinary from "./cloudinary.js";

/* =========================================================
   CLOUDINARY IMAGE STORAGE
========================================================= */

const storage = new CloudinaryStorage({
  cloudinary,

  params: async (req, file) => {
    return {
      folder: "turban-culture-gallery",

      resource_type: "image",

      allowed_formats: [
        "jpg",
        "jpeg",
        "png",
        "webp",
      ],

      /* ===================================================
         IMAGE OPTIMIZATION
      =================================================== */

      transformation: [
        {
          // Large images will be reduced to this boundary
          width: 1920,
          height: 1920,

          // Does not enlarge smaller images
          crop: "limit",

          // Cloudinary automatically balances quality/size
          quality: "auto:good",

          // Automatically serves efficient format when possible
          fetch_format: "auto",
        },
      ],
    };
  },
});

/* =========================================================
   IMAGE FILE FILTER
========================================================= */

const fileFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith("image/")) {
    return cb(
      new Error("Only image files are allowed"),
      false
    );
  }

  return cb(null, true);
};

/* =========================================================
   MULTER IMAGE UPLOAD
========================================================= */

export const upload = multer({
  storage,

  fileFilter,

  limits: {
    // Maximum incoming image size = 15MB
    fileSize: 15 * 1024 * 1024,
  },
});