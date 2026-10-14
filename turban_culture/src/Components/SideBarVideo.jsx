import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/api/videos`;

const SideBarVideo = ({ height = "250px" }) => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState(null);

  // Lock background scroll when modal open
  useEffect(() => {
    if (selectedVideo) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [selectedVideo]);

  // Fetch Videos
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await axios.get(API_URL);
        setVideos(res.data.videos || []);
      } catch (err) {
        console.log("Video load error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  // Open Modal
  const openModal = (videoUrl, posterUrl) => {
    setSelectedVideo({
      videoUrl,
      posterUrl,
    });
  };

  // Close Modal
  const closeModal = () => {
    setSelectedVideo(null);
  };

  if (loading) {
    return (
      <div className="p-4 text-sm text-gray-500">
        Loading videos...
      </div>
    );
  }

  if (!videos.length) {
    return (
      <div className="p-4 text-sm text-gray-500">
        No videos available
      </div>
    );
  }

  return (
    <>
      {/* ================= VIDEO SCROLLER ================= */}

      <div
        className="
          w-full
          overflow-x-auto
          overflow-y-hidden
          px-3
          pb-3
          scroll-smooth
          touch-pan-x
        "
      >
<div className="flex w-max mx-auto flex-nowrap gap-3 md:gap-4">
  {videos.map((item) => (
    <div
      key={item._id}
      onClick={() =>
        openModal(item.videoUrl, item.posterUrl)
      }
      style={{ height }}
      className="
        relative
        w-[130px]
        md:w-[170px]
        lg:w-[200px]
        shrink-0
        cursor-pointer
        overflow-hidden
        rounded-xl
        bg-neutral-900
      "
    >
      {/* Poster */}
      <img
        src={item.posterUrl}
        alt="Video poster"
        loading="lazy"
        draggable="false"
        className="
          h-full
          w-full
          object-cover
          select-none
        "
      />

      {/* Play Button */}
      <div
        className="
          pointer-events-none
          absolute
          inset-0
          flex
          items-center
          justify-center
        "
      >
        <div
          className="
            flex
            h-11
            w-11
            items-center
            justify-center
            rounded-full
            bg-black/60
            text-lg
            text-white
            shadow-lg
            md:h-12
            md:w-12
          "
        >
          ▶
        </div>
      </div>
    </div>
  ))}
</div>
      </div>

      {/* ================= VIDEO MODAL ================= */}

      {selectedVideo &&
        createPortal(
          <div
            onClick={closeModal}
            className="
              fixed
              inset-0
              z-[99999]
              flex
              items-center
              justify-center
              bg-black/95
              p-3
              md:p-6
            "
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="
                relative
                flex
                h-full
                w-full
                items-center
                justify-center
              "
            >
              {/* Close Button */}

              <button
                type="button"
                onClick={closeModal}
                className="
                  absolute
                  right-2
                  top-2
                  z-20
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-full
                  bg-white
                  text-xl
                  font-bold
                  text-black
                  shadow-lg
                  md:right-5
                  md:top-5
                "
              >
                ✕
              </button>

              {/* Video */}

              <video
                src={selectedVideo.videoUrl}
                poster={selectedVideo.posterUrl || ""}
                controls
                controlsList="nodownload"
                disablePictureInPicture
                playsInline
                preload="metadata"
                className="
                  max-h-[75dvh]
                  max-w-[90vw]
                  rounded-2xl
                  object-contain
                  shadow-2xl
                  sm:max-w-[400px]
                  md:max-h-[80vh]
                  lg:max-w-[450px]
                "
              />
            </div>
          </div>,
          document.body
        )}
    </>
  );
};

export default SideBarVideo;