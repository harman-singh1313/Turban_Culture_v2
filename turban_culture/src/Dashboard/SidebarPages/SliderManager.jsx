import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const SliderManager = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [slides, setSlides] = useState([]);
  const [uploading, setUploading] = useState(false);

  const fileInputRef = useRef(null);

  // ================= GET SLIDES =================
  const fetchSlides = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/slider`);
      setSlides(res.data);
    } catch (err) {
      console.error("Fetch slider error:", err);
      alert("Unable to fetch slider images.");
    }
  };

  useEffect(() => {
    fetchSlides();
  }, []);

  // ================= SELECT IMAGE =================
  const handleChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image.");

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      return;
    }

    setSelectedImage(file);
  };

  // ================= UPLOAD =================
  const handleUpload = async () => {
    if (!selectedImage) {
      return alert("Please select an image first.");
    }

    try {
      setUploading(true);

      const token = localStorage.getItem("adminToken");

      const formData = new FormData();
      formData.append("image", selectedImage);

      await axios.post(`${API_URL}/api/slider`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Image uploaded successfully.");

      setSelectedImage(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      fetchSlides();
    } catch (err) {
      console.error("Upload Error:", err);
      alert("Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  // ================= DELETE =================
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this image?"
    );

    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("adminToken");

      await axios.delete(`${API_URL}/api/slider/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Image deleted successfully.");

      fetchSlides();
    } catch (err) {
      console.error("Delete Error:", err);
      alert("Delete failed.");
    }
  };

  return (
    <div
      className="
        min-w-0
        p-4
        sm:p-5
        lg:p-6
      "
    >
      {/* ================= HEADER ================= */}

      <div className="mb-5 sm:mb-6">
        <h1
          className="
            text-xl
            font-bold
            text-gray-900
            sm:text-2xl
            lg:text-3xl
          "
        >
          Slider Manager
        </h1>

        <p className="mt-1 text-xs text-gray-500 sm:text-sm">
          Upload and manage homepage slider images.
        </p>
      </div>

      {/* ================= UPLOAD CARD ================= */}

      <div
        className="
          rounded-2xl
          border
          border-gray-100
          bg-white
          p-4
          shadow-sm
          sm:p-5
          lg:p-6
        "
      >
        <label
          className="
            mb-2
            block
            text-sm
            font-semibold
            text-gray-800
          "
        >
          Select Slider Image
        </label>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleChange}
          className="
            block
            w-full
            min-w-0
            cursor-pointer
            rounded-xl
            border
            border-gray-200
            bg-gray-50
            p-2
            text-xs
            text-gray-600
            sm:text-sm
          "
        />

        {/* ================= PREVIEW ================= */}

        {selectedImage && (
          <div className="mt-5">
            <p className="mb-2 text-xs font-medium text-gray-500">
              Image Preview
            </p>

            <div
              className="
                w-full
                max-w-md
                overflow-hidden
                rounded-xl
                border
                border-gray-200
                bg-gray-100
              "
            >
              <img
                src={URL.createObjectURL(selectedImage)}
                alt="Preview"
                className="
                  aspect-video
                  w-full
                  object-cover
                "
              />
            </div>

            <p
              className="
                mt-2
                max-w-md
                truncate
                text-xs
                text-gray-400
              "
            >
              {selectedImage.name}
            </p>
          </div>
        )}

        {/* ================= UPLOAD BUTTON ================= */}

        <button
          type="button"
          onClick={handleUpload}
          disabled={uploading || !selectedImage}
          className="
            mt-5
            flex
            w-full
            items-center
            justify-center
            rounded-xl
            bg-[#c9913a]
            px-5
            py-3
            text-sm
            font-semibold
            text-white
            transition
            hover:bg-[#b18236]
            disabled:cursor-not-allowed
            disabled:opacity-50
            sm:w-auto
          "
        >
          {uploading ? "Uploading..." : "Upload Image"}
        </button>
      </div>

      {/* ================= SLIDER HEADER ================= */}

      <div
        className="
          mt-7
          mb-4
          flex
          items-center
          justify-between
          gap-3
          sm:mt-8
        "
      >
        <h2 className="text-base font-bold text-gray-900 sm:text-lg">
          Slider Images
        </h2>

        <span
          className="
            shrink-0
            rounded-full
            bg-white
            px-3
            py-1
            text-xs
            font-medium
            text-gray-500
            shadow-sm
          "
        >
          {slides.length} {slides.length === 1 ? "Image" : "Images"}
        </span>
      </div>

      {/* ================= SLIDER IMAGES ================= */}

      {slides.length > 0 ? (
        <div
          className="
            grid
            min-w-0
            grid-cols-1
            gap-4
            sm:grid-cols-2
            sm:gap-5
            xl:grid-cols-3
            2xl:grid-cols-4
          "
        >
          {slides.map((slide) => (
            <div
              key={slide._id}
              className="
                min-w-0
                overflow-hidden
                rounded-2xl
                border
                border-gray-100
                bg-white
                shadow-sm
                transition
                hover:shadow-md
              "
            >
              {/* Image */}
              <div
                className="
                  aspect-video
                  w-full
                  overflow-hidden
                  bg-gray-100
                "
              >
                <img
                  src={slide.imageUrl}
                  alt={slide.title || "Slider"}
                  loading="lazy"
                  className="
                    h-full
                    w-full
                    object-cover
                  "
                />
              </div>

              {/* Footer */}
              <div
                className="
                  flex
                  items-center
                  justify-between
                  gap-3
                  p-3
                  sm:p-4
                "
              >
                <div className="min-w-0">
                  <p
                    className="
                      truncate
                      text-sm
                      font-semibold
                      text-gray-800
                    "
                  >
                    {slide.title || "Slider Image"}
                  </p>

                  <p className="mt-0.5 text-xs text-gray-400">
                    Homepage Slider
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleDelete(slide._id)}
                  className="
                    shrink-0
                    rounded-lg
                    bg-red-50
                    px-3
                    py-2
                    text-xs
                    font-semibold
                    text-red-600
                    transition
                    hover:bg-red-100
                    sm:text-sm
                  "
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* ================= EMPTY STATE ================= */

        <div
          className="
            flex
            min-h-[220px]
            flex-col
            items-center
            justify-center
            rounded-2xl
            border
            border-dashed
            border-gray-300
            bg-white
            p-6
            text-center
          "
        >
          <div
            className="
              mb-3
              flex
              h-12
              w-12
              items-center
              justify-center
              rounded-full
              bg-[#c9913a]/10
              text-xl
              text-[#b07d2a]
            "
          >
            🖼
          </div>

          <p className="text-sm font-semibold text-gray-700">
            No slider images
          </p>

          <p className="mt-1 text-xs text-gray-400">
            Upload your first slider image above.
          </p>
        </div>
      )}
    </div>
  );
};

export default SliderManager;