import { NavLink } from 'react-router-dom'
import { FaInstagram, FaFacebookF, FaYoutube } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className='bg-[#1a1a1a] text-[#e8ddd0]'>
      {/* Top Gold Line - matches your site */}
      <div className='h-[1px] bg-gradient-to-r from-transparent via-[#c9913a] to-transparent'></div>

      <div className='max-w-7xl mx-auto px-6 py-14'>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12'>

          {/* Brand - Same as your logo style */}
          <div>
            <h1 className="font-serif text-[#c9913a] text-2xl mb-3 tracking-widest">
              TURBAN CULTURE
            </h1>

            <p className="text-[#9a8c7d] leading-7 text-[14px]">
              Preserving the dignity and tradition of{" "}
              <span className="text-[#e8ddd0] font-medium">
                Pagg tying in Rania, Sirsa
              </span>{" "}
              for the modern gentleman. Professional wedding turban service across
              Haryana & Punjab.
            </p>

            <div className="flex gap-3 mt-6">
              {/* Instagram */}
              <a
                href="https://instagram.com/turbanculture.in"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full border border-[#3a332c] flex items-center justify-center hover:bg-[#c9913a] hover:text-black transition"
                aria-label="Instagram"
              >
                <FaInstagram size={18} />
              </a>

              {/* Facebook */}
              <a
                href="https://www.facebook.com/harman.ramgarhia.52643"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full border border-[#3a332c] flex items-center justify-center hover:bg-[#c9913a] hover:text-black transition"
                aria-label="Facebook"
              >
                <FaFacebookF size={18} />
              </a>

              {/* YouTube */}
              <a
                href="https://www.youtube.com/@Ramgarhia_turbans"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full border border-[#3a332c] flex items-center justify-center hover:bg-[#c9913a] hover:text-black transition"
                aria-label="YouTube"
              >
                <FaYoutube size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-3">
            <h1 className="font-bold mb-2 text-[#c9913a] tracking-widest text-xs uppercase">Quick Links</h1>
            {[
              { name: "Home", path: "/" },
              { name: "Services", path: "/Services" },
              { name: "Gallery", path: "/Gallery" },
              { name: "Booking", path: "/Booking" },
            ].map((link) => (
              <NavLink key={link.path} to={link.path}
                className={({ isActive }) => `w-fit text-[14px] text-[#9a8c7d] hover:text-[#c9913a] transition ${isActive ? "text-[#c9913a]" : ""}`}>
                {link.name}
              </NavLink>
            ))}
          </div>

          {/* Services - SEO for Rania Sirsa */}
          <div className="flex flex-col gap-2.5">
            <h1 className="font-bold mb-3 text-[#c9913a] tracking-widest text-xs uppercase">Our Services</h1>
            <p className="text-[14px] text-[#9a8c7d] hover:text-[#e8ddd0] transition cursor-pointer">Punjabi Wedding Pagg </p>
            <p className="text-[14px] text-[#9a8c7d] hover:text-[#e8ddd0] transition cursor-pointer">Hindu Wedding Safa </p>
            <p className="text-[14px] text-[#9a8c7d] hover:text-[#e8ddd0] transition cursor-pointer">Groom & Baraati Pagg Tying</p>
            <p className="text-[14px] text-[#9a8c7d] hover:text-[#e8ddd0] transition cursor-pointer">Pre-Wedding & Jaggo Turban Service</p>
            <p className="text-[14px] text-[#9a8c7d] hover:text-[#e8ddd0] transition cursor-pointer">Other Occasions & Festivals</p>
            <p className="text-[14px] text-[#c9913a] font-semibold hover:text-white transition cursor-pointer">Professional Turban Tying Classes</p>

            <p className="text-[#c9913a] text-[11px] mt-3 tracking-[0.15em] leading-5 border-t border-[#2a2a2a] pt-3">
              RANIA • SIRSA • HISAR • BATHINDA • DELHI NCR
            </p>
          </div>

          {/* Contact - Local SEO */}
          <div>
            <h1 className='font-bold mb-3 text-[#c9913a] tracking-widest text-xs uppercase'>Contact Us</h1>
            <div className='space-y-3 text-[14px] text-[#9a8c7d]'>
              <p>📍 Main Bazaar, Rania, Sirsa, Haryana 125075</p>
              <p className='text-[#e8ddd0]'>📞 +91 93505-17309</p>
              <p>✉️ enduring.ramgarhia@gmail.com</p>
            </div>
            <button
              onClick={() => window.open("https://wa.me/919350517309", "_blank")}
              className="mt-6 w-full bg-[#c9913a] text-black font-bold py-3 rounded-full hover:bg-white transition text-sm"
            >
              Chat on WhatsApp
            </button>
          </div>

        </div>

        {/* Bottom Line */}
        <div className='border-t border-[#2a2a2a] mt-12 pt-6 flex flex-col md:flex-row justify-between items-center gap-3 text-[12px] text-[#6b5f52]'>
          <p>© {new Date().getFullYear()} Turban Culture, Rania Sirsa. All Rights Reserved.</p>
          <p>Professional Turban Tying Service in Haryana, Punjab & Rajasthan</p>
        </div>
      </div>
    </footer>
  )
}
export default Footer