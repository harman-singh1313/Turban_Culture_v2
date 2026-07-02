import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const SliderManager = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [slides, setSlides] = useState([]);
  const [uploading, setUploading] = useState(false);

  // GET SLIDES
  const fetchSlides = async () => {
    const res = await axios.get(`${API_URL}/api/slider`);
    setSlides(res.data);
  };

  useEffect(() => {
    fetchSlides();
  }, []);

  // SELECT IMAGE
  const handleChange = (e) => {
    setSelectedImage(e.target.files[0]);
  };

  // UPLOAD TO CLOUDINARY
  const handleUpload = async () => {
    if (!selectedImage) return alert("Select image first");

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

      alert("Uploaded");

      setSelectedImage(null);
      fetchSlides();
    } catch (err) {
      console.log(err);
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  // DELETE
  const handleDelete = async (id) => {
    await axios.delete(`${API_URL}/api/slider/${id}`);
    fetchSlides();
  };

  return (
    <div className="p-6">
      <h1>Slider Manager</h1>

      {/* Upload */}
      <input type="file" onChange={handleChange} />

      <button onClick={handleUpload} disabled={uploading}>
        {uploading ? "Uploading..." : "Upload"}
      </button>

      {/* LIST */}
      <div className="grid grid-cols-4 gap-4 mt-6">
        {slides.map((s) => (
          <div key={s._id}>
            <img src={s.imageUrl} className="h-40 w-full object-cover" />
            <button onClick={() => handleDelete(s._id)}>
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SliderManager;