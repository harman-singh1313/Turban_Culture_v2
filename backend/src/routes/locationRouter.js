import express from "express";
import { searchLocation } from "../controllers/locationController.js";

const router = express.Router();

router.get("/", searchLocation);

export default router;