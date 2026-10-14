import mongoose from "mongoose";

const videoSchema = new mongoose.Schema(
  {
    // ================= VIDEO =================
    videoUrl: {
      type: String,
      required: true,
      trim: true,
    },

    publicId: {
      type: String,
      required: false,
    },

    // ================= POSTER / THUMBNAIL =================
    posterUrl: {
      type: String,
      required: true,
      trim: true,
    },

    posterPublicId: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Video", videoSchema);