import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import cloudinary from "./cloudinary.js";

const videoStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "turban-culture-videos",
    resource_type: "video",
    allowed_formats: ["mp4", "mov", "avi", "mkv", "webm"],
  },
});

export const uploadVideo = multer({
  storage: videoStorage,
   limits: {
    fileSize: 200 * 1024 * 1024 // 200MB
  }
});