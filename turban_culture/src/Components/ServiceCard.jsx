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

  /* ================= MOBILE CHECK ================= */

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");

    const updateMobile = () => {
      setIsMobile(mediaQuery.matches);
    };

    updateMobile();

    mediaQuery.addEventListener("change", updateMobile);

    return () => {
      mediaQuery.removeEventListener("change", updateMobile);
    };
  }, []);

  /* ================= SCROLL ANIMATION ================= */

  useEffect(() => {
    const card = cardRef.current;

    if (!card) return;

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

    observer.observe(card);

    return () => {
      observer.disconnect();
    };
  }, []);

  /* ================= DESKTOP AUTO FLIP ================= */

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

      if (resetTimer) {
        clearTimeout(resetTimer);
      }
    };
  }, [visible, isMobile, index]);

  /* ================= NAVIGATION ================= */

  const goTo = (path) => {
    navigate(path);
  };

  /* =====================================================
     MOBILE STACK
     New card comes ABOVE previous card
  ===================================================== */

  const mobileStackStyle = isMobile
    ? {
        position: "sticky",

        // original stacked look
        top: `${120 + index * 16}px`,

        // IMPORTANT:
        // next card appears above previous card
        zIndex: index + 1,
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

        ${
          isMobile
            ? `
              mb-3
            `
            : `
              [perspective:1000px]
              transition-all
              duration-700

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
        {/* =====================================================
            FRONT
        ===================================================== */}

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
          {/* IMAGE */}

          <img
            src={image}
            alt={title}
            draggable="false"
            className="
              pointer-events-none
              block
              h-full
              w-full
              select-none
              object-cover
            "
          />

          {/* DARK OVERLAY */}

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

          {/* ================= CONTENT ================= */}

          <div
            className="
              pointer-events-none
              absolute
              bottom-0
              left-0
              right-0
              z-20
              p-5
            "
          >
            {/* SMALL TITLE */}

            <p
              className="
                text-[10px]
                uppercase
                tracking-[0.22em]
                text-[#f4c46c]
              "
            >
              Turban Service
            </p>

            {/* TITLE */}

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

            {/* FEATURES */}

            <div className="mt-2 space-y-1">
              {(isMobile
                ? features.slice(0, 2)
                : features.slice(0, 3)
              ).map((feature, featureIndex) => (
                <p
                  key={featureIndex}
                  className="
                    text-[11px]
                    text-white/80
                  "
                >
                  ✓ {feature}
                </p>
              ))}
            </div>

            {/* =================================================
                MOBILE BUTTONS
            ================================================= */}

            {isMobile && (
              <div
                className="
                  pointer-events-auto
                  relative
                  z-50
                  mt-4
                  flex
                  gap-3
                "
              >
                {/* GET QUOTE */}

                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();

                    goTo("/booking");
                  }}
                  className="
                    flex
                    min-h-[48px]
                    flex-1
                    touch-manipulation
                    select-none
                    items-center
                    justify-center
                    rounded-full
                    bg-[#c9913a]
                    px-4
                    text-[12px]
                    font-bold
                    text-black

                    transition-transform
                    duration-150

                    active:scale-[0.97]
                  "
                >
                  Get Quote
                </button>

                {/* GALLERY */}

                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();

                    goTo("/gallery");
                  }}
                  className="
                    flex
                    min-h-[48px]
                    flex-1
                    touch-manipulation
                    select-none
                    items-center
                    justify-center
                    rounded-full
                    bg-white
                    px-4
                    text-[12px]
                    font-bold
                    text-black

                    transition-transform
                    duration-150

                    active:scale-[0.97]
                  "
                >
                  Gallery
                </button>
              </div>
            )}
          </div>
        </div>

        {/* =====================================================
            BACK - DESKTOP ONLY
        ===================================================== */}

{/* ================= BACK SIDE - DESKTOP ONLY ================= */}
{!isMobile && (
  <div
    className="
      absolute
      inset-0
      flex
      flex-col
      rounded-[20px]
      border
      border-[#d8ad62]/50
      bg-[#fff8ef]
      p-5
      shadow-xl
      [backface-visibility:hidden]
      [transform:rotateY(180deg)]
    "
  >
    {/* ================= SERVICE DETAILS ================= */}
    <div className="min-h-0 flex-1">
      <p
        className="
          mb-2
          text-[9px]
          uppercase
          tracking-[0.22em]
          text-[#c9913a]
        "
      >
        Service Details
      </p>

      <h3
        className="
          mb-3
          font-serif
          text-[18px]
          font-semibold
          leading-[1.25]
          text-[#2f2418]
        "
      >
        {title}
      </h3>

      <ul
        className="
          space-y-1.5
          text-[12px]
          leading-[1.35]
          text-[#6b5b4b]
        "
      >
        {features.slice(0, 4).map((feature, featureIndex) => (
          <li
            key={featureIndex}
            className="flex items-start gap-1.5"
          >
            <span className="shrink-0 text-[#9a681d]">✓</span>

            <span>{feature}</span>
          </li>
        ))}
      </ul>
    </div>

    {/* ================= DESKTOP BUTTONS ================= */}
    <div
      className="
        mt-3
        grid
        shrink-0
        grid-cols-2
        gap-2
      "
    >
      {/* GET QUOTE */}
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          goTo("/booking");
        }}
        className="
          flex
          min-h-[40px]
          items-center
          justify-center
          rounded-full
          bg-[#c9913a]
          px-3
          text-center
          text-[11px]
          font-semibold
          leading-tight
          text-white
          transition
          duration-200
          hover:bg-[#b67f2e]
        "
      >
        Get Quote
      </button>

      {/* VIEW GALLERY */}
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          goTo("/gallery");
        }}
        className="
          flex
          min-h-[40px]
          items-center
          justify-center
          rounded-full
          border
          border-[#c9913a]
          bg-transparent
          px-3
          text-center
          text-[11px]
          font-semibold
          leading-tight
          text-[#9a681d]
          transition
          duration-200
          hover:bg-[#c9913a]
          hover:text-white
        "
      >
        View Gallery
      </button>
    </div>
  </div>
)}      </div>
    </div>
  );
};

export default ServiceCard;