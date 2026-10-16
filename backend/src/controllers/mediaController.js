import Media from "../models/media.js";
import cloudinary from "../config/cloudinary.js";

/* =========================================================
   HELPERS
========================================================= */

const destroyQuietly = async (publicId, resourceType) => {
  if (!publicId) return;

  try {
    await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });
  } catch (cleanupError) {
    console.log(`${resourceType} cleanup error:`, cleanupError);
  }
};

/* =========================================================
   CREATE IMAGE MEDIA
   (images ke liye title nahi hota)
========================================================= */

export const createImageMedia = async (req, res) => {
  try {
    const { category, status } = req.body;

    /* ================= VALIDATION ================= */

    if (!category) {
      return res.status(400).json({
        success: false,
        message: "Category is required",
      });
    }

    // "videos" category cannot be used for image uploads
    if (category === "videos") {
      return res.status(400).json({
        success: false,
        message: "Videos category cannot be used for image upload",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Image is required",
      });
    }

    /* ================= CREATE MEDIA ================= */

    const media = await Media.create({
      category,

      image: {
        url: req.file.path,
        publicId: req.file.filename,
      },

      status: status || "published",
    });

    return res.status(201).json({
      success: true,
      message: "Image uploaded successfully",
      media,
    });
  } catch (error) {
    console.log("CREATE IMAGE MEDIA ERROR:", error);

    /*
      If Cloudinary upload succeeded but MongoDB save failed,
      remove uploaded image.
    */
    await destroyQuietly(req.file?.filename, "image");

    return res.status(500).json({
      success: false,
      message: error.message || "Image upload failed",
    });
  }
};

/* =========================================================
   CREATE VIDEO + POSTER MEDIA
   (title optional hai)
========================================================= */

export const createVideoMedia = async (req, res) => {
  try {
    const { title, status } = req.body;

    const videoFile = req.files?.video?.[0];
    const posterFile = req.files?.poster?.[0];

    /* ================= VALIDATION ================= */

    if (!videoFile) {
      // Poster upload ho gaya ho to hata do
      await destroyQuietly(posterFile?.filename, "image");

      return res.status(400).json({
        success: false,
        message: "Video is required",
      });
    }

    if (!posterFile) {
      /*
        Video may already have reached Cloudinary,
        so remove it if poster is missing.
      */
      await destroyQuietly(videoFile.filename, "video");

      return res.status(400).json({
        success: false,
        message: "Video poster is required",
      });
    }

    /* ================= CREATE MEDIA ================= */

    const media = await Media.create({
      title: typeof title === "string" ? title.trim() : "",

      // Video always belongs to videos category
      category: "videos",

      video: {
        url: videoFile.path,
        publicId: videoFile.filename,

        posterUrl: posterFile.path,
        posterPublicId: posterFile.filename,
      },

      status: status || "published",
    });

    return res.status(201).json({
      success: true,
      message: "Video and poster uploaded successfully",
      media,
    });
  } catch (error) {
    console.log("CREATE VIDEO MEDIA ERROR:", error);

    const videoFile = req.files?.video?.[0];
    const posterFile = req.files?.poster?.[0];

    await destroyQuietly(videoFile?.filename, "video");
    await destroyQuietly(posterFile?.filename, "image");

    return res.status(500).json({
      success: false,
      message: error.message || "Video upload failed",
    });
  }
};

/* =========================================================
   GET ALL MEDIA
========================================================= */

export const getAllMedia = async (req, res) => {
  try {
    const {
      category,
      status,
      limit,
      page = 1,
    } = req.query;

    /* ================= FILTER ================= */

    const filter = {};

    if (category && category !== "all") {
      filter.category = category;
    }

    if (status) {
      filter.status = status;
    }

    /* ================= PAGINATION ================= */

    const parsedLimit = parseInt(limit, 10);
    const parsedPage = Math.max(parseInt(page, 10) || 1, 1);

    let query = Media.find(filter).sort({
      createdAt: -1,
    });

    if (parsedLimit && !isNaN(parsedLimit) && parsedLimit > 0) {
      query = query
        .skip((parsedPage - 1) * parsedLimit)
        .limit(parsedLimit);
    }

    const media = await query;

    const total = await Media.countDocuments(filter);

    return res.status(200).json({
      success: true,
      count: media.length,
      total,
      page: parsedPage,
      media,
    });
  } catch (error) {
    console.log("GET MEDIA ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =========================================================
   GET SINGLE MEDIA
========================================================= */

export const getMediaById = async (req, res) => {
  try {
    const media = await Media.findById(req.params.id);

    if (!media) {
      return res.status(404).json({
        success: false,
        message: "Media not found",
      });
    }

    return res.status(200).json({
      success: true,
      media,
    });
  } catch (error) {
    console.log("GET MEDIA BY ID ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =========================================================
   UPDATE MEDIA DETAILS
========================================================= */

export const updateMedia = async (req, res) => {
  try {
    const { title, category, status } = req.body;

    const media = await Media.findById(req.params.id);

    if (!media) {
      return res.status(404).json({
        success: false,
        message: "Media not found",
      });
    }

    /* ================= TITLE (sirf videos, khaali bhi chalega) ================= */

    if (title !== undefined && media.category === "videos") {
      media.title = typeof title === "string" ? title.trim() : "";
    }

    /* ================= CATEGORY ================= */

    if (category !== undefined) {
      /*
        Existing video cannot be moved to an image category.
      */
      if (media.category === "videos" && category !== "videos") {
        return res.status(400).json({
          success: false,
          message: "Video category cannot be changed",
        });
      }

      /*
        Existing image cannot become videos category.
      */
      if (media.category !== "videos" && category === "videos") {
        return res.status(400).json({
          success: false,
          message: "Image cannot be changed to videos category",
        });
      }

      media.category = category;
    }

    /* ================= STATUS ================= */

    if (status !== undefined) {
      media.status = status;
    }

    await media.save();

    return res.status(200).json({
      success: true,
      message: "Media updated successfully",
      media,
    });
  } catch (error) {
    console.log("UPDATE MEDIA ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =========================================================
   DELETE MEDIA
========================================================= */

export const deleteMedia = async (req, res) => {
  try {
    const media = await Media.findById(req.params.id);

    if (!media) {
      return res.status(404).json({
        success: false,
        message: "Media not found",
      });
    }

    /* =====================================================
       DELETE NORMAL IMAGE
    ===================================================== */

    if (media.image?.publicId) {
      await cloudinary.uploader.destroy(
        media.image.publicId,
        {
          resource_type: "image",
        }
      );
    }

    /* =====================================================
       DELETE VIDEO
    ===================================================== */

    if (media.video?.publicId) {
      await cloudinary.uploader.destroy(
        media.video.publicId,
        {
          resource_type: "video",
        }
      );
    }

    /* =====================================================
       DELETE VIDEO POSTER
    ===================================================== */

    if (media.video?.posterPublicId) {
      await cloudinary.uploader.destroy(
        media.video.posterPublicId,
        {
          resource_type: "image",
        }
      );
    }

    /* =====================================================
       DELETE FROM MONGODB
    ===================================================== */

    await Media.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Media deleted successfully",
    });
  } catch (error) {
    console.log("DELETE MEDIA ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
