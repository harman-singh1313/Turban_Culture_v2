import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import connectDB from "./src/config/db.js";

import bookingRoutes from "./src/routes/bookingRoutes.js";
import distanceRoute from "./src/routes/distanceRouter.js";
import locationRouter from "./src/routes/locationRouter.js";
import quickBookingRoutes from "./src/routes/quickBookingRouter.js";
import paymentRouter from "./src/routes/paymentRouter.js";
import receiptRoutes from "./src/routes/receiptRoutes.js";
import dashboardRoutes from "./src/routes/dashboardRoutes.js";
import adminBookingRouters from"./src/routes/adminBookingRoutes.js";
import authRoutes from './src/routes/authRoutes.js'
import pricingRoutes from'./src/routes/pricingRouters.js'
import reviewRoutes from './src/routes/reviewRoutes.js'
import galleryRoutes from './src/routes/galleryRoutes.js'
import leadRoutes from './src/routes/leadRoutes.js'
dotenv.config();

// MongoDB Connect
connectDB();

const app = express();
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://turbanculture.com",
    "https://www.turbanculture.com"
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
app.use(express.json());

// ================= ROUTES =================
app.use("/api", bookingRoutes);
app.use("/api/distance", distanceRoute);
app.use("/api/location", locationRouter);
app.use("/api/quick-bookings", quickBookingRoutes);
app.use("/api", paymentRouter);
app.use("/api", receiptRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/admin-bookings",adminBookingRouters);
app.use("/api/auth", authRoutes);
app.use("/api/pricing", pricingRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/leads", leadRoutes);
// ================= HOME =================
app.get("/", (req, res) => {
  res.send("Backend Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});