import Booking from "../models/bookingModel.js";
import QuickBooking from "../models/quickBookingModel.js";

export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });

    const quickBookings = await QuickBooking.find().sort({ createdAt: -1 });

    const allBookings = [
      ...bookings.map((item) => ({
        ...item.toObject(),
        bookingType: "Booking",
      })),

      ...quickBookings.map((item) => ({
        ...item.toObject(),
        bookingType: "Quick Booking",
      })),
    ];

    allBookings.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    const today = new Date();

    // Today
    const todayBookings = allBookings.filter((booking) => {
      const bookingDate = new Date(booking.createdAt);
      return (
        bookingDate.getDate() === today.getDate() &&
        bookingDate.getMonth() === today.getMonth() &&
        bookingDate.getFullYear() === today.getFullYear()
      );
    }).length;

    // Last 7 days
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    const weeklyBookings = allBookings.filter((booking) => {
      return new Date(booking.createdAt) >= weekAgo;
    }).length;

    // This month
    const monthlyBookings = allBookings.filter((booking) => {
      const bookingDate = new Date(booking.createdAt);
      return (
        bookingDate.getMonth() === today.getMonth() &&
        bookingDate.getFullYear() === today.getFullYear()
      );
    }).length;

    res.status(200).json({
      success: true,
      stats: {
        totalBookings: allBookings.length,
        todayBookings,
        weeklyBookings,
        monthlyBookings,
      },
      bookings: allBookings,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// Update Booking Status

export const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { bookingStatus } = req.body;

    let booking = await Booking.findByIdAndUpdate(
      id,
      { bookingStatus },
      { new: true, strict: false }   // ← strict: false add kita
    );

    if (!booking) {
      booking = await QuickBooking.findByIdAndUpdate(
        id,
        { bookingStatus },
        { new: true, strict: false }  // ← ithe bhi
      );
    }

    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    res.status(200).json({ success: true, booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
// Delete Booking

export const deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;

    let deletedBooking = await Booking.findByIdAndDelete(id);

    if (!deletedBooking) {
      deletedBooking = await QuickBooking.findByIdAndDelete(id);
    }

    if (!deletedBooking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Booking deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};