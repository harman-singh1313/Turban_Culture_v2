import React, { useEffect, useState, useRef } from "react";
import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/api/videos`;

const SideBarVideo = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeVideo, setActiveVideo] = useState(null); // 👈 NEW
  const containerRef = useRef(null);

  // FETCH VIDEOS
  const fetchVideos = async () => {
    try {
      const res = await axios.get(API_URL);
      setVideos(res.data.videos || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  // AUTO PLAY
  useEffect(() => {
    if (!videos.length) return;

    const videosList = containerRef.current?.querySelectorAll("video");
    if (!videosList) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target;

          if (entry.isIntersecting) {
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.6 }
    );

    videosList.forEach((video) => observer.observe(video));

    return () => observer.disconnect();
  }, [videos]);

  if (loading) {
    return (
      <div className="p-4 text-sm text-gray-500">
        Loading videos...
      </div>
    );
  }

  return (
    <>
      {/* ================= SIDEBAR ================= */}
      <div
        ref={containerRef}
        className="
          w-full
          md:w-[350px]
          h-auto
          md:h-[85vh]
          overflow-y-auto
          space-y-4
          p-2 md:p-3
          bg-gray-50
          rounded-xl
        "
      >
        {videos.map((item) => (
          <div
            key={item._id}
            className="rounded-xl overflow-hidden shadow bg-white"
          >
            <video
              src={item.videoUrl}
              className="w-full h-[200px] sm:h-[220px] object-cover"
              muted
              loop
              playsInline
              onClick={() => setActiveVideo(item.videoUrl)} // 👈 CLICK TO OPEN
            />

            <div className="p-3 text-sm font-medium">
              Wedding Video
            </div>
          </div>
        ))}
      </div>

      {/* ================= FULL SCREEN MODAL ================= */}
      {activeVideo && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
          onClick={() => setActiveVideo(null)}
        >
          <video
            src={activeVideo}
            controls
            autoPlay
            className="w-full max-w-3xl max-h-[80vh]"
          />
        </div>
      )}
    </>
  );
};

export default SideBarVideo;