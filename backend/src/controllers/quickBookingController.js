import QuickBooking from "../models/quickBookingModel.js";
import crypto from "crypto";
import PDFDocument from "pdfkit";
import {
  sendUserConfirmationEmail,
  sendOwnerNotificationEmail,
} from "../config/emailService.js";


// ================= HELPER: FULL CALCULATION (Single Source of Truth) =================
// Saari calculations sirf ithey hundi ne — frontend vich kuch nahi
const calculateBooking = ({ packagePrice, travelCharge, paymentMode }) => {
  const finalTotalAmount = packagePrice + travelCharge;

  let onlinePaid    = 0;
  let pendingAmount = 0;
  let cashAmount    = 0;

  if (paymentMode === "online") {
    onlinePaid    = finalTotalAmount;
    pendingAmount = 0;
    cashAmount    = 0;
  } else {
    // cash: 30% advance online, baki cash
    onlinePaid    = Math.round(finalTotalAmount * 0.3);
    pendingAmount = finalTotalAmount - onlinePaid;
    cashAmount    = pendingAmount;
  }

  return {
    finalTotalAmount,
    onlinePaid,
    pendingAmount,
    cashAmount,
    paymentCompleted: pendingAmount === 0,
  };
};


// ================= PRICE BREAKDOWN (called before payment modal) =================
// Frontend es route nu call karda hai — modal nu saara data ithon milta hai
export const calcPrice = (req, res) => {
  try {
    const {
      packagePrice      = 0,
      distanceCharge    = 0,
      includeTravelOnline = false,
    } = req.body;

    const pkg    = Number(packagePrice);
    const travel = Number(distanceCharge);

    // grandTotal = package + travel (only if travel included in online payment)
    const grandTotal    = pkg + (includeTravelOnline ? travel : 0);

    // 30% advance for cash option
    const advanceAmount = Math.round(grandTotal * 0.3);

    // remaining cash after advance (travel separate if not included online)
    const remainingCash = grandTotal - advanceAmount;
    const totalCash     = remainingCash + (!includeTravelOnline ? travel : 0);

    return res.status(200).json({
      packagePrice:       pkg,
      distanceCharge:     travel,
      includeTravelOnline,
      grandTotal,          // full online payment amount
      advanceAmount,       // 30% for cash option
      remainingCash,       // grandTotal - advance
      totalCash,           // remaining + travel (if cash)
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};


// ================= QUICK BOOKING =================
export const createQuickBooking = async (req, res) => {
  try {
    const {
      name,
      phone,
      email,
      address,
      date,
      session,
      time,

      distanceKm          = 0,
      distanceCharge      = 0,   // raw from frontend
      travelIncludedOnline = false,

      paymentMode,
      formId,
      paymentId,
      orderId,
      paymentStatus,

      selectedPackage,
    } = req.body;

    // ---------- VALIDATION ----------
    if (!name || !phone || !address || !date || !session || !time || !selectedPackage) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields",
      });
    }

    // ---------- PACKAGE ----------
    const packagePrice = Number(selectedPackage?.price || 0);

    // ---------- TRAVEL ----------
    const travelChargeFinal = Number(distanceCharge || 0);
    const travelStatus      = travelIncludedOnline ? "PAID" : "PAY_LATER";

    // ---------- CALCULATION (backend only) ----------
    // Travel charge: include in total only if user chose to pay online
    const travelForCalc = travelIncludedOnline ? travelChargeFinal : 0;

    const {
      finalTotalAmount,
      onlinePaid,
      pendingAmount,
      cashAmount,
      paymentCompleted,
    } = calculateBooking({
      packagePrice,
      travelCharge: travelForCalc,
      paymentMode,
    });

    // ---------- CREATE BOOKING ----------
    const booking = await QuickBooking.create({
      // customer
      name,
      phone,
      email,
      address,

      // booking
      date,
      session,
      time,

      // distance
      distanceKm: Number(distanceKm),

      // travel
      travelCharge:               travelChargeFinal,
      travelIncludedOnline,
      travelChargePaymentStatus:  travelStatus,

      // payment (all calculated on backend)
      totalPrice:       finalTotalAmount,
      paidAmount:       onlinePaid,
      onlinePaid,
      cashAmount,
      pendingAmount,
      paymentCompleted,

      paymentMode,
      paymentStatus:    paymentStatus || "SUCCESS",
      formId,
      paymentId,
      orderId,

      // package
      packageName:    selectedPackage?.name,
      packagePrice,
      packageTheme:   selectedPackage?.theme,
      packageBadge:   selectedPackage?.badge,
      packageDesc:    selectedPackage?.desc,
      packageIcon:    selectedPackage?.icon,
      packagePopular: selectedPackage?.popular,
    });

    // ---------- EMAILS ----------
    try {
      if (booking.email) {
        await sendUserConfirmationEmail({
          to:            booking.email,
          name:          booking.name,
          bookingId:     booking.formId || booking._id,
          packageName:   booking.packageName,
          totalPrice:    booking.totalPrice,
          travelCharge:  booking.travelCharge,
          onlinePaid:    booking.onlinePaid,
          cashAmount:    booking.cashAmount,
          pendingAmount: booking.pendingAmount,
          paymentStatus: booking.paymentStatus,
        });
      }

      await sendOwnerNotificationEmail({
        name:          booking.name,
        phone:         booking.phone,
        email:         booking.email,
        bookingId:     booking.formId || booking._id,
        packageName:   booking.packageName,
        totalPrice:    booking.totalPrice,
        travelCharge:  booking.travelCharge,
        onlinePaid:    booking.onlinePaid,
        cashAmount:    booking.cashAmount,
        pendingAmount: booking.pendingAmount,
        paymentStatus: booking.paymentStatus,
        location:      booking.address,
      });
    } catch (emailError) {
      console.log("EMAIL ERROR:", emailError.message);
    }

    return res.status(201).json({
      success: true,
      message: "Quick Booking Created Successfully",
      booking,
    });

  } catch (error) {
    console.log("QUICK BOOKING ERROR:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};


// ================= VERIFY PAYMENT =================
export const verifyQuickBookingPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: "Invalid Signature" });
    }

    return res.status(200).json({ success: true, message: "Payment Verified" });

  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};


