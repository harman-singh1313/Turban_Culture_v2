import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Slider from '../Components/Slider'
import SidebarScroll from '../Components/SidebarScroll'
import bg_image from '../assets/bg_image.png'

const API_URL = import.meta.env.VITE_API_URL || "http://3.27.155.171:5000";

const Gallery = () => {
  const [myImages, setMyImages] = useState([])
const [loading, setLoading] = useState(true)
  // Fetch gallery images from database
  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await axios.get(
          `${API_URL}/api/gallery`
        )

        const images = res.data.images.map(
          (item) => item.imageUrl
        )

        setMyImages(images)
      } catch (error) {
        console.error('Gallery Fetch Error:', error)
      } finally{
        setLoading(false)
      }
    }

    fetchGallery()
  }, [])

  // Split images into 3 different rows
  const row1 = myImages.filter((_, index) => index % 3 === 0)
  const row2 = myImages.filter((_, index) => index % 3 === 1)
  const row3 = myImages.filter((_, index) => index % 3 === 2)

  return (
    <div className='bg-[#fdfaf6]'>

      {/* Hero Slider */}
      <Slider />

      {/* Heading */}
      <div className='text-center py-12 md:py-16 px-4'>
        <p className='text-[#a08060] tracking-[4px] uppercase text-sm mb-2'>
          Our Collection
        </p>

        <h1 className='text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#c9913a]'>
          Royal Gallery
        </h1>

        <div className='w-20 h-[2px] bg-[#c9913a] mx-auto mt-4'></div>

        <p className='text-[#888888] mt-5 max-w-2xl mx-auto text-sm md:text-base leading-relaxed'>
          Explore our collection of wedding turbans, royal safas,
          and unforgettable moments crafted with tradition,
          elegance, and perfection.
        </p>
      </div>

      {/* Gallery Section */}
   {/* Gallery Section */}
{loading ? (
  <div className="flex items-center justify-center min-h-[500px]">
    <div className="w-14 h-14 border-4 border-[#c9913a] border-t-transparent rounded-full animate-spin"></div>
  </div>
) : (
  <div className='relative w-full min-h-screen overflow-hidden'>

    {/* Background */}
    <div
      className='absolute inset-0'
      style={{
        backgroundImage: `url(${bg_image})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    />

    {/* Overlay */}
    <div className='absolute inset-0 bg-black/55'></div>

    {/* Scrolling Rows */}
    <div className='relative z-10 flex flex-col justify-center gap-6 md:gap-16 py-10 md:py-24 px-4 sm:px-6 md:px-10 overflow-hidden'>

      {row1.length > 0 && (
        <SidebarScroll
          images={row1}
          height="250px"
          speed="30s"
          direction="right"
        />
      )}

      {row2.length > 0 && (
        <SidebarScroll
          images={row2}
          height="250px"
          speed="20s"
          direction="left"
        />
      )}

      {row3.length > 0 && (
        <SidebarScroll
          images={row3}
          height="250px"
          speed="30s"
          direction="right"
        />
      )}

    </div>
  </div>
)}
    </div>
  )
}

export default Gallery