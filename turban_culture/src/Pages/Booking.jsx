import BookingForm from '../Components/BookingForm'
import PackagesCard from '../Components/PackagesCard'
import { Link } from 'react-router-dom'
import ServiceCard from '../Components/ServiceCard'
import punjabi_groom from '../assets/punjabi_groom.jpg'
import punjabiCouple from '../assets/PunjabiCouple.jpg'
import Notice from '../Components/Notice'
import QuickBookingForm from '../Components/QuickBookingForm'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { SlLocationPin } from "react-icons/sl";
import { GrAchievement } from "react-icons/gr";
import { TiTickOutline } from "react-icons/ti";
const Booking = () => {
  const [selectedPackage, setSelectedPackage] = useState(null)
  const [packagesData, setPackagesData] = useState([])

  useEffect(() => {
    const fetchPackages = async () => {
      try {
const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/pricing`)
        console.log("API response:", res.data) // ← pehli var ye dekho console vich

        const packages = res.data?.pricing?.packages
        if (!packages) {
          console.warn("No packages array found in response")
          return
        }
        const activePackages = packages.filter(p => p.isActive)
        setPackagesData(activePackages)
      } catch (err) {
        console.log("Packages fetch error:", err)
      }
    }
    fetchPackages()
  }, [])

  const handleBooking = (pkg) => {
    setSelectedPackage(pkg)
    console.log("Selected:", pkg)
  }

  const closePopup = () => {
    setSelectedPackage(null)
  }

  return (
    <div className="bg-[#fdfaf6] min-h-screen">

      {/* ── Hero Section ── */}
      <div className="text-center pt-5 mt-10 px-6">
        <p className="text-[#c9913a] tracking-[0.3em] text-sm mb-3">✦ ✦ ✦</p>
        <h1 className="font-serif text-4xl text-[#3d2e1e] mb-2">
          Book Your <span className="text-[#c9913a]">Appointment</span>
        </h1>
        <div className="w-14 h-px bg-[#c9913a] opacity-40 mx-auto mb-4" />
        <p className="text-[#888] text-sm max-w-md mx-auto leading-relaxed mb-10">
          Professional Turban Tying services for Your Special Day
        </p>
        {/* <p className='my-3'>
          <span className="text-[10px] tracking-[0.18em] uppercase text-[#b18236] bg-[#c9913a]/10 px-2 py-1 rounded-full">
            Please review the pricing information below before filling out the booking form.
          </span>
        </p> */}
      </div>

      {/* <Notice /> */}

      {/* ── Form + Info Cards ── */}
  <div className="flex flex-wrap gap-8 justify-center items-start max-w-5xl mx-auto px-4 mb-20 bg-white rounded-3xl shadow-xl p-6">
  <div className="flex flex-col gap-5 w-64">
    {[
      {
        icon: <GrAchievement />,
        title: "Expert Stylists",
        text: "Professional turban artists with 5+ years of experience in traditional styling. Specializing in Punjabi and Rajasthani turbans for weddings and special occasions."
      },
      {
        icon: <SlLocationPin />,
        title: "We Come to You",
        text: "On-location turban styling with free travel up to 40 km from Rania (Sirsa)."
      },
      {
        icon: <TiTickOutline />,
        title: "Instant Confirmation",
        text: "Our team will contact you within 24 hours. A confirmation message and booking details will be sent to your email—please keep them safe for future reference."
      },
    ].map((card) => (
      <div
        key={card.title}
        className="
          bg-white
          border border-[#c9913a]/30
          rounded-2xl
          p-5
          shadow-lg
          hover:shadow-2xl
          hover:-translate-y-2
          hover:scale-[1.02]
          hover:border-[#c9913a]
          hover:bg-gradient-to-b
          hover:from-white
          hover:to-[#fffaf2]
          transition-all
          duration-300
          cursor-pointer
        "
      >
        <div className="w-12 h-12 rounded-full bg-[#c9913a]/10 flex items-center justify-center text-[#c9913a] text-2xl mb-3">
          {card.icon}
        </div>

        <h3 className="font-serif text-base font-semibold text-[#c9913a] mb-2">
          {card.title}
        </h3>

        <p className="text-sm text-gray-600 leading-relaxed">
          {card.text}
        </p>
      </div>
    ))}
  </div>

  <BookingForm />
</div>

      {/* ── Packages Section ── */}
      <div className="text-center mb-8 px-4">
        <span className="inline-block text-[10px] tracking-[0.18em] uppercase text-[#c9913a] bg-[#c9913a]/10 px-4 py-1 rounded-full mb-3">
          Our Offerings
        </span>
        <h2 className="font-serif text-2xl text-[#3d2e1e] mb-1">
          Premium Packages
        </h2>
        <p className="text-[#aaa] text-xs">
          Choose the experience that suits your celebration
        </p>
        <div className="w-10 h-0.5 bg-gradient-to-r from-[#c9913a] to-[#f0c040] rounded-full mx-auto mt-3" />
      </div>

      <div className="flex flex-wrap gap-5 justify-center px-4 pb-20">
        {packagesData.length === 0 ? (
          <p className="text-gray-400 text-sm">Koi package available nahi hai abhi.</p>
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
              onBook={handleBooking}
            />
          ))

        )}

        {selectedPackage && (
          <QuickBookingForm
            selectedPackage={selectedPackage}
            onClose={closePopup}
          />
        )}
      </div>

    </div>
  )
}

export default Booking