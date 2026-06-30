import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ================= USER EMAIL =================
export const sendUserConfirmationEmail = async ({
  to,
  name,
  bookingId,
  totalPrice,
  eventType,
  packageName,
  travelCharge = 0,
  totalAmount = 0,
  onlinePaid = 0,
  cashAmount = 0,
  pendingAmount = 0,
  paymentMode = "",
  paymentStatus = "",
  advancePercent = 30,
}) => {
  const bookingType = eventType || packageName || "Booking";

  await transporter.sendMail({
    from: `"Turban Culture" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Booking Confirmed - Turban Culture",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin:auto; padding:24px; border:1px solid #e8dccb; border-radius:12px;">
        
        <h2 style="color:#2f2418; text-align:center;">
          Turban Culture
        </h2>

        <hr />

        <p>Dear <strong>${name}</strong>,</p>

        <p>
          Your booking has been confirmed successfully.
          Our team will contact you within <strong>1-2 days</strong>.
        </p>

        <div style="background:#fff8ef;padding:15px;border-radius:8px;">

          <p><strong>Booking ID:</strong> #${bookingId}</p>

          <p><strong>Booking Type:</strong> ${bookingType}</p>

          <p><strong>Package Price:</strong> ₹${totalPrice}</p>

          <p><strong>Travel Charge:</strong> ₹${travelCharge}</p>

          <p><strong>Total Amount:</strong> ₹${totalAmount}</p>

          <hr />

          <p><strong>Advance Paid (${advancePercent}%):</strong> ₹${onlinePaid}</p>


          <p><strong>Pending Amount:</strong> ₹${pendingAmount}</p>

          <p><strong>Payment Method:</strong> ${paymentMode}</p>

          <p><strong>Payment Status:</strong> ${paymentStatus}</p>

        </div>

        <p style="margin-top:20px;">
          Thank you for choosing Turban Culture.
        </p>

      </div>
    `,
  });
};

// ================= OWNER EMAIL =================
export const sendOwnerNotificationEmail = async ({
  name,
  phone,
  email,
  bookingId,
  totalPrice,
  eventType,
  packageName,
  location,
  travelCharge = 0,

  totalAmount = 0,
  onlinePaid = 0,
  cashAmount = 0,
  pendingAmount = 0,
  paymentMode = "",
  paymentStatus = "",
  advancePercent = 30,
}) => {
  const bookingType = eventType || packageName || "Booking";

  await transporter.sendMail({
    from: `"Turban Culture Bookings" <${process.env.EMAIL_USER}>`,
    to: process.env.OWNER_EMAIL,
    subject: `New Booking - ${name}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin:auto; padding:24px; border:1px solid #e8dccb; border-radius:12px;">

        <h2>New Booking Received</h2>

        <hr />

        <table style="width:100%; border-collapse:collapse;">

          <tr>
            <td><strong>Name</strong></td>
            <td>${name}</td>
          </tr>

          <tr>
            <td><strong>Phone</strong></td>
            <td>${phone}</td>
          </tr>

          <tr>
            <td><strong>Email</strong></td>
            <td>${email || "N/A"}</td>
          </tr>

          <tr>
            <td><strong>Booking</strong></td>
            <td>${bookingType}</td>
          </tr>

          <tr>
            <td><strong>Location</strong></td>
            <td>${location}</td>
          </tr>

          <tr>
            <td><strong>Package Price</strong></td>
            <td>₹${totalPrice}</td>
          </tr>

          <tr>
            <td><strong>Travel Charge</strong></td>
            <td>₹${travelCharge}</td>
          </tr>

          <tr>
            <td><strong>Total Amount</strong></td>
            <td>₹${totalAmount}</td>
          </tr>

          <tr>
            <td><strong>Advance (${advancePercent}%)</strong></td>
            <td>₹${onlinePaid}</td>
          </tr>


          <tr>
            <td><strong>Pending Amount</strong></td>
            <td>₹${pendingAmount}</td>
          </tr>

          <tr>
            <td><strong>Payment Method</strong></td>
            <td>${paymentMode}</td>
          </tr>

          <tr>
            <td><strong>Payment Status</strong></td>
            <td>${paymentStatus}</td>
          </tr>

          <tr>
            <td><strong>Booking ID</strong></td>
            <td>#${bookingId}</td>
          </tr>

        </table>

      </div>
    `,
  });
};

// ================= OTP EMAIL =================
export const sendOTPEmail = async (to, otp) => {
  await transporter.sendMail({
    from: `"Turban Culture Admin" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Admin Login OTP - Turban Culture",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 400px; margin:auto; padding:24px; border:1px solid #e8dccb; border-radius:12px;">
        <h2 style="color:#2f2418; text-align:center;">Turban Culture 👑</h2>
        <hr/>
        <p>Tera Admin Login OTP:</p>
        <div style="text-align:center; margin:20px 0;">
          <span style="font-size:36px; font-weight:bold; color:#c9913a; letter-spacing:8px;">${otp}</span>
        </div>
        <p style="color:#999; font-size:12px;">Ih OTP 5 minute vich expire ho jaayega.</p>
        <p style="color:#f00; font-size:12px;">Kisi naal share na karo.</p>
      </div>
    `,
  });
};