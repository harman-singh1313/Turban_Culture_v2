import { useState, useEffect } from 'react'
import axios from 'axios'
import Main from '../Components/Main'
import turban_tying from '../assets/turban_tying.png'
import ServiceCard from '../Components/ServiceCard'
import turban1 from '../assets/turban1.png'
import turban2 from '../assets/turban2.png'
import turban3 from '../assets/turban3.png'
import turban4 from '../assets/turban4.jpg'
import lehriya from '../assets/lehriya.webp'
import jodpuri from '../assets/jodpuri.jpg'
import jodpuri_safa from '../assets/jodpuri_safa.jpg'
import jodpuri2 from '../assets/jodpuri2.jpg'
import PackagesCard from '../Components/PackagesCard'

const API_URL = import.meta.env.VITE_API_URL || "http://3.27.155.171:5000";

const Services = () => {
  const [packagesData, setPackagesData] = useState([])

  useEffect(() => {
    const fetchPackages = async () => {
      try {
const res = await axios.get(`${API_URL}/api/pricing`)
        const packages = res.data?.pricing?.packages
        if (!packages) return
        const activePackages = packages.filter(p => p.isActive)
        setPackagesData(activePackages)
      } catch (err) {
        console.log("Packages fetch error:", err)
      }
    }
    fetchPackages()
  }, [])

  return (
    <div className='bg-[#fdfaf6]'>

      <Main
        image={turban_tying}
        text="turban culture"
        head1="Styled "
        head2="For "
        head3="Royal Moments"
        line="Crafted with tradition and styled with elegance.  
                Creating royal looks for unforgettable moments.."
        button="Book Now→"
      />

      <div className='text-center py-12'>
        <p className='text-[#a08060] text-sm tracking-[4px] uppercase mb-2'>
          Royal Experience
        </p>
        <h1 className='text-4xl md:text-5xl font-serif font-bold text-[#c9913a]'>
          Our Packages
        </h1>
        <div className='w-20 h-[2px] bg-[#c9913a] mx-auto mt-4'></div>
        <p className='text-[#888888] text-sm mt-4 max-w-lg mx-auto'>
          Choose the perfect package for your special day and enjoy a royal turban styling experience.
        </p>
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8 max-w-6xl mx-auto px-4 mb-20'>
        {packagesData.length === 0 ? (
          <p className="text-gray-400 text-sm col-span-3 text-center">Koi package available nahi hai abhi.</p>
        ) : (
          packagesData.map((pkg) => (
            <PackagesCard
              key={pkg._id}
              badge={pkg.badge}
              desc={pkg.desc}
              icon={pkg.icon}
              name={pkg.name}
              price={pkg.price}
              features={pkg.features}
              popular={pkg.isFeatured}
              theme={pkg.theme || "silver"}
            />
          ))
        )}
      </div>

      {/* baaki sab same rehne do */}
      <h1 className='text-3xl md:text-4xl font-serif text-center m-5 font-bold text-[#c9913a]'>
        Punjabi Weeding Styles
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto px-15 lg:px-0">
        <ServiceCard image={turban1} title="Groom Special" description="The ultimate royal experience. Includes fabric selection guidance and a dedicated session for the perfect turban" />
        <ServiceCard image={turban2} title="Groom Special" description="The ultimate royal experience. Includes fabric selection guidance and a dedicated session for the perfect turban" />
        <ServiceCard image={turban3} title="Groom Special" description="The ultimate royal experience. Includes fabric selection guidance and a dedicated session for the perfect turban" />
        <ServiceCard image={turban4} title="Groom Special" description="The ultimate royal experience. Includes fabric selection guidance and a dedicated session for the perfect turban" />
      </div>

      <div className='p-10 text-center'>
        <p className='text-[#a08060]'>ROYAL RAJPUTANA</p>
        <h1 className='font-serif text-3xl text-[#c9913a]'>Hindu Wedding Safas</h1>
        <p className='text-sm text-[#888888] mb-10'>
          Luxury safa styling crafted to make every groom look confident, royal, and distinguished.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto px-4">
          <ServiceCard image={lehriya} title="Groom Special" description="The ultimate royal experience. Includes fabric selection guidance and a dedicated session for the perfect turban" />
          <ServiceCard image={jodpuri} title="Groom Special" description="The ultimate royal experience. Includes fabric selection guidance and a dedicated session for the perfect turban" />
          <ServiceCard image={jodpuri_safa} title="Groom Special" description="The ultimate royal experience. Includes fabric selection guidance and a dedicated session for the perfect turban" />
          <ServiceCard image={jodpuri2} title="Groom Special" description="The ultimate royal experience. Includes fabric selection guidance and a dedicated session for the perfect turban" />
        </div>
      </div>

    </div>
  )
}

export default Services