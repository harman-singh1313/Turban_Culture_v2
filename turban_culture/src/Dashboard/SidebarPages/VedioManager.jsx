import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaTrash, FaUpload, FaVideo } from "react-icons/fa";

const API_URL = `${import.meta.env.VITE_API_URL}/api/videos`;

const VedioManager = () => {
  const [video, setVideo] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("adminToken");

  // Fetch Videos
  const fetchVideos = async () => {
    try {
      const res = await axios.get(API_URL);
      setVideos(res.data.videos || []);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  // Upload
  const handleUpload = async () => {
    if (!video) {
      alert("Please select a video.");
      return;
    }

    const formData = new FormData();
    formData.append("video", video);

    try {
      setLoading(true);

      await axios.post(API_URL, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Video uploaded successfully");

      setVideo(null);

      fetchVideos();
    } catch (err) {
      console.log(err);
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  // Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this video?")) return;

    try {
      await axios.delete(`${API_URL}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchVideos();
    } catch (err) {
      console.log(err);
      alert("Delete failed");
    }
  };

  return (
    <div className="p-6">

      <h1 className="text-3xl font-bold mb-6">
        Video Management
      </h1>

      {/* Upload Card */}

      <div className="bg-white rounded-xl shadow p-6 mb-8">

        <label className="font-semibold block mb-3">
          Select Video
        </label>

        <input
          type="file"
          accept="video/*"
          onChange={(e) => setVideo(e.target.files[0])}
          className="mb-4"
        />

        <button
          onClick={handleUpload}
          disabled={loading}
          className="bg-black text-white px-6 py-2 rounded-lg flex items-center gap-2"
        >
          <FaUpload />

          {loading ? "Uploading..." : "Upload Video"}
        </button>

      </div>

      {/* Video List */}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

        {videos.map((item) => (

          <div
            key={item._id}
            className="bg-white rounded-xl shadow overflow-hidden"
          >

            <video
              src={item.videoUrl}
              controls
              className="w-full h-64 object-cover"
            />

            <div className="p-4 flex justify-between items-center">

              <div className="flex items-center gap-2">

                <FaVideo />

                <span>Wedding Video</span>

              </div>

              <button
                onClick={() => handleDelete(item._id)}
                className="text-red-600"
              >
                <FaTrash size={20} />
              </button>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
};

export default VedioManager;