import React, { useEffect, useState } from "react";
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL || "http://3.27.155.171:5000";

const AdminBookings = () => {
  const [bookings, setBookings]               = useState([]);
  const [search, setSearch]                   = useState("");
  const [startDate, setStartDate]             = useState("");
  const [endDate, setEndDate]                 = useState("");
  const [statusFilter, setStatusFilter]       = useState("ALL");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [selectedMonth, setSelectedMonth]     = useState(new Date().getMonth());

  const months = ["January","February","March","April","May","June",
    "July","August","September","October","November","December"];

  const fetchBookings = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/admin-bookings/all`);
      setBookings(res.data.bookings || []);
    } catch (error) {
      console.log("Booking Fetch Error:", error);
    }
  };

  const deleteBooking = async (id) => {
    if (!window.confirm("Are you sure you want to delete this booking?")) return;
    try {
      await axios.delete(`${API_URL}/api/admin-bookings/${id}`);
      fetchBookings();
    } catch (error) {
      console.log("Delete Error:", error);
    }
  };

  const markAsDone = async (id) => {
    try {
      await axios.put(`${API_URL}/api/admin-bookings/status/${id}`, {
  bookingStatus: "DONE"
});

      fetchBookings();
    } catch (error) {
      console.log("Status Update Error:", error);
    }
  };

  useEffect(() => { fetchBookings(); }, []);

  // ── Stats ──
  const todayBookings = bookings.filter((b) => {
    const d = new Date(b.createdAt), t = new Date();
    return d.getDate()===t.getDate() && d.getMonth()===t.getMonth() && d.getFullYear()===t.getFullYear();
  }).length;

  const weeklyBookings = bookings.filter((b) => {
    const weekAgo = new Date(); weekAgo.setDate(weekAgo.getDate()-7);
    return new Date(b.createdAt) >= weekAgo;
  }).length;

  const totalCollected = bookings.reduce((sum, b) => sum + (Number(b.onlinePaid || b.paidAmount) || 0), 0);
  const totalPending   = bookings.reduce((sum, b) => sum + (Number(b.pendingAmount) || 0), 0);

  // ── Filters ──
  const finalBookings = bookings
    .filter((b) => new Date(b.createdAt).getMonth() === Number(selectedMonth))
    .filter((b) => {
      if (!startDate || !endDate) return true;
      const d = new Date(b.createdAt), s = new Date(startDate), e = new Date(endDate);
      e.setHours(23,59,59,999);
      return d >= s && d <= e;
    })
    .filter((b) => statusFilter === "ALL" || b.bookingStatus === statusFilter)
    .filter((b) =>
      b?.name?.toLowerCase().includes(search.toLowerCase()) || b?.phone?.includes(search)
    );

  const monthCollected = finalBookings.reduce((sum, b) => sum + (Number(b.onlinePaid || b.paidAmount) || 0), 0);
  const monthPending   = finalBookings.reduce((sum, b) => sum + (Number(b.pendingAmount) || 0), 0);

  const statusColor = (s) => {
    if (s === "PENDING")   return "bg-yellow-100 text-yellow-700";
    if (s === "CONFIRMED") return "bg-blue-100 text-blue-700";
    if (s === "DONE" || s === "COMPLETED") return "bg-green-100 text-green-700";
    return "bg-red-100 text-red-700";
  };

  const payColor = (s) => s === "SUCCESS"
    ? "bg-green-100 text-green-700"
    : "bg-red-100 text-red-700";

  return (
    <div className="min-h-screen bg-[#f8f7f3] p-3 md:p-6">

      {/* Heading */}
      <div className="mb-6">
        <h1 className="text-xl md:text-2xl font-bold text-gray-800">Booking Management</h1>
        <p className="text-sm text-gray-500 mt-1">Manage all customer bookings</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border">
          <p className="text-xs text-gray-500">Total Bookings</p>
          <h2 className="text-2xl font-bold text-[#b07d2a]">{bookings.length}</h2>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border">
          <p className="text-xs text-gray-500">Today</p>
          <h2 className="text-2xl font-bold text-[#b07d2a]">{todayBookings}</h2>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border">
          <p className="text-xs text-gray-500">This Week</p>
          <h2 className="text-2xl font-bold text-[#b07d2a]">{weeklyBookings}</h2>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border">
          <p className="text-xs text-gray-500">{months[selectedMonth]} Bookings</p>
          <h2 className="text-2xl font-bold text-[#b07d2a]">{finalBookings.length}</h2>
        </div>
      </div>

      {/* Revenue Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <div className="bg-green-50 rounded-xl p-4 shadow-sm border border-green-200">
          <p className="text-xs text-green-600">Total Collected (Online)</p>
          <h2 className="text-xl font-bold text-green-700">₹{totalCollected.toLocaleString("en-IN")}</h2>
        </div>
        <div className="bg-orange-50 rounded-xl p-4 shadow-sm border border-orange-200">
          <p className="text-xs text-orange-600">Total Pending (Cash)</p>
          <h2 className="text-xl font-bold text-orange-700">₹{totalPending.toLocaleString("en-IN")}</h2>
        </div>
        <div className="bg-blue-50 rounded-xl p-4 shadow-sm border border-blue-200">
          <p className="text-xs text-blue-600">{months[selectedMonth]} Collected</p>
          <h2 className="text-xl font-bold text-blue-700">₹{monthCollected.toLocaleString("en-IN")}</h2>
        </div>
        <div className="bg-yellow-50 rounded-xl p-4 shadow-sm border border-yellow-200">
          <p className="text-xs text-yellow-700">{months[selectedMonth]} Pending</p>
          <h2 className="text-xl font-bold text-yellow-700">₹{monthPending.toLocaleString("en-IN")}</h2>
        </div>
      </div>

      {/* Month Filter */}
      <div className="mb-4">
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(Number(e.target.value))}
          className="border rounded-lg px-3 py-2 text-sm bg-white"
        >
          {months.map((m, i) => <option key={i} value={i}>{m}</option>)}
        </select>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <input
            type="text" placeholder="Search Name or Phone" value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm"
          />
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm" />
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm" />
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm">
            <option value="ALL">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="DONE">Done</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      {/* ── Table ── */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full" style={{ tableLayout: "fixed" }}>
            <colgroup>
              <col style={{ width: "20%" }} />  {/* Name */}
              <col style={{ width: "14%" }} />  {/* Phone */}
              <col style={{ width: "13%" }} />  {/* Type */}
              <col style={{ width: "13%" }} />  {/* Date */}
              <col style={{ width: "13%" }} />  {/* Status */}
              <col style={{ width: "27%" }} />  {/* Actions */}
            </colgroup>
            <thead className="bg-[#f3f1ea]">
              <tr>
                <th className="px-3 py-2.5 text-left text-[10px] uppercase tracking-wide text-gray-500">Name</th>
                <th className="px-3 py-2.5 text-left text-[10px] uppercase tracking-wide text-gray-500">Phone</th>
                <th className="px-3 py-2.5 text-left text-[10px] uppercase tracking-wide text-gray-500">Type</th>
                <th className="px-3 py-2.5 text-left text-[10px] uppercase tracking-wide text-gray-500">Date</th>
                <th className="px-3 py-2.5 text-left text-[10px] uppercase tracking-wide text-gray-500">Status</th>
                <th className="px-3 py-2.5 text-left text-[10px] uppercase tracking-wide text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {finalBookings.length > 0 ? finalBookings.map((item) => (
                <tr key={item._id} className="border-t hover:bg-gray-50">

                  {/* Name */}
                  <td className="px-3 py-2.5 text-xs font-medium truncate" title={item.name}>
                    {item.name}
                  </td>

                  {/* Phone */}
                  <td className="px-3 py-2.5 text-xs text-gray-600 truncate">
                    {item.phone}
                  </td>

                  {/* Booking Type */}
                  <td className="px-3 py-2.5">
                    <span className="px-2 py-0.5 rounded-full text-[10px] bg-gray-100 text-gray-600 truncate block w-fit max-w-full">
                      {item.bookingType}
                    </span>
                  </td>

                  {/* Date */}
                  <td className="px-3 py-2.5 text-xs text-gray-500">
                    {new Date(item.createdAt).toLocaleDateString("en-IN")}
                  </td>

                  {/* Booking Status */}
                  <td className="px-3 py-2.5">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] ${statusColor(item.bookingStatus)}`}>
                      {item.bookingStatus || "PENDING"}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-3 py-2.5">
                    <div className="flex flex-wrap gap-1.5">
                      <button
                        onClick={() => setSelectedBooking(item)}
                        className="px-2.5 py-1 rounded text-[10px] bg-blue-100 text-blue-700 font-medium"
                      >
                        View
                      </button>
                      {item.bookingStatus !== "DONE" && (
                        <button
                          onClick={() => markAsDone(item._id)}
                          className="px-2.5 py-1 rounded text-[10px] bg-green-100 text-green-700 font-medium"
                        >
                          Done
                        </button>
                      )}
                      <button
                        onClick={() => deleteBooking(item._id)}
                        className="px-2.5 py-1 rounded text-[10px] bg-red-100 text-red-700 font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="6" className="text-center py-10 text-gray-500 text-sm">
                    No Bookings Found
                  </td>
                </tr>
              )}
            </tbody>

            {/* Footer totals */}
            {finalBookings.length > 0 && (
              <tfoot className="bg-[#f3f1ea] border-t-2 border-gray-300">
                <tr>
                  <td colSpan="3" className="px-3 py-2.5 text-[10px] font-bold uppercase text-gray-600">
                    {months[selectedMonth]} Totals ({finalBookings.length} bookings)
                  </td>
                  <td colSpan="3" className="px-3 py-2.5 text-xs">
                    <span className="font-bold text-green-700 mr-3">
                      ₹{monthCollected.toLocaleString("en-IN")} collected
                    </span>
                    <span className="font-bold text-orange-600">
                      ₹{monthPending.toLocaleString("en-IN")} pending
                    </span>
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>

      {/* ── Detail Modal ── */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">

            <div className="flex justify-between items-center mb-5">
              <h2 className="text-lg font-bold text-gray-800">Booking Details</h2>
              <button
                onClick={() => setSelectedBooking(null)}
                className="text-gray-400 hover:text-red-500 text-xl leading-none"
              >✕</button>
            </div>

            {/* Customer Info */}
            <div className="bg-gray-50 rounded-xl p-4 mb-4">
              <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-2.5">Customer</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Name</span>
                  <span className="font-medium text-gray-800">{selectedBooking.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Phone</span>
                  <span className="font-medium text-gray-800">{selectedBooking.phone}</span>
                </div>
                {selectedBooking.email && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Email</span>
                    <span className="font-medium text-gray-800 text-right break-all">{selectedBooking.email}</span>
                  </div>
                )}
                <div className="flex justify-between gap-4">
                  <span className="text-gray-500 shrink-0">Address</span>
                  <span className="font-medium text-gray-800 text-right">
                    {selectedBooking.address || selectedBooking.location || "—"}
                  </span>
                </div>
              </div>
            </div>

            {/* Booking Info */}
            <div className="bg-gray-50 rounded-xl p-4 mb-4">
              <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-2.5">Booking</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Type</span>
                  <span className="font-medium text-gray-800">{selectedBooking.bookingType}</span>
                </div>
                {selectedBooking.packageName && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Package</span>
                    <span className="font-medium text-gray-800">{selectedBooking.packageName}</span>
                  </div>
                )}
                {selectedBooking.eventType && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Event</span>
                    <span className="font-medium text-gray-800">{selectedBooking.eventType}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-500">Date</span>
                  <span className="font-medium text-gray-800">
                    {selectedBooking.date
                      ? new Date(selectedBooking.date).toLocaleDateString("en-IN")
                      : selectedBooking.startDate
                        ? new Date(selectedBooking.startDate).toLocaleDateString("en-IN")
                        : "—"}
                  </span>
                </div>
                {selectedBooking.session && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Session</span>
                    <span className="font-medium text-gray-800">{selectedBooking.session}</span>
                  </div>
                )}
                {selectedBooking.time && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Time</span>
                    <span className="font-medium text-gray-800">{selectedBooking.time}</span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Booking Status</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs ${statusColor(selectedBooking.bookingStatus)}`}>
                    {selectedBooking.bookingStatus || "PENDING"}
                  </span>
                </div>
              </div>
            </div>

            {/* Payment Info */}
            <div className="bg-[#fff8ef] border border-[#e8dccb] rounded-xl p-4 mb-5">
              <p className="text-[10px] uppercase tracking-widest text-[#a08060] mb-3">Payment Summary</p>
              <div className="space-y-2 text-sm">

                <div className="flex justify-between">
                  <span className="text-gray-600">Package Price</span>
                  <span className="font-semibold">₹{Number(selectedBooking.packagePrice || 0).toLocaleString("en-IN")}</span>
                </div>

                {Number(selectedBooking.travelCharge || selectedBooking.distanceCharge || 0) > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">
                      Travel Charge
                      {selectedBooking.distanceKm > 0 && (
                        <span className="text-xs text-gray-400 ml-1">({selectedBooking.distanceKm} km)</span>
                      )}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold">
                        ₹{Number(selectedBooking.travelCharge || selectedBooking.distanceCharge || 0).toLocaleString("en-IN")}
                      </span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                        selectedBooking.travelChargePaymentStatus === "PAID"
                          ? "bg-green-100 text-green-700"
                          : "bg-orange-100 text-orange-600"
                      }`}>
                        {selectedBooking.travelChargePaymentStatus === "PAID" ? "Paid Online" : "Cash Pending"}
                      </span>
                    </div>
                  </div>
                )}

                <div className="flex justify-between border-t border-[#e8dccb] pt-2 font-bold">
                  <span>Grand Total</span>
                  <span>₹{Number(selectedBooking.totalPrice || 0).toLocaleString("en-IN")}</span>
                </div>

                <div className="flex justify-between text-green-700">
                  <span>✓ Collected (Online)</span>
                  <span className="font-bold">
                    ₹{Number(selectedBooking.onlinePaid || selectedBooking.paidAmount || 0).toLocaleString("en-IN")}
                  </span>
                </div>

                {Number(selectedBooking.pendingAmount) > 0 && (
                  <div className="flex justify-between text-orange-600">
                    <span>⏳ Pending (Cash)</span>
                    <span className="font-bold">₹{Number(selectedBooking.pendingAmount).toLocaleString("en-IN")}</span>
                  </div>
                )}

                <div className="flex justify-between items-center pt-1">
                  <span className="text-gray-600">Payment Mode</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                    selectedBooking.paymentMode === "cash"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-green-100 text-green-700"
                  }`}>
                    {selectedBooking.paymentMode === "cash" ? "💵 Cash (30% Advance)" : "💳 Online"}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Payment Status</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${payColor(selectedBooking.paymentStatus)}`}>
                    {selectedBooking.paymentStatus || "PENDING"}
                  </span>
                </div>

                {selectedBooking.paymentId && (
                  <p className="text-xs text-gray-400 pt-1 break-all">
                    Payment ID: {selectedBooking.paymentId}
                  </p>
                )}
              </div>
            </div>

            {/* Action buttons in modal */}
            <div className="flex gap-3">
              {selectedBooking.bookingStatus !== "DONE" && (
                <button
                  onClick={() => { markAsDone(selectedBooking._id); setSelectedBooking(null); }}
                  className="flex-1 bg-green-600 text-white py-2 rounded-lg text-sm font-semibold"
                >
                  Mark as Done
                </button>
              )}
              <button
                onClick={() => setSelectedBooking(null)}
                className="flex-1 bg-[#b07d2a] text-white py-2 rounded-lg text-sm font-semibold"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBookings;
