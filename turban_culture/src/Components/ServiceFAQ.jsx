import { useState } from "react";
import {
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaInstagram,
} from "react-icons/fa";

export default function ServiceFAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      q: "How early should I book for a wedding?",
      a: "We recommend booking at least 15–20 days before the event to ensure availability and allow time for custom fabric matching.",
    },
    {
      q: "Is a trial session available before the wedding?",
      a: "Yes, we provide a trial session to help you choose the turban style, color, and fabric before finalizing your booking.",
    },
  ];

  return (
    <section className="w-full bg-[#fcf3e8] py-8 md:py-10 lg:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Heading */}
        <div className="mb-6 text-center md:mb-8">
          <h2 className="font-serif text-[22px] font-bold text-[#231a12] sm:text-[24px] lg:text-[28px]">
            Frequently Asked Questions
          </h2>

          <p className="mt-1 text-[12px] text-[#8c7d6c] sm:text-[13px]">
            Everything you need to know
          </p>
        </div>

        {/* Main Cards */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-12">

          {/* 1. Personal Training */}
          <div className="flex flex-col rounded-2xl border border-[#eadfce] bg-[#faf2e7] p-5 md:p-[18px] lg:col-span-3">

            <div className="flex items-start gap-2.5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#c89a48] text-[12px] text-white">
                ◐
              </div>

              <h3 className="font-serif text-[15px] font-bold leading-[19px] text-[#231a12]">
                Personal Training
              </h3>
            </div>

            <p className="mt-3 text-[11px] leading-[17px] text-[#6e5e4e]">
              Looking for personalized turban training? We provide one-to-one
              training sessions with individual guidance based on your learning
              needs.
            </p>

            <div className="mt-3 space-y-1 text-[11px] text-[#3f3328]">
              <p>✓ One-to-One Personal Training</p>
              <p>✓ Individual Guidance & Practical Learning</p>
              <p>✓ Learn at Your Own Pace</p>
              <p>✓ Home Visit Training Available</p>
            </div>

          </div>

          {/* 2. Online Classes */}
          <div className="rounded-2xl border border-[#ecdfca] bg-[#fcf6ed] p-5 md:p-[18px] lg:col-span-3">

            <div className="flex items-start gap-2.5">

              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#f2d19d] text-[12px]">
                💻
              </div>

              <div>
                <h4 className="text-[14px] font-bold text-[#231a12]">
                  Online Classes
                </h4>

                <span className="mt-1 inline-block rounded-full bg-[#f5c97a] px-2.5 py-1 text-[9px] font-bold text-[#5a3a0f]">
                  Live Zoom Sessions
                </span>
              </div>

            </div>

            <ul className="mt-4 space-y-1.5 text-[11px] text-[#5f5042]">
              <li>• Live virtual training</li>
              <li>• Recorded tutorials access</li>
              <li>• Certificate upon completion</li>
              <li>• Q&A with Expert Trainer</li>
            </ul>

            <p className="mt-5 text-[12px] font-bold text-[#231a12]">
              Starts at ₹2,999
            </p>

          </div>

          {/* 3. Offline Classes */}
          <div className="rounded-2xl border border-[#ecdfca] bg-[#fcf6ed] p-5 md:p-[18px] lg:col-span-3">

            <div className="flex items-start gap-2.5">

              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#f2d19d]">
                <FaMapMarkerAlt className="text-[15px] text-[#8a5a1f]" />
              </div>

              <div>
                <h4 className="text-[14px] font-bold text-[#231a12]">
                  Offline Classes
                </h4>

                <span className="mt-1 inline-block rounded-full bg-[#e8dfd1] px-2.5 py-1 text-[9px] font-bold text-[#5a4a3a]">
                  In-Person Sessions
                </span>
              </div>

            </div>

            <ul className="mt-4 space-y-1.5 text-[11px] text-[#5f5042]">
              <li>• Offline classes available in Rania & Sirsa</li>
              <li>• Local in-person training sessions</li>
              <li>• Hands-on practical learning</li>
              <li>• Training material will be arranged by students</li>
            </ul>

            <p className="mt-5 text-[12px] font-bold text-[#231a12]">
              Starts at ₹2,999
            </p>

          </div>

          {/* 4. FAQ */}
          <div className="space-y-3 md:col-span-2 lg:col-span-3">

            {faqs.map((item, i) => {
              const isOpen = openIndex === i;

              return (
                <div
                  key={i}
                  className="rounded-2xl border border-[#ecdfca] bg-[#fcf6ed] p-4"
                >

                  <button
                    type="button"
                    onClick={() =>
                      setOpenIndex(isOpen ? -1 : i)
                    }
                    className="flex w-full items-start justify-between gap-3 text-left"
                    aria-expanded={isOpen}
                  >

                    <h4 className="pt-1 text-[11px] font-bold leading-[15px] text-[#231a12]">
                      {item.q}
                    </h4>

                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#d9c3a0] text-[16px] leading-none text-[#8a681f] transition">
                      {isOpen ? "−" : "+"}
                    </span>

                  </button>

                  <div
                    className={`grid transition-all duration-300 ${
                      isOpen
                        ? "mt-2 grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="text-[10.5px] leading-[16px] text-[#6e5e4e]">
                        {item.a}
                      </p>
                    </div>
                  </div>

                </div>
              );
            })}

          </div>

        </div>

        {/* Contact Information */}
        <div className="mt-6 rounded-2xl border border-[#e9dcc3] bg-[#f8efe3] p-5 sm:p-6">

          <div className="flex flex-col items-center justify-between gap-5 text-center md:flex-row md:text-left">

            {/* Contact Text */}
            <div className="max-w-3xl">

              <h3 className="font-serif text-[18px] font-bold text-[#231a12]">
                Need More Information?
              </h3>

              <p className="mt-1.5 text-[11px] leading-[17px] text-[#6e5e4e] sm:text-[12px]">
                For personal training, classes, bookings, or any other
                information, feel free to contact us. You can call us,
                message us on Instagram, or send an enquiry through our
                website.
              </p>

            </div>

            {/* Contact Buttons */}
            <div className="flex flex-wrap justify-center gap-2 md:justify-end">

              {/* Call */}
              <a
                href="tel:+919350517309"
                className="flex items-center gap-1.5 rounded-full bg-[#c9913a] px-4 py-2.5 text-[11px] font-bold text-white transition hover:opacity-90 active:scale-95"
              >
                <FaPhoneAlt className="text-[11px]" />
                Call Us
              </a>

              {/* Instagram */}
              <a
                href="https://instagram.com/turbanculture.in"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 rounded-full border border-[#d8b987] bg-[#fcf6ed] px-4 py-2.5 text-[11px] font-bold text-[#8a5a1f] transition hover:bg-[#f5e8d5] active:scale-95"
              >
                <FaInstagram className="text-[14px]" />
                Instagram
              </a>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}