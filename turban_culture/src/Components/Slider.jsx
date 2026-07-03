import React, { useState, useEffect } from "react";
import axios from "axios";

import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Autoplay, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const Slider = () => {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const res = await axios.get(`${API_URL}/slider`);
        setSlides(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSlides();
  }, []);

  if (loading) {
    return (
      <div
        style={{
          height: "80vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        Loading...
      </div>
    );
  }

  return (
    <div
      style={{
        background: "#0f0f0f",
        padding: "60px 0",
        overflow: "hidden",
      }}
    >
      <Swiper
        effect={"coverflow"}
        grabCursor={true}
        centeredSlides={true}
        loop={true}
        slidesPerView={"auto"}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        coverflowEffect={{
          rotate: 0,
          stretch: 0,
          depth: 150,
          modifier: 2,
          scale: 0.9,
          slideShadows: false,
        }}
        pagination={{ clickable: true }}
        modules={[EffectCoverflow, Autoplay, Pagination]}
      >
        {slides.map((slide) => (
          <SwiperSlide
            key={slide._id}
            style={{
              width: "320px",
            }}
          >
            <div
              style={{
                borderRadius: "24px",
                overflow: "hidden",
                background: "#1a1a1a",
                boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
              }}
            >
              <img
                src={slide.imageUrl}
                alt={slide.title}
                style={{
                  width: "100%",
                  height: "520px",
                  objectFit: "cover",
                  display: "block",
                }}
              />

              <div
                style={{
                  padding: "18px",
                  color: "#fff",
                  textAlign: "center",
                }}
              >
                <h3
                  style={{
                    margin: 0,
                    fontSize: "22px",
                    fontWeight: 500,
                  }}
                >
                  {slide.title}
                </h3>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Slider;