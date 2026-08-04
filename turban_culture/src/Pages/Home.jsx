import groom2 from '../assets/groom2.webp'
import React, { useEffect, useRef, useState } from 'react'
import punjabi_groom from '../assets/punjabi_groom.jpg'
import family_turban from '../assets/family_turban.jpg'
import jodpuri_safa from '../assets/jodpuri_safa.jpg'
import barat_safa from '../assets/barat_safa.jpg'
import party_hall from '../assets/party_hall.jpg'
import ServiceCard from '../Components/ServiceCard'
import groom_review from '../assets/groom_review.jpg'
import Main from '../Components/Main'
import transparent1 from '../assets/transparent1.png'
import axios from 'axios'
import SidebarScroll from '../Components/SidebarScroll'
import LeadsForm from '../Components/LeadsForm'
import SideBarVedio from '../Components/SideBarVideo'
import GoogleReviews from '../Components/GoogleReviews'

const API_URL = import.meta.env.VITE_API_URL || "http://3.27.155.171:5000";

// Scroll reveal wrapper - Added stagger effect

const Reveal = ({ children, delay = 0, className = '' }) => {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])



  return (
    <div
      ref={ref}
      style={{
        transitionDelay: `${delay}ms`,
        transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)'
      }}
      className={`${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'} ${className}`}
    >
      {children}
    </div>
  )
}

const Home = () => {
  const [myImages, setMyImages] = useState([]);
const [showMedia, setShowMedia] = useState(false);
useEffect(() => {
  let timer;

  const fetchGallery = async () => {
    try {
      const fastRes = await axios.get(`${API_URL}/api/gallery?limit=8`);

      const fastImages =
        fastRes.data?.images?.map((item) => item.imageUrl) || [];

      setMyImages(fastImages);

      timer = setTimeout(async () => {
        try {
          const fullRes = await axios.get(`${API_URL}/api/gallery`);

          const fullImages =
            fullRes.data?.images?.map((item) => item.imageUrl) || [];

          setMyImages(fullImages);
        } catch (err) {
          console.error("Full gallery load error:", err);
        }
      }, 2000);
    } catch (err) {
      console.error("Gallery load error:", err);
    }
  };

  fetchGallery();

  return () => clearTimeout(timer);
}, []);

useEffect(() => {
  const t = setTimeout(() => {
    setShowMedia(true);
  }, 1500); // 1.5 second baad media load

  return () => clearTimeout(t);
}, []);
  return (
    <div className='bg-gradient-to-b from-[#fdfaf6] via-[#fff] to-[#fdfaf6]'>

      {/* Hero - Main component ch button styling sudhaar lavi */}
 <Main
  image={groom2}
  text="PAGG • PAGRI • SAFA • TURBAN"
 head1="Professional"
  head2="Wedding Turban"
  head3="Tying Service"
  line="Professional Punjabi pagg, pagri, safa, and wedding turban tying services for grooms, baraat, jaggo, receptions, family functions, and destination weddings across India."
  button="Book Your Royal Look"
/>

{/* SEO Hidden Content */}


      {/* Heritage Section - IMPROVED */}
      <div className='relative flex flex-col md:flex-row px-10   lg:px-24  sm:py-16  md:gap-16 items-center overflow-hidden'>

        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-[#c9913a]/5 rounded-full blur-3xl -z-10"></div>

        {/* Image with floating hover effect */}
        <Reveal className='w-full md:w-1/2 flex justify-center flex-shrink-0'>
          <img
            className='
        w-full
        max-w-xs
        sm:max-w-sm
        md:max-w-md
        object-contain
        drop-shadow-2xl
        transition-all
        duration-700
        ease-out
        hover:scale-110
        hover:-translate-y-3
      '
            src={transparent1}
            alt="Orange Turban"
          />
        </Reveal>

        {/* Text - Better hierarchy */}
        <div className='flex flex-col  w-full md:w-1/2'>
          <Reveal delay={100}>
            <span className="text-[#c9913a] uppercase tracking-wider text-sm font-semibold">
              Our Heritage
            </span>
            <h2 className='font-serif text-3xl sm:text-4xl lg:text-5xl text-[#1a1a1a] mt-2 leading-tight'>
               Punjabi <span className="text-[#c9913a]">Pagg, Pagri & Turban</span> <br />
                 Tying Heritage
            </h2>
          </Reveal>

          <Reveal delay={150}>
            <p className='leading-8 text-base text-[#555]'>
              A turban is not just an attire — it is a
              <span className="font-semibold text-[#1a1a1a]">
                {" "}sacred symbol of honor, royalty, and identity
              </span>.
              In Punjabi and Hindu wedding traditions, a meticulously tied Pagg represents
              supreme dignity, lineage, and the timeless legacy carried forward through generations.
            </p>
          </Reveal>

          <Reveal delay={300}>
           <p className='leading-8 text-base text-[#555]'>
      At <span className="font-semibold text-[#c9913a]">Turban Culture</span>,
      we provide professional
      <span className="font-semibold text-[#1a1a1a]">
        {' '}Punjabi Pagg, Pagri, Safa, and Wedding Turban Tying Services
      </span>
      for grooms, baraat members, jaggo ceremonies, family functions, and
      cultural events across
  <span className="font-semibold text-[#1a1a1a]">
  {' '}Punjab, Haryana, Delhi, Rajasthan, Chandigarh, and wedding destinations across India
</span>.
      Every fold is crafted with precision, elegance, and cultural authenticity.
    </p>
          </Reveal>


          <Reveal delay={450}>
            <div className="flex items-center gap-4 pt-4">
              <div className="h-px bg-[#c9913a] w-12"></div>
              <p className='leading-7 text-sm sm:text-base text-[#1a1a1a] font-medium italic'>
                Every groom deserves to have his turban tied with absolute grace,
                unmatched confidence, and royal perfection.
              </p>
            </div>
          </Reveal>
        </div>
      </div>

     {showMedia && <SideBarVedio />}

      {/* Services Section - IMPROVED */}
      <div className='bg-gradient-to-b from-white to-[#fdfaf6] p-5'>
        <Reveal>
          <div className='text-center '>
            <span className="text-[#c9913a] font-semibold tracking-widest text-xs uppercase">What We Offer</span>
            <h2 className='font-serif text-3xl sm:text-4xl lg:text-5xl text-[#1a1a1a] mt-3 mb-3'>Curated Services</h2>
            <p className='text-[#a08060] text-base max-w-xl mx-auto'>Tailored excellence for every occasion, crafted with royal precision</p>
          </div>
        </Reveal>
      </div>

      {/* Cards grid - Fully Responsive */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5 sm:gap-6 max-w-7xl mx-auto  mb-16 px-10">
        <ServiceCard
          index={0}
          image={punjabi_groom}
          title="Groom Special"
          description="The ultimate royal experience. Includes fabric selection guidance and a dedicated session for the perfect turban."
        />

        <ServiceCard
          index={1}
          image={family_turban}
          title="Family Tying"
          description="Group services for Baratis and Family members with uniform elegance."
        />

        <ServiceCard
          index={2}
          image={jodpuri_safa}
          title="Royal Jodhpuri Safa"
          description="From fabric selection to final styling, every safa is customized professionally."
        />

        <ServiceCard
          index={3}
          image={barat_safa}
          title="Baraati Safa"
          description="Professionally tied baraati safas for elegance and perfect coordination."
        />

        <ServiceCard
          index={4}
          image={party_hall}
          title="Special Occasion"
          description="Professional turban styling for family functions, receptions, and cultural celebrations."
        />
      </div>

      <div className='text-center pb-8 md:py-16 px-4'>
        <p className='text-[#a08060] tracking-[4px] uppercase text-sm mb-2'>
          Our Collection
        </p>

        <h2 className='text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#c9913a]'>
          Royal Gallery
        </h2>

        {/* <div className='w-20 h-[2px] bg-[#c9913a] mx-auto mt-4'></div> */}

        {/* <p className='text-[#888888] mt-5 max-w-2xl mx-auto text-sm md:text-base leading-relaxed'>
          Explore our collection of wedding turbans, royal safas,
          and unforgettable moments crafted with tradition,
          elegance, and perfection.
        </p> */}
      </div>


     {showMedia && (
  <SidebarScroll
    images={myImages}
    height="250px"
    speed="30s"
    direction="right"
  />
)}

<section className="relative py-10 md:py-14 overflow-hidden bg-gradient-to-b from-orange-50 via-white to-gray-50">
  <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="text-center mb-8 md:mb-10">
      <span className="inline-block bg-orange-100 text-orange-600 text-sm font-semibold px-4 py-2 rounded-full mb-3">
        Wedding Turban Service
      </span>

      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-3">
        Book Your <span className="text-orange-500">Turban Artist</span>
      </h2>

      <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto">
        Get a quick callback and visit our trusted Google Business profile.
      </p>
    </div>

    <div className="grid lg:grid-cols-12 gap-6 lg:gap-8 items-start">
      <div className="lg:col-span-5">
        <LeadsForm />
      </div>

      <div className="lg:col-span-7">
        <div className="w-full bg-white rounded-3xl p-4 sm:p-5 shadow-lg border border-orange-100">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Visit Turban Culture
          </h3>

          <p className="text-gray-600 mb-4">
            Main Bazaar, Rania, Haryana 125076
          </p>

          <div className="rounded-2xl overflow-hidden border border-gray-200">
            <GoogleReviews/>
          </div>

          <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            Open 24 hours • Quick response for bookings
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
    </div>
  )
}

export default Home