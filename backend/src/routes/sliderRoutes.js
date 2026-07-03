import express from "express";
import { upload } from "../config/multer.js";
import {
  getSliders,
  createSlider,
  deleteSlider,
} from "../controllers/sliderController.js";

const router = express.Router();

router.get("/slider", getSliders);
router.post("/slider", upload.single("image"), createSlider);
router.delete("/slider/:id", deleteSlider);

export default router;