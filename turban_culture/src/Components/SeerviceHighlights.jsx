import React from "react";
import {
  FaUsers,
  FaCalendarCheck,
  FaGraduationCap,
   FaHeart,
} from "react-icons/fa";

const ServiceHighlights = () => {
  return (
    <section className="bg-[#f8f4ee] border-y border-[#e5ddd2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-7">
        <div className="grid grid-cols-2 lg:grid-cols-5 items-center gap-6 lg:gap-4">

          {/* Stat 1 */}
          <div className="flex items-center justify-center gap-3 text-center">
            <FaUsers className="text-[#c9913a] text-xl shrink-0" />
            <div>
              <h3 className="font-bold text-[#1a1a1a] text-sm">
                4000+
              </h3>
              <p className="text-[10px] text-[#6b6258]">
                Turbans Tied
              </p>
            </div>
          </div>

          {/* Stat 2 */}
          <div className="flex items-center justify-center gap-3 text-center">
            <FaCalendarCheck className="text-[#c9913a] text-xl shrink-0" />
            <div>
              <h3 className="font-bold text-[#1a1a1a] text-sm">
                2000+
              </h3>
              <p className="text-[10px] text-[#6b6258]">
                Weddings Served
              </p>
            </div>
          </div>

          {/* Center Heading */}
          <div className="col-span-2 lg:col-span-1 text-center order-first lg:order-none">
            <h2 className="font-serif text-[#1a1a1a] text-xl sm:text-2xl font-semibold">
              What We Offer
            </h2>

            <div className="w-12 h-[2px] bg-[#c9913a] mx-auto mt-2 mb-2"></div>

            <p className="text-[10px] sm:text-[11px] text-[#8a7d6f] tracking-[0.2em] uppercase">
              Punjabi Turban • Baraati Safa • Groom Special • Tying Classes
            </p>

            <p className="text-[11px] text-[#a09080] mt-1 italic">
              Tradition tied with perfection, for every occasion
            </p>
          </div>

          {/* Stat 3 */}
          <div className="flex items-center justify-center gap-3 text-center">
            <FaGraduationCap className="text-[#c9913a] text-xl shrink-0" />
            <div>
              <h3 className="font-bold text-[#1a1a1a] text-sm">
                500+
              </h3>
              <p className="text-[10px] text-[#6b6258]">
                Students Trained
              </p>
            </div>
          </div>

          {/* Stat 4 */}
          <div className="flex items-center justify-center gap-3 text-center">
             <FaHeart className="text-[#c9913a] text-xl shrink-0" />
            <div>
              <h3 className="font-bold text-[#1a1a1a] text-sm">
                1500+
              </h3>
              <p className="text-[10px] text-[#6b6258]">
                Happy Customers
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default ServiceHighlights;