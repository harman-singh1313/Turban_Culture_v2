import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { uploadVideo } from "../config/videoMulter.js";

import {
  uploadVideoFile,
  getVideos,
  deleteVideo,
} from "../controllers/videoController.js";

const router = express.Router();

/* ================= GET VIDEOS ================= */

router.get("/", getVideos);

/* ================= UPLOAD VIDEO + POSTER ================= */

router.post(
  "/",
  authMiddleware,

  uploadVideo.fields([
    {
      name: "video",
      maxCount: 1,
    },
    {
      name: "poster",
      maxCount: 1,
    },
  ]),

  uploadVideoFile
);

/* ================= DELETE VIDEO ================= */

router.delete(
  "/:id",
  authMiddleware,
  deleteVideo
);

export default router;