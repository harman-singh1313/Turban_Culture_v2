import { useEffect, useState } from "react";
import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_URL || "http://3.27.155.171:5000";

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
        const res = await axios.get(
          `${API_URL}/api/dashboard/recent`
        );

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
      const res = await axios.get(
        `${API_URL}/api/dashboard/all-bookings`
      );

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

  const getInitials = (name = "") => {
    const parts = name.trim().split(" ");

    return (
      (parts[0]?.[0] || "") +
      (parts[1]?.[0] || "")
    ).toUpperCase();
  };

  return (
    <>
      {/* ================= RECENT BOOKINGS ================= */}
      <div
        className="
          w-full
          min-w-0
          rounded-2xl
          border
          border-gray-100
          bg-white
          p-4
          sm:p-5
        "
      >
        {/* Header */}
        <div className="mb-3 flex items-center justify-between gap-3 sm:mb-4">
          <h2 className="text-sm font-bold text-gray-900 sm:text-base">
            Recent Bookings
          </h2>

          <button
            type="button"
            onClick={handleViewAll}
            className="
              shrink-0
              text-xs
              font-semibold
              text-[#b07d2a]
              transition
              hover:text-[#8f641f]
              sm:text-sm
            "
          >
            View All
          </button>
        </div>

        {/* Bookings */}
        <div className="divide-y divide-gray-100">
          {bookings.length > 0 ? (
            bookings.map((b, i) => {
              const initials = getInitials(b?.name);
              const status = getStatus(b.paymentStatus);

              return (
                <div
                  key={b._id || i}
                  className="
                    flex
                    min-w-0
                    items-center
                    gap-2.5
                    py-2.5
                    sm:gap-3
                  "
                >
                  {/* Avatar */}
                  <div
                    className="
                      flex
                      h-9
                      w-9
                      shrink-0
                      items-center
                      justify-center
                      rounded-full
                      text-[11px]
                      font-bold
                      text-white
                      sm:text-xs
                    "
                    style={{
                      background:
                        avatarColors[
                          i % avatarColors.length
                        ],
                    }}
                  >
                    {initials || "TC"}
                  </div>

                  {/* Customer */}
                  <div className="min-w-0 flex-1">
                    <p
                      className="
                        truncate
                        text-xs
                        font-semibold
                        text-gray-900
                        sm:text-sm
                      "
                    >
                      {b.name || "N/A"}
                    </p>

                    <p
                      className="
                        mt-0.5
                        truncate
                        text-[10px]
                        text-gray-400
                        sm:text-xs
                      "
                    >
                      {b.service || "Turban Service"}
                    </p>
                  </div>

                  {/* Status */}
                  <span
                    className={`
                      shrink-0
                      rounded-md
                      px-2
                      py-1
                      text-[9px]
                      font-medium
                      sm:text-[10px]
                      ${statusStyle[status] || statusStyle.PENDING}
                    `}
                  >
                    {status}
                  </span>
                </div>
              );
            })
          ) : (
            <div className="py-8 text-center text-sm text-gray-400">
              No recent bookings
            </div>
          )}
        </div>
      </div>

      {/* ================= ALL BOOKINGS MODAL ================= */}
      {open && (
        <div
          className="
            fixed
            inset-0
            z-[200]
            flex
            items-end
            justify-center
            bg-black/50
            p-0
            backdrop-blur-[2px]
            sm:items-center
            sm:p-4
          "
          onClick={() => setOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="
              flex
              max-h-[85dvh]
              w-full
              flex-col
              rounded-t-2xl
              bg-white
              shadow-2xl

              sm:max-w-3xl
              sm:rounded-2xl
            "
          >
            {/* Modal Header */}
            <div
              className="
                flex
                shrink-0
                items-center
                justify-between
                gap-3
                border-b
                border-gray-100
                px-4
                py-4
                sm:px-5
              "
            >
              <div>
                <h2 className="text-base font-bold text-gray-900 sm:text-lg">
                  All Bookings
                </h2>

                <p className="mt-0.5 text-xs text-gray-400">
                  {allBookings.length} total bookings
                </p>
              </div>

              <button
                type="button"
                onClick={() => setOpen(false)}
                className="
                  shrink-0
                  rounded-lg
                  bg-gray-100
                  px-3
                  py-2
                  text-xs
                  font-semibold
                  text-gray-600
                  transition
                  hover:bg-gray-200
                  sm:text-sm
                "
              >
                Close
              </button>
            </div>

            {/* Modal List */}
            <div className="flex-1 overflow-y-auto px-4 sm:px-5">
              {allBookings.length > 0 ? (
                <div className="divide-y divide-gray-100">
                  {allBookings.map((b, i) => {
                    const initials = getInitials(b?.name);
                    const status = getStatus(
                      b.paymentStatus
                    );

                    return (
                      <div
                        key={b._id || i}
                        className="
                          flex
                          min-w-0
                          items-center
                          gap-2.5
                          py-3
                          sm:gap-3
                        "
                      >
                        {/* Avatar */}
                        <div
                          className="
                            flex
                            h-10
                            w-10
                            shrink-0
                            items-center
                            justify-center
                            rounded-full
                            text-xs
                            font-bold
                            text-white
                          "
                          style={{
                            background:
                              avatarColors[
                                i %
                                  avatarColors.length
                              ],
                          }}
                        >
                          {initials || "TC"}
                        </div>

                        {/* Details */}
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-gray-900">
                            {b.name || "N/A"}
                          </p>

                          <p className="mt-0.5 truncate text-xs text-gray-400">
                            {b.service ||
                              "Turban Service"}
                          </p>
                        </div>

                        {/* Status */}
                        <span
                          className={`
                            shrink-0
                            rounded-md
                            px-2
                            py-1
                            text-[9px]
                            font-medium
                            sm:px-3
                            sm:text-[10px]
                            ${
                              statusStyle[
                                status
                              ] ||
                              statusStyle.PENDING
                            }
                          `}
                        >
                          {status}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex min-h-[200px] items-center justify-center text-sm text-gray-400">
                  No bookings available
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default RecentBookings;