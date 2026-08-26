import "dotenv/config";
import Booking from "../models/bookingModel.js";
import Pricing from "../models/pricingModel.js";
import {
  sendUserConfirmationEmail,
  sendOwnerNotificationEmail,
} from "../config/emailService.js";

// ================= CREATE BOOKING =================
// Booking create hote hi seedha CONFIRMED lead ki tarah save hoti hai
// aur confirmation emails turant chali jaandiyan han. Koi payment
// gateway involved nahi hai — simple form submit.

export const createBooking = async (req, res) => {
  try {
    const {
      name,
      phone,
      email,
      eventType,
      customEvent,
      days,
      startDate,
      endDate,
      location,
      bookingFor,
      paggMembers,
      paggStyle,
      paggTime,
      preferredTime,
      formId,
      totalPrice,
      paidAmount,
      paymentMode,
      travelCharge,
      travelChargeIncludedOnline,
      travelChargePaymentStatus,
      distanceKm,
    } = req.body;

    if (
      !name ||
      !phone ||
      !eventType ||
      !startDate ||
      !location ||
      !paggTime ||
      !paggStyle ||
      !bookingFor?.length
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields",
      });
    }

    //calculating amount
    const totalAmount = Number(totalPrice || 0) + Number(travelCharge || 0);

    // Koi online payment nahi hoti, isliye onlinePaid hamesha 0 rahega
    // aur poora amount pending/cash treat hoga (jo team event day pe
    // ya baad mein manually collect karegi).
    const finalOnlinePaid = 0;
    const finalPendingAmount = Math.max(totalAmount - finalOnlinePaid, 0);
    const finalCashAmount = finalPendingAmount;

    const booking = await Booking.create({
      name,
      phone,
      email,
      eventType,
      customEvent,
      days,
      startDate,
      endDate,
      location,
      bookingFor,
      paggMembers,
      paggStyle,
      paggTime,
      preferredTime,
      formId,
      paymentStatus: "PENDING",
      totalPrice,
      totalAmount,

      bookingStatus: "CONFIRMED",

      paidAmount,
      paymentMode,
      travelCharge: travelCharge || 0,
      travelChargeIncludedOnline: travelChargeIncludedOnline || false,
      travelChargePaymentStatus: travelChargePaymentStatus || "PAY_LATER",
      distanceKm: distanceKm || 0,

      onlinePaid: finalOnlinePaid,
      cashAmount: finalCashAmount,
      pendingAmount: finalPendingAmount,
    });

    // Email booking create hote hi jaandi hai.
    try {
      await sendUserConfirmationEmail({
        to: booking.email,
        name: booking.name,
        bookingId: booking._id,

        totalPrice: booking.totalPrice,
        travelCharge: booking.travelCharge,

        totalAmount: booking.totalAmount,
        onlinePaid: booking.onlinePaid,

        cashAmount: booking.cashAmount,

        pendingAmount: booking.pendingAmount,

        paymentMode: booking.paymentMode,

        paymentStatus: booking.paymentStatus,

        advancePercent: 30,

        eventType: booking.eventType,
      });

      await sendOwnerNotificationEmail({
        name: booking.name,
        phone: booking.phone,
        email: booking.email,
        bookingId: booking._id,

        totalPrice: booking.totalPrice,

        travelCharge: booking.travelCharge,

        totalAmount: booking.totalAmount,
        onlinePaid: booking.onlinePaid,

        cashAmount: booking.cashAmount,

        pendingAmount: booking.pendingAmount,

        paymentMode: booking.paymentMode,

        paymentStatus: booking.paymentStatus,

        advancePercent: 30,

        eventType: booking.eventType,

        location: booking.location,
      });
    } catch (emailErr) {
      console.log("Email error:", emailErr);
    }

    return res.status(201).json({
      success: true,
      message: "Booking Created Successfully",
      booking,
    });
  } catch (error) {
    console.error("CREATE BOOKING ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= GET BOOKINGS =================
export const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.status(200).json({ success: true, bookings });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ================= GET SINGLE BOOKING BY ID =================
export const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    res.status(200).json({ success: true, booking });
  } catch (error) {
    console.error("GET BOOKING BY ID ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= CALCULATE DISTANCE =================
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of Earth in KM

  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

export const calculateDistance = async (req, res) => {
  try {
    const { lat, lon } = req.body;

    const officeLat = 29.5316;
    const officeLon = 74.8368;

    const distanceKm = getDistanceFromLatLonInKm(
      officeLat,
      officeLon,
      Number(lat),
      Number(lon),
    );

    // Dashboard wali pricing load karo
    const pricing = await Pricing.findOne();

    const freeTravelKm = pricing?.freeTravelKm || 30;
    const travelPricePerKm = pricing?.travelPricePerKm || 20;

    let distanceCharge = 0;

    if (distanceKm > freeTravelKm) {
      distanceCharge = Math.round(
        (distanceKm - freeTravelKm) * travelPricePerKm,
      );
    }

    res.status(200).json({
      success: true,
      distanceKm: Math.round(distanceKm),
      freeTravelKm,
      travelPricePerKm,
      distanceCharge,
    });
  } catch (error) {
    console.error("DISTANCE ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
      error: String(error),
    });
  }
};