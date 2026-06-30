import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL || "http://3.27.155.171:5000";
const ProtectedRoute = ({ children }) => {
  const [checking, setChecking] = useState(true);
  const [valid, setValid] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const verify = async () => {
      const token = localStorage.getItem("adminToken");
      if (!token) { navigate("/admin/login"); return; }

      try {
        await axios.get(`${API_URL}/api/auth/verify`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setValid(true);
      } catch {
        localStorage.removeItem("adminToken");
        navigate("/admin/login");
      } finally {
        setChecking(false);
      }
    };
    verify();
  }, []);

  if (checking) return (
    <div className="min-h-screen bg-[#fdfaf6] flex items-center justify-center">
      <p className="text-[#c9913a] text-sm">Checking access...</p>
    </div>
  );

  return valid ? children : null;
};

export default ProtectedRoute;