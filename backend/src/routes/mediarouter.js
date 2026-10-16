import express from "express";

import {
  createImageMedia,
  createVideoMedia,
  getAllMedia,
  getMediaById,
  updateMedia,
  deleteMedia,
} from "../controllers/mediaController.js";

// Image upload middleware
import { upload } from "../config/multer.js";

// Video + Poster upload middleware
import { uploadVideo } from "../config/videoMulter.js";

const router = express.Router();

/* =========================================================
   GET ALL MEDIA
========================================================= */

router.get("/", getAllMedia);

/* =========================================================
   UPLOAD IMAGE

   POST /api/media/image

   FormData:
   title     -> Text
   category  -> Text
   status    -> Text
   image     -> File
========================================================= */

router.post(
  "/image",
  upload.single("image"),
  createImageMedia
);

/* =========================================================
   UPLOAD VIDEO + POSTER

   POST /api/media/video

   FormData:
   title   -> Text
   status  -> Text
   video   -> File
   poster  -> File

   Category automatically = videos
========================================================= */

router.post(
  "/video",
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
  createVideoMedia
);


router.post("/test-post", (req, res) => {
  res.json({
    success: true,
    message: "POST media route working",
  });
});
/* =======

==================================================
   GET SINGLE MEDIA
========================================================= */

router.get("/:id", getMediaById);

/* =========================================================
   UPDATE MEDIA
========================================================= */

router.put("/:id", updateMedia);

/* =========================================================
   DELETE MEDIA
========================================================= */

router.delete("/:id", deleteMedia);

export default router;