// ================= RECEIPT =================
export const downloadReceipt = async (req, res) => {
  try {
    const booking = await QuickBooking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ success: false, message: "Quick booking not found" });
    }

    const doc = new PDFDocument();

    res.setHeader("Content-Disposition", `attachment; filename=receipt-${booking.formId || booking._id}.pdf`);
    res.setHeader("Content-Type", "application/pdf");

    doc.pipe(res);

    doc.fontSize(18).text("Turban Culture Receipt");
    doc.moveDown();
    doc.fontSize(12);

    doc.text(`Receipt ID: ${booking.formId || booking._id}`);
    doc.text(`Payment ID: ${booking.paymentId || "N/A"}`);
    doc.text(`Order ID: ${booking.orderId || "N/A"}`);
    doc.moveDown();

    doc.text(`Name: ${booking.name}`);
    doc.text(`Phone: ${booking.phone}`);
    doc.text(`Email: ${booking.email || "N/A"}`);
    doc.text(`Address: ${booking.address}`);
    doc.text(`Date: ${booking.date}`);
    doc.text(`Session: ${booking.session}`);
    doc.text(`Time: ${booking.time}`);
    doc.moveDown();

    doc.text(`Package: ${booking.packageName}`);
    doc.text(`Package Price: Rs ${booking.packagePrice}`);
    doc.text(`Travel Charge: Rs ${booking.travelCharge}`);
    doc.text(`Travel Status: ${booking.travelChargePaymentStatus}`);
    doc.moveDown();

    doc.text(`Paid Amount: Rs ${booking.paidAmount}`);
    doc.text(`Total Price: Rs ${booking.totalPrice}`);
    doc.text(`Online Paid: Rs ${booking.onlinePaid}`);
    doc.text(`Cash Amount: Rs ${booking.cashAmount}`);
    doc.text(`Pending Amount: Rs ${booking.pendingAmount}`);
    doc.text(`Payment Status: ${booking.paymentStatus}`);

    doc.end();

  } catch (error) {
    console.log("PDF ERROR:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};