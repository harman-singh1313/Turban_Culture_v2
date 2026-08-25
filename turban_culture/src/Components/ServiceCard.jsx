import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const ServiceCard = ({ image, title, features = [], index = 0 }) => {
  const navigate = useNavigate();
  const ref = useRef(null);
  const timerRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => {
      window.removeEventListener("resize", checkMobile);
      observer.disconnect();
    };
  }, []);

  // Desktop auto flip
  useEffect(() => {
    if (!visible || isMobile) return;
    const flipTimer = setTimeout(() => {
      setFlipped(true);
      timerRef.current = setTimeout(() => setFlipped(false), 2500);
    }, 3000 + index * 800);
    return () => clearTimeout(flipTimer);
  }, [visible, index, isMobile]);

  return (
    <div
      ref={ref}
      onMouseEnter={() =>!isMobile && setFlipped(true)}
      onMouseLeave={() =>!isMobile && setFlipped(false)}
      style={
        isMobile
        ? { position: "sticky", top: "150px", zIndex: index, marginBottom: "14px" }
          : { perspective: "1000px", animationDelay: `${index * 100}ms` }
      }
      className={`w-full h-[420px] md:h-80 cursor-pointer ${!isMobile && (visible? "opacity-100 translate-y-0" : "opacity-0 translate-y-8")} transition-all duration-700`}
    >
      <div
        className="relative w-full h-full rounded-[20px]"
        style={{
          transformStyle: isMobile? "flat" : "preserve-3d",
          transition: isMobile? "none" : "transform 1000ms",
          transform:!isMobile && flipped? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* ============ FRONT SIDE ============ */}
        <div
          className="absolute inset-0 rounded-[20px] overflow-hidden border border-[#e3c48b] shadow-xl"
          style={{ backfaceVisibility: isMobile? "visible" : "hidden", background: "#000" }}
        >
          <img src={image} alt={title} className="w-full h-full object-cover block" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

          <div className="absolute left-0 right-0 bottom-0 p-5">
            <p className="text-[#f4c46c] text-[10px] tracking-[0.22em] uppercase">Turban Service</p>
            <h2 className="text-white font-serif text-[20px] font-semibold mt-1 leading-tight">{title}</h2>

            {/* Mobile te sirf 2 features, Desktop te 3 */}
            <div className="mt-2 space-y-1">
              {(isMobile? features.slice(0, 2) : features.slice(0, 3)).map((f, i) => (
                <p key={i} className="text-white/80 text-[11px]">✓ {f}</p>
              ))}
            </div>

            {/* Mobile buttons - image te */}
            {isMobile && (
              <div className="flex gap-2 mt-4">
                <button onClick={() => navigate("/booking")} className="flex-1 bg-[#c9913a] text-black text-[11px] font-bold py-2.5 rounded-full">Get Quote</button>
                <button onClick={() => navigate("/gallery")} className="flex-1 bg-white text-black text-[11px] font-bold py-2.5 rounded-full">Gallery</button>
              </div>
            )}
          </div>
        </div>

        {/* ============ BACK SIDE - ONLY DESKTOP (Tuhadi purani info) ============ */}
        {!isMobile && (
          <div
            className="absolute inset-0 rounded-[20px] bg-[#fff8ef] border border-[#d8ad62]/50 shadow-xl px-5 py-5 flex flex-col justify-between"
            style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
          >
            <div>
              <p className="text-[#c9913a] text-[10px] uppercase tracking-[0.22em] mb-2">Service Details</p>
              <h3 className="text-[#2f2418] text-xl font-serif font-semibold mb-4">{title}</h3>
              <ul className="space-y-2 text-sm text-[#6b5b4b]">
                {features.map((item, i) => (
                  <li key={i}>✓ {item}</li>
                ))}
              </ul>
            </div>
            <div className="flex gap-2 pt-4">
              <button onClick={() => navigate("/booking")} className="bg-[#c9913a] text-white px-4 py-2 rounded-full text-xs font-semibold">Get Quote</button>
              <button onClick={() => navigate("/gallery")} className="border border-[#c9913a] text-[#9a681d] px-4 py-2 rounded-full text-xs font-semibold hover:bg-[#c9913a] hover:text-white transition">View Gallery</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceCard;