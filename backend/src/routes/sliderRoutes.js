import express from "express";
import {
  getSliders,
  createSlider,
  deleteSlider,
} from "../controllers/sliderController.js";

const router = express.Router();

router.get("/slider", getSliders);
router.post("/slider", createSlider);
router.delete("/slider/:id", deleteSlider);

export default router;