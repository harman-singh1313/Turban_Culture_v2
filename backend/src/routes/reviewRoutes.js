import express from "express";
import {
  getReviews, getAllReviews,
  addReview, approveReview, deleteReview
} from "../controllers/reviewController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getReviews);                              // public
router.get("/all", authMiddleware, getAllReviews);         // admin
router.post("/", addReview);                              // public
router.put("/:id/approve", authMiddleware, approveReview); // admin
router.delete("/:id", authMiddleware, deleteReview);       // admin

export default router;