import groom_special_turban_sirsa from '../assets/groom_special_turban_sirsa.png'
import React, { useEffect, useRef, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import punjabi_groom1 from '../assets/punjabi_groom1.jpg'
import family_turban from '../assets/family_turban.jpg'
import jodpuri_safa from '../assets/jodpuri_safa.jpg'
import barat_safa1 from '../assets/barat_safa1.jpg'
import party_hall1 from '../assets/party_hall1.jpg'
import ServiceCard from '../Components/ServiceCard'
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
    <>
      <Helmet>
  <title>
    Wedding Turban & Pagdi Tying Service in Rania, Sirsa | Turban Culture
  </title>

  <meta
    name="description"
    content="Professional wedding turban and pagdi tying service in Rania, Sirsa. Book groom turban, wedding pagdi, Punjabi turban, Jodhpuri safa and baraati pagdi tying for Punjabi weddings and special occasions."
  />

  <link rel="canonical" href="https://turbanculture.com/" />
   <script type="application/ld+json">
  {JSON.stringify({
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Turban Culture",
    url: "https://turbanculture.com/",
    telephone: "+919350517309",
    image: [
      new URL(groom_special_turban_sirsa, import.meta.url).href
    ],
    address: {
      "@type": "PostalAddress",
      streetAddress: "Main Bazaar",
      addressLocality: "Rania",
      addressRegion: "Haryana",
      postalCode: "125076",
      addressCountry: "IN"
    }
  })}
</script>
</Helmet>

      <div className='bg-gradient-to-b from-[#fdfaf6] via-[#fff] to-[#fdfaf6]'>

        {/* Hero - Main component ch button styling sudhaar lavi */}
        <Main
          image={groom_special_turban_sirsa}
          text="PAGG • PAGRI • SAFA • TURBAN"
          head1="Professional"
          head2="Wedding Pagdi & Turban"
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

          {/* Text - SEO Optimized + Premium */}
          <div className='flex flex-col w-full md:w-1/2'>
            <Reveal delay={100}>
              <span className="text-[#c9913a] uppercase tracking-wider text-sm font-semibold">
                Our Heritage • Based in Rania, Sirsa
              </span>
              <h2 className='font-serif text-3xl sm:text-4xl lg:text-5xl text-[#1a1a1a] mt-2 leading-tight'>
                Punjabi <span className="text-[#c9913a]">Pagg, Pagri & Turban</span> <br />
                Tying Heritage
              </h2>
            </Reveal>

            <Reveal delay={150}>
              <p className='leading-8 text-base text-[#555]'>
                A Pagg is not just attire — it is a
                <span className="font-semibold text-[#1a1a1a]">{" "}sacred symbol of honour, royalty & identity.</span>
                {" "}Rooted in Punjabi tradition, it represents dignity and lineage passed through generations.
              </p>
            </Reveal>

            <Reveal delay={300}>
              <p className='leading-8 text-base text-[#555]'>
                At <span className="font-semibold text-[#c9913a]">Turban Culture</span>, we are a professional
                <span className="font-semibold text-[#1a1a1a]">{" "}wedding turban tying service based in Rania, Sirsa, Haryana.</span>
                {" "}We provide expert Punjabi Pagg, Pagri, Jodhpuri Safa & Baraati Pagg tying for grooms and family functions across
                <span className="font-semibold text-[#1a1a1a]">{" "}Sirsa, Hisar, Fatehabad, Bathinda, Chandigarh, Delhi NCR & destination weddings across India.</span>
              </p>
            </Reveal>

            <Reveal delay={450}>
              <div className="flex items-center gap-4 pt-4">
                <div className="h-px bg-[#c9913a] w-12"></div>
                <p className='leading-7 text-sm sm:text-base text-[#1a1a1a] font-medium italic'>
                  Every groom from Rania to Delhi deserves his turban tied with grace, confidence & royal perfection.
                </p>
              </div>
            </Reveal>

            <Reveal delay={550}>
              <div className="flex flex-wrap gap-3 pt-6 mb-10 md:mb-5 lg:mb-2">
                <span className="px-4 py-1.5 rounded-full bg-[#fdf6ec] border border-[#e8d5b5] text-xs font-semibold tracking-wider text-[#1a1a1a]">RANIA • SIRSA</span>
                <span className="px-4 py-1.5 rounded-full bg-[#fdf6ec] border border-[#e8d5b5] text-xs font-semibold tracking-wider text-[#1a1a1a]">PUNJABI turban EXPERTS</span>
                <span className="px-4 py-1.5 rounded-full bg-[#fdf6ec] border border-[#e8d5b5] text-xs font-semibold tracking-wider text-[#1a1a1a]">PAN-INDIA SERVICE</span>
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
        {/* Desktop te 5 cols, Mobile te Stack Chipakna */}
        <div className="max-w-7xl mx-auto px-3 lg:px-10 pb-0">
          <div className="flex flex-col lg:grid lg:grid-cols-5 lg:gap-6 gap-10">
            <ServiceCard index={0} total={5} image={punjabi_groom1} title="Groom tying a traditional Punjabi wedding turban" features={["Premium Turban Tying", "Style Consultation", "Professional Fitting", "Perfect Finish"]} />
            <ServiceCard index={1} total={5} image={family_turban} title="Family Punjabi turban tying for wedding" features={["Traditional Turban Tying", "Family Style Matching", "Professional Fitting", "Final Adjustments"]} />
            <ServiceCard index={2} total={5} image={jodpuri_safa} title="Royal Jodhpuri safa for wedding" features={["Jodhpuri Style Safa", "Premium Fabric Styling", "Royal Look Finish", "Professional Tying"]} />
            <ServiceCard index={3} total={5} image={barat_safa1} title="Baraati safa styling for Punjabi wedding" features={["Baraat Ready Safa", "Matching Style Options", "Professional Fitting", "Quick Finishing"]} />
            <ServiceCard index={4} total={5} image={party_hall1} title="Special Occasion" features={["Event Turban Styling", "Custom Color Matching", "Professional Tying", "Elegant Final Look"]} />
          </div>
        </div>

       

        {/* Agla section - mt-0 rakho */}
        <div className="mt-2">
        </div>
        <div className='text-center pb-8 md:py-16 px-4'>
          <p className='text-[#a08060] tracking-[4px] uppercase text-sm mb-2'>
            Our Collection
          </p>

          <h2 className='text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#c9913a]'>
            Royal Gallery
          </h2>
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
          <div className="relative max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">

            {/* Heading */}
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

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">

              {/* Callback Form */}
              <div className="lg:col-span-4">
                <LeadsForm />
              </div>

              {/* Map / Google Reviews */}
              <div className="lg:col-span-8">
                <div className="w-full bg-white rounded-3xl p-4 sm:p-6 lg:p-7 shadow-xl border border-orange-100">

                  <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
                    Visit Turban Culture
                  </h3>

                  <p className="text-gray-600 text-base sm:text-lg mb-5">
                    Main Bazaar, Rania, Haryana 125076
                  </p>

                  {/* Bigger Google Map */}
                  <GoogleReviews />

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
    </>

  )
}

export default Home