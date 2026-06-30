import Booking from "../models/bookingModel.js";
import QuickBooking from "../models/quickBookingModel.js";

// helper: merge all
const getAllData = async () => {
  const bookings = await Booking.find();
  const quickBookings = await QuickBooking.find();

  return [...bookings, ...quickBookings];
};

export const getDashboardStats = async (req, res) => {
  try {
    const all = await getAllData();

    const totalBookings = all.length;

    const totalRevenue = all.reduce(
      (sum, b) => sum + (b.totalPrice || 0),
      0
    );

    const customers = new Set(all.map(b => b.phone)).size;

    const totalPending = all.filter(
      b => b.paymentStatus === "PENDING"
    ).length;

    const totalOrders = all.filter(
      b => b.paymentStatus === "PAID"
    ).length;

    const upcoming = all.filter(
      b => b.date && new Date(b.date) > new Date()
    ).length;

    // monthly chart
    const monthly = Array(12).fill(0);
    all.forEach(b => {
      if (b.createdAt) {
        monthly[new Date(b.createdAt).getMonth()]++;
      }
    });

    res.json({
      success: true,
      stats: {
        totalBookings,
        totalRevenue,
        customers,
        totalPending,
        totalOrders,
        upcoming,
      },
      monthly,
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 🔥 recent 5
export const getRecentBookings = async (req, res) => {
  try {
    const all = await getAllData();

    const recent = all
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);

    res.json({
      success: true,
      bookings: recent
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 🔥 ALL BOOKINGS (for View All popup)
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find();
    const quickBookings = await QuickBooking.find();

    const all = [...bookings, ...quickBookings].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    res.json({
      success: true,
      bookings: all,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};