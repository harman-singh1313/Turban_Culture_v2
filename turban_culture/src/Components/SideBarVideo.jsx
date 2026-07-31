import React, { useEffect, useState, useRef } from "react";
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

  const videoRefs = useRef([]);

  const pause = () => setIsPaused(true);
  const resume = () => setIsPaused(false);


  // Lock background scroll
  useEffect(() => {
    document.body.style.overflow = selectedVideo ? "hidden" : "auto";

    return () => {
      document.body.style.overflow = "auto";
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



  if (loading) {
    return <div className="p-4 text-sm text-gray-500">
      Loading videos...
    </div>;
  }


  if (!videos.length) {
    return <div className="p-4 text-sm text-gray-500">
      No videos available
    </div>;
  }



  const displayVideos = [...videos, ...videos];


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

              <div className="video-loader">
                <div className="video-spinner" />
              </div>


              <div className="video-card">

                <video
                  ref={(el) => videoRefs.current[i] = el}
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
            className="relative w-full max-w-[280px] sm:max-w-[340px] md:max-w-[420px] lg:max-w-[520px]"
          >

            <button
              onClick={() => setSelectedVideo(null)}
              className="absolute -top-2 -right-2 z-20 w-10 h-10 rounded-full bg-white text-black text-xl font-bold flex items-center justify-center shadow-lg"
            >
              ✕
            </button>


            <video
              src={selectedVideo}
              controls
              autoPlay
              muted
              playsInline
              className="w-full max-h-[80vh] rounded-2xl bg-black shadow-2xl object-contain"
            />

          </div>

        </div>
      )}

    </div>
  );
};

export default SideBarVideo;