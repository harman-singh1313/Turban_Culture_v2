import Slider from "../models/sliderModel.js";

// GET
export const getSliders = async (req, res) => {
  try {
    const slides = await Slider.find({ active: true }).sort({ order: 1 });
    res.json(slides);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// CREATE
export const createSlider = async (req, res) => {
  try {
    const imageUrl = req.file?.path || req.body.imageUrl;

    if (!imageUrl) {
      return res.status(400).json({
        success: false,
        message: "Image is required",
      });
    }

    const slide = await Slider.create({
      imageUrl,
      title: req.body.title || "",
      subtitle: req.body.subtitle || "",
      rating: req.body.rating !== undefined ? Number(req.body.rating) : undefined,
      logoUrl: req.body.logoUrl || "",
      order: Number(req.body.order) || 1,
      active: true,
    });

    res.json(slide);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// DELETE
export const deleteSlider = async (req, res) => {
  try {
    await Slider.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};