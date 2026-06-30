import Lead from "../models/leadModel.js";
 
// POST /api/leads  -> save a new lead from the form
export const createLead = async (req, res) => {
  try {
    const { name, phone, date, location } = req.body;
 
    if (!name || !phone) {
      return res.status(400).json({ message: "Name and phone are required" });
    }
 
    const lead = await Lead.create({ name, phone, date, location });
 
    res.status(201).json({
      message: "Lead saved successfully",
      lead,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
 
// GET /api/leads  -> view saved leads (useful for an admin panel later)
export const getLeads = async (req, res) => {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 });
    res.status(200).json({ leads });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};