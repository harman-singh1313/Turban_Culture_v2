import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

/**
 * Card-style carousel slider (poster + rating + title), backed by the same
 * /slider API as before. Extra fields (rating, logoUrl, subtitle) are
 * optional — if your backend doesn't send them yet, the card just hides
 * that piece, so nothing breaks.
 *
 * Expected slide shape (only imageUrl + title are required):
 * {
 *   _id: string,
 *   imageUrl: string,
 *   title: string,
 *   rating?: number | string,   // e.g. 7.8
 *   logoUrl?: string,           // small network/provider badge, top-left
 *   subtitle?: string           // e.g. "2020–2023 · 3 Seasons"
 * }
 */

const Slider = () => {
  const [slides, setSlides] = useState([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const timerRef = useRef(null);

  // ================= FETCH SLIDES =================
  useEffect(() => {
    const fetchSlides = async () => {
      try {
        setLoading(true);

        const res = await axios.get(`${API_URL}/slider`);

        // Backend might return a raw array, or wrap it like
        // { data: [...] } / { slides: [...] } / { result: [...] }.
        // Handle all of those so this doesn't break either way.
        const raw = res.data;
        const list = Array.isArray(raw)
          ? raw
          : Array.isArray(raw?.data)
          ? raw.data
          : Array.isArray(raw?.slides)
          ? raw.slides
          : Array.isArray(raw?.result)
          ? raw.result
          : [];

        if (list.length === 0 && !Array.isArray(raw)) {
          console.warn(
            "Slider: couldn't find an array in the response, got:",
            raw
          );
        }

        setSlides(list);

        // Preload images
        list.forEach((slide) => {
          const img = new Image();
          img.src = slide.imageUrl;
        });
      } catch (err) {
        console.error("Slider fetch error:", err);
        setError("Unable to load slider.");
      } finally {
        setLoading(false);
      }
    };

    fetchSlides();
  }, []);

  // ================= RESET CURRENT INDEX =================
  useEffect(() => {
    if (current >= slides.length) {
      setCurrent(0);
    }
  }, [slides, current]);

  // ================= AUTO SLIDE =================
  useEffect(() => {
    if (slides.length <= 1) return;

    timerRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 3500);

    return () => clearInterval(timerRef.current);
  }, [slides]);

  const goTo = (index) => {
    clearInterval(timerRef.current);
    setCurrent(((index % slides.length) + slides.length) % slides.length);
  };

  const goPrev = () => goTo(current - 1);
  const goNext = () => goTo(current + 1);

  // ================= LOADING =================
  if (loading) {
    return (
      <div style={styles.stateScreen}>
        <div style={styles.spinner} />
        <span style={{ marginTop: 14 }}>Loading slider...</span>
      </div>
    );
  }

  // ================= ERROR =================
  if (error) {
    return (
      <div style={{ ...styles.stateScreen, color: "#ff5a5a" }}>{error}</div>
    );
  }

  // ================= NO DATA =================
  if (slides.length === 0) {
    return <div style={styles.stateScreen}>No slider images found.</div>;
  }

  return (
    <div style={styles.wrapper}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      {/* Ambient glow behind the active card */}
      <div
        style={{
          ...styles.ambientGlow,
          backgroundImage: `radial-gradient(ellipse 60% 55% at 50% 45%, rgba(180,30,30,0.55), rgba(0,0,0,0) 70%), url(${slides[current]?.imageUrl})`,
        }}
      />
      <div style={styles.vignette} />

      {/* Track */}
      <div style={styles.track}>
        {slides.map((slide, index) => {
          const offset = index - current;
          const isActive = offset === 0;
          const abs = Math.abs(offset);

          // hide cards that are far away so the row doesn't get crowded
          if (abs > 2) return null;

          return (
            <div
              key={slide._id ?? index}
              onClick={() => goTo(index)}
              style={{
                ...styles.card,
                transform: `translateX(${offset * 62}%) scale(${
                  isActive ? 1 : 0.8
                })`,
                zIndex: isActive ? 5 : 5 - abs,
                opacity: abs > 2 ? 0 : 1,
                filter: isActive ? "none" : "brightness(0.55)",
                cursor: isActive ? "default" : "pointer",
              }}
            >
              <img
                src={slide.imageUrl}
                alt={slide.title}
                style={styles.cardImage}
                draggable={false}
              />

              {/* subtle bottom gradient for text legibility */}
              <div style={styles.cardShade} />

              {slide.logoUrl && (
                <img src={slide.logoUrl} alt="" style={styles.logoBadge} />
              )}

              {slide.rating && (
                <div style={styles.ratingBadge}>
                  <span style={styles.star}>★</span>
                  {slide.rating}
                </div>
              )}

              <div style={styles.cardText}>
                <h2 style={styles.cardTitle}>{slide.title}</h2>
                {slide.subtitle && (
                  <p style={styles.cardSubtitle}>{slide.subtitle}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Prev / Next arrows */}
      <button
        onClick={goPrev}
        style={{ ...styles.arrow, left: 16 }}
        aria-label="Previous slide"
      >
        ‹
      </button>
      <button
        onClick={goNext}
        style={{ ...styles.arrow, right: 16 }}
        aria-label="Next slide"
      >
        ›
      </button>

      {/* Dots */}
      <div style={styles.dots}>
        {slides.map((slide, index) => (
          <div
            key={slide._id ?? index}
            onClick={() => goTo(index)}
            style={{
              ...styles.dot,
              width: current === index ? 20 : 8,
              background:
                current === index ? "#fff" : "rgba(255,255,255,0.4)",
            }}
          />
        ))}
      </div>
    </div>
  );
};

const styles = {
  wrapper: {
    position: "relative",
    width: "100%",
    height: "100vh",
    overflow: "hidden",
    background: "#000",
    fontFamily:
      "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },
  stateScreen: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    fontSize: 20,
    background: "#0b0b0d",
    color: "#eee",
  },
  spinner: {
    width: 34,
    height: 34,
    borderRadius: "50%",
    border: "3px solid rgba(255,255,255,0.2)",
    borderTopColor: "#e53935",
    animation: "spin 0.9s linear infinite",
  },
  ambientGlow: {
    position: "absolute",
    inset: 0,
    backgroundSize: "cover",
    backgroundPosition: "center",
    filter: "blur(60px) saturate(1.4)",
    transform: "scale(1.2)",
    opacity: 0.9,
    transition: "background-image 0.6s ease",
  },
  vignette: {
    position: "absolute",
    inset: 0,
    background:
      "radial-gradient(ellipse at center, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.85) 75%)",
  },
  track: {
    position: "relative",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    position: "absolute",
    width: "34%",
    maxWidth: 320,
    aspectRatio: "2 / 3",
    borderRadius: 14,
    overflow: "hidden",
    boxShadow: "0 20px 50px rgba(0,0,0,0.6)",
    transition: "transform 0.5s cubic-bezier(.22,.9,.35,1), filter 0.5s ease",
  },
  cardImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
    userSelect: "none",
  },
  cardShade: {
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(to bottom, rgba(0,0,0,0) 50%, rgba(0,0,0,0.85) 100%)",
  },
  logoBadge: {
    position: "absolute",
    top: 10,
    left: 10,
    height: 18,
    filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.6))",
  },
  ratingBadge: {
    position: "absolute",
    top: 10,
    right: 10,
    background: "rgba(0,0,0,0.55)",
    color: "#fff",
    fontSize: 13,
    fontWeight: 600,
    padding: "3px 8px",
    borderRadius: 20,
    display: "flex",
    alignItems: "center",
    gap: 4,
    backdropFilter: "blur(4px)",
  },
  star: { color: "#f5c518", fontSize: 12 },
  cardText: {
    position: "absolute",
    bottom: 14,
    left: 14,
    right: 14,
    color: "#fff",
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: 600,
    margin: 0,
    lineHeight: 1.25,
  },
  cardSubtitle: {
    fontSize: 12,
    margin: "4px 0 0",
    color: "rgba(255,255,255,0.75)",
  },
  arrow: {
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    width: 40,
    height: 40,
    borderRadius: "50%",
    border: "none",
    background: "rgba(255,255,255,0.12)",
    color: "#fff",
    fontSize: 24,
    lineHeight: 0,
    cursor: "pointer",
    zIndex: 10,
    backdropFilter: "blur(4px)",
  },
  dots: {
    position: "absolute",
    bottom: 20,
    left: "50%",
    transform: "translateX(-50%)",
    display: "flex",
    gap: 8,
    zIndex: 10,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    cursor: "pointer",
    transition: "all 0.3s",
  },
};

export default Slider;
