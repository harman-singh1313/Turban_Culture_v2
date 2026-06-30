import React, { useState, useEffect } from "react";
import punjabi_turban from "../assets/punjabi_turban.png";
import punjabi_turban2 from "../assets/punjabi_turban2.jpeg";
import jodpuri_groom from "../assets/jodpuri_groom.png";
import barati from "../assets/barati.png";

const slides = [
  { img: punjabi_turban, name: "Full Groom Look" },
  { img: punjabi_turban2, name: "Groom" },
  { img: jodpuri_groom, name: "Jodpuri safa" },
  { img: barati, name: "Barati" },
];

const Slider = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % slides.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{ position: "relative", width: "100%", height: "100vh", overflow: "hidden" }}>

      {/* Background Images */}
      {slides.map((s, i) => (
        <div key={i} style={{
          position: "absolute", inset: 0,
          backgroundImage: `url(${s.img})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: i === current ? 1 : 0,
          transition: "opacity 1.2s ease-in-out",
        }} />
      ))}

      {/* Dark Overlay */}
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.65))",
        zIndex: 2,
      }} />

      {/* Image Name */}
      <div style={{
        position: "absolute", bottom: 60, left: 32,
        zIndex: 3, color: "#fff"
      }}>
        <h2 style={{ fontSize: 28, fontWeight: 500 }}>
          {slides[current].name}
        </h2>
      </div>

      {/* Dots */}
      <div style={{
        position: "absolute", bottom: 24,
        left: "50%", transform: "translateX(-50%)",
        display: "flex", gap: 8, zIndex: 3
      }}>
        {slides.map((_, i) => (
          <div key={i}
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