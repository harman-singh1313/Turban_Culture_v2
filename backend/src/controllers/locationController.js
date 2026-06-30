import axios from "axios";

export const searchLocation = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || q.trim().length < 3) return res.status(200).json([]);

    const response = await axios.get(
      "https://api.opencagedata.com/geocode/v1/json",
      {
        params: {
          q: q.trim(),
          key: process.env.OPENCAGE_API_KEY,
          countrycode: "in",
          limit: 5,
          language: "en",
          no_annotations: 1,
        },
      }
    );

    const results = response.data.results.map((r) => ({
      place_id: r.annotations?.geohash || Math.random(),
      display_name: r.formatted,
      lat: r.geometry.lat,
      lon: r.geometry.lng,
    }));

    return res.status(200).json(results);
  } catch (error) {
    console.log("Location search error:", error.response?.data || error.message);
    return res.status(500).json({ message: "Location search failed" });
  }
};