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
    return arr.map((v) => v.charAt(0).toUpperCase() + v.slice(1)).join(", ");
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

const row = (doc, label, value, y, options = {}) => {
  const {
    labelColor = "#4b5563",
    valueColor = "#1f2937",
    bold = false,
  } = options;
  doc
    .fontSize(bold ? 11 : 10.5)
    .fillColor(labelColor)
    .font(bold ? "Helvetica-Bold" : "Helvetica")
    .text(label, 50, y)
    .fillColor(valueColor)
    .font(bold ? "Helvetica-Bold" : "Helvetica")
    .text(String(value ?? "-"), 0, y, { align: "right", width: 495 });
};

const badgeRow = (doc, label, badgeText, badgeColor, y) => {
  doc
    .fontSize(10.5)
    .fillColor("#1f2937")
    .font("Helvetica-Bold")
    .text(label, 50, y);
  const badgeW = doc.widthOfString(badgeText) + 20;
  const badgeX = 545 - badgeW;
  doc.roundedRect(badgeX, y - 3, badgeW, 18, 9).fill(badgeColor);
  doc
    .fontSize(9)
    .fillColor("#ffffff")
    .font("Helvetica-Bold")
    .text(badgeText, badgeX, y + 1, { width: badgeW, align: "center" });
};

const highlightBox = (
  doc,
  label,
  value,
  y,
  bgColor,
  borderColor,
  textColor,
) => {
  doc.roundedRect(50, y, 495, 36, 10).fillAndStroke(bgColor, borderColor);
  doc
    .fontSize(12)
    .fillColor(textColor)
    .font("Helvetica-Bold")
    .text(label, 66, y + 11)
    .text(value, 0, y + 11, { align: "right", width: 479 });
};

const sectionHeading = (doc, text, y) => {
  doc
    .fontSize(8)
    .fillColor("#9ca3af")
    .font("Helvetica-Bold")
    .text(text.toUpperCase(), 50, y, { characterSpacing: 1.2 });
};

const subNote = (doc, text, y) => {
  doc.fontSize(8.5).fillColor("#9ca3af").font("Helvetica").text(text, 66, y);
};

// ═══════════════════════════════════════════════════════════
export const downloadReceipt = async (req, res) => {
  console.log("Receipt Route Hit", req.params);
  try {
    const { type, id } = req.params;

    let booking;
    // ✅ FIX: findByPk → findById (Mongoose/MongoDB)
    if (type === "simple") booking = await Booking.findById(id);
    else if (type === "quick") booking = await QuickBooking.findById(id);

    if (!booking)
      return res
        .status(404)
        .json({ success: false, message: "Booking not found" });

    // ── Payment calculations ──────────────────────────────
   const baseTotal = Number(booking.totalPrice) || 0;

const paidAmount =
  booking.paidAmount != null
    ? Number(booking.paidAmount)
    : Number(booking.onlinePaid) || 0;

const isCash = booking.paymentMode === "cash" && paidAmount > 0;
const travelCharge = Number(booking.travelCharge || 0);
    // ✅ FIX: Quick Booking model vich field "travelIncludedOnline" hai, "travelChargeIncludedOnline" nahi
    const travelOnline =
      booking.travelIncludedOnline === true ||
      booking.travelChargeIncludedOnline === true ||
      booking.travelChargePaymentStatus === "PAID";

    const grandTotal = baseTotal + travelCharge;
    const pendingBase = Math.max(baseTotal - paidAmount, 0);
    const pendingTravel = travelCharge > 0 && !travelOnline ? travelCharge : 0;
    const totalPending = pendingBase + pendingTravel;

    // ── PDF setup ──────────────────────────────────────────
    const doc = new PDFDocument({ margin: 50, size: "A5" });
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=receipt-${booking.formId || id}.pdf`,
    );
    doc.pipe(res);

    let y = 40;

    // ── Header ──────────────────────────────────────────────
    doc
      .fontSize(22)
      .font("Helvetica-Bold")
      .fillColor("#2f2418")
      .text("Turban Culture", 50, y, { align: "center", width: 495 });
    y += 30;
    doc
      .fontSize(10)
      .font("Helvetica")
      .fillColor("#9ca3af")
      .text(
        type === "quick" ? "Package Booking Receipt" : "Booking Receipt",
        50,
        y,
        { align: "center", width: 495 },
      );
    y += 22;

    dashedLine(doc, y);
    y += 16;

    // ── BOOKING DETAILS ─────────────────────────────────────
    sectionHeading(doc, "Booking Details", y);
    y += 18;

    // ✅ FIX: Quick Booking fields sahi ne — address, date, session, time, packageName
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
      ["End Date", formatDate(booking.endDate)],
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

    const detailRows = type === "quick" ? quickRows : simpleRows;
    detailRows.forEach(([label, value]) => {
      row(doc, label, value, y);
      y += 18;
    });

    y += 8;
    dashedLine(doc, y);
    y += 16;

    // ── PAYMENT SUMMARY ─────────────────────────────────────
    sectionHeading(doc, "Payment Summary", y);
    y += 18;

    const modeBadgeText = isCash ? "Cash (Advance Paid)" : "Online";
    const modeBadgeColor = isCash ? "#d97706" : "#16a34a";
    badgeRow(doc, "Payment Mode", modeBadgeText, modeBadgeColor, y);
    y += 24;

    row(doc, "Booking Amount", `₹${baseTotal}`, y);
    y += 18;

    if (travelCharge > 0) {
      doc
        .fontSize(10.5)
        .fillColor("#4b5563")
        .font("Helvetica")
        .text("Travel Charge", 50, y);

      const pillText = travelOnline ? "Paid Online" : "Cash Pending";
      const pillBg = travelOnline ? "#dcfce7" : "#fff7ed";
      const pillFg = travelOnline ? "#15803d" : "#ea580c";
      const pillW = doc.widthOfString(pillText) + 16;
      const pillX = 545 - pillW;
      doc.roundedRect(pillX, y - 2, pillW, 16, 8).fill(pillBg);
      doc
        .fontSize(8.5)
        .fillColor(pillFg)
        .font("Helvetica-Bold")
        .text(pillText, pillX, y + 1, { width: pillW, align: "center" });

      doc
        .fontSize(10.5)
        .fillColor("#1f2937")
        .font("Helvetica")
        .text(`₹${travelCharge}`, 0, y, {
          align: "right",
          width: 495 - pillW - 8,
        });

      y += 14;

      if (Number(booking.distanceKm) > 0) {
        subNote(doc, `${booking.distanceKm} km · ₹20/km after 30 km`, y);
        y += 14;
      }
    }

    y += 4;
    dashedLine(doc, y);
    y += 10;
    row(doc, "Grand Total", `₹${grandTotal}`, y, { bold: true });
    y += 26;

    highlightBox(
      doc,
      "  ✓ Amount Paid (Online)",
      `₹${paidAmount}`,
      y,
      "#f0fdf4",
      "#bbf7d0",
      "#15803d",
    );
    y += 46;

    if (totalPending > 0) {
      highlightBox(
        doc,
        "  ⏳ Total Pending (Cash)",
        `₹${totalPending}`,
        y,
        "#fff7ed",
        "#fed7aa",
        "#ea580c",
      );
      y += 44;

      doc.fontSize(9).fillColor("#9a3412").font("Helvetica");
      if (pendingBase > 0) {
        doc.text(`   Remaining booking amount (cash on event day)`, 60, y);
        doc
          .font("Helvetica-Bold")
          .text(`₹${pendingBase}`, 0, y, { align: "right", width: 479 });
        doc.font("Helvetica");
        y += 14;
      }
      if (pendingTravel > 0) {
        doc.text(`   Travel charge (cash on event day)`, 60, y);
        doc
          .font("Helvetica-Bold")
          .text(`₹${pendingTravel}`, 0, y, { align: "right", width: 479 });
        y += 14;
      }
      y += 6;
    }

    if (pendingBase > 0) {
      y += 4;
      const boxH = isCash && travelCharge > 0 && !travelOnline ? 76 : 58;
      doc.roundedRect(50, y, 495, boxH, 10).fillAndStroke("#fefce8", "#fef08a");

      doc
        .fontSize(9)
        .fillColor("#713f12")
        .font("Helvetica-Bold")
        .text("Cash Booking Breakdown", 66, y + 10);
      y += 26;

      const cbRows = [
        ["30% Advance Paid Online", `₹${paidAmount}`],
        ["Remaining Balance (Cash on Event Day)", `₹${pendingBase}`],
      ];
      if (pendingTravel > 0) {
        cbRows.push([
          `+ Travel Charge (Cash on Event Day)`,
          `₹${pendingTravel}`,
        ]);
      }
      cbRows.forEach(([lbl, val]) => {
        doc.fontSize(9).fillColor("#92400e").font("Helvetica").text(lbl, 66, y);
        doc
          .fillColor("#92400e")
          .font("Helvetica-Bold")
          .text(val, 0, y, { align: "right", width: 479 });
        y += 14;
      });
      y += 10;
    }

    y += 4;
    row(doc, "Payment Status", booking.paymentStatus || "SUCCESS", y, {
      valueColor: "#16a34a",
    });
    y += 18;
    row(doc, "Booking ID", `#${id}`, y, { valueColor: "#9ca3af" });
    y += 22;

    dashedLine(doc, y);
    y += 18;

    doc
      .fontSize(10)
      .fillColor("#9ca3af")
      .font("Helvetica")
      .text("Thank you for choosing Turban Culture 🙏", 50, y, {
        align: "center",
        width: 495,
      });

    doc.end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};
