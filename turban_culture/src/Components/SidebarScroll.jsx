import React, { useState, useEffect, memo } from "react";
import { createPortal } from "react-dom";
import './SidebarScroll.css';

const optimizeCloudinaryUrl = (url, width = 400, height = 500) => {
  if (!url || !url.includes("res.cloudinary.com") || !url.includes("/upload/")) {
    return url; // not a Cloudinary URL, leave untouched
  }
  const transform = `f_auto,q_auto,w_${width},h_${height},c_limit`;
  return url.replace("/upload/", `/upload/${transform}/`);
};

const SidebarScroll = ({ images, height, speed, direction }) => {
  // Duplicate for seamless infinite loop
  const allImages = images.length > 0
    ? [...images, ...images]
    : [];
  const className = `scroll-track-${direction}`;

  const [selectedImg, setSelectedImg] = useState(null);
  const [modalLoading, setModalLoading] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (selectedImg) {
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
  }, [selectedImg]);

  const pause = () => setIsPaused(true);
  const resume = () => setIsPaused(false);

  // Safety net: mobile browsers fire "ghost" mouse events after touch,
  // and once the modal (portal) covers the track, mouseup/mouseleave
  // never reach it — leaving isPaused stuck true forever.
  useEffect(() => {
    const forceResume = () => resume();

    window.addEventListener("touchend", forceResume);
    window.addEventListener("touchcancel", forceResume);
    window.addEventListener("mouseup", forceResume);

    return () => {
      window.removeEventListener("touchend", forceResume);
      window.removeEventListener("touchcancel", forceResume);
      window.removeEventListener("mouseup", forceResume);
    };
  }, []);

  const openModal = (img) => {
    setSelectedImg(img);
    setModalLoading(true);
  };

  const closeModal = () => setSelectedImg(null);

  return (
    <div
      className="scroll-outer"
      style={{
        height: height || "250px",
        padding: "0 12px",
      }}
    >

      {/* Scroll Track */}
      <div
        className={`${className} ${isPaused || selectedImg ? "paused" : ""}`}
        style={{ animationDuration: speed || "30s" }}
        onTouchStart={pause}
        onTouchEnd={resume}
        onMouseDown={pause}
        onMouseUp={resume}
        onMouseLeave={resume}
      >
        {allImages.map((img, i) => (
          <div
            key={i}
            className="gallery-image-wrapper"
          >
            {/* Loader */}
            <div className="gallery-image-loader">
              <div className="loader-spinner" />
            </div>

            {/* Image */}
            <img
              src={optimizeCloudinaryUrl(img, 220, 320)}
              alt={`gallery-${i}`}
              loading="lazy"
              decoding="async"
              className="gallery-scroll-image"
              ref={(el) => {
                if (el && el.complete) {
                  el.classList.add("loaded");
                  el.previousSibling?.classList.add("hidden");
                }
              }}
              onLoad={(e) => {
                e.target.classList.add("loaded");
                e.target.previousSibling?.classList.add("hidden");
              }}
              onClick={() => openModal(img)}
            />
          </div>
        ))}
      </div>

      {/* Fullscreen Modal — rendered via portal so it always sits above navbar/widgets */}
      {selectedImg &&
        createPortal(
          <div
            className="image-modal-overlay"
            onClick={closeModal}
          >
            <div
              className="image-modal-inner"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={closeModal}
                aria-label="Close image"
                className="image-close-btn"
              >
                ✕
              </button>

              {/* Loader */}
              {modalLoading && (
                <div className="modal-spinner-wrapper">
                  <div className="loader-spinner" />
                </div>
              )}

              {/* Full Image */}
              <img
                key={selectedImg}
                src={selectedImg}
                alt="full view"
                draggable={false}
                onLoad={() => setModalLoading(false)}
                className={`image-modal-el ${modalLoading ? "opacity-0" : "opacity-100"}`}
              />
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};

export default memo(SidebarScroll);
