import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { uploadVideo } from "../config/videoMulter.js";

import {
  uploadVideoFile,
  getVideos,
  deleteVideo,
} from "../controllers/videoController.js";

const router = express.Router();

router.get("/", getVideos);

router.post(
  "/",
  authMiddleware,
  uploadVideo.single("video"),
  uploadVideoFile
);

router.delete("/:id", authMiddleware, deleteVideo);

export default router;