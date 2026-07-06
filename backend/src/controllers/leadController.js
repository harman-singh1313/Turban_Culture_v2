import Lead from "../models/leadModel.js";
import nodemailer from "nodemailer";

// Gmail transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// POST /api/leads
export const createLead = async (req, res) => {
  try {
    const { name, phone, date, location } = req.body;

    if (!name || !phone) {
      return res.status(400).json({
        message: "Name and phone are required",
      });
    }

    // Save lead
    const lead = await Lead.create({
      name,
      phone,
      date,
      location,
    });

    // Send email notification
    await transporter.sendMail({
      from: `"Turban Culture" <${process.env.EMAIL_USER}>`,
      to: process.env.OWNER_EMAIL,
      subject: "New Lead Received - Turban Culture",
      html: `
        <h2>New Lead Received</h2>

        <table border="1" cellpadding="8" cellspacing="0" style="border-collapse:collapse;">
          <tr>
            <td><strong>Name</strong></td>
            <td>${name}</td>
          </tr>

          <tr>
            <td><strong>Phone</strong></td>
            <td>${phone}</td>
          </tr>

          <tr>
            <td><strong>Location</strong></td>
            <td>${location || "Not Provided"}</td>
          </tr>

          <tr>
            <td><strong>Date</strong></td>
            <td>${date || "Not Provided"}</td>
          </tr>
        </table>

        <br/>
        <p>A new lead has been submitted from the Turban Culture website.</p>
      `,
    });

    res.status(201).json({
      message: "Lead saved successfully",
      lead,
    });
  } catch (error) {
    console.error("Lead Error:", error);

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// GET /api/leads
export const getLeads = async (req, res) => {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 });

    res.status(200).json({ leads });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};