import { useState, useEffect } from 'react'
import axios from 'axios'
import { Helmet } from "react-helmet-async";
import Main from '../Components/Main'
import ServiceCard from '../Components/ServiceCard'
import turban1 from '../assets/turban1.webp'
import punjabi_groom1 from '../assets/punjabi_groom1.jpg'
import turban3 from '../assets/turban3.webp'
import lehriya from '../assets/lehriya.webp'
import jodpuri from '../assets/jodpuri.jpg'
import jodpuri_safa from '../assets/jodpuri_safa.jpg'
import jodpuri2 from '../assets/jodpuri2.jpg'
import PackagesCard from '../Components/PackagesCard'
import service3 from '../assets/service3.png'
import family_turban2 from '../assets/family_turban2.jpg'

import ServiceHighlights from '../Components/SeerviceHighlights'
import ServiceFAQ from '../Components/ServiceFAQ'

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
    <>

    <Helmet>
  <title>Wedding Turban & Pagg Tying Services in Rania & Sirsa | Turban Culture</title>
  <meta
    name="description"
    content="Explore professional groom turban, Punjabi pagg, Jodhpuri safa and baraati turban tying services in Rania, Sirsa and nearby areas."
  />
    <link rel="canonical" href="https://turbanculture.com/Services" />

</Helmet>

    <div className='bg-[#fdfaf6]'>

      <Main
        image={service3}
        text="turban culture"
        head1="Every Groom "
        head2="Deserves "
        head3="a Royal Look"
        line="From groom turban styling to complete baraat turban services, we create refined and memorable looks that honor tradition while enhancing your special day."
        button="Book Your Turban Artist"
      />
      <div>

        <ServiceHighlights />
      </div>

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
          <p className="text-gray-400 text-sm col-span-3 text-center">Something Royal is on Its Way. Stay Tuned</p>
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto px-4">

        <ServiceCard
          index={0}
          image={turban1}
          title="Amritsar Shahi Turban"
          features={[
            "Face Shape Perfect Fit",
            "Matching Kalgi Styling",
            "Premium Wedding Finish",
            "Perfect For Grooms"
          ]}
        />

        <ServiceCard
          index={1}
          image={turban3}
          title="wattan Wali Pagg"
          features={[
            "Face Shape According Perfectly Styled",
            "Matching Royal Kalgi",
            "Elegant Color Combination",
            "Premium Finishing"
          ]}
        />

        <ServiceCard
          index={2}
          image={punjabi_groom1}
          title="Patiala Shahi Turban"
          features={[
            "Classic Punjabi Design",
            "Matching Couple Style",
            "Royal Wedding Look",
            "Elegant Wedding Colors"
          ]}
        />

        <ServiceCard
          index={3}
          image={family_turban2}
          title="Ivory Elegance Style"
          features={[
            "Bride Side Turban Tying",
            "Matching Family Look",
            "Perfect Wedding Matching",
            "Perfect Wedding Matching"
          ]}
        />

      </div>

      <div className='p-10 text-center'>
        <p className='text-[#a08060]'>ROYAL RAJPUTANA</p>
        <h1 className='font-serif text-3xl text-[#c9913a]'>Hindu Wedding Safas</h1>
        <p className='text-sm text-[#888888] mb-10'>
          Luxury safa styling crafted to make every groom look confident, royal, and distinguished.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto px-4">

          <ServiceCard
            index={0}
            image={lehriya}
            title="Lehriya Safa"
            features={[
              "Traditional Rajasthani Style",
              "Vibrant Lehriya Pattern",
              "Royal Wedding Finish",
              "Elegant Safa Draping"
            ]}
          />

          <ServiceCard
            index={1}
            image={jodpuri}
            title="Royal Jodhpuri"
            features={[
              "Classic Jodhpuri Styling",
              "Premium Safa Finish",
              "Royal Wedding Look",
              "Timeless Elegance"
            ]}
          />

          <ServiceCard
            index={2}
            image={jodpuri_safa}
            title="Rajputana Style"
            features={[
              "Inspired By Rajput Royalty",
              "Perfect for Your Barat",
                "Premium Luxury Finishing",
              "Traditional Safa Tying",
            
            ]}
          />

          <ServiceCard
            index={3}
            image={jodpuri2}
            title="Classic Wedding Safa"
            features={[
              "Traditional Wedding Look",
              "Expert Safa Styling",
              "Elegant Presentation",
              "Perfect For Celebrations"
            ]}
          />

        </div>
      </div>

            <ServiceFAQ/>
    </div>
        </>
  )
}

export default Services