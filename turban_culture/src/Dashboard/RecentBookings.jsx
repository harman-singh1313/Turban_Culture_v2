import { useEffect, useState } from "react";
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL || "http://3.27.155.171:5000";
const statusStyle = {
  PAID: "bg-green-50 text-green-600 border border-green-200",
  SUCCESS: "bg-green-50 text-green-600 border border-green-200",
  PENDING: "bg-yellow-50 text-yellow-600 border border-yellow-200",
  FAILED: "bg-red-50 text-red-600 border border-red-200",
};

const avatarColors = [
  "#d4a55a",
  "#5b8dd4",
  "#d45b5b",
  "#6ab87a",
  "#8b6ad4",
];

const RecentBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [allBookings, setAllBookings] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const loadRecent = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/dashboard/recent`);

        if (res.data.success) {
          setBookings(res.data.bookings);
        }
      } catch (err) {
        console.log("Recent Error:", err);
      }
    };

    loadRecent();
  }, []);

  const handleViewAll = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/dashboard/all-bookings`);

      if (res.data.success) {
        setAllBookings(res.data.bookings);
        setOpen(true);
      }
    } catch (err) {
      console.log("View All Error:", err);
    }
  };

  const getStatus = (status) => {
    if (status === "SUCCESS") return "PAID";
    return status || "PENDING";
  };

  return (
    <>
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-gray-900">
            Recent Bookings
          </h2>

          <button
            onClick={handleViewAll}
            className="text-sm font-semibold text-[#b07d2a]"
          >
            View All
          </button>
        </div>

        <div className="space-y-1">
          {bookings.map((b, i) => {
            const initials =
              (b?.name?.split(" ")[0]?.[0] || "") +
              (b?.name?.split(" ")[1]?.[0] || "");

            const status = getStatus(b.paymentStatus);

            return (
              <div
                key={b._id || i}
                className="flex items-center gap-3 py-2 border-b border-gray-50"
              >
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold"
                  style={{
                    background:
                      avatarColors[i % avatarColors.length],
                  }}
                >
                  {initials}
                </div>

                <div className="flex-1">
                  <p className="font-semibold text-sm">
                    {b.name || "N/A"}
                  </p>

                  <p className="text-xs text-gray-400">
                    {b.service || "Turban Service"}
                  </p>
                </div>

                <span
                  className={`text-xs px-2 py-1 rounded border ${
                    statusStyle[status]
                  }`}
                >
                  {status}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-3xl max-h-[80vh] overflow-y-auto p-5 rounded-xl">

            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-lg">
                All Bookings ({allBookings.length})
              </h2>

              <button
                onClick={() => setOpen(false)}
                className="px-3 py-1 bg-red-500 text-white rounded"
              >
                Close
              </button>
            </div>

            <div className="space-y-2">
              {allBookings.map((b, i) => {
                const initials =
                  (b?.name?.split(" ")[0]?.[0] || "") +
                  (b?.name?.split(" ")[1]?.[0] || "");

                const status = getStatus(b.paymentStatus);

                return (
                  <div
                    key={b._id || i}
                    className="flex items-center gap-3 py-3 border-b"
                  >
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold"
                      style={{
                        background:
                          avatarColors[i % avatarColors.length],
                      }}
                    >
                      {initials}
                    </div>

                    <div className="flex-1">
                      <p className="font-semibold">
                        {b.name || "N/A"}
                      </p>

                      <p className="text-sm text-gray-500">
                        {b.service || "Turban Service"}
                      </p>
                    </div>

                    <span
                      className={`text-xs px-3 py-1 rounded border ${
                        statusStyle[status]
                      }`}
                    >
                      {status}
                    </span>
                  </div>
                );
              })}
            </div>

          </div>
        </div>
      )}
    </>
  );
};

export default RecentBookings;