import mongoose from "mongoose";

const mediaSchema = new mongoose.Schema(
  {
    /* =====================================================
       TITLE
    ===================================================== */

    title: {
      type: String,
      default:"",
      trim: true,
    },

    /* =====================================================
       CATEGORY
    ===================================================== */

    category: {
      type: String,
      required: true,
      enum: [
        "groom",
        "wattan-wali-pagg",
        "patiala-shahi",
        "amritsar-shahi-pagg",
        "jodhpuri-safa",
        "groom-safa",
        "dumala-sahib",
        "videos",
      ],
    },

    /* =====================================================
       IMAGE
       Used for all categories except "videos"
    ===================================================== */

    image: {
      url: {
        type: String,
        default: "",
      },

      publicId: {
        type: String,
        default: "",
      },
    },

    /* =====================================================
       VIDEO
       Used only when category = "videos"
    ===================================================== */

    video: {
      url: {
        type: String,
        default: "",
      },

      publicId: {
        type: String,
        default: "",
      },

      posterUrl: {
        type: String,
        default: "",
      },

      posterPublicId: {
        type: String,
        default: "",
      },
    },

    /* =====================================================
       STATUS
    ===================================================== */

    status: {
      type: String,
      enum: ["draft", "published"],
      default: "published",
    },
  },
  {
    timestamps: true,
  }
);

/* =========================================================
   MODEL
========================================================= */

const Media = mongoose.model("media", mediaSchema);

export default Media;