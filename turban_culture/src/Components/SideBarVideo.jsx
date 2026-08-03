import React, { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import axios from "axios";
import "./SideBarVideo.css";

const API_URL = `${import.meta.env.VITE_API_URL}/api/videos`;

const optimizeCloudinaryVideo = (url, width = 400, height = 500) => {
  if (!url || !url.includes("res.cloudinary.com") || !url.includes("/upload/")) {
    return url;
  }

  const transform = `f_auto,q_auto,w_${width},h_${height},c_limit`;

  return url.replace("/upload/", `/upload/${transform}/`);
};

const SideBarVideo = ({ height = "250px", speed = "12s" }) => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);

  const videoRefs = useRef([]);

  const pause = () => setIsPaused(true);
  const resume = () => setIsPaused(false);

  // Lock background scroll
  useEffect(() => {
    if (selectedVideo) {
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none";
      setIsPaused(true);
    } else {
      document.body.style.overflow = "auto";
      document.body.style.touchAction = "auto";
      setIsPaused(false);
    }

    return () => {
      document.body.style.overflow = "auto";
      document.body.style.touchAction = "auto";
    };
  }, [selectedVideo]);

  // Pause sidebar videos when modal open
  useEffect(() => {
    videoRefs.current.forEach((video) => {
      if (!video) return;

      if (selectedVideo) {
        video.pause();
      } else {
        video.play().catch(() => {});
      }
    });
  }, [selectedVideo]);

  // Fetch videos
  useEffect(() => {
    let timer;

    const fetchVideos = async () => {
      try {
        const fastRes = await axios.get(`${API_URL}?limit=5`);

        setVideos(fastRes.data.videos || []);
        setLoading(false);

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

  // Auto play videos
  useEffect(() => {
    if (!videos.length) return;

    videoRefs.current.forEach((video) => {
      if (video) {
        video.muted = true;
        video.loop = true;
        video.playsInline = true;
      }
    });

    const playBatch = (start, end) => {
      videoRefs.current
        .slice(start, end)
        .filter(Boolean)
        .forEach((video) => {
          video.play().catch(() => {});
        });
    };

    playBatch(0, 3);

    const timer1 = setTimeout(() => playBatch(3, 6), 2000);
    const timer2 = setTimeout(() => playBatch(6, 9), 4000);

    const timer3 = setTimeout(() => {
      if (videoRefs.current.length > 9) {
        playBatch(9, videoRefs.current.length);
      }
    }, 6000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [videos]);

  const openModal = (src) => {
    setSelectedVideo(src);
    setModalLoading(true);
  };

  const closeModal = () => {
    setSelectedVideo(null);
    setModalLoading(false);
  };

  if (loading) {
    return <div className="p-4 text-sm text-gray-500">Loading videos...</div>;
  }

  if (!videos.length) {
    return <div className="p-4 text-sm text-gray-500">No videos available</div>;
  }

  const displayVideos = [...videos, ...videos];

  return (
    <div className="video-wrapper" style={{ height }}>
      <div
        className={`video-track ${isPaused || selectedVideo ? "paused" : ""}`}
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
              onClick={() => openModal(originalSrc)}
            >
              <div className="video-loader">
                <div className="video-spinner" />
              </div>

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

      {selectedVideo &&
        createPortal(
          <div onClick={closeModal} className="video-modal-overlay">
            <div className="video-modal-inner" onClick={(e) => e.stopPropagation()}>
              <button onClick={closeModal} className="close-btn">
                ✕
              </button>

              {modalLoading && (
                <div className="modal-spinner-wrapper">
                  <div className="video-spinner" />
                </div>
              )}

              <video
                key={selectedVideo}
                src={selectedVideo}
                controls
                controlsList="nodownload"
                disablePictureInPicture
                autoPlay
                playsInline
                onLoadedData={() => setModalLoading(false)}
                className={`modal-video-el ${modalLoading ? "opacity-0" : "opacity-100"}`}
              />
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};

export default SideBarVideo;
