import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://3.27.155.171:5000";
const generateUUID = () => {
  return Math.random().toString(16).slice(2) + Math.random().toString(16).slice(2);
};

const generateFormId = () => {
  return `QUICK-${Date.now().toString(36).toUpperCase()}-${generateUUID().toUpperCase()}`;
};

// ─────────────────────────────────────────────
// Payment Modal Component
// ─────────────────────────────────────────────
function PaymentChoiceModal({
  breakdown,   // ← comes from backend: { packagePrice, distanceCharge, includeTravelOnline, grandTotal, advanceAmount, remainingCash, totalCash }
  onClose,
  onConfirm,
}) {
  const [step, setStep] = useState(1);

  const handleOnline  = () => onConfirm("online", breakdown.grandTotal);
  const handleCash    = () => setStep(2);
  const handleCashConfirm = () => onConfirm("cash", breakdown.advanceAmount);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 relative">

        <button onClick={onClose} className="absolute top-3 right-4 text-gray-400 hover:text-gray-600">
          ✕
        </button>

        {/* ── STEP 1 ── */}
        {step === 1 && (
          <>
            <div className="text-center mb-5">
              <span className="text-3xl">💳</span>
              <h3 className="text-base font-serif mt-2">Payment Method</h3>

              <div className="mt-3 bg-[#fff8ef] rounded-xl p-3 text-left text-xs">
                <div className="flex justify-between">
                  <span>Package</span>
                  <span>₹{breakdown.packagePrice}</span>
                </div>

                {breakdown.distanceCharge > 0 && (
                  <div className="flex justify-between mt-1">
                    <span>Travel</span>
                    <span>
                      {breakdown.includeTravelOnline
                        ? `₹${breakdown.distanceCharge} (included)`
                        : `₹${breakdown.distanceCharge} (cash)`}
                    </span>
                  </div>
                )}

                <div className="flex justify-between font-bold border-t mt-2 pt-2">
                  <span>Pay Now</span>
                  <span>₹{breakdown.grandTotal}</span>
                </div>
              </div>
            </div>

            <button onClick={handleOnline} className="w-full bg-[#c9913a] text-white py-2 rounded-xl mb-2">
              Pay Full Online
            </button>
            <button onClick={handleCash} className="w-full border border-[#c9913a] text-[#c9913a] py-2 rounded-xl">
              Cash (30% Advance)
            </button>
          </>
        )}

        {/* ── STEP 2 ── */}
        {step === 2 && (
          <>
            <div className="text-center mb-5">
              <span className="text-3xl">⚠️</span>
              <h3 className="text-base font-serif mt-2">30% Advance Required</h3>
            </div>

            <div className="bg-[#fff8ef] p-3 rounded-xl text-xs space-y-2">
              <div className="flex justify-between font-bold">
                <span>Advance (30%)</span>
                <span>₹{breakdown.advanceAmount}</span>
              </div>

              <div className="flex justify-between">
                <span>Remaining Cash</span>
                <span>₹{breakdown.remainingCash}</span>
              </div>

              {breakdown.distanceCharge > 0 && !breakdown.includeTravelOnline && (
                <div className="flex justify-between text-orange-600">
                  <span>Travel Cash</span>
                  <span>₹{breakdown.distanceCharge}</span>
                </div>
              )}

              <div className="border-t pt-2 flex justify-between font-bold">
                <span>Total Cash</span>
                <span>₹{breakdown.totalCash}</span>
              </div>
            </div>

            <div className="flex gap-2 mt-3">
              <button onClick={() => setStep(1)} className="flex-1 border rounded-xl py-2">
                Back
              </button>
              <button onClick={handleCashConfirm} className="flex-1 bg-[#c9913a] text-white rounded-xl py-2">
                Pay ₹{breakdown.advanceAmount}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Main Quick Booking Form
// ─────────────────────────────────────────────
const QuickBookingForm = ({ selectedPackage, onClose }) => {
  const navigate = useNavigate();
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [locationInput, setLocationInput]             = useState("");
  const debounceRef = useRef(null);
  const [loading, setLoading] = useState(false);

  // travel state — raw values only, no calculations here
  const [distanceCharge, setDistanceCharge]           = useState(0);
  const [distanceKm, setDistanceKm]                   = useState(0);
  const [includeTravelOnline, setIncludeTravelOnline] = useState(false);

  // payment modal state — breakdown comes 100% from backend
  const [showPayModal, setShowPayModal] = useState(false);
  const [breakdown, setBreakdown]       = useState(null);

  const [formData, setFormData] = useState({
    formId:  generateFormId(),
    name:    "",
    phone:   "",
    email:   "",
    address: "",
    date:    "",
    session: "",
    time:    "",
  });

  const packagePrice = selectedPackage?.price || 0;

  // ── Location search ──
  const searchLocation = (query) => {
    clearTimeout(debounceRef.current);
    if (query.length < 3) { setLocationSuggestions([]); return; }
    debounceRef.current = setTimeout(async () => {
      try {
const res  = await fetch(`${API_URL}/api/location?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setLocationSuggestions(data);
      } catch (error) {
        console.log("Location search error:", error);
      }
    }, 500);
  };

  // ── Distance fetch — just store raw km/charge, no math ──
  const calculateDistance = async (lat, lon) => {
    try {
const res = await axios.post(`${API_URL}/api/distance`, { lat, lon });
      setDistanceCharge(res.data.distanceCharge);
      setDistanceKm(res.data.distanceKm || 0);
      setIncludeTravelOnline(false);
    } catch (err) {
      console.log("Distance error:", err);
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // ── Validation → ask backend to calculate breakdown ──
  const handleSubmitClick = async (e) => {
    e.preventDefault();

    if (!selectedPackage?.price) return alert("Package price not found");
    if (formData.phone.length !== 10) return alert("Enter valid 10 digit phone");

    try {
      // Backend returns full breakdown — no math on frontend
const res = await axios.post(`${API_URL}/api/quick-bookings/calc-price`, {
          packagePrice,
        distanceCharge,
        includeTravelOnline,
      });

      setBreakdown(res.data);   // { packagePrice, distanceCharge, includeTravelOnline, grandTotal, advanceAmount, remainingCash, totalCash }
      setShowPayModal(true);
    } catch (err) {
      console.log(err);
      alert("Could not calculate price. Please try again.");
    }
  };

  // ── Called from modal after user chooses payment method ──
  const handlePayConfirm = async (mode, amountToPay) => {
    setShowPayModal(false);

    try {
      setLoading(true);

const { data } = await axios.post(`${API_URL}/api/create-order`, {
          amount:  amountToPay,
        receipt: formData.formId,
      });

      const options = {
        key:         import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount:      data.order.amount,
        currency:    "INR",
        name:        "Turban Culture",
        description: selectedPackage.name,
        order_id:    data.order.id,

        handler: async function (response) {
const verifyRes = await axios.post(`${API_URL}/api/quick-bookings/verify-payment`, {
              razorpay_order_id:   response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature:  response.razorpay_signature,
          });

          if (!verifyRes.data.success) return alert("Payment failed");

          // Send raw data — backend will recalculate everything
          const bookingData = {
            ...formData,
            selectedPackage,
            distanceCharge,
            distanceKm,
            travelIncludedOnline: includeTravelOnline,
            paymentMode:          mode,
            paymentId:            response.razorpay_payment_id,
            orderId:              response.razorpay_order_id,
            paymentStatus:        "SUCCESS",
          };

const bookingRes = await axios.post(`${API_URL}/api/quick-bookings`, bookingData);
          const booking    = bookingRes.data.booking;

          navigate("/receipt", {
            state: { bookingId: booking._id, type: "package", booking, selectedPackage },
          });

          onClose();
        },

        prefill: {
          name:    formData.name,
          contact: formData.phone,
          email:   formData.email,
        },

        theme: { color: "#c9913a" },
      };

      new window.Razorpay(options).open();
    } catch (err) {
      console.log(err);
      alert("Booking failed");
    } finally {
      setLoading(false);
    }
  };

  // ── Display-only summary — values come from state set by backend (distanceCharge) ──
  // payNow display = packagePrice + (includeTravelOnline ? distanceCharge : 0)
  // This is just for UI preview, actual math is always confirmed by backend
  const displayPayNow = packagePrice + (includeTravelOnline ? distanceCharge : 0);

  return (
    <>
      {showPayModal && breakdown && (
        <PaymentChoiceModal
          breakdown={breakdown}
          onClose={() => setShowPayModal(false)}
          onConfirm={handlePayConfirm}
        />
      )}

      <div className="fixed inset-0 bg-black/55 flex items-center justify-center z-50 px-3 py-3">
        <div className="bg-white w-full max-w-[380px] rounded-2xl p-3.5 relative max-h-[94vh] overflow-y-auto">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-2 right-3 text-lg text-gray-400 hover:text-black"
          >
            ✕
          </button>

          <h2 className="text-sm font-serif text-[#3d2e1e] mb-0.5">{selectedPackage.name}</h2>
          <p className="text-[10px] text-[#8a7a68] mb-2.5">Fill your booking details</p>

          <form onSubmit={handleSubmitClick} className="flex flex-col gap-1.5">
            <div className="grid grid-cols-2 gap-1.5">
              <div>
                <label className="text-[10px] text-[#6b5b4b]">Name</label>
                <input
                  name="name"
                  placeholder="Your name"
                  onChange={handleChange}
                  required
                  className="w-full border border-[#c9913a]/30 px-2 py-1 text-[11px] rounded-lg mt-0.5 focus:outline-none focus:border-[#c9913a]"
                />
              </div>

              <div>
                <label className="text-[10px] text-[#6b5b4b]">Phone</label>
                <input
                  name="phone"
                  placeholder="Phone"
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "").slice(0, 10);
                    setFormData((prev) => ({ ...prev, phone: val }));
                  }}
                  value={formData.phone}
                  required
                  className="w-full border border-[#c9913a]/30 px-2 py-1 text-[11px] rounded-lg mt-0.5 focus:outline-none focus:border-[#c9913a]"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] text-[#6b5b4b]">Email</label>
              <input
                type="email"
                name="email"
                placeholder="yourmail@gmail.com"
                onChange={handleChange}
                className="w-full border border-[#c9913a]/30 px-2 py-1 text-[11px] rounded-lg mt-0.5 focus:outline-none focus:border-[#c9913a]"
              />
            </div>

            <div>
              <label className="text-[10px] text-[#6b5b4b]">Location</label>
              <div className="relative">
                <input
                  placeholder="Venue / Location"
                  value={locationInput}
                  onChange={(e) => {
                    setLocationInput(e.target.value);
                    setFormData((prev) => ({ ...prev, address: e.target.value }));
                    searchLocation(e.target.value);
                  }}
                  required
                  className="w-full border border-[#c9913a]/30 px-2 py-1 text-[11px] rounded-lg mt-0.5 focus:outline-none focus:border-[#c9913a]"
                />
                {locationSuggestions.length > 0 && (
                  <div className="absolute z-10 w-full bg-white border rounded-xl mt-0.5 shadow-lg max-h-28 overflow-y-auto">
                    {locationSuggestions.map((s) => (
                      <div
                        key={s.place_id}
                        onClick={() => {
                          setLocationInput(s.display_name);
                          setFormData((prev) => ({ ...prev, address: s.display_name }));
                          setLocationSuggestions([]);
                          calculateDistance(s.lat, s.lon);
                        }}
                        className="px-2.5 py-1 text-[11px] hover:bg-[#c9913a]/10 cursor-pointer border-b border-gray-100"
                      >
                        {s.display_name}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* ── TRAVEL CHARGE TOGGLE ── */}
              {distanceCharge > 0 && (
                <div className="mt-2 bg-[#fff8ef] border border-[#c9913a]/30 rounded-xl p-2.5">
                  <p className="text-[9px] uppercase tracking-widest text-[#a08060] mb-1.5">🚗 Travel Charge</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-[#b18236]">₹{distanceCharge}</p>
                      <p className="text-[9px] text-gray-400">{distanceKm} km away</p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <label className="flex items-center gap-1.5 cursor-pointer select-none">
                        <span className="text-[9px] text-gray-500">
                          {includeTravelOnline ? "Added to payment" : "Pay later (cash)"}
                        </span>
                        <div
                          onClick={() => setIncludeTravelOnline((prev) => !prev)}
                          className={`w-9 h-5 rounded-full relative transition-colors duration-200 ${includeTravelOnline ? "bg-[#c9913a]" : "bg-gray-200"}`}
                        >
                          <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all duration-200 ${includeTravelOnline ? "left-4" : "left-0.5"}`} />
                        </div>
                      </label>
                      <p className="text-[9px] text-gray-400">
                        {includeTravelOnline ? "Included in online payment" : "Cash on event day"}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-1.5">
              <div>
                <label className="text-[10px] text-[#6b5b4b]">Date</label>
                <input
                  type="date"
                  name="date"
                  onChange={handleChange}
                  required
                  className="w-full border border-[#c9913a]/30 px-2 py-1 text-[11px] rounded-lg mt-0.5 focus:outline-none focus:border-[#c9913a]"
                />
              </div>

              <div>
                <label className="text-[10px] text-[#6b5b4b]">Session</label>
                <select
                  name="session"
                  onChange={handleChange}
                  required
                  className="w-full border border-[#c9913a]/30 px-2 py-1 text-[11px] rounded-lg mt-0.5 focus:outline-none focus:border-[#c9913a]"
                >
                  <option value="">Select</option>
                  <option value="morning">Morning</option>
                  <option value="evening">Evening</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-[10px] text-[#6b5b4b]">Exact Time</label>
              <input
                type="time"
                name="time"
                onChange={handleChange}
                required
                className="w-full border border-[#c9913a]/30 px-2 py-1 text-[11px] rounded-lg mt-0.5 focus:outline-none focus:border-[#c9913a]"
              />
            </div>

            {/* ── PRICE SUMMARY (display only — no calculations) ── */}
            <div className="bg-[#fff7ed] border border-[#c9913a]/20 rounded-lg p-2">
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-gray-500">Package Price</span>
                <span className="font-medium">₹{packagePrice}</span>
              </div>

              {distanceCharge > 0 && (
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-gray-500">
                    Travel Charge{" "}
                    <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${includeTravelOnline ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-600"}`}>
                      {includeTravelOnline ? "Online" : "Pay Later"}
                    </span>
                  </span>
                  <span className={`font-medium ${includeTravelOnline ? "text-[#b18236]" : "text-orange-500"}`}>
                    ₹{distanceCharge}
                  </span>
                </div>
              )}

              <div className="border-t border-[#c9913a]/15 pt-1.5 flex justify-between">
                <span className="text-xs font-semibold text-[#3d2e1e]">
                  Pay Now {distanceCharge > 0 && !includeTravelOnline ? "(excl. travel)" : ""}
                </span>
                {/* Display value — confirmed by backend on submit */}
                <span className="text-xs font-bold text-[#b18236]">₹{displayPayNow}</span>
              </div>
            </div>

            {distanceCharge > 0 && !includeTravelOnline && (
              <div className="flex items-start gap-2 bg-orange-50 border border-orange-200 rounded-xl px-3 py-2">
                <span className="text-base mt-0.5">🚗</span>
                <div>
                  <p className="text-[10px] font-bold text-orange-700 tracking-wide">Travel Charge — Pay Later</p>
                  <p className="text-[9px] text-orange-600 mt-0.5">
                    ₹{distanceCharge} will be collected in cash on the event day.
                  </p>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="bg-[#c9913a] text-white py-1.5 rounded-xl font-semibold text-xs hover:bg-[#b17a2a] active:scale-95 transition-all duration-200 shadow-md mt-0.5"
            >
              {loading ? "Processing..." : "✦ Confirm Booking"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default QuickBookingForm;
