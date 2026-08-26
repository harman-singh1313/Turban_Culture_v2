import QuickBooking from "../models/quickBookingModel.js";
import PDFDocument from "pdfkit";
import {
  sendUserConfirmationEmail,
  sendOwnerNotificationEmail,
} from "../config/emailService.js";

// ================= HELPER: TOTAL CALCULATION (Single Source of Truth) =================
// No payment splits anymore — sirf total, jo event te collect hona
const calculateTotal = ({ packagePrice, travelCharge }) => {
  return Number(packagePrice || 0) + Number(travelCharge || 0);
};

// ================= PRICE SUMMARY (optional — called before final submit to show total) =================
export const calcPrice = (req, res) => {
  try {
    const { packagePrice = 0, distanceCharge = 0 } = req.body;

    const pkg    = Number(packagePrice);
    const travel = Number(distanceCharge);
    const total  = calculateTotal({ packagePrice: pkg, travelCharge: travel });

    return res.status(200).json({
      packagePrice:   pkg,
      distanceCharge: travel,
      totalAmount:    total, // to be collected on event day, no online payment
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ================= QUICK BOOKING (LEAD CREATION — NO PAYMENT) =================
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

      distanceKm     = 0,
      distanceCharge = 0,

      formId,
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

    // ---------- TOTAL (backend only, informational — collected in person) ----------
    const totalPrice = calculateTotal({
      packagePrice,
      travelCharge: travelChargeFinal,
    });

    // ---------- CREATE LEAD/BOOKING ----------
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
      travelCharge: travelChargeFinal,

      // pricing (informational only — no online payment taken)
      totalPrice,

      // lead tracking
      formId,
      status: "NEW_LEAD",

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
    // ✅ SIMPLIFIED: Sirf Package Price, Travel Charge, Total Amount, Booking ID.
    // Koi advance/pending/payment-method/payment-status nahi bhejna — is stage
    // te sirf form fill hoya hai, koi payment nahi hoyi.
    try {
      if (booking.email) {
        await sendUserConfirmationEmail({
          to:           booking.email,
          name:         booking.name,
          bookingId:    booking.formId || booking._id,
          packageName:  booking.packageName,
          totalPrice:   booking.totalPrice,
          travelCharge: booking.travelCharge,
        });
      }

      // Owner notification — THIS is what tells you someone filled the form
      await sendOwnerNotificationEmail({
        name:         booking.name,
        phone:        booking.phone,
        email:        booking.email,
        bookingId:    booking.formId || booking._id,
        packageName:  booking.packageName,
        totalPrice:   booking.totalPrice,
        travelCharge: booking.travelCharge,
        date:         booking.date,
        session:      booking.session,
        time:         booking.time,
        location:     booking.address,
      });
    } catch (emailError) {
      console.log("EMAIL ERROR:", emailError.message);
    }

    return res.status(201).json({
      success: true,
      message: "Quick Booking Lead Created Successfully",
      booking,
    });

  } catch (error) {
    console.log("QUICK BOOKING ERROR:", error);
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

    doc.fontSize(18).text("Turban Culture Booking Receipt");
    doc.moveDown();
    doc.fontSize(12);

    doc.text(`Booking ID: ${booking.formId || booking._id}`);
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
    doc.moveDown();

    doc.text(`Total Amount: Rs ${booking.totalPrice}`);
    doc.text(`Payment: To be collected in person on event day`);
    doc.moveDown();
    doc.text(`Status: ${booking.status || "NEW_LEAD"}`);

    doc.end();

  } catch (error) {
    console.log("PDF ERROR:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};