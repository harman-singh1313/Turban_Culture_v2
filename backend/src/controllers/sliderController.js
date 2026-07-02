import Slider from "../models/sliderModel.js";

// GET
export const getSliders = async (req, res) => {
  try {
    const slides = await Slider.find({ active: true }).sort({ order: 1 });
    res.json(slides);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

// CREATE
export const createSlider = async (req, res) => {
  try {
    const slide = await Slider.create({
      imageUrl: req.file ? req.file.path : req.body.imageUrl,
      title: req.body.title,
      order: req.body.order || 1,
      active: true,
    });

    res.json(slide);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

// DELETE
export const deleteSlider = async (req, res) => {
  try {
    await Slider.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json(err.message);
  }
};