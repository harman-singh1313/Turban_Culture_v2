import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const Slider = () => {
  const [slides, setSlides] = useState([]);
  const [current, setCurrent] = useState(0);

  // FETCH FROM BACKEND
  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/slider`);
        setSlides(res.data);
      } catch (err) {
        console.log("Slider fetch error:", err);
      }
    };

    fetchSlides();
  }, []);

  // AUTO SLIDE
  useEffect(() => {
    if (slides.length === 0) return;

    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 3000);

    return () => clearInterval(timer);
  }, [slides]);

  if (slides.length === 0) {
    return (
      <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        Loading slider...
      </div>
    );
  }

  return (
    <div style={{ position: "relative", width: "100%", height: "100vh", overflow: "hidden" }}>

      {/* Background Images */}
      {slides.map((s, i) => (
        <div
          key={s._id || i}
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url(${s.imageUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: i === current ? 1 : 0,
            transition: "opacity 1.2s ease-in-out",
          }}
        />
      ))}

      {/* Dark Overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.65))",
          zIndex: 2,
        }}
      />

      {/* Text */}
      <div
        style={{
          position: "absolute",
          bottom: 60,
          left: 32,
          zIndex: 3,
          color: "#fff",
        }}
      >
        <h2 style={{ fontSize: 28, fontWeight: 500 }}>
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
        {slides.map((_, i) => (
          <div
            key={i}
            onClick={() => setCurrent(i)}
            style={{
              width: i === current ? 20 : 8,
              height: 8,
              borderRadius: 4,
              background: i === current ? "#fff" : "rgba(255,255,255,0.4)",
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