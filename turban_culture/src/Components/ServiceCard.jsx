import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
const ServiceCard = ({ image, title, description, index = 0 }) => {
  const navigate = useNavigate();
  const ref = useRef(null);
  const timerRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const hasAutoFlipped = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.5 }
    );

    if (ref.current) observer.observe(ref.current);

    return () => {
      observer.disconnect();
      clearTimeout(timerRef.current);
    };
  }, []);

useEffect(() => {
  if (!visible) return;

const isMobile = window.matchMedia("(hover: none) and (pointer: coarse)").matches;
  if (isMobile && !hasAutoFlipped.current) {
    hasAutoFlipped.current = true;

    const flipTimer = setTimeout(() => {
      setFlipped(true);

      const backTimer = setTimeout(() => {
        setFlipped(false);
      }, 2500);

      timerRef.current = backTimer;
}, 3000 + index * 1000);

    return () => {
      clearTimeout(flipTimer);
      clearTimeout(timerRef.current);
    };
  }
}, [visible,index]);  const handleMouseEnter = () => {
    clearTimeout(timerRef.current);
    setFlipped(true);
  };

  const handleMouseLeave = () => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setFlipped(false);
    }, 2000);
  };

  return (
    <div
      ref={ref}
      style={{ animationDelay: `${index * 100}ms`, perspective: "1000px" }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative group w-full h-72 lg:h-80 cursor-pointer
        ${visible ? "animate-bottomtotop" : "opacity-0 translate-y-16"}`}
    >
      <div
        className="relative w-full h-full transition-transform duration-[1000ms] rounded-2xl"
        style={{
          transformStyle: "preserve-3d",
          transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* FRONT */}
        <div
          className="absolute inset-0 overflow-hidden rounded-2xl shadow-md border border-[#ead8bd]"
          style={{ backfaceVisibility: "hidden" }}
        >
          <img src={image} alt={title} className="w-full h-full object-cover" />

          <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/20 to-transparent" />

          <div className="absolute left-4 right-4 bottom-5">
            <p className="text-[#f4c46c] text-[10px] uppercase tracking-[0.22em] mb-1">
              Turban Service
            </p>
            <h2 className="text-white text-lg sm:text-xl font-serif font-semibold leading-snug drop-shadow">
              {title}
            </h2>
          </div>
        </div>

        {/* BACK */}
        <div
          className="absolute inset-0 rounded-2xl bg-[#fff8ef] border border-[#d8ad62]/50 shadow-md px-4 py-5 flex flex-col justify-between"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <div>
            <p className="text-[#c9913a] text-[10px] uppercase tracking-[0.22em] mb-2">
              Details
            </p>

            <h3 className="text-[#2f2418] text-lg sm:text-xl font-serif font-semibold leading-snug mb-3">
              {title}
            </h3>

            <p className="text-[#6b5b4b] text-xs sm:text-sm leading-relaxed">
              {description}
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/gallery")}
            className="self-start text-[#9a681d] border border-[#c9913a]/40 rounded-full px-4 py-1.5 text-[11px] sm:text-xs font-semibold tracking-wider hover:bg-[#c9913a] hover:text-white transition duration-300"
          >
            View Gallery
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;