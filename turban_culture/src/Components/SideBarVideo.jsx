import React, { useEffect, useState, useRef } from "react";
import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/api/videos`;

const SideBarVideo = ({
  height = "250px",
  speed = "12s",
  direction = "left",
}) => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const videoRefs = useRef([]);

  // FETCH VIDEOS
  useEffect(() => {
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

    fetchVideos();
  }, []);

  // FORCE AUTOPLAY ALL VIDEOS
  useEffect(() => {
    if (!videos.length) return;

    const timer = setTimeout(() => {
      videoRefs.current.forEach((video) => {
        if (video) {
          video.muted = true;
          video.loop = true;
          video.playsInline = true;

          video.play().catch(() => {});
        }
      });
    }, 300);

    return () => clearTimeout(timer);
  }, [videos]);

  if (loading) {
    return <div className="p-4 text-sm text-gray-500">Loading videos...</div>;
  }

  // ✅ ONLY DOUBLE (smooth infinite)
  const allVideos = [...videos, ...videos];
  const className = `video-scroll-${direction}`;

  return (
    <div
      style={{
        width: "100%",
        height,
        overflow: "hidden",
        padding: "0 12px",
      }}
    >
      {/* ================= CSS ================= */}
      <style>{`
        @keyframes videoScrollLeft {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        @keyframes videoScrollRight {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }

        .${className} {
          display: flex;
          width: max-content;
          will-change: transform;
          backface-visibility: hidden;
          transform: translateZ(0);

          animation: ${
            direction === "right"
              ? "videoScrollRight"
              : "videoScrollLeft"
          } ${speed} linear infinite;
        }

        .video-card {
          flex: 0 0 auto;
          width: 200px;
          height: ${height};
          margin-right: 16px;
          border-radius: 14px;
          overflow: hidden;
          background: black;
          cursor: pointer;
        }

        .video-card video {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        @media (max-width: 768px) {
          .video-card {
            width: 130px;
            height: 180px;
            margin-right: 12px;
          }
        }
      `}</style>

      {/* ================= SCROLL TRACK ================= */}
      <div className={className}>
        {allVideos.map((item, i) => (
          <div
            key={i}
            className="video-card"
            onClick={() => setSelectedVideo(item.videoUrl)}
          >
            <video
              ref={(el) => (videoRefs.current[i] = el)}
              src={item.videoUrl}
              muted
              loop
              playsInline
              preload="auto"
            />
          </div>
        ))}
      </div>

      {/* ================= FULLSCREEN MODAL ================= */}
      {selectedVideo && (
        <div
          onClick={() => setSelectedVideo(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.92)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: "20px",
          }}
        >
          <video
            src={selectedVideo}
            controls
            autoPlay
            muted
            style={{
              maxWidth: "95vw",
              maxHeight: "85vh",
              borderRadius: "14px",
            }}
            onClick={(e) => e.stopPropagation()}
          />

          {/* CLOSE BUTTON */}
          <button
            onClick={() => setSelectedVideo(null)}
            style={{
              position: "absolute",
              top: 20,
              right: 20,
              width: 40,
              height: 40,
              borderRadius: "50%",
              border: "none",
              cursor: "pointer",
              fontSize: 18,
              background: "rgba(255,255,255,0.2)",
              color: "#fff",
            }}
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
};

export default SideBarVideo;