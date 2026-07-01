import { useState, useRef, useEffect } from "react";
import axios from "axios";
import InputField from "./InputField";
import EventCard from "./EventCard";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://3.27.155.171:5000";

const EVENT_TYPES = [
  { name: "Wedding", icon: "💍" },
  { name: "Engagement", icon: "💛" },
  { name: "Sangeet", icon: "🎶" },
  { name: "Corporate", icon: "🏢" },
  { name: "Birthday", icon: "🎂" },
  { name: "Other", icon: "✨" },
];

const BOOKING_FOR = [
  { value: "groom", label: " Groom", icon: "🤵" },
  { value: "barat", label: " Members", icon: "👨‍👨‍👦" },
  { value: "engagement", label: "Engagement", icon: "💍" },
];

const weddingEvents = ["Wedding", "Sangeet", "Other"];

const generateFormId = () => {
  return `FORM-${Date.now().toString(36).toUpperCase()}-${crypto.randomUUID().split("-")[0].toUpperCase()}`;
};

// ─────────────────────────────────────────────
// Payment Modal Component
// ─────────────────────────────────────────────
function PaymentChoiceModal({ breakdown, onClose, onConfirm }) {
  const [step, setStep] = useState(1);

  const {
    baseAmount,
    travelCharge,
    totalAmount,
    advanceAmount,
    cashPending
  } = breakdown;

  const handleOnline = () =>
    onConfirm("online", totalAmount);

  const handleCashConfirm = () =>
    onConfirm("cash", advanceAmount);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm">

        <button onClick={onClose} className="absolute right-4 top-3">✕</button>

        {step === 1 && (
          <>
            <h3 className="text-center text-lg font-semibold">
              Payment Method
            </h3>

            <div className="bg-[#fff8ef] p-3 rounded-xl mt-3 text-sm">
              <div className="flex justify-between">
                <span>Booking</span>
                <span>₹{baseAmount}</span>
              </div>

              {travelCharge > 0 && (
                <div className="flex justify-between">
                  <span>Travel</span>
                  <span>₹{travelCharge}</span>
                </div>
              )}

              <div className="flex justify-between font-bold border-t mt-2 pt-2">
                <span>Total</span>
                <span>₹{totalAmount}</span>
              </div>
            </div>

            <button
              onClick={handleOnline}
              className="w-full mt-3 bg-[#c9913a] text-white py-2 rounded-xl"
            >
              Pay Online
            </button>

            <button
              onClick={() => setStep(2)}
              className="w-full mt-2 border py-2 rounded-xl"
            >
              Cash Option
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <h3 className="text-center">Advance Required</h3>

            <div className="bg-[#fff8ef] p-3 rounded-xl mt-3 text-sm">
              <div className="flex justify-between">
                <span>Advance</span>
                <span>₹{advanceAmount}</span>
              </div>

              <div className="flex justify-between">
                <span>Remaining Cash</span>
                <span>₹{cashPending}</span>
              </div>
            </div>

            <button
              onClick={handleCashConfirm}
              className="w-full mt-3 bg-[#c9913a] text-white py-2 rounded-xl"
            >
              Pay ₹{advanceAmount}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
// ─────────────────────────────────────────────
// Main Booking Form
// ─────────────────────────────────────────────
function BookingForm() {
  const navigate = useNavigate();

  const initialFormData = {
    formId: generateFormId(),
    name: "",
    phone: "",
    email: "",
    eventType: "",
    customEvent: "",
    days: 1,
    startDate: "",
    location: "",
    bookingFor: [],
    paggMembers: 1,
    paggStyle: "",
    paggTime: "",
    preferredTime: "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [locationInput, setLocationInput] = useState("");
  const debounceRef = useRef(null);
  const [distanceCharge, setDistanceCharge] = useState(0);
  const [includeTravelOnline, setIncludeTravelOnline] = useState(false);
  const [distanceKm, setDistanceKm] = useState(0);
  const [showPayModal, setShowPayModal] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [processingBooking, setProcessingBooking] = useState(false); 

  // ── ✅ FIX: freeTravelKm aur travelPricePerKm bhi backend to fetch karo ──
  const [pricing, setPricing] = useState({
    groomPrice: 4100,
    extraDayPrice: 1000,
    memberPrice: 300,
    engagementPrice: 2100,
    freeTravelKm: 30,        // ✅ ADDED
    travelPricePerKm: 20,    // ✅ ADDED
  });
  const [pricingLoaded, setPricingLoaded] = useState(false);
const [pricingBreakdown, setPricingBreakdown] = useState(null);
  useEffect(() => {
    const fetchPricing = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/pricing?t=${Date.now()}`);

        const p = res.data.pricing;
        setPricing({
          groomPrice: p.groomPrice,
          extraDayPrice: p.extraDayPrice,
          memberPrice: p.memberPrice,
          engagementPrice: p.engagementPrice,
          freeTravelKm: p.freeTravelKm ?? 30,
          travelPricePerKm: p.travelPricePerKm ?? 20,
        });
      } catch (err) {
        console.log("Pricing fetch ERROR =", err);
      } finally {
        setPricingLoaded(true);
      }
    };
    fetchPricing();
  }, []);

  const isWeddingEvent = weddingEvents.includes(formData.eventType || "");

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) { setEmailError("Please enter a valid email address"); return false; }
    const domain = email.split("@")[1]?.toLowerCase();
    const wrongDomains = ["gmial.com", "gamil.com", "gmail.con", "gmail.co"];
    if (wrongDomains.includes(domain)) { setEmailError("Did you mean gmail.com?"); return false; }
    setEmailError("");
    return true;
  };

  const update = (field, value) => {
    setFormData((prev) => {
      let updated = { ...prev, [field]: value };
      if (field === "eventType") {
        const isWedding = weddingEvents.includes(value);
        const isEngagement = value === "Engagement";
        updated.bookingFor = prev.bookingFor.filter((item) => item !== "groom" && item !== "engagement");
        if (!isWedding && !isEngagement) {
          updated.bookingFor = prev.bookingFor.filter((item) => item !== "barat");
        }
      }
      return updated;
    });
  };

  const toggleBookingFor = (value) => {
    setFormData((prev) => {
      const alreadySelected = prev.bookingFor.includes(value);
      let newBookingFor = alreadySelected
        ? prev.bookingFor.filter((item) => item !== value)
        : [...prev.bookingFor, value];
      if (value === "engagement" && alreadySelected) {
        newBookingFor = newBookingFor.filter((item) => item !== "barat");
      }
      return { ...prev, bookingFor: newBookingFor };
    });
  };

  const getEndDate = () => {
    if (!formData.startDate) return "";
    const d = new Date(formData.startDate);
    d.setDate(d.getDate() + formData.days - 1);
    return d.toISOString().split("T")[0];
  };

  const searchLocation = (query) => {
    clearTimeout(debounceRef.current);
    if (query.length < 3) { setLocationSuggestions([]); return; }
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`${API_URL}/api/location?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setLocationSuggestions(data);
      } catch (error) {
        console.log("Location search error:", error);
      }
    }, 500);
  };

  
  // ✅ FIX: calculateDistance backend response use karda hai — fresh values mildi ne
  const calculateDistance = async (lat, lon) => {
    try {
      const res = await axios.post(`${API_URL}/api/distance`, { lat, lon });

      console.log("DISTANCE API RESPONSE =", res.data);

      setDistanceCharge(res.data.distanceCharge);
      setDistanceKm(res.data.distanceKm || 0);
      setIncludeTravelOnline(false);

      // ✅ Travel pricing bhi update karo agar backend naye values bheje
      if (res.data.freeTravelKm !== undefined) {
      setPricing((prev) => ({
  ...prev,
  freeTravelKm: res.data.freeTravelKm ?? prev.freeTravelKm,
  travelPricePerKm: res.data.travelPricePerKm ?? prev.travelPricePerKm,
}));
      }
    } catch (err) {
      console.log("Distance error:", err);
    }
  };

  const groomPrice = formData.bookingFor.includes("groom")
    ? pricing.groomPrice + (formData.days - 1) * pricing.extraDayPrice
    : 0;
const membersPrice =
  formData.bookingFor.includes("barat")
    ? (formData.paggMembers || 1) *
      (pricing.memberPrice || 0) *
      (formData.days || 1)
    : 0;

const engagementPrice =
  formData.bookingFor.includes("engagement")
    ? (formData.paggMembers || 1) *
      (pricing.engagementPrice || 0) *
      (formData.days || 1)
    : 0;  const baseTotal = groomPrice + membersPrice + engagementPrice;
  const totalPrice = baseTotal + (includeTravelOnline ? distanceCharge : 0);

const handleSubmitClick = async () => {
  if (!validateEmail(formData.email)) return;
  if (formData.phone.length !== 10) return;

  const resolvedEventType =
    formData.eventType === "Other"
      ? formData.customEvent
      : formData.eventType;

  if (
    !formData.name ||
    !formData.phone ||
    !resolvedEventType ||
    !formData.startDate ||
    !formData.location ||
    !formData.paggTime ||
    !formData.paggStyle ||
    formData.bookingFor.length === 0
  ) {
    alert("Please fill all required fields");
    return;
  }

  // 👇 direct quote calculate here
  const baseAmount = baseTotal;
  const travelChargeFinal = includeTravelOnline ? distanceCharge : 0;

  const totalAmount = baseAmount + travelChargeFinal;
  const advanceAmount = Math.round(totalAmount * 0.3);
  const cashPending = totalAmount - advanceAmount;

  setPricingBreakdown({
    baseAmount,
    travelCharge: travelChargeFinal,
    totalAmount,
    advanceAmount,
    cashPending,
  });

  setShowPayModal(true);
};

const handlePayConfirm = async (mode, amountFromModal) => {
    setShowPayModal(false);

const breakdown = pricingBreakdown || {};
if (!pricingBreakdown) {
  alert("Pricing not ready yet");
  return;
}


  const amountToPay =
    mode === "online"
      ? breakdown.totalAmount
      : breakdown.advanceAmount;

  try {
    setLoading(true);

    const orderRes = await axios.post(`${API_URL}/api/create-order`, {
      amount: amountToPay,
      receipt: formData.formId,
    });

    const order = orderRes.data.order;

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: "INR",
      order_id: order.id,
handler: async function (response) {
  setProcessingBooking(true);   // ✅ loader on

  try {
    const verifyRes = await axios.post(`${API_URL}/api/verify-payment`, response);

    if (!verifyRes.data.success) {
      alert("Payment failed");
      setProcessingBooking(false);
      return;
    }

    const bookingRes = await axios.post(`${API_URL}/api/bookings`, {
      ...formData,
      pricingBreakdown,
      paymentMode: mode,
      paidAmount: amountToPay,
      paymentId: response.razorpay_payment_id,
      orderId: response.razorpay_order_id,
    });

    navigate(`/receipt/${bookingRes.data.booking._id}`);
  } catch (err) {
    console.log(err);
    alert("Something went wrong, please contact support.");
    setProcessingBooking(false);
  }
},
      prefill: {
        name: formData.name,
        contact: formData.phone,
      },

      theme: { color: "#c9913a" },
    };

    new window.Razorpay(options).open();
  } catch (err) {
    console.log(err);
  } finally {
    setLoading(false);
  }
};

  const counterBtn =
    "w-7 h-7 rounded-full border border-[#c9913a]/40 text-[#c9913a] font-bold text-sm hover:bg-[#c9913a]/10 hover:border-[#c9913a] transition duration-200 active:scale-90";

  return (
    <>
      {showPayModal && (
       <PaymentChoiceModal
  breakdown={pricingBreakdown || {
    baseAmount: 0,
    travelCharge: 0,
    totalAmount: 0,
    advanceAmount: 0,
    cashPending: 0,
  }}
  onClose={() => setShowPayModal(false)}
  onConfirm={handlePayConfirm}
/>
      )}
        {processingBooking && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/90 gap-4">
          <div
            style={{
              width: "48px", height: "48px",
              border: "4px solid #e8dccb",
              borderTop: "4px solid #c9913a",
              borderRadius: "50%",
              animation: "spin 0.8s linear infinite",
            }}
          />
          <p className="text-sm text-[#a08060]">Confirming your booking...</p>
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      )}


      <div className="bg-white border border-[#c9913a]/30 rounded-2xl shadow-lg p-6 w-full max-w-2xl">

        <div className="text-center mb-5">
          <span className="text-[#c9913a] text-lg block mb-1">✦</span>
          <h2 className="text-xl font-serif text-gray-800 tracking-wide">Booking Form</h2>
          <div className="w-10 h-px bg-[#c9913a] opacity-40 mx-auto mt-2" />
        </div>

        <p className="text-[#c9913a] text-[9px] tracking-widest uppercase mb-2">👤 Client Details</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
          <InputField label="Full Name" placeholder="Full Name" value={formData.name} onChange={(e) => update("name", e.target.value)} />
          <InputField
            label="Contact Number" type="tel" placeholder="+91 9876543210" value={formData.phone}
            onChange={(e) => { const val = e.target.value.replace(/\D/g, "").slice(0, 10); update("phone", val); }}
            maxLength={10}
          />
          <InputField
            label="Email" type="email" placeholder="yourmail@gmail.com" value={formData.email}
            onChange={(e) => { update("email", e.target.value); validateEmail(e.target.value); }}
          />
          {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
        </div>

        <p className="text-[#c9913a] text-[9px] tracking-widest uppercase mb-2">🎊 Event Type</p>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-1.5 mb-2">
          {EVENT_TYPES.map((ev) => (
            <EventCard key={ev.name} name={ev.name} icon={ev.icon} selected={formData.eventType === ev.name} onClick={() => update("eventType", ev.name)} />
          ))}
        </div>

        {formData.eventType === "Other" && (
          <div className="mb-3">
            <InputField label="Other Occasion" placeholder="e.g. Graduation" value={formData.customEvent} onChange={(e) => update("customEvent", e.target.value)} />
          </div>
        )}

        <p className="text-[#c9913a] text-[9px] tracking-widest uppercase mt-4 mb-2">📅 Duration & Dates</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-4">
          <div className="bg-[#faf8f5] border border-[#c9913a]/25 rounded-xl px-3 py-2 flex items-center justify-between">
            <button type="button" className={counterBtn} onClick={() => update("days", Math.max(1, formData.days - 1))}>−</button>
            <span className="text-lg font-serif text-gray-800">{formData.days}</span>
            <button type="button" className={counterBtn} onClick={() => update("days", formData.days + 1)}>+</button>
          </div>
          <InputField label="Start Date" type="date" value={formData.startDate} onChange={(e) => update("startDate", e.target.value)} />
          <InputField label="End Date" type="date" value={getEndDate()} readOnly />
        </div>

        <p className="text-[#c9913a] text-[9px] tracking-widest uppercase mb-2">⏰ Timing</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] text-[#a08060] tracking-wide">Time Preference</label>
            <select value={formData.paggTime} onChange={(e) => update("paggTime", e.target.value)} className="bg-white border border-[#c9913a]/25 rounded-xl px-3 py-2.5 text-xs">
              <option value="">Select Time</option>
              <option value="morning">Morning</option>
              <option value="evening">Evening</option>
            </select>
          </div>
          <InputField label="Preferred Time" type="time" value={formData.preferredTime} onChange={(e) => update("preferredTime", e.target.value)} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-[#c9913a] text-[9px] tracking-widest uppercase mb-2">📍 Location</p>
            <div className="relative">
              <input
                placeholder="Venue / Location"
                value={locationInput}
                onChange={(e) => { setLocationInput(e.target.value); update("location", e.target.value); searchLocation(e.target.value); }}
                className="w-full bg-[#faf8f5] border border-[#c9913a]/25 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-[#c9913a]"
              />
              {locationSuggestions.length > 0 && (
                <div className="absolute z-10 w-full bg-white border border-[#c9913a]/20 rounded-xl mt-1 shadow-lg max-h-48 overflow-y-auto">
                  {locationSuggestions.map((s) => (
                    <div
                      key={s.place_id}
                      onClick={() => { setLocationInput(s.display_name); update("location", s.display_name); setLocationSuggestions([]); calculateDistance(s.lat, s.lon); }}
                      className="px-3 py-2 text-xs text-gray-700 hover:bg-[#c9913a]/10 cursor-pointer border-b border-gray-100"
                    >
                      {s.display_name}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {distanceCharge > 0 && (
              <div className="mt-3 bg-[#fff8ef] border border-[#c9913a]/30 rounded-xl p-3">
                <p className="text-[10px] uppercase tracking-widest text-[#a08060] mb-2">🚗 Travel Charge</p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-[#b18236]">₹{distanceCharge}</p>
                    {/* ✅ FIX: distanceKm + freeTravelKm display */}
                    <p className="text-[10px] text-gray-400">
                      {distanceKm > 0
                        ? `${distanceKm} km away · Free upto ${pricing.freeTravelKm} km`
                        : "Distance charge applicable"}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <span className="text-[10px] text-gray-500">
                        {includeTravelOnline ? "Added to online payment" : "Pay later (cash)"}
                      </span>
                      <div
                        onClick={() => setIncludeTravelOnline((prev) => !prev)}
                        className={`w-10 h-5 rounded-full relative transition-colors duration-200 ${includeTravelOnline ? "bg-[#c9913a]" : "bg-gray-200"}`}
                      >
                        <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all duration-200 ${includeTravelOnline ? "left-5" : "left-0.5"}`} />
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

          <div>
            <p className="text-[#c9913a] text-[9px] tracking-widest uppercase mb-2">👑 Booking For</p>
            <div className="flex flex-col gap-2">
              {BOOKING_FOR.map((item) => {
                const isSelected = formData.bookingFor.includes(item.value);
                const isGroomDisabled = item.value === "groom" && !weddingEvents.includes(formData.eventType);
                const isEngagementDisabled = item.value === "engagement" && formData.eventType !== "Engagement";
                const isBaratDisabled = item.value === "barat" && formData.eventType === "Engagement" && !formData.bookingFor.includes("engagement");
                if (isGroomDisabled || isEngagementDisabled || isBaratDisabled) return null;
                return (
                  <button
                    type="button" key={item.value} onClick={() => toggleBookingFor(item.value)}
                    className={`py-2 px-3 rounded-xl border text-xs font-medium flex items-center gap-2 transition-all ${isSelected ? "border-[#c9913a] bg-[#c9913a]/10 text-[#a07030]" : "border-[#c9913a]/25 bg-[#faf8f5] text-[#888]"}`}
                  >
                    {item.icon} {item.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <p className="text-[#c9913a] text-[9px] tracking-widest uppercase mb-2">🪯 Turban Details</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-5">
          {(formData.bookingFor.includes("barat") || formData.bookingFor.includes("engagement")) && (
            <div className="bg-[#faf8f5] border border-[#c9913a]/25 rounded-xl px-3 py-3">
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs text-[#a08060]">Members</span>
                <div className="flex items-center gap-2">
                  <button type="button" className={counterBtn} onClick={() => update("paggMembers", Math.max(1, formData.paggMembers - 1))}>−</button>
                  <span className="text-lg font-serif text-gray-800">{formData.paggMembers}</span>
                  <button type="button" className={counterBtn} onClick={() => update("paggMembers", formData.paggMembers + 1)}>+</button>
                </div>
              </div>
              <div className="border-t border-[#c9913a]/10 pt-2 flex justify-between">
                <span className="text-[11px] text-gray-500">Members Price</span>
                <span className="text-sm font-semibold text-[#b18236]">₹{membersPrice || engagementPrice}</span>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-1 justify-center">
            <label className="text-[10px] text-[#a08060] tracking-wide">Wedding Style</label>
            <select value={formData.paggStyle} onChange={(e) => update("paggStyle", e.target.value)} className="bg-white border border-[#c9913a]/25 rounded-xl px-3 py-2.5 text-xs">
              <option value="">Select Style</option>
              <option value="punjabi">Punjabi Style</option>
              <option value="hindu">Hindu Style</option>
              <option value="rajasthani">Rajasthani</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        <div className="bg-[#fff8ef] border border-[#c9913a]/25 rounded-2xl p-4 mb-5">
          <p className="text-[#c9913a] text-[9px] tracking-widest uppercase mb-3">💰 Price Summary</p>
          <div className="space-y-3 text-sm">
            {formData.bookingFor.includes("groom") && (
              <div className="flex justify-between border-b border-[#c9913a]/10 pb-2">
                <span>Groom Styling</span>
                <span className="font-semibold text-[#b18236]">₹{groomPrice}</span>
              </div>
            )}
            {formData.bookingFor.includes("barat") && (
              <div className="flex justify-between border-b border-[#c9913a]/10 pb-2">
                <span>Barat Members ({formData.paggMembers} × ₹{pricing.memberPrice} × {formData.days} days)</span>
                <span className="font-semibold text-[#b18236]">₹{membersPrice}</span>
              </div>
            )}
            {formData.bookingFor.includes("engagement") && (
              <div className="flex justify-between border-b border-[#c9913a]/10 pb-2">
                <span>Engagement Members ({formData.paggMembers} × ₹{pricing.engagementPrice} × {formData.days} days)</span>
                <span className="font-semibold text-[#b18236]">₹{engagementPrice}</span>
              </div>
            )}
            {distanceCharge > 0 && (
              <div className="flex justify-between border-b border-[#c9913a]/10 pb-2">
                <span className="text-gray-600">
                  Travel Charge ({distanceKm} km · ₹{pricing.travelPricePerKm}/km){" "}
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${includeTravelOnline ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-600"}`}>
                    {includeTravelOnline ? "Online" : "Pay Later"}
                  </span>
                </span>
                <span className="font-semibold text-[#b18236]">₹{distanceCharge}</span>
              </div>
            )}
            <div className="flex justify-between pt-2">
              <span className="font-semibold text-[#3d2e1e]">
                Total {includeTravelOnline ? "" : distanceCharge > 0 ? "(excl. travel)" : ""}
              </span>
              <span className="text-lg font-bold text-[#b18236]">₹{totalPrice}</span>
            </div>
          </div>
        </div>

        {distanceCharge > 0 && !includeTravelOnline && (
          <div className="flex items-start gap-3 bg-orange-50 border border-orange-200 rounded-xl px-4 py-3 mb-4">
            <span className="text-lg mt-0.5">🚗</span>
            <div>
              <p className="text-xs font-bold text-orange-700 tracking-wide">Travel Charge — Pay Later</p>
              <p className="text-[11px] text-orange-600 mt-0.5">
                A travel charge of <span className="font-bold">₹{distanceCharge}</span> ({distanceKm} km) is pending. You will pay this in cash on the event day directly to the team.
              </p>
            </div>
          </div>
        )}

        <button
          onClick={handleSubmitClick}
          disabled={loading}
          className={`w-full py-2.5 rounded-xl font-medium tracking-widest uppercase text-xs transition-all duration-200
          ${submitted ? "bg-green-500 text-white" : "bg-[#c9913a] text-white hover:-translate-y-0.5 hover:shadow-lg"}`}
        >
          {loading ? "Processing..." : submitted ? "✓ Booking Confirmed!" : "✦ Submit Booking"}
        </button>
      </div>
    </>
  );
}

export default BookingForm;