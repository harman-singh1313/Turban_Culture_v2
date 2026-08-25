import React from "react";
import { Link } from "react-router-dom";

const Main = (props) => {
  return (
    <section className="relative w-full overflow-hidden bg-[#fdfaf6] m-0 mt-0 pt-0">

      {/* =====================================================
          DESKTOP HERO — split layout (text left / portrait image right)
          Portrait source is 736x904 (~0.81 aspect). A full-bleed
          object-cover box was crushing it into a wide landscape
          frame, so instead we give the image its own contained
          panel that respects its natural aspect ratio.
      ====================================================== */}
      <div className="relative hidden lg:grid lg:grid-cols-2 w-full h-[580px] lg:h-[630px] xl:h-[670px] items-start pt-24 lg:pt-24">

        {/* LEFT: CONTENT */}
        <div className="relative z-10 px-12 lg:px-20 xl:px-24">
          <div className="w-full max-w-xl">

            {/* TAG */}
            <p
              style={{ animationDelay: "300ms" }}
              className="
                text-[#c9913a]
                text-[10px]
                lg:text-xs
                tracking-[3px]
                uppercase
                mb-5
                flex
                items-center
                gap-3
                opacity-0
                animate-slidein
              "
            >
              <span className="w-7 h-px bg-[#c9913a] flex-shrink-0" />
              {props.text}
            </p>

            {/* TITLE */}
            <h1
              style={{ animationDelay: "800ms" }}
              className="
                font-serif
                text-4xl
                lg:text-5xl
                xl:text-[58px]
                font-bold
                leading-[1.08]
                mb-4
                text-[#1a1a1a]
                opacity-0
                animate-slidein
              "
            >
              {props.head1}
              <br />
              {props.head2}

              <span className="text-[#c9913a] block">
                {props.head3}
              </span>
            </h1>

            {/* SUBTITLE */}
            {props.test2 && (
              <p
                style={{ animationDelay: "1200ms" }}
                className="
                  font-serif
                  text-xl
                  lg:text-2xl
                  italic
                  text-[#888888]
                  mb-5
                  opacity-0
                  animate-slidein
                "
              >
                {props.test2}
              </p>
            )}

            {/* DIVIDER */}
            <div
              style={{ animationDelay: "1500ms" }}
              className="
                w-12
                h-px
                bg-[#c9913a]
                mb-5
                opacity-0
                animate-fadein
              "
            />

            {/* DESCRIPTION */}
            <p
              style={{ animationDelay: "1800ms" }}
              className="
                text-[#806f60]
                font-light
                text-sm
                lg:text-[15px]
                leading-7
                mb-7
                max-w-md
                opacity-0
                animate-slidein
              "
            >
              {props.line}
            </p>

            {/* BUTTON */}
            <Link
              to="/Booking"
              style={{ animationDelay: "2100ms" }}
              className="
                group
                relative
                inline-flex
                items-center
                gap-2
                overflow-hidden
                bg-gradient-to-r
                from-[#c9913a]
                via-[#d4a574]
                to-[#c9913a]
                text-white
                text-[11px]
                font-semibold
                px-5
                py-2.5
                rounded-full
                shadow-xl
                shadow-[#c9913a]/30
                hover:shadow-2xl
                hover:shadow-[#c9913a]/50
                transition-all
                duration-500
                hover:scale-105
                opacity-0
                animate-slidein
              "
            >

              {/* SHINE EFFECT */}
              <span
                className="
                  absolute
                  inset-0
                  bg-gradient-to-r
                  from-transparent
                  via-white/20
                  to-transparent
                  -translate-x-full
                  group-hover:translate-x-full
                  transition-transform
                  duration-1000
                "
              />

              <span className="relative z-10">
                {props.button || "BOOK NOW"}
              </span>

              <svg
                className="
                  relative
                  z-10
                  w-3.5
                  h-3.5
                  group-hover:translate-x-1
                  transition-transform
                  duration-300
                "
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>

            </Link>

          </div>
        </div>

        {/* RIGHT: PORTRAIT IMAGE, SOFTLY BLENDED INTO THE PAGE */}
        <div className="relative z-10 h-full flex items-center justify-center py-6 pr-6 lg:pr-10 xl:pr-14">

          {/* warm ambient glow sitting behind the photo — barely-there */}
          <div
            className="absolute w-[95%] aspect-square rounded-full pointer-events-none blur-3xl"
            style={{
              background:
                "radial-gradient(closest-side, rgba(201,145,58,0.03) 0%, rgba(217,196,168,0.02) 45%, rgba(253,250,246,0) 75%)",
            }}
          />
          <div
            className="absolute w-[70%] aspect-square rounded-full pointer-events-none blur-3xl -translate-x-4 translate-y-6"
            style={{
              background:
                "radial-gradient(closest-side, rgba(230,180,150,0.03) 0%, rgba(253,250,246,0) 70%)",
            }}
          />

          {/* BLURRED ECHO of the photo — scaled up, heavily blurred, fills the
              surrounding space with a soft trace of the photo's colours.
              Its own edges are masked to a soft radial fade so it never
              reads as its own separate rectangle/blob. */}
          <div
            className="absolute w-[92%] max-w-[640px] aspect-[736/904] pointer-events-none"
            style={{
              filter: "blur(60px)",
              opacity: 0.18,
              transform: "scale(1.2)",
              maskImage:
                "radial-gradient(60% 65% at 50% 45%, #000 40%, rgba(0,0,0,0) 100%)",
              WebkitMaskImage:
                "radial-gradient(60% 65% at 50% 45%, #000 40%, rgba(0,0,0,0) 100%)",
            }}
          >
            <img
              src={props.image}
              alt=""
              aria-hidden="true"
              className="w-full h-full object-cover object-center"
            />
          </div>

          <div
            className="
              relative
              w-full
              max-w-[400px]
              lg:max-w-[460px]
              xl:max-w-[520px]
              aspect-[736/904]
            "
          >
            <img
              src={props.image}
              alt="Professional Punjabi Pagg, Pagri & Wedding Turban Tying Service"
              width="736"
              height="904"
              loading="eager"
              fetchpriority="high"
              decoding="async"
              className="
                absolute
                inset-0
                w-full
                h-full
                object-cover
                object-center
                animate-kenburns
                border-0
                outline-none
              "
              style={{
                border: "none",
                maskImage:
                  "radial-gradient(68% 78% at 50% 42%, #000 32%, rgba(0,0,0,0.65) 52%, rgba(0,0,0,0.2) 74%, rgba(0,0,0,0) 94%)",
                WebkitMaskImage:
                  "radial-gradient(68% 78% at 50% 42%, #000 32%, rgba(0,0,0,0.65) 52%, rgba(0,0,0,0.2) 74%, rgba(0,0,0,0) 94%)",
              }}
            />

            {/* faint warm color-wash over the photo so it reads as one tone family with the page */}
            <div
              className="absolute inset-0 pointer-events-none mix-blend-multiply opacity-[0.06]"
              style={{
                background:
                  "linear-gradient(160deg, #c9913a 0%, #fdfaf6 55%, #d4a574 100%)",
                maskImage:
                  "radial-gradient(68% 78% at 50% 42%, #000 32%, rgba(0,0,0,0.65) 52%, rgba(0,0,0,0.2) 74%, rgba(0,0,0,0) 94%)",
                WebkitMaskImage:
                  "radial-gradient(68% 78% at 50% 42%, #000 32%, rgba(0,0,0,0.65) 52%, rgba(0,0,0,0.2) 74%, rgba(0,0,0,0) 94%)",
              }}
            />
          </div>
        </div>
      </div>


      {/* =====================================================
          MOBILE HERO (unchanged — already working correctly)
      ====================================================== */}
      <div className="lg:hidden w-full pt-5">

        {/* ---------------- IMAGE ---------------- */}
        <div className="relative w-full h-[52vh] sm:h-[65vh] md:h-[72vh] min-h-[360px] max-h-[560px] sm:max-h-[680px] md:max-h-[760px] overflow-hidden">

          <img
            src={props.image}
            alt="Professional Punjabi Pagg, Pagri & Wedding Turban Tying Service"
            width="736"
            height="904"
            loading="eager"
            fetchpriority="high"
            decoding="async"
            className="
              w-full
              h-full
              object-cover
              object-[center_18%]
              sm:object-[center_10%]
              animate-kenburns
            "
          />

          {/* TOP SOFT FADE */}
          <div
            className="absolute inset-x-0 top-0 h-20"
            style={{
              background:
                "linear-gradient(to bottom, rgba(253,250,246,0.35), transparent)",
            }}
          />

          {/* BOTTOM FADE */}
          <div
            className="absolute inset-x-0 bottom-0 h-36"
            style={{
              background:
                "linear-gradient(to top, #fdfaf6 0%, rgba(253,250,246,0.75) 35%, rgba(253,250,246,0) 100%)",
            }}
          />

        </div>


        {/* ---------------- CONTENT ---------------- */}
        <div className="relative z-10 bg-[#fdfaf6] px-5 sm:px-8 pt-2 pb-10">

          <div className="w-full max-w-xl mx-auto">

            {/* TAG */}
            <p
              style={{ animationDelay: "300ms" }}
              className="
                text-[#c9913a]
                text-[9px]
                sm:text-xs
                tracking-[2.5px]
                uppercase
                mb-4
                flex
                items-center
                gap-3
                opacity-0
                animate-slidein
              "
            >
              <span className="w-7 h-px bg-[#c9913a] flex-shrink-0" />
              {props.text}
            </p>


            {/* TITLE */}
            <h1
              style={{ animationDelay: "800ms" }}
              className="
                font-serif
                text-[32px]
                sm:text-4xl
                font-bold
                leading-[1.12]
                mb-3
                text-[#1a1a1a]
                opacity-0
                animate-slidein
              "
            >
              {props.head1}
              <br />
              {props.head2}

              <span className="text-[#c9913a] block">
                {props.head3}
              </span>
            </h1>


            {/* SUBTITLE */}
            {props.test2 && (
              <p
                style={{ animationDelay: "1200ms" }}
                className="
                  font-serif
                  text-lg
                  sm:text-xl
                  italic
                  text-[#888888]
                  mb-4
                  opacity-0
                  animate-slidein
                "
              >
                {props.test2}
              </p>
            )}


            {/* DIVIDER */}
            <div
              style={{ animationDelay: "1500ms" }}
              className="
                w-12
                h-px
                bg-[#c9913a]
                mb-4
                opacity-0
                animate-fadein
              "
            />


            {/* DESCRIPTION */}
            <p
              style={{ animationDelay: "1800ms" }}
              className="
                text-[#806f60]
                font-light
                text-sm
                leading-7
                mb-6
                max-w-md
                opacity-0
                animate-slidein
              "
            >
              {props.line}
            </p>


            {/* BUTTON */}
            <Link
              to="/Booking"
              style={{ animationDelay: "2100ms" }}
              className="
                group
                relative
                inline-flex
                items-center
                justify-center
                gap-2
                overflow-hidden
                bg-gradient-to-r
                from-[#c9913a]
                via-[#d4a574]
                to-[#c9913a]
                text-white
                text-[11px]
                font-semibold
                px-6
                py-3
                rounded-full
                shadow-xl
                shadow-[#c9913a]/30
                transition-all
                duration-500
                active:scale-95
                opacity-0
                animate-slidein
              "
            >

              {/* SHINE */}
              <span
                className="
                  absolute
                  inset-0
                  bg-gradient-to-r
                  from-transparent
                  via-white/20
                  to-transparent
                  -translate-x-full
                  group-hover:translate-x-full
                  transition-transform
                  duration-1000
                "
              />

              <span className="relative z-10">
                {props.button || "BOOK NOW"}
              </span>

              <svg
                className="
                  relative
                  z-10
                  w-3.5
                  h-3.5
                  group-hover:translate-x-1
                  transition-transform
                  duration-300
                "
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>

            </Link>

          </div>
        </div>

      </div>

    </section>
  );
};

export default Main;
