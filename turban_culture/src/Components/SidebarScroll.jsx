import React, { useState, memo } from "react";
import './SidebarScroll.css';
// Injects Cloudinary transformation params (auto format/quality + resize)
// into a raw Cloudinary URL coming from the database, if it is one.
const optimizeCloudinaryUrl = (url, width = 400, height = 500) => {
  if (!url || !url.includes("res.cloudinary.com") || !url.includes("/upload/")) {
    return url; // not a Cloudinary URL, leave untouched
  }
  const transform = `f_auto,q_auto,w_${width},h_${height},c_fill`;
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
              src={optimizeCloudinaryUrl(img, 180, 240)}
              alt={`gallery-${i}`}
              width="180"
              height="240"
              loading="lazy"
              decoding="async"
              fetchPriority="low"
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
          onClick={() => setSelectedImg(null)}
          className="fixed inset-0 z-[999999] bg-black/95 flex items-center justify-center p-2 md:p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full h-full flex items-center justify-center"
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedImg(null)}
              aria-label="Close image"
              className="absolute top-3 right-3 z-20 w-10 h-10 rounded-full bg-black/70 text-white text-2xl font-bold flex items-center justify-center"
            >
              ✕
            </button>

            {/* Loader */}
            {modalLoading && (
              <div className="absolute z-10">
                <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin" />
              </div>
            )}

            {/* Full Image */}
            <img
              src={selectedImg}
              alt="full view"
              onLoad={() => setModalLoading(false)}
              className={`max-w-full max-h-full object-contain rounded-xl transition-opacity duration-300 ${modalLoading ? "opacity-0" : "opacity-100"
                }`}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(SidebarScroll);
