import React, { useState, memo } from "react";

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
  const allImages = [...images, ...images].map((img) =>
    optimizeCloudinaryUrl(img)
  );

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
        width: "100%",
        height: height || "250px",
        overflow: "hidden",
        padding: "0 12px",
      }}
    >
      <style>{`

        .scroll-outer {
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
        }

        .scroll-outer::-webkit-scrollbar {
          display: none;
        }

        @media (max-width: 768px) {
          .scroll-outer {
            overflow-x: auto !important;
            overflow-y: hidden;
          }
        }

        @keyframes spin {
          to {
            transform: translate(-50%, -50%) rotate(360deg);
          }
        }

        @keyframes scrollLeft {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        @keyframes scrollRight {
          0% {
            transform: translateX(-50%);
          }
          100% {
            transform: translateX(0);
          }
        }

        .${className} {
          display: flex;
          align-items: center;
          width: max-content;
          will-change: transform;
          backface-visibility: hidden;
          transform: translateZ(0);

          animation: ${
            direction === "right" ? "scrollRight" : "scrollLeft"
          } ${speed || "30s"} linear infinite;
        }

        .${className}:hover {
          animation-play-state: paused;
        }

        .${className}.paused {
          animation-play-state: paused !important;
        }

        .gallery-scroll-image {
          width: 200px;
          height: ${height || "250px"};
          object-fit: cover;
          border-radius: 14px;
          flex-shrink: 0;
          cursor: pointer;
          margin-right: 22px;
          background: #1e1e1e;
          opacity: 0;
          transition: transform 0.3s ease, opacity 0.35s ease;
        }

        .gallery-scroll-image.loaded {
          opacity: 1;
        }

        .gallery-scroll-image:hover {
          transform: scale(1.04);
        }

        /* Mobile */
        @media (max-width: 768px) {
          .gallery-scroll-image {
            width: 120px;
            height: 180px;
            margin-right: 14px;
            border-radius: 10px;
          }
        }

      `}</style>

      {/* Scroll Track */}
      <div
        className={`${className} ${isPaused ? "paused" : ""}`}
        onTouchStart={pause}
        onTouchEnd={resume}
        onMouseDown={pause}
        onMouseUp={resume}
        onMouseLeave={resume}
      >
        {allImages.map((img, i) => (
          <img
            key={i}
            src={img}
            alt={`pic-${i}`}
            loading="lazy"
            decoding="async"
            className="gallery-scroll-image"
            ref={(el) => {
              if (el && el.complete) el.classList.add("loaded");
            }}
            onLoad={(e) => e.target.classList.add("loaded")}
            onClick={() => {
              setSelectedImg(img);
              setModalLoading(true);
            }}
          />
        ))}
      </div>

      {/* Fullscreen Modal */}
      {selectedImg && (
        <div
          onClick={() => setSelectedImg(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.9)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "relative",
              display: "inline-block",
              maxWidth: "92vw",
              maxHeight: "90vh",
            }}
          >
            <button
              onClick={() => setSelectedImg(null)}
              aria-label="Close image"
              style={{
                position: "absolute",
                top: "12px",
                right: "12px",
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                border: "none",
                background: "rgba(0,0,0,0.65)",
                color: "#fff",
                fontSize: "24px",
                fontWeight: "bold",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 10,
              }}
            >
              ✕
            </button>

            {modalLoading && (
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: "48px",
                  height: "48px",
                  border: "4px solid rgba(255,255,255,0.25)",
                  borderTopColor: "#fff",
                  borderRadius: "50%",
                  animation: "spin 0.8s linear infinite",
                  zIndex: 5,
                }}
              />
            )}

            <img
              src={selectedImg}
              alt="full view"
              onLoad={() => setModalLoading(false)}
              style={{
                display: "block",
                maxWidth: "92vw",
                maxHeight: "90vh",
                objectFit: "contain",
                borderRadius: "14px",
                opacity: modalLoading ? 0 : 1,
                transition: "opacity 0.25s ease",
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(SidebarScroll);
