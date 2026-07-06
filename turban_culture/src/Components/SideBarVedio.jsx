import React, { useEffect, useState, useRef } from "react";
import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/api/videos`;

const SideBarVedio = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef(null);

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

  // Auto play visible video
  useEffect(() => {
    const videoElements = document.querySelectorAll(".auto-video");

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
      {
        threshold: 0.6,
      }
    );

    videoElements.forEach((v) => observer.observe(v));

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
          className="
            rounded-xl
            overflow-hidden
            shadow
            bg-white
          "
        >
          <video
            src={item.videoUrl}
            className="
              w-full
              h-[200px]
              sm:h-[220px]
              md:h-[200px]
              object-cover
            "
            muted
            loop
            playsInline
            controls={false}
          />

          <div className="p-3 text-sm font-medium">
            Wedding Video
          </div>
        </div>
      ))}
    </div>
  );
};

export default SideBarVedio;