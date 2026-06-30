import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://3.27.155.171:5000";

const AdminLogin = () => {
  const [step, setStep] = useState(1); // 1 = password, 2 = OTP
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

const handleLogin = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError("");

  try {
    const res = await axios.post(`${API_URL}/api/auth/login`, {
      email,
      password,
    });

    // ✅ OTP FLOW ENABLED
    if (res.data.step === "otp") {
      setStep(2);
      return;
    }

    // fallback (if direct token comes)
    if (res.data.token) {
      localStorage.setItem("adminToken", res.data.token);
      navigate("/admin");
    }

  } catch (err) {
    setError(err.response?.data?.message || "Wrong email or password");
  } finally {
    setLoading(false);
  }
};

  // Step 2 — OTP Verify
  const handleOTPVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await axios.post(`${API_URL}/api/auth/verify-otp`, {
        email,
        otp,
      });
      localStorage.setItem("adminToken", res.data.token);
      navigate("/admin");
    } catch (err) {
      setError(err.response?.data?.message || "Wrong or expired OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fdfaf6] flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white border border-[#c9913a]/25 rounded-2xl shadow-lg p-8">

        {/* Header */}
        <div className="text-center mb-8">
          <span className="text-3xl">👑</span>
          <h1 className="text-xl font-serif text-gray-800 mt-2">Turban Culture</h1>
          <p className="text-xs text-gray-400 mt-1 tracking-widest uppercase">
            {step === 1 ? "Admin Login" : "Enter OTP"}
          </p>
        </div>

        {/* Step 1 — Password Form */}
        {step === 1 && (
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div>
              <label className="text-[10px] text-[#a08060] tracking-wide uppercase">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@turbanculture.com"
                className="w-full mt-1 bg-[#faf8f5] border border-[#c9913a]/25 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#c9913a]"
                required
              />
            </div>
            <div>
              <label className="text-[10px] text-[#a08060] tracking-wide uppercase">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full mt-1 bg-[#faf8f5] border border-[#c9913a]/25 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#c9913a]"
                required
              />
            </div>
            {error && <p className="text-red-500 text-xs text-center">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#c9913a] text-white rounded-xl text-sm font-semibold tracking-wide hover:bg-[#b17a2a] transition mt-2"
            >
              {loading ? "Checking..." : "Continue →"}
            </button>
          </form>
        )}

        {/* Step 2 — OTP Form */}
        {step === 2 && (
          <form onSubmit={handleOTPVerify} className="flex flex-col gap-4">
            <div className="text-center bg-[#fff8ef] rounded-xl p-3 mb-2">
              <p className="text-xs text-gray-500">OTP bheja gaya:</p>
              <p className="text-sm font-semibold text-[#c9913a]">{email}</p>
            </div>
            <div>
              <label className="text-[10px] text-[#a08060] tracking-wide uppercase">6-Digit OTP</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="••••••"
                maxLength={6}
                className="w-full mt-1 bg-[#faf8f5] border border-[#c9913a]/25 rounded-xl px-3 py-2.5 text-sm text-center tracking-[8px] font-bold focus:outline-none focus:border-[#c9913a]"
                required
              />
            </div>
            {error && <p className="text-red-500 text-xs text-center">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#c9913a] text-white rounded-xl text-sm font-semibold tracking-wide hover:bg-[#b17a2a] transition"
            >
              {loading ? "Verifying..." : "Verify OTP →"}
            </button>
            <button
              type="button"
              onClick={() => { setStep(1); setError(""); setOtp(""); }}
              className="text-xs text-gray-400 hover:text-gray-600 text-center"
            >
              ← Back to Login
            </button>
          </form>
        )}

      </div>
    </div>
  );
};

export default AdminLogin;