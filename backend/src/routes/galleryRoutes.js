import express from "express";
import { getGallery, uploadImage, deleteImage } from "../controllers/galleryController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { upload } from "../config/multer.js";

const router = express.Router();

router.get("/", getGallery);
router.post("/", authMiddleware, upload.single("image"), uploadImage);
router.delete("/:id", authMiddleware, deleteImage);

export default router;