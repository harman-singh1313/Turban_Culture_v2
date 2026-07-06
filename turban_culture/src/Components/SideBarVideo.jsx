import React, { useEffect, useState, useRef } from "react";
import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/api/videos`;

const SideBarVideo = ({
  height = "250px",
  speed = "12s",
}) => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const videoRefs = useRef([]);

  // FETCH
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

  // AUTOPLAY
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

  return (
    <div className="video-wrapper">
      {/* TRACK (NO DOUBLE ARRAY) */}
      <div className="video-track">
        {videos.map((item, i) => (
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

      {/* MODAL */}
      {selectedVideo && (
        <div className="video-modal" onClick={() => setSelectedVideo(null)}>
          <video
            src={selectedVideo}
            controls
            autoPlay
            className="modal-video"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {/* CSS */}
      <style>{`
        .video-wrapper {
          width: 100%;
          height: ${height};
          overflow: hidden;
          padding: 0 12px;
        }

        .video-track {
          display: flex;
          flex-wrap: nowrap;
          gap: 16px;
          width: max-content;
          animation: scrollLeft ${speed} linear infinite;
          will-change: transform;
        }

        @keyframes scrollLeft {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        .video-card {
          flex: 0 0 auto;
          width: 200px;
          height: ${height};
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

        .video-modal {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.92);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
        }

        .modal-video {
          max-width: 95vw;
          max-height: 85vh;
          border-radius: 12px;
        }

        @media (max-width: 768px) {
          .video-card {
            width: 130px;
            height: 180px;
          }
        }
      `}</style>
    </div>
  );
};

export default SideBarVideo;