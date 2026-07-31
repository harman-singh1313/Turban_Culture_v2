import React, { useState, memo } from "react";
import './SidebarScroll.css';
// Injects Cloudinary transformation params (auto format/quality + resize)
// into a raw Cloudinary URL coming from the database, if it is one.
const optimizeCloudinaryUrl = (url, width = 400, height = 500) => {
  if (!url || !url.includes("res.cloudinary.com") || !url.includes("/upload/")) {
    return url; // not a Cloudinary URL, leave untouched
  }
const transform = `f_auto,q_auto,w_${width},h_${height},c_limit`;
  return url.replace("/upload/", `/upload/${transform}/`);
};

const SidebarScroll = ({ images, height, speed, direction }) => {
  // Duplicate for seamless infinite loop, and optimize Cloudinary URLs
  // Keep original URLs
// Duplicate for seamless infinite loop
const allImages = images.length > 0
  ? [...images, ...images]
  : [];
  const className = `scroll-track-${direction}`;

  const [selectedImg, setSelectedImg] = useState(null);
  const [modalLoading, setModalLoading] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  const pause = () => setIsPaused(true);
  const resume = () => setIsPaused(false);

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
        className={`${className} ${isPaused ? "paused" : ""}`}
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
  className="gallery-scroll-image w-full h-auto object-contain"
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
  onClick={() => {
    setSelectedImg(img);
    setModalLoading(true);
  }}
/>
          </div>
        ))}
      </div>

      {/* Fullscreen Modal */}
{selectedImg && (
  <div
    className="fixed top-0 left-0 right-0 bottom-0 z-[9999999] bg-black/95 flex items-center justify-center"
    onClick={() => setSelectedImg(null)}
  >
    <div
      className="relative w-full h-full flex items-center justify-center p-4"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Close Button */}
      <button
        onClick={() => setSelectedImg(null)}
        aria-label="Close image"
        className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-white text-black text-2xl font-bold flex items-center justify-center shadow-lg"
      >
        ✕
      </button>

      {/* Loader */}
      {modalLoading && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="w-10 h-10 border-4 border-white/30 border-t-white rounded-full animate-spin" />
        </div>
      )}

      {/* Full Image */}
      <img
        src={selectedImg}
        alt="full view"
        onLoad={() => setModalLoading(false)}
        className={`max-w-[92vw] max-h-[85vh] object-contain rounded-2xl shadow-2xl transition-opacity duration-300 ${
          modalLoading ? "opacity-0" : "opacity-100"
        }`}
      />
    </div>
  </div>
)}
    </div>
  );
};

export default memo(SidebarScroll);
