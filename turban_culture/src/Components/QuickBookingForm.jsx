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
// Main Quick Booking Form
// ─────────────────────────────────────────────
const QuickBookingForm = ({ selectedPackage, onClose }) => {
  const navigate = useNavigate();
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [locationInput, setLocationInput]             = useState("");
  const debounceRef = useRef(null);
  const [loading, setLoading] = useState(false);

  // travel state — raw values only, display purpose (collected in person now)
  const [distanceCharge, setDistanceCharge] = useState(0);
  const [distanceKm, setDistanceKm]         = useState(0);

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
    } catch (err) {
      console.log("Distance error:", err);
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // ── Submit form directly → creates a lead, no payment involved ──
  const handleSubmitClick = async (e) => {
    e.preventDefault();

    if (!selectedPackage?.price) return alert("Package price not found");
    if (formData.phone.length !== 10) return alert("Enter valid 10 digit phone");

    try {
      setLoading(true);

      const bookingData = {
        ...formData,
        selectedPackage,
        distanceCharge,
        distanceKm,
      };

      const bookingRes = await axios.post(`${API_URL}/api/quick-bookings`, bookingData);
      const booking     = bookingRes.data.booking;

      // Straight to receipt page — no payment step in between
      navigate("/receipt", {
        state: { bookingId: booking._id, type: "package", booking, selectedPackage },
      });

      onClose();
    } catch (err) {
      console.log(err);
      alert("Booking failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── Display-only total — package + travel, collected in person on event day ──
  const displayTotal = packagePrice + distanceCharge;

  return (
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

            {/* ── TRAVEL CHARGE INFO (display only, collected in person) ── */}
            {distanceCharge > 0 && (
              <div className="mt-2 bg-[#fff8ef] border border-[#c9913a]/30 rounded-xl p-2.5">
                <p className="text-[9px] uppercase tracking-widest text-[#a08060] mb-1.5">🚗 Travel Charge</p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-[#b18236]">₹{distanceCharge}</p>
                    <p className="text-[9px] text-gray-400">{distanceKm} km away</p>
                  </div>
                  <p className="text-[9px] text-gray-400 text-right">
                    Collected in person<br />on event day
                  </p>
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

          {/* ── PRICE SUMMARY (display only — collected in person, no online payment) ── */}
          <div className="bg-[#fff7ed] border border-[#c9913a]/20 rounded-lg p-2">
            <div className="flex justify-between text-[11px] mb-1">
              <span className="text-gray-500">Package Price</span>
              <span className="font-medium">₹{packagePrice}</span>
            </div>

            {distanceCharge > 0 && (
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-gray-500">Travel Charge</span>
                <span className="font-medium text-[#b18236]">₹{distanceCharge}</span>
              </div>
            )}

            <div className="border-t border-[#c9913a]/15 pt-1.5 flex justify-between">
              <span className="text-xs font-semibold text-[#3d2e1e]">Total (collected in person)</span>
              <span className="text-xs font-bold text-[#b18236]">₹{displayTotal}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-[#c9913a] text-white py-1.5 rounded-xl font-semibold text-xs hover:bg-[#b17a2a] active:scale-95 transition-all duration-200 shadow-md mt-0.5"
          >
            {loading ? "Submitting..." : "✦ Confirm Booking"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default QuickBookingForm;
