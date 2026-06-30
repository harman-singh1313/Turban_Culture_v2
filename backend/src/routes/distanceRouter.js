import express from "express";
import {calculateDistance} from '../controllers/distanceController.js'

const router = express.Router();
router.post("/",calculateDistance);

export default router;