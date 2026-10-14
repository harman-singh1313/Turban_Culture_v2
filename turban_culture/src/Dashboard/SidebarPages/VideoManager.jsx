import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaTrash,
  FaUpload,
  FaVideo,
} from "react-icons/fa";

const API_URL = `${import.meta.env.VITE_API_URL}/api/videos`;

const VideoManager = () => {
  const [video, setVideo] = useState(null);
  const [poster, setPoster] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("adminToken");

  // ================= FETCH VIDEOS =================
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

  // ================= UPLOAD =================
  const handleUpload = async () => {
    if (!video) {
      alert("Please select a video.");
      return;
    }

    if (!poster) {
      alert("Please select a poster.");
      return;
    }

    const formData = new FormData();

    formData.append("video", video);
    formData.append("poster", poster);

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
      setPoster(null);

      fetchVideos();
    } catch (err) {
      console.log(err);
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  // ================= DELETE =================
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
    <div
      className="
        min-w-0
        p-4
        sm:p-5
        lg:p-6
      "
    >
      {/* ================= PAGE HEADER ================= */}

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
          Video Management
        </h1>

        <p className="mt-1 text-xs text-gray-500 sm:text-sm">
          Upload and manage website videos.
        </p>
      </div>

      {/* ================= UPLOAD CARD ================= */}

      <div
        className="
          mb-6
          w-full
          rounded-2xl
          border
          border-gray-100
          bg-white
          p-4
          shadow-sm
          sm:mb-8
          sm:p-5
          lg:p-6
        "
      >
        {/* Video Input */}
        <div className="mb-5">
          <label
            className="
              mb-2
              block
              text-sm
              font-semibold
              text-gray-800
            "
          >
            Select Video
          </label>

          <input
            type="file"
            accept="video/*"
            onChange={(e) =>
              setVideo(e.target.files?.[0] || null)
            }
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

          {video && (
            <p className="mt-2 truncate text-xs text-gray-500">
              Selected: {video.name}
            </p>
          )}
        </div>

        {/* Poster Input */}
        <div className="mb-5">
          <label
            className="
              mb-2
              block
              text-sm
              font-semibold
              text-gray-800
            "
          >
            Select Poster
          </label>

          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setPoster(e.target.files?.[0] || null)
            }
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

          {poster && (
            <p className="mt-2 truncate text-xs text-gray-500">
              Selected: {poster.name}
            </p>
          )}
        </div>

        {/* Upload Button */}
        <button
          type="button"
          onClick={handleUpload}
          disabled={loading}
          className="
            flex
            w-full
            items-center
            justify-center
            gap-2
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
            disabled:opacity-60
            sm:w-auto
          "
        >
          <FaUpload />

          {loading ? "Uploading..." : "Upload Video"}
        </button>
      </div>

      {/* ================= VIDEO SECTION ================= */}

      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-base font-bold text-gray-900 sm:text-lg">
          Uploaded Videos
        </h2>

        <span
          className="
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
          {videos.length} {videos.length === 1 ? "Video" : "Videos"}
        </span>
      </div>

      {/* ================= VIDEO LIST ================= */}

      {videos.length > 0 ? (
        <div
          className="
            grid
            grid-cols-1
            gap-4
            sm:grid-cols-2
            sm:gap-5
            xl:grid-cols-3
            xl:gap-6
          "
        >
          {videos.map((item) => (
            <div
              key={item._id}
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
              {/* Video */}
              <div
                className="
                  relative
                  aspect-video
                  w-full
                  overflow-hidden
                  bg-black
                "
              >
                <video
                  src={item.videoUrl}
                  poster={item.posterUrl}
                  controls
                  preload="metadata"
                  className="
                    h-full
                    w-full
                    object-cover
                  "
                />
              </div>

              {/* Video Footer */}
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
                <div className="flex min-w-0 items-center gap-2">
                  <div
                    className="
                      flex
                      h-9
                      w-9
                      shrink-0
                      items-center
                      justify-center
                      rounded-full
                      bg-[#c9913a]/10
                      text-[#b07d2a]
                    "
                  >
                    <FaVideo size={15} />
                  </div>

                  <div className="min-w-0">
                    <p
                      className="
                        truncate
                        text-sm
                        font-semibold
                        text-gray-800
                      "
                    >
                      Wedding Video
                    </p>

                    <p className="text-[11px] text-gray-400">
                      Turban Culture
                    </p>
                  </div>
                </div>

                {/* Delete */}
                <button
                  type="button"
                  onClick={() => handleDelete(item._id)}
                  aria-label="Delete video"
                  className="
                    flex
                    h-9
                    w-9
                    shrink-0
                    items-center
                    justify-center
                    rounded-lg
                    bg-red-50
                    text-red-500
                    transition
                    hover:bg-red-100
                    hover:text-red-600
                  "
                >
                  <FaTrash size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
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
              text-[#b07d2a]
            "
          >
            <FaVideo size={20} />
          </div>

          <p className="text-sm font-semibold text-gray-700">
            No videos uploaded
          </p>

          <p className="mt-1 text-xs text-gray-400">
            Upload your first video using the form above.
          </p>
        </div>
      )}
    </div>
  );
};

export default VideoManager;