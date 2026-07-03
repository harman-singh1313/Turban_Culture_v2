import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://3.27.155.171:5000";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleReset = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await axios.post(
        `${API_URL}/api/auth/reset-password/${token}`,
        { newPassword }
      );

      setSuccess(res.data.message || "Password reset successful");

      setTimeout(() => {
        navigate("/admin/login");
      }, 2000);

    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fdfaf6] px-4">
      <div className="w-full max-w-sm bg-white border border-[#c9913a]/25 rounded-2xl shadow-lg p-8">

        <h1 className="text-xl font-serif text-center mb-6">
          Reset Password 🔐
        </h1>

        <form onSubmit={handleReset} className="flex flex-col gap-4">

          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full border rounded-xl px-3 py-2 text-sm"
            required
          />

          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full border rounded-xl px-3 py-2 text-sm"
            required
          />

          {error && (
            <p className="text-red-500 text-xs text-center">{error}</p>
          )}

          {success && (
            <p className="text-green-600 text-xs text-center">{success}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#c9913a] text-white rounded-xl text-sm font-semibold hover:bg-[#b17a2a]"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>

        </form>
      </div>
    </div>
  );
};

export default ResetPassword;