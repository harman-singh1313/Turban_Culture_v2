import Pricing from "../models/pricingModel.js";

export const calculateDistance = async (req, res) => {
  try {
    const { lat, lon } = req.body;

    const businessLat = 29.4584;
    const businessLon = 74.9275;

    const R = 6371;
    const dLat = ((lat - businessLat) * Math.PI) / 180;
    const dLon = ((lon - businessLon) * Math.PI) / 180;

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((businessLat * Math.PI) / 180) *
      Math.cos((lat * Math.PI) / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distanceKm = Math.round(R * c);

    // ✅ Database to fresh values lo
    const pricing = await Pricing.findOne();
    const freeTravelKm = pricing?.freeTravelKm ?? 30;
    const travelPricePerKm = pricing?.travelPricePerKm ?? 20;

    let distanceCharge = 0;
    if (distanceKm > freeTravelKm) {
      distanceCharge = Math.round((distanceKm - freeTravelKm) * travelPricePerKm);
    }

    // ✅ freeTravelKm aur travelPricePerKm bhi bhejo
    res.json({ distanceKm, distanceCharge, freeTravelKm, travelPricePerKm });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Distance calculation failed" });
  }
};