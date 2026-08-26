import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const ServiceCard = ({
  image,
  title,
  features = [],
  index = 0,
  total = 5,
}) => {
  const navigate = useNavigate();
  const cardRef = useRef(null);

  const [visible, setVisible] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  /* ---------------- Mobile Check ---------------- */
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();

    window.addEventListener("resize", checkMobile);

    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  /* ---------------- Scroll Animation ---------------- */
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
        }
      },
      {
        threshold: 0.2,
      }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  /* ---------------- Desktop Auto Flip ---------------- */
  useEffect(() => {
    if (!visible || isMobile) return;

    let resetTimer;

    const flipTimer = setTimeout(() => {
      setFlipped(true);

      resetTimer = setTimeout(() => {
        setFlipped(false);
      }, 2500);
    }, 3000 + index * 800);

    return () => {
      clearTimeout(flipTimer);
      clearTimeout(resetTimer);
    };
  }, [visible, isMobile, index]);

  /* ---------------- Navigation ---------------- */
  const goTo = (path) => {
    navigate(path);
  };

  /* ---------------- Mobile Sticky Style ---------------- */
const mobileStackStyle = isMobile
  ? {
      top: `${120 + index * 16}px`,
      zIndex: index + 1,
      position: "sticky",
    }
  : {};

  return (
    <div
      ref={cardRef}
      style={mobileStackStyle}
      className={`
        w-full
        h-[420px]
        md:h-80

        transition-all
        duration-700

        ${
          isMobile
            ? `
              mb-3
            `
            : `
              [perspective:1000px]
              ${
                visible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-8 opacity-0"
              }
            `
        }
      `}
    >
      {/* ================= CARD WRAPPER ================= */}
      <div
        className={`
          relative
          h-full
          w-full
          rounded-[20px]

          ${
            isMobile
              ? `
                shadow-[0_-2px_0_0_#f4c46c,0_10px_30px_rgba(0,0,0,0.35)]
              `
              : `
                [transform-style:preserve-3d]
                transition-transform
                duration-1000
              `
          }

          ${
            !isMobile && flipped
              ? "[transform:rotateY(180deg)]"
              : "[transform:rotateY(0deg)]"
          }
        `}
        onMouseEnter={() => {
          if (!isMobile) {
            setFlipped(true);
          }
        }}
        onMouseLeave={() => {
          if (!isMobile) {
            setFlipped(false);
          }
        }}
      >
        {/* ================= FRONT SIDE ================= */}
        <div
          className={`
            absolute
            inset-0
            overflow-hidden
            rounded-[20px]
            border
            border-[#e3c48b]
            bg-black
            shadow-xl

            ${!isMobile ? "[backface-visibility:hidden]" : ""}
          `}
        >
          {/* Image */}
          <img
            src={image}
            alt={title}
            className="block h-full w-full object-cover"
          />

          {/* Dark Overlay */}
          <div
            className="
              pointer-events-none
              absolute
              inset-0
              bg-gradient-to-t
              from-black
              via-black/40
              to-transparent
            "
          />

          {/* Content */}
          <div
            className="
              absolute
              bottom-0
              left-0
              right-0
              z-20
              p-5
            "
          >
            {/* Small Heading */}
            <p className="text-[10px] uppercase tracking-[0.22em] text-[#f4c46c]">
              Turban Service
            </p>

            {/* Title */}
            <h2
              className="
                mt-1
                font-serif
                text-[20px]
                font-semibold
                leading-tight
                text-white
              "
            >
              {title}
            </h2>

            {/* Features */}
            <div className="mt-2 space-y-1">
              {(isMobile
                ? features.slice(0, 2)
                : features.slice(0, 3)
              ).map((feature, featureIndex) => (
                <p
                  key={featureIndex}
                  className="text-[11px] text-white/80"
                >
                  ✓ {feature}
                </p>
              ))}
            </div>

            {/* ================= MOBILE BUTTONS ================= */}
            {isMobile && (
              <div
                className="
                  relative
                  z-[999]
                  mt-4
                  flex
                  gap-2
                  pointer-events-auto
                "
              >
                {/* Get Quote */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    goTo("/booking");
                  }}
                  className="
                    relative
                    z-[1000]
                    flex-1
                    cursor-pointer
                    rounded-full
                    bg-[#c9913a]
                    py-2.5
                    text-[11px]
                    font-bold
                    text-black
                    transition
                    duration-200
                    active:scale-95
                  "
                >
                  Get Quote
                </button>

                {/* Gallery */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    goTo("/gallery");
                  }}
                  className="
                    relative
                    z-[1000]
                    flex-1
                    cursor-pointer
                    rounded-full
                    bg-white
                    py-2.5
                    text-[11px]
                    font-bold
                    text-black
                    transition
                    duration-200
                    active:scale-95
                  "
                >
                  Gallery
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ================= BACK SIDE - DESKTOP ONLY ================= */}
        {!isMobile && (
          <div
            className="
              absolute
              inset-0
              flex
              flex-col
              justify-between
              rounded-[20px]
              border
              border-[#d8ad62]/50
              bg-[#fff8ef]
              px-5
              py-5
              shadow-xl
              [backface-visibility:hidden]
              [transform:rotateY(180deg)]
            "
          >
            {/* Service Details */}
            <div>
              <p
                className="
                  mb-2
                  text-[10px]
                  uppercase
                  tracking-[0.22em]
                  text-[#c9913a]
                "
              >
                Service Details
              </p>

              <h3
                className="
                  mb-4
                  font-serif
                  text-xl
                  font-semibold
                  text-[#2f2418]
                "
              >
                {title}
              </h3>

              <ul
                className="
                  space-y-2
                  text-sm
                  text-[#6b5b4b]
                "
              >
                {features.map((feature, featureIndex) => (
                  <li key={featureIndex}>
                    ✓ {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* Desktop Buttons */}
            <div className="flex gap-2 pt-4">
              {/* Get Quote */}
              <button
                type="button"
                onClick={() => goTo("/booking")}
                className="
                  rounded-full
                  bg-[#c9913a]
                  px-4
                  py-2
                  text-xs
                  font-semibold
                  text-white
                  transition
                  hover:scale-105
                "
              >
                Get Quote
              </button>

              {/* Gallery */}
              <button
                type="button"
                onClick={() => goTo("/gallery")}
                className="
                  rounded-full
                  border
                  border-[#c9913a]
                  px-4
                  py-2
                  text-xs
                  font-semibold
                  text-[#9a681d]
                  transition
                  hover:bg-[#c9913a]
                  hover:text-white
                "
              >
                View Gallery
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceCard;