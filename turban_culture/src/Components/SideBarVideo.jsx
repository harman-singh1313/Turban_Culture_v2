import React, { useEffect, useState, useRef } from "react";
import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/api/videos`;

// Injects Cloudinary transformation params (auto format/quality + resize)
// into a raw Cloudinary video URL coming from the database, if it is one.
const optimizeCloudinaryVideo = (url, width = 400, height = 500) => {
  if (!url || !url.includes("res.cloudinary.com") || !url.includes("/upload/")) {
    return url; // not a Cloudinary URL, leave untouched
  }
  const transform = `f_auto,q_auto,w_${width},h_${height},c_fill`;
  return url.replace("/upload/", `/upload/${transform}/`);
};

const SideBarVideo = ({ height = "250px", speed = "12s" }) => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const videoRefs = useRef([]);

  const pause = () => setIsPaused(true);
  const resume = () => setIsPaused(false);

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
      <div
        className={`video-track ${isPaused ? "paused" : ""}`}
        onTouchStart={pause}
        onTouchEnd={resume}
        onMouseDown={pause}
        onMouseUp={resume}
        onMouseLeave={resume}
      >
        {[...videos, ...videos].map((item, i) => {
          const src = optimizeCloudinaryVideo(item.videoUrl);
          return (
            <div
              key={i}
              className="video-card"
              onClick={() => setSelectedVideo(src)}
            >
              <video
                ref={(el) => (videoRefs.current[i] = el)}
                src={src}
                muted
                loop
                playsInline
                preload="metadata"
                className="video-el"
                onLoadedData={(e) => e.target.classList.add("loaded")}
              />
            </div>
          );
        })}
      </div>

      {selectedVideo && (
        <div className="video-modal" onClick={() => setSelectedVideo(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <button
              className="close-btn"
              onClick={() => setSelectedVideo(null)}
            >
              ✖
            </button>

            <video
              src={selectedVideo}
              controls
              autoPlay
              className="modal-video"
            />
          </div>
        </div>
      )}

      <style>{`

        .video-wrapper {
          width: 100%;
          height: ${height};
          overflow: hidden;
          padding: 0 12px;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
        }

        .video-wrapper::-webkit-scrollbar {
          display: none;
        }

        @media (max-width: 768px) {
          .video-wrapper {
            overflow-x: auto !important;
            overflow-y: hidden;
          }
        }


        .video-track {
          display: flex;
          flex-wrap: nowrap;
          gap: 16px;
          width: max-content;
          animation: scrollLeft ${speed} linear infinite;
          will-change: transform;
        }

        .video-track.paused {
          animation-play-state: paused !important;
        }

        .video-track:hover {
          animation-play-state: paused;
        }


        @keyframes scrollLeft {

          0% {
            transform: translateX(0);
          }

          100% {
            transform: translateX(-50%);
          }

        }


        .video-card {

          flex: 0 0 auto;
          width: 200px;
          height: ${height};
          border-radius: 14px;
          overflow: hidden;
          background: #1e1e1e;
          cursor: pointer;

        }


        .video-el {

          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0;
          transition: opacity 0.35s ease;

        }

        .video-el.loaded {
          opacity: 1;
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



        .modal-box {

          position: relative;
          max-width: 95vw;
          max-height: 85vh;

        }



        .modal-video {

          width: 100%;
          height: auto;
          border-radius: 12px;

        }



        .close-btn {

          position: absolute;
          top: -12px;
          right: -12px;

          background: white;
          color: black;

          border: none;

          width: 34px;
          height: 34px;

          border-radius: 50%;

          font-size: 18px;

          cursor: pointer;

          display: flex;
          align-items: center;
          justify-content: center;

          z-index: 10;

        }



        @media(max-width:768px){

          .video-card{

            width:130px;
            height:180px;

          }


          .close-btn{

            top:10px;
            right:10px;

          }

        }

      `}</style>

    </div>
  );
};

export default SideBarVideo;
