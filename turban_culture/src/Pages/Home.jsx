import React, { useEffect, useRef, useState } from 'react'
import groom2 from '../assets/groom2.png'
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
import turbanCultureRemovedBG from '../assets/turbanCultureRemovedBG.png'
import SidebarScroll from '../Components/SidebarScroll'
import WhatsappChat from '../Components/whatsappChat'
import LeadsForm from '../Components/LeadsForm'

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
  useEffect(() => {
    const fetchGallery = async () => {
      const res = await axios.get(`${API_URL}/api/gallery`)
   const images = res.data?.images?.map(
  (item) => item.imageUrl
) || [];
      setMyImages(images);
    };
    fetchGallery();
  }, []);
  return (
    <div className='bg-gradient-to-b from-[#fdfaf6] via-[#fff] to-[#fdfaf6]'>

      {/* Hero - Main component ch button styling sudhaar lavi */}
      <Main
        image={groom2}
        text="LEGACY & ELEGANCE"
        head1="Professional"
        head2="Turban"
        head3="Tying Service"
        line="Har shaadi nu yadgaar banaao. Expert turban tying — booked at your date, delivered with pride."
        button="Book Your Royal Look"
      />

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
            <h1 className='font-serif text-3xl sm:text-4xl lg:text-5xl text-[#1a1a1a] mt-2 leading-tight'>
              The Heritage of the <span className="text-[#c9913a]">Turban</span>
            </h1>
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
              we specialize in premium turban styling, where every single fold is crafted with utmost
              precision, elegance, and cultural authenticity. From the majestic Patiala Shahi
              to bespoke contemporary wedding styles, we ensure the crown of your big day is tied to perfection.
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


      {/* Services Section - IMPROVED */}
      <div className='bg-gradient-to-b from-white to-[#fdfaf6] p-5'>
        <Reveal>
          <div className='text-center '>
            <span className="text-[#c9913a] font-semibold tracking-widest text-xs uppercase">What We Offer</span>
            <h1 className='font-serif text-3xl sm:text-4xl lg:text-5xl text-[#1a1a1a] mt-3 mb-3'>Curated Services</h1>
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

        <h1 className='text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#c9913a]'>
          Royal Gallery
        </h1>

        {/* <div className='w-20 h-[2px] bg-[#c9913a] mx-auto mt-4'></div> */}

        {/* <p className='text-[#888888] mt-5 max-w-2xl mx-auto text-sm md:text-base leading-relaxed'>
          Explore our collection of wedding turbans, royal safas,
          and unforgettable moments crafted with tradition,
          elegance, and perfection.
        </p> */}
      </div>


      <SidebarScroll
        images={myImages}
        height="250px"
        speed="30s"
        direction="right"
      />

      {/* Review Section - IMPROVED */}
      <div className="px-6 sm:px-10 pb-20 sm:pb-16 mt-8 flex flex-col lg:flex-row gap-8 items-start justify-center">
        <Reveal>
          <div className='relative flex flex-col items-center text-center m-auto w-full max-w-3xl bg-gradient-to-br from-[#FFFEF0] to-[#fff] p-8 sm:p-12 rounded-3xl shadow-xl border border-[#c9913a]/10'>

            {/* Quote icon */}
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-[#c9913a] rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z" />
              </svg>
            </div>

            <p className='font-serif text-lg sm:text-xl text-[#3a3a3a] leading-9 italic mb-8 mt-4'>
              "Turban Culture transformed my wedding journey into a truly royal experience. Every detail was handled with perfection, and the elegance lasted throughout the entire celebration. A master of his craft."
            </p>

            <div className="flex flex-col items-center">
              <img
                className='w-20 h-20 rounded-full object-cover mb-4 border-4 border-[#c9913a]/30 shadow-lg'
                src={groom_review}
                alt="Ranveer Singh"
              />
              <h2 className='font-semibold tracking-widest text-sm text-[#1a1a1a]'>RANVEER SINGH</h2>
              <p className='text-[#a08060] text-xs mt-1'>November 2023 Groom</p>

              {/* 5 Stars */}
              <div className="flex gap-1 mt-3">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-4 h-4 text-[#c9913a]" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>
          </div>
        </Reveal>


        <LeadsForm />
      </div>
    </div>
  )
}

export default Home