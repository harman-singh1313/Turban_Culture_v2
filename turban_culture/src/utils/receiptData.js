// src/utils/receiptData.js

export const buildReceiptData = (booking) => {

  return {
    bookingId: booking.id,

    name: booking.name,

    phone: booking.phone,

    address: booking.address,

    amount: booking.totalPrice,

    paymentId: booking.paymentId,

    orderId: booking.orderId,

    paymentStatus: booking.paymentStatus,

    bookingType: booking.bookingType,
  };
};