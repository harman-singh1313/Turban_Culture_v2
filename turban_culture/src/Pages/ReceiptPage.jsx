import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useRef, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

function ReceiptPage() {
  const slipRef = useRef();
  const { bookingId } = useParams();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [type, setType] = useState("form");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!bookingId) {
      setLoading(false);
      return;
    }
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/bookings/${bookingId}`)
      .then((res) => {
        setBooking(res.data.booking);
        setSelectedPackage(res.data.booking?.selectedPackage || null);
        setType(res.data.booking?.type || "form");
      })
      .catch((err) => {
        console.log("Receipt fetch error:", err);
        setBooking(null);
      })
      .finally(() => setLoading(false));
  }, [bookingId]);

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric", month: "short", year: "numeric",
    });
  };

  const formatBookingFor = (val) => {
    try {
      const arr = typeof val === "string" ? JSON.parse(val) : val;
      return arr.map((v) => v.charAt(0).toUpperCase() + v.slice(1)).join(", ");
    } catch { return val; }
  };

  const downloadPDF = async () => {
    const canvas = await html2canvas(slipRef.current, {
      scale: 2, useCORS: true, backgroundColor: "#ffffff",
    });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a5");
    pdf.addImage(imgData, "PNG", 0, 0, 148, 210);
    pdf.save(`receipt-${bookingId}.pdf`);
  };

if (loading) {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", backgroundColor: "#f8f5f0", gap: "16px" }}>
      <div style={{
        width: "48px", height: "48px",
        border: "4px solid #e8dccb",
        borderTop: "4px solid #c9913a",
        borderRadius: "50%",
        animation: "spin 0.8s linear infinite",
      }} />
      <p style={{ color: "#6b7280", fontSize: "14px" }}>Preparing your receipt...</p>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

  if (!bookingId || !booking) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#f9fafb", padding: "0 16px" }}>
        <div style={{ backgroundColor: "#fff", padding: "24px", borderRadius: "16px", boxShadow: "0 4px 20px rgba(0,0,0,0.1)", textAlign: "center", maxWidth: "360px" }}>
          <h2 style={{ fontSize: "20px", fontWeight: "700", color: "#dc2626", marginBottom: "8px" }}>Receipt Not Found</h2>
          <p style={{ color: "#6b7280", fontSize: "14px", marginBottom: "20px" }}>Booking details missing. Please try again.</p>
          <button onClick={() => navigate("/")} style={{ backgroundColor: "#000", color: "#fff", padding: "8px 20px", borderRadius: "8px", fontSize: "14px", fontWeight: "600", border: "none", cursor: "pointer" }}>Go Home</button>
        </div>
      </div>
    );
  }

  const isPackage = type === "package";
  // ... baaki poora code (payment breakdown, rows, JSX) waisa hi rahega jaisa pehle tha

  // ── Payment breakdown ──────────────────────────────────
  const isCash       = booking.paymentMode === "cash";
  const baseTotal    = Number(booking.totalPrice || selectedPackage?.price || 0);
  const paidAmount   = booking.paidAmount != null
    ? Number(booking.paidAmount)
    : Number(booking.totalPrice || selectedPackage?.price || 0);
  const travelCharge = Number(booking.travelCharge || booking.distanceCharge || 0);

  // ✅ FIX: Quick Booking model vich field "travelIncludedOnline" hai
  const travelPaidOnline =
    booking.travelIncludedOnline === true ||
    booking.travelIncludedOnline === "true" ||
    booking.travelChargePaymentStatus === "PAID";

  const grandTotal    = baseTotal + travelCharge;
  const pendingBase   = Math.max(baseTotal - paidAmount, 0);
  const pendingTravel = travelCharge > 0 && !travelPaidOnline ? travelCharge : 0;
  const totalPending  = pendingBase + pendingTravel;

  // ── Row data ────────────────────────────────────────────
  // ✅ FIX: Package rows vich sahi fields — address, date, session, time
  const packageRows = [
    ["Name",     booking.name],
    ["Phone",    booking.phone],
    ["Package",  booking.packageName || selectedPackage?.name || "-"],
    ["Location", booking.address || "-"],
    ["Date",     formatDate(booking.date)],
    ["Session",  booking.session || "-"],
    ["Time",     booking.time || "-"],
    ...(Number(booking.distanceKm) > 0
      ? [["Distance", `${booking.distanceKm} KM`]]
      : []),
  ];

  const formRows = [
    ["Name",          booking.name],
    ["Phone",         booking.phone],
    ["Event Type",    booking.eventType],
    ["Start Date",    formatDate(booking.startDate)],
    ...(booking.endDate ? [["End Date", formatDate(booking.endDate)]] : []),
    ["Days",          booking.days],
    ["Location",      booking.location],
    ["Booking For",   formatBookingFor(booking.bookingFor)],
    ["Members",       booking.paggMembers],
    ["Turban Style",  booking.paggStyle],
    ["Session",       booking.paggTime],
    ...(booking.preferredTime ? [["Preferred Time", booking.preferredTime]] : []),
  ];

  const rows = isPackage ? packageRows : formRows;

  const gold       = "#c9913a";
  const goldLight  = "#fff8ef";
  const goldBorder = "#e8dccb";
  const detailRow  = { display: "flex", justifyContent: "space-between", alignItems: "flex-start" };
  const labelStyle = { fontWeight: "600", color: "#4b5563", flexShrink: 0, marginRight: "12px" };
  const valueStyle = { color: "#1f2937", textAlign: "right" };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8f5f0", display: "flex", flexDirection: "column", alignItems: "center", padding: "40px 16px" }}>

      {/* Success Header */}
      <div style={{ textAlign: "center", marginBottom: "28px" }}>
        <div style={{ width: "62px", height: "62px", backgroundColor: "#dcfce7", color: "#16a34a", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px", fontSize: "28px" }}>✓</div>
        <h1 style={{ fontSize: "26px", fontWeight: "700", color: "#2f2418", margin: "0 0 6px" }}>Payment Successful</h1>
        <p style={{ color: "#6b7280", fontSize: "14px", margin: 0 }}>Your booking is confirmed. Here is your receipt.</p>
      </div>

      {/* Receipt Slip */}
      <div ref={slipRef} style={{ width: "100%", maxWidth: "460px", backgroundColor: "#ffffff", border: `1px solid ${goldBorder}`, borderRadius: "16px", padding: "32px", fontFamily: "Arial, sans-serif", color: "#000000" }}>

        {/* Brand Header */}
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <h2 style={{ fontSize: "22px", fontWeight: "bold", letterSpacing: "2px", margin: "0 0 4px", color: "#2f2418" }}>Turban Culture</h2>
          <p style={{ fontSize: "13px", color: "#9ca3af", margin: 0 }}>
            {isPackage ? "Package Booking Receipt" : "Booking Receipt"}
          </p>
        </div>

        <hr style={{ border: "none", borderTop: "1px dashed #d1d5db", marginBottom: "20px" }} />

        {/* Package Badge */}
        {isPackage && selectedPackage && (
          <div style={{ backgroundColor: goldLight, border: "1px solid #f5c97a", borderRadius: "12px", padding: "14px 16px", marginBottom: "18px", display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ fontSize: "28px" }}>{selectedPackage.icon}</div>
            <div>
              <p style={{ fontWeight: "700", fontSize: "16px", color: "#7a4f10", margin: "0 0 2px" }}>{selectedPackage.name}</p>
              <p style={{ fontSize: "12px", color: "#a07840", margin: 0 }}>{selectedPackage.badge} Package</p>
            </div>
            <div style={{ marginLeft: "auto", textAlign: "right" }}>
              <p style={{ fontWeight: "700", fontSize: "18px", color: gold, margin: 0 }}>₹{selectedPackage.price}</p>
              <p style={{ fontSize: "11px", color: "#9ca3af", margin: 0 }}>Package Price</p>
            </div>
          </div>
        )}

        {/* Package Features */}
        {isPackage && selectedPackage?.features?.length > 0 && (
          <div style={{ marginBottom: "18px" }}>
            <p style={{ fontSize: "11px", fontWeight: "700", color: "#9ca3af", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "10px" }}>Package Includes</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              {selectedPackage.features.map((f, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "8px", fontSize: "13px" }}>
                  <span style={{ color: gold, fontWeight: "700", flexShrink: 0 }}>✓</span>
                  <span style={{ color: "#374151" }}>{f}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {isPackage && selectedPackage && (
          <hr style={{ border: "none", borderTop: "1px dashed #d1d5db", marginBottom: "18px" }} />
        )}

        {/* Booking Details */}
        <p style={{ fontSize: "11px", fontWeight: "700", color: "#9ca3af", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "12px" }}>Booking Details</p>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "14px" }}>
          {rows.map(([label, value]) => (
            <div key={label} style={detailRow}>
              <span style={labelStyle}>{label}</span>
              <span style={valueStyle}>{value || "-"}</span>
            </div>
          ))}
        </div>

        <hr style={{ border: "none", borderTop: "1px dashed #d1d5db", margin: "20px 0" }} />

        {/* Payment Summary */}
        <p style={{ fontSize: "11px", fontWeight: "700", color: "#9ca3af", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "12px" }}>Payment Summary</p>

        <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "14px" }}>

          <div style={detailRow}>
            <span style={labelStyle}>Payment Mode</span>
            <span style={{ fontSize: "12px", fontWeight: "700", padding: "3px 12px", borderRadius: "20px", backgroundColor: isCash ? "#fef9c3" : "#dcfce7", color: isCash ? "#854d0e" : "#15803d" }}>
              {isCash ? "💵 Cash (Advance Paid)" : "💳 Online"}
            </span>
          </div>

          <div style={detailRow}>
            <span style={{ color: "#4b5563" }}>Booking Amount</span>
            <span style={{ color: "#1f2937" }}>₹{baseTotal}</span>
          </div>

          {travelCharge > 0 && (
            <div style={detailRow}>
              <div>
                <span style={{ color: "#4b5563" }}>Travel Charge</span>
                {Number(booking.distanceKm) > 0 && (
                  <p style={{ fontSize: "11px", color: "#9ca3af", margin: "2px 0 0" }}>
                    {booking.distanceKm} km · ₹20/km after 30 km
                  </p>
                )}
              </div>
              <div style={{ textAlign: "right" }}>
                <span style={{ color: "#1f2937" }}>₹{travelCharge} </span>
                <span style={{ fontSize: "10px", padding: "2px 8px", borderRadius: "20px", backgroundColor: travelPaidOnline ? "#dcfce7" : "#fff7ed", color: travelPaidOnline ? "#15803d" : "#ea580c" }}>
                  {travelPaidOnline ? "Paid Online" : "Cash Pending"}
                </span>
              </div>
            </div>
          )}

          <div style={{ ...detailRow, borderTop: "1px dashed #d1d5db", paddingTop: "10px" }}>
            <span style={{ fontWeight: "700", color: "#1f2937" }}>Grand Total</span>
            <span style={{ fontWeight: "800", color: "#1f2937" }}>₹{grandTotal}</span>
          </div>

          <div style={{ backgroundColor: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "10px", padding: "12px 16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontWeight: "700", color: "#15803d" }}>✓ Amount Paid (Online)</span>
              <span style={{ fontWeight: "800", fontSize: "18px", color: "#15803d" }}>₹{paidAmount}</span>
            </div>
          </div>

          {totalPending > 0 && (
            <div style={{ backgroundColor: "#fff7ed", border: "1px solid #fed7aa", borderRadius: "10px", padding: "12px 16px", display: "flex", flexDirection: "column", gap: "8px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontWeight: "700", color: "#ea580c" }}>⏳ Total Pending (Cash)</span>
                <span style={{ fontWeight: "800", fontSize: "18px", color: "#ea580c" }}>₹{totalPending}</span>
              </div>
              <div style={{ borderTop: "1px dashed #fed7aa", paddingTop: "8px", display: "flex", flexDirection: "column", gap: "5px", fontSize: "12px", color: "#c2410c" }}>
                {pendingBase > 0 && (
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span>Remaining booking amount (cash on event day)</span>
                    <span style={{ fontWeight: "700" }}>₹{pendingBase}</span>
                  </div>
                )}
                {pendingTravel > 0 && (
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span>Travel charge (cash on event day)</span>
                    <span style={{ fontWeight: "700" }}>₹{pendingTravel}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {pendingBase > 0 && (
            <div style={{ backgroundColor: "#fefce8", border: "1px solid #fef08a", borderRadius: "10px", padding: "12px 16px" }}>
              <p style={{ fontSize: "11px", fontWeight: "700", color: "#713f12", textTransform: "uppercase", letterSpacing: "1px", margin: "0 0 10px" }}>
                Cash Booking Breakdown
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "13px", color: "#92400e" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>30% Advance Paid Online</span>
                  <span style={{ fontWeight: "700" }}>₹{paidAmount}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>Remaining Balance (Cash on Event Day)</span>
                  <span style={{ fontWeight: "700" }}>₹{pendingBase}</span>
                </div>
                {pendingTravel > 0 && (
                  <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px dashed #fde68a", paddingTop: "6px" }}>
                    <span>+ Travel Charge (Cash on Event Day)</span>
                    <span style={{ fontWeight: "700" }}>₹{pendingTravel}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          <div style={detailRow}>
            <span style={labelStyle}>Payment Status</span>
            <span style={{ fontWeight: "700", color: "#16a34a" }}>{booking.paymentStatus || "SUCCESS"}</span>
          </div>
          <div style={detailRow}>
            <span style={labelStyle}>Booking ID</span>
            <span style={{ fontSize: "12px", color: "#9ca3af" }}>#{bookingId}</span>
          </div>
        </div>

        <hr style={{ border: "none", borderTop: "1px dashed #d1d5db", margin: "20px 0 14px" }} />
        <p style={{ textAlign: "center", fontSize: "12px", color: "#9ca3af", margin: 0 }}>
          Thank you for choosing Turban Culture 🙏
        </p>
      </div>

      {/* Action Buttons */}
      <div style={{ display: "flex", gap: "12px", marginTop: "24px" }}>
        <button
          onClick={downloadPDF}
          style={{ padding: "13px 36px", borderRadius: "10px", backgroundColor: gold, color: "#fff", fontSize: "15px", fontWeight: "700", border: "none", cursor: "pointer", boxShadow: "0 4px 14px rgba(201,145,58,0.35)" }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#b18236"}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = gold}
        >
          ⬇ Download Receipt
        </button>
        <button
          onClick={() => navigate("/")}
          style={{ padding: "13px 28px", borderRadius: "10px", border: "1px solid #d1d5db", backgroundColor: "#fff", color: "#374151", fontSize: "15px", fontWeight: "600", cursor: "pointer" }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f3f4f6"}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#fff"}
        >
          ← Home
        </button>
      </div>
    </div>
  );
}

export default ReceiptPage;
