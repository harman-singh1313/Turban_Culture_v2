import mongoose from "mongoose";

const videoSchema = new mongoose.Schema(
  {
    videoUrl: {
      type: String,
      required: true,
    },

    publicId: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Video", videoSchema);