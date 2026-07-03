import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

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
    const file = e.target.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image.");
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
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Slider Manager</h1>

      {/* Upload Section */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleChange}
      />

      {selectedImage && (
        <div className="mt-4">
          <img
            src={URL.createObjectURL(selectedImage)}
            alt="Preview"
            className="w-60 rounded shadow"
          />
        </div>
      )}

      <button
        onClick={handleUpload}
        disabled={uploading || !selectedImage}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
      >
        {uploading ? "Uploading..." : "Upload"}
      </button>

      {/* Slider Images */}
      <div className="grid grid-cols-4 gap-4 mt-8">
        {slides.map((slide) => (
          <div key={slide._id} className="border rounded p-2 shadow">
            <img
              src={slide.imageUrl}
              alt={slide.title || "Slider"}
              className="h-40 w-full object-cover rounded"
            />

            <button
              onClick={() => handleDelete(slide._id)}
              className="mt-2 w-full bg-red-600 text-white py-2 rounded"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SliderManager;