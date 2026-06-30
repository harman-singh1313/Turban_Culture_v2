import express from "express";
import { downloadReceipt } from "../controllers/receiptController.js";

const router = express.Router();

router.get(
  "/receipt/:type/:id",
  downloadReceipt
);

export default router;