import express from "express";
import {
  getPricing, updatePricing,
  addPackage, updatePackage, deletePackage
} from "../controllers/pricingController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getPricing);                                    // public
router.put("/", authMiddleware, updatePricing);                 // admin
router.post("/packages", authMiddleware, addPackage);           // admin
router.put("/packages/:packageId", authMiddleware, updatePackage);   // admin
router.delete("/packages/:packageId", authMiddleware, deletePackage); // admin

export default router;