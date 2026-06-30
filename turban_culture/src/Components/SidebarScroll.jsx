import React, { useState } from "react";

const SidebarScroll = ({ images, height, speed, direction }) => {

  // Triple duplicate for smoother infinite loop
  const allImages = [...images, ...images, ...images];

  const className = `scroll-track-${direction}`;

  const [selectedImg, setSelectedImg] = useState(null);

  return (
    <div
      style={{
        width: "100%",
        height: height || "250px",
        overflow: "hidden",
        padding: "0 12px",
      }}
    >
      <style>{`

        @keyframes scrollLeft {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.333%);
          }
        }

        @keyframes scrollRight {
          0% {
            transform: translateX(-33.333%);
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

        .gallery-scroll-image {
          width: 200px;
          height: ${height || "250px"};
          object-fit: cover;
          border-radius: 14px;
          flex-shrink: 0;
          cursor: pointer;
          margin-right: 22px;
          transition: transform 0.3s ease;
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
      <div className={className}>
        {allImages.map((img, i) => (
          <img
            key={i}
            src={img}
            alt={`pic-${i}`}
            className="gallery-scroll-image"
            onClick={() => setSelectedImg(img)}
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
          <button
            onClick={() => setSelectedImg(null)}
            style={{
              position: "absolute",
              top: 20,
              right: 24,
              background: "rgba(255,255,255,0.15)",
              border: "1px solid rgba(255,255,255,0.4)",
              color: "#fff",
              fontSize: 22,
              width: 42,
              height: 42,
              borderRadius: "50%",
              cursor: "pointer",
            }}
          >
            ✕
          </button>

          <img
            src={selectedImg}
            alt="full view"
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: "92vw",
              maxHeight: "90vh",
              borderRadius: "14px",
              objectFit: "contain",
            }}
          />
        </div>
      )}
    </div>
  );
};

export default SidebarScroll;