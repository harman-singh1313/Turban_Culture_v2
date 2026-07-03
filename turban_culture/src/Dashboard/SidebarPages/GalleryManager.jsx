import React, { useState, useEffect } from "react";
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL || "http://3.27.155.171:5000";

const GalleryManager = () => {
  // Selected images before upload
  const [selectedImages, setSelectedImages] = useState([]);

  // Images fetched from database
  const [gallery, setGallery] = useState([]);

  // Loading state
  const [uploading, setUploading] = useState(false);

  // ==========================================
  // Fetch all gallery images from backend
  // ==========================================
  const fetchGallery = async () => {
    try {
     const res = await axios.get(
  `${API_URL}/api/gallery`
);

setGallery(res.data.images || []);
    } catch (error) {
      console.error("Fetch Gallery Error:", error);
    }
  };

  // Load images when page opens
  useEffect(() => {
    fetchGallery();
  }, []);

  // ==========================================
  // Select image from computer
  // ==========================================
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedImages(files);
  };

  // ==========================================
  // Upload image
  // ==========================================
  const handleUpload = async () => {
    if (selectedImages.length === 0) {
      return alert("Please select an image");
    }

    try {
      setUploading(true);

      const token = localStorage.getItem("adminToken");

      const formData = new FormData();

      // Backend currently uses upload.single("image")
      // So upload one image at a time
      formData.append("image", selectedImages[0]);

await axios.post(
  `${API_URL}/api/gallery`,
  formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert("Image uploaded successfully");

      // Clear selected images
      setSelectedImages([]);

      // Refresh gallery
      fetchGallery();
    } catch (error) {
      console.error("Upload Error:", error);
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  // ==========================================
  // Delete image
  // ==========================================
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this image?"
    );

    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("adminToken");

     await axios.delete(
  `${API_URL}/api/gallery/${id}`,
  
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Image deleted successfully");

      // Refresh gallery after delete
      fetchGallery();
    } catch (error) {
      console.error("Delete Error:", error);
      alert("Delete failed");
    }
  };

  return (
    <div className="p-6">

      {/* Page Heading */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">
          Gallery Manager
        </h1>
      </div>

      {/* Upload Section */}
      <div className="bg-white rounded-xl shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">
          Upload New Image
        </h2>

        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="mb-4"
        />

        <button
          onClick={handleUpload}
          disabled={uploading}
          className="bg-black text-white px-5 py-2 rounded-lg"
        >
          {uploading ? "Uploading..." : "Upload Image"}
        </button>
      </div>

      {/* Selected Image Preview */}
      {selectedImages.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">
            Selected Image Preview
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {selectedImages.map((image, index) => (
              <div
                key={index}
                className="border rounded-lg overflow-hidden"
              >
                <img
                  src={URL.createObjectURL(image)}
                  alt="Preview"
                  className="w-full h-52 object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Uploaded Images */}
      <div>
        <h2 className="text-xl font-semibold mb-4">
          Uploaded Images ({gallery.length})
        </h2>

        {gallery.length === 0 ? (
          <div className="border rounded-xl p-8 text-center text-gray-500">
            No images uploaded yet
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

            {gallery.map((img) => (
              <div
                key={img._id}
                className="border rounded-xl overflow-hidden bg-white shadow"
              >
                {/* Uploaded Image */}
                <img
                  src={img.imageUrl}
                  alt="Gallery"
                  className="w-full h-52 object-cover"
                />

                {/* Image Info */}
                <div className="p-3">
                  <p className="text-xs text-gray-500 mb-2 break-all">
                    ID: {img._id}
                  </p>

                  <button
                    onClick={() => handleDelete(img._id)}
                    className="w-full bg-red-500 text-white py-2 rounded-lg"
                  >
                    Delete Image
                  </button>
                </div>
              </div>
            ))}

          </div>
        )}
      </div>
    </div>
  );
};

export default GalleryManager;