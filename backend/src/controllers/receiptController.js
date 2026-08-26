import PDFDocument from "pdfkit";
import Booking from "../models/bookingModel.js";
import QuickBooking from "../models/quickBookingModel.js";

// ─── Helpers ───────────────────────────────────────────────
const formatDate = (dateStr) => {
  if (!dateStr) return "-";

  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const formatBookingFor = (val) => {
  try {
    const arr = typeof val === "string" ? JSON.parse(val) : val;

    if (!Array.isArray(arr)) return val || "-";

    return arr
      .map((v) => v.charAt(0).toUpperCase() + v.slice(1))
      .join(", ");
  } catch {
    return val || "-";
  }
};

const dashedLine = (doc, y) => {
  doc
    .save()
    .moveTo(50, y)
    .lineTo(545, y)
    .dash(3, { space: 4 })
    .strokeColor("#cccccc")
    .stroke()
    .restore();
};

const row = (doc, label, value, y) => {
  doc
    .fontSize(10.5)
    .fillColor("#4b5563")
    .font("Helvetica")
    .text(label, 50, y)
    .fillColor("#1f2937")
    .font("Helvetica")
    .text(String(value ?? "-"), 0, y, {
      align: "right",
      width: 495,
    });
};

const sectionHeading = (doc, text, y) => {
  doc
    .fontSize(8)
    .fillColor("#9ca3af")
    .font("Helvetica-Bold")
    .text(text.toUpperCase(), 50, y, {
      characterSpacing: 1.2,
    });
};

const highlightBox = (doc, label, value, y) => {
  doc
    .roundedRect(50, y, 495, 36, 10)
    .fillAndStroke("#fff8ef", "#e8dccb");

  doc
    .fontSize(12)
    .fillColor("#7a4f10")
    .font("Helvetica-Bold")
    .text(label, 66, y + 11)
    .fillColor("#c9913a")
    .font("Helvetica-Bold")
    .text(value, 0, y + 11, {
      align: "right",
      width: 479,
    });
};

// ═══════════════════════════════════════════════════════════
export const downloadReceipt = async (req, res) => {
  console.log("Receipt Route Hit", req.params);

  try {
    const { type, id } = req.params;

    // ── Get booking ────────────────────────────────────────
    let booking;

    if (type === "simple") {
      booking = await Booking.findById(id);
    } else if (type === "quick") {
      booking = await QuickBooking.findById(id);
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid booking type",
      });
    }

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // ── Pricing ────────────────────────────────────────────
    const packagePrice = Number(booking.totalPrice) || 0;

    const travelCharge =
      Number(booking.travelCharge || booking.distanceCharge) || 0;

    const totalAmount = packagePrice + travelCharge;

    // ── PDF Setup ──────────────────────────────────────────
    const doc = new PDFDocument({
      margin: 50,
      size: "A5",
    });

    res.setHeader("Content-Type", "application/pdf");

    res.setHeader(
      "Content-Disposition",
      `attachment; filename=receipt-${booking.formId || id}.pdf`
    );

    doc.pipe(res);

    let y = 40;

    // ── Header ─────────────────────────────────────────────
    doc
      .fontSize(22)
      .font("Helvetica-Bold")
      .fillColor("#2f2418")
      .text("Turban Culture", 50, y, {
        align: "center",
        width: 495,
      });

    y += 30;

    doc
      .fontSize(10)
      .font("Helvetica")
      .fillColor("#9ca3af")
      .text(
        type === "quick"
          ? "Package Booking Receipt"
          : "Booking Receipt",
        50,
        y,
        {
          align: "center",
          width: 495,
        }
      );

    y += 22;

    dashedLine(doc, y);
    y += 16;

    // ── Booking Details ────────────────────────────────────
    sectionHeading(doc, "Booking Details", y);
    y += 18;

    const quickRows = [
      ["Name", booking.name],
      ["Phone", booking.phone],
      ["Package", booking.packageName || "-"],
      ["Location", booking.address || "-"],
      ["Date", formatDate(booking.date)],
      ["Session", booking.session || "-"],
      ["Time", booking.time || "-"],
      ...(Number(booking.distanceKm) > 0
        ? [["Distance", `${booking.distanceKm} KM`]]
        : []),
    ];

    const simpleRows = [
      ["Name", booking.name],
      ["Phone", booking.phone],
      ["Event Type", booking.eventType],
      ["Start Date", formatDate(booking.startDate)],
      ...(booking.endDate
        ? [["End Date", formatDate(booking.endDate)]]
        : []),
      ["Days", booking.days],
      ["Location", booking.location],
      ["Booking For", formatBookingFor(booking.bookingFor)],
      ["Members", booking.paggMembers],
      ["Turban Style", booking.paggStyle],
      ["Session", booking.paggTime],
      ...(booking.preferredTime
        ? [["Preferred Time", booking.preferredTime]]
        : []),
    ];

    const detailRows =
      type === "quick" ? quickRows : simpleRows;

    detailRows.forEach(([label, value]) => {
      row(doc, label, value, y);
      y += 18;
    });

    y += 8;

    dashedLine(doc, y);
    y += 18;

    // ── Payment Summary ────────────────────────────────────
    sectionHeading(doc, "Payment Summary", y);
    y += 18;

    row(doc, "Package Price", `₹${packagePrice}`, y);
    y += 20;

    if (travelCharge > 0) {
      row(doc, "Travel Charge", `₹${travelCharge}`, y);
      y += 20;

      if (Number(booking.distanceKm) > 0) {
        doc
          .fontSize(8)
          .fillColor("#9ca3af")
          .font("Helvetica")
          .text(
            `${booking.distanceKm} km · ₹20/km after 30 km`,
            66,
            y - 4
          );

        y += 12;
      }
    }

    // ── Total ───────────────────────────────────────────────
    highlightBox(
      doc,
      "Total Amount",
      `₹${totalAmount}`,
      y
    );

    y += 52;

    // ── Booking ID ─────────────────────────────────────────
    row(
      doc,
      "Booking ID",
      `#${booking.formId || id}`,
      y
    );

    y += 26;

    dashedLine(doc, y);
    y += 14;

    // ── Footer ─────────────────────────────────────────────
    doc
      .fontSize(8.5)
      .fillColor("#9ca3af")
      .font("Helvetica")
      .text(
        "Thank you for choosing Turban Culture 🙏",
        50,
        y,
        {
          align: "center",
          width: 495,
        }
      );

    doc.end();
  } catch (error) {
    console.error("Receipt PDF Error:", error);

    if (!res.headersSent) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
};