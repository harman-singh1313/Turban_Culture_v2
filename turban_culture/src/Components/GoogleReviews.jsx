import React from "react";

const GoogleReviews = () => {
  return (
    <a
      href="https://www.google.com/maps/place/Turban+Culture"
      target="_blank"
      rel="noreferrer"
      className="block w-full"
    >
      <div className="relative w-full rounded-3xl overflow-hidden border border-gray-200 shadow-lg cursor-pointer">

        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3471.8124948669683!2d74.83433477636812!3d29.52182417519086!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xae1f9de25b2d3a59%3A0x3fee04790f1c10c8!2sTurban%20Culture!5e0!3m2!1sen!2sin!4v1785823525215!5m2!1sen!2sin"
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
          title="Turban Culture Google Map"
          className="w-full h-[320px] sm:h-[400px] md:h-[460px] lg:h-[560px] xl:h-[620px] border-0 pointer-events-none select-none"
        />

        {/* Hover overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/0 hover:bg-black/10 transition-all duration-300">
          <div className="bg-white/95 px-4 py-2 rounded-full text-sm font-semibold text-gray-800 shadow-md opacity-0 hover:opacity-100 transition duration-300">
            📍 Open in Google Maps
          </div>
        </div>

      </div>
    </a>
  );
};

export default GoogleReviews;