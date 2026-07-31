import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import './SideBarVideo.css';
const API_URL = `${import.meta.env.VITE_API_URL}/api/videos`;

// Injects Cloudinary transformation params (auto format/quality + resize)
// into a raw Cloudinary video URL coming from the database, if it is one.
const optimizeCloudinaryVideo = (url, width = 400, height = 500) => {
  if (!url || !url.includes("res.cloudinary.com") || !url.includes("/upload/")) {
    return url; // not a Cloudinary URL, leave untouched
  }
const transform = `f_auto,q_auto,w_${width},h_${height},c_limit`;
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
    let timer;

    const fetchVideos = async () => {
      try {
        // ⚡ Fast load - first 5 videos
        const fastRes = await axios.get(`${API_URL}?limit=5`);

        const fastVideos = fastRes.data.videos || [];
        setVideos(fastVideos);
        setLoading(false);

        // 🐢 Background load - all videos
        timer = setTimeout(async () => {
          try {
            const fullRes = await axios.get(API_URL);
            setVideos(fullRes.data.videos || []);
          } catch (err) {
            console.log("Full video load error:", err);
          }
        }, 2000);
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    };

    fetchVideos();

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!videos.length) return;

    // Setup all videos
    videoRefs.current.forEach((video) => {
      if (video) {
        video.muted = true;
        video.loop = true;
        video.playsInline = true;
      }
    });

    // Helper function
   const playBatch = (start, end) => {
  videoRefs.current
    .slice(start, end)
    .filter(Boolean)
    .forEach((video) => {
      video.play().catch(() => {});
    });
};

    // ⚡ First 3 videos immediately
    playBatch(0, 3);

    // 🐢 Next 3 after 2 sec
    const timer1 = setTimeout(() => {
      playBatch(3, 6);
    }, 2000);

    // 🐢 Next 3 after 4 sec
    const timer2 = setTimeout(() => {
      playBatch(6, 9);
    }, 4000);

    // 🐢 All remaining videos after 6 sec
    const timer3 = setTimeout(() => {
      const remainingStart = 9;

      if (videoRefs.current.length > remainingStart) {
        playBatch(remainingStart, videoRefs.current.length);
      }
    }, 6000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [videos]);

  if (loading) {
    return <div className="p-4 text-sm text-gray-500">Loading videos...</div>;
  }
  if (!videos.length) {
    return <div className="p-4 text-sm text-gray-500">No videos available</div>;
  }

  const displayVideos = videos.length > 0
    ? [...videos, ...videos]
    : [];

return (
  <div className="video-wrapper" style={{ height }}>
    <div
      className={`video-track ${isPaused ? "paused" : ""}`}
      style={{ animationDuration: speed }}
      onTouchStart={pause}
      onTouchEnd={resume}
      onMouseDown={pause}
      onMouseUp={resume}
      onMouseLeave={resume}
    >
      {displayVideos.map((item, i) => {
        const originalSrc = item.videoUrl;
        const thumbSrc = optimizeCloudinaryVideo(item.videoUrl, 180, 240);

        return (
          <div
            key={i}
            className="video-card-wrapper"
            style={{ height }}
            onClick={() => setSelectedVideo(originalSrc)}
          >
              {/* Loader */}
              <div className="video-loader">
                <div className="video-spinner" />
              </div>

              {/* Video */}
              <div className="video-card">
                <video
                  ref={(el) => (videoRefs.current[i] = el)}
                  src={thumbSrc}
                  muted
                  loop
                  playsInline
                  preload={i < 3 ? "metadata" : "none"}
                  className="video-el"
                  onLoadedData={(e) => {
                    e.target.classList.add("loaded");
                    e.target.parentElement.previousSibling?.classList.add("hidden");
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

 {selectedVideo && (
  <div
    onClick={() => setSelectedVideo(null)}
    className="fixed inset-0 z-[999999] bg-black/95 flex items-center justify-center p-3 sm:p-4"
  >
    <div
      onClick={(e) => e.stopPropagation()}
      className="relative w-full max-w-[280px] sm:max-w-[340px] md:max-w-[420px] lg:max-w-[520px] xl:max-w-[620px]"
    >
      {/* Close Button */}
      <button
        onClick={() => setSelectedVideo(null)}
        aria-label="Close video"
        className="absolute -top-2 -right-2 sm:-top-3 sm:-right-3 z-20 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white text-black text-xl font-bold flex items-center justify-center shadow-lg"
      >
        ✕
      </button>

      {/* Video */}
      <video
        src={selectedVideo}
        controls
        autoPlay
        playsInline
        className="w-full max-h-[75vh] rounded-2xl bg-black shadow-2xl object-contain"
      />
    </div>
  </div>
)}



    </div>
  );
};

export default SideBarVideo;
