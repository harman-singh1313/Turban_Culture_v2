import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const Slider = () => {
  const [slides, setSlides] = useState([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ================= FETCH SLIDES =================
  useEffect(() => {
    const fetchSlides = async () => {
      try {
        setLoading(true);

        const res = await axios.get(`${API_URL}/api/slider`);

        setSlides(res.data);

        // Preload images
        res.data.forEach((slide) => {
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

    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 3000);

    return () => clearInterval(timer);
  }, [slides]);

  // ================= LOADING =================
  if (loading) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "22px",
        }}
      >
        Loading slider...
      </div>
    );
  }

  // ================= ERROR =================
  if (error) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "22px",
          color: "red",
        }}
      >
        {error}
      </div>
    );
  }

  // ================= NO DATA =================
  if (slides.length === 0) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "22px",
        }}
      >
        No slider images found.
      </div>
    );
  }

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      {/* Background Images */}
      {slides.map((slide, index) => (
        <div
          key={slide._id}
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url(${slide.imageUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: current === index ? 1 : 0,
            transition: "opacity 1.2s ease-in-out",
          }}
        />
      ))}

      {/* Overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.65))",
          zIndex: 2,
        }}
      />

      {/* Title */}
      <div
        style={{
          position: "absolute",
          bottom: 60,
          left: 32,
          color: "#fff",
          zIndex: 3,
        }}
      >
        <h2
          style={{
            fontSize: 28,
            fontWeight: 500,
            margin: 0,
          }}
        >
          {slides[current]?.title}
        </h2>
      </div>

      {/* Dots */}
      <div
        style={{
          position: "absolute",
          bottom: 24,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          gap: 8,
          zIndex: 3,
        }}
      >
        {slides.map((slide, index) => (
          <div
            key={slide._id}
            onClick={() => setCurrent(index)}
            style={{
              width: current === index ? 20 : 8,
              height: 8,
              borderRadius: 4,
              background:
                current === index
                  ? "#fff"
                  : "rgba(255,255,255,0.4)",
              cursor: "pointer",
              transition: "all 0.3s",
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default Slider;