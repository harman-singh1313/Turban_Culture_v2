import Pricing from "../models/pricingModel.js";

// ── Get Pricing ──
export const getPricing = async (req, res) => {
  try {
    let pricing = await Pricing.findOne();
    if (!pricing) {
      pricing = await Pricing.create({});
    } else {
      // ✅ Purane document vich missing fields force update karo
      let changed = false;
      if (pricing.freeTravelKm == null) { pricing.freeTravelKm = 30; changed = true; }
      if (pricing.travelPricePerKm == null) { pricing.travelPricePerKm = 20; changed = true; }
      if (changed) await pricing.save();
    }
    res.status(200).json({ success: true, pricing });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
// ── Update Pricing ──
export const updatePricing = async (req, res) => {
  try {
    let pricing = await Pricing.findOne();
    if (!pricing) pricing = await Pricing.create({});
    
    Object.assign(pricing, req.body);
    await pricing.save();
    
    res.status(200).json({ success: true, pricing });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── Add Package ──
export const addPackage = async (req, res) => {
  try {
    let pricing = await Pricing.findOne();
    if (!pricing) pricing = await Pricing.create({});
    
    pricing.packages.push(req.body);
    await pricing.save();
    
    res.status(201).json({ success: true, pricing });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── Update Package ──
export const updatePackage = async (req, res) => {
  try {
    const pricing = await Pricing.findOne();
    const pkg = pricing.packages.id(req.params.packageId);
    if (!pkg) return res.status(404).json({ message: "Package not found" });
    
    Object.assign(pkg, req.body);
    await pricing.save();
    
    res.status(200).json({ success: true, pricing });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── Delete Package ──
export const deletePackage = async (req, res) => {
  try {
    const pricing = await Pricing.findOne();
    pricing.packages.pull({ _id: req.params.packageId });
    await pricing.save();
    
    res.status(200).json({ success: true, message: "Package deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};