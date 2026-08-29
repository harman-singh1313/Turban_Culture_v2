import React, { useEffect, useState } from 'react'
import { Helmet } from "react-helmet-async";
import axios from 'axios'
import Slider from '../Components/Slider'

const API_URL =
  import.meta.env.VITE_API_URL || 'http://3.27.155.171:5000'

const Gallery = () => {
  // ================= DATA STATES =================

  const [myImages, setMyImages] = useState([])
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)

  // Initially visible
  const [visibleImages, setVisibleImages] = useState(10)
  const [visibleVideos, setVisibleVideos] = useState(3)

  // Loading states
  const [loadedImages, setLoadedImages] = useState({})
  const [loadedVideos, setLoadedVideos] = useState({})

  // Modal states
  const [selectedImage, setSelectedImage] = useState(null)
  const [selectedVideo, setSelectedVideo] = useState(null)


  // ================= FETCH DATA =================

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const [galleryRes, videoRes] = await Promise.all([
          axios.get(`${API_URL}/api/gallery`),
          axios.get(`${API_URL}/api/videos`)
        ])

        const images =
          galleryRes.data.images?.map(
            (item) => item.imageUrl
          ) || []

        const videoData =
          videoRes.data.videos?.map(
            (item) => item.videoUrl
          ) || []

        setMyImages(images)
        setVideos(videoData)

      } catch (error) {
        console.error(
          'Gallery/Video Fetch Error:',
          error
        )
      } finally {
        setLoading(false)
      }
    }

    fetchGallery()
  }, [])


  // ================= IMAGE LOAD =================

  const handleImageLoad = (index) => {
    setLoadedImages((prev) => ({
      ...prev,
      [index]: true
    }))
  }


  // ================= VIDEO LOAD =================

  const handleVideoLoad = (index) => {
    setLoadedVideos((prev) => ({
      ...prev,
      [index]: true
    }))
  }


  // ================= SHOW MORE =================

  const handleShowMoreImages = () => {
    setVisibleImages((prev) => prev + 10)
  }

  const handleShowMoreVideos = () => {
    setVisibleVideos((prev) => prev + 3)
  }


  // ================= CLOSE MODAL =================

  const closeModal = () => {
    setSelectedImage(null)
    setSelectedVideo(null)
  }


  // ================= RENDER =================

  return (
    <>
<Helmet>
  <title>Wedding Turban Gallery | Punjabi Turban & Groom Safa Designs</title>
  <meta
    name="description"
    content="Explore wedding turban, Punjabi pagg, groom safa and baraati turban styles from Turban Culture."
  />

    <link rel="canonical" href="https://turbanculture.com/Gallery" />

</Helmet>

    <div className='min-h-screen bg-[#fdfaf6]'>

      {/* HERO SLIDER */}
      <Slider />


      {/* HEADING */}

      <div className='text-center py-10 sm:py-12 md:py-16 px-4'>

        <p className='text-[#a08060] tracking-[3px] sm:tracking-[4px] uppercase text-xs sm:text-sm mb-2'>
          Our Collection
        </p>

        <h1 className='text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#c9913a]'>
          Royal Gallery
        </h1>

        <div className='w-16 sm:w-20 h-[2px] bg-[#c9913a] mx-auto mt-4'></div>

        <p className='text-[#888888] mt-5 max-w-2xl mx-auto text-sm md:text-base leading-relaxed'>
          Explore our collection of wedding turbans, royal safas,
          and unforgettable moments crafted with tradition,
          elegance, and perfection.
        </p>

      </div>


      {/* GALLERY */}

      <div className='bg-[#f7f0e6] px-3 sm:px-5 md:px-8 lg:px-12 py-8 sm:py-10 md:py-16'>

        {loading ? (

          <div className='flex flex-col items-center justify-center min-h-[400px]'>

            <div className='w-12 h-12 sm:w-14 sm:h-14 border-4 border-[#c9913a] border-t-transparent rounded-full animate-spin'></div>

            <p className='mt-4 text-sm text-[#a08060]'>
              Loading gallery...
            </p>

          </div>

        ) : (

          <>


            {/* ================= IMAGES ================= */}

            {myImages.length > 0 && (

              <section>

                <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-5'>

                  {myImages
                    .slice(0, visibleImages)
                    .map((image, index) => (

                      <button
                        key={`${image}-${index}`}
                        onClick={() => setSelectedImage(image)}
                        className='relative w-full aspect-[4/5] overflow-hidden rounded-md sm:rounded-lg bg-[#eee5d8] shadow-md cursor-pointer group'
                      >

                        {/* IMAGE LOADING SPINNER */}

                        {!loadedImages[index] && (

                          <div className='absolute inset-0 flex items-center justify-center'>

                            <div className='w-8 h-8 sm:w-10 sm:h-10 border-4 border-[#c9913a] border-t-transparent rounded-full animate-spin'></div>

                          </div>

                        )}


                        {/* IMAGE */}

                        <img
                          src={image}
                          alt={`Royal Gallery ${index + 1}`}
                          loading='lazy'
                          decoding='async'
                          onLoad={() => handleImageLoad(index)}
                          onError={() => handleImageLoad(index)}
                          className={`
                            w-full
                            h-full
                            object-cover
                            transition-all
                            duration-500
                            group-hover:scale-105
                            ${
                              loadedImages[index]
                                ? 'opacity-100'
                                : 'opacity-0'
                            }
                          `}
                        />

                      </button>

                    ))}

                </div>


                {/* SHOW MORE IMAGES */}

                {visibleImages < myImages.length && (

                  <div className='flex justify-center mt-8 sm:mt-10'>

                    <button
                      onClick={handleShowMoreImages}
                      className='bg-[#c9913a] hover:bg-[#ae762b] active:scale-95 text-white px-7 sm:px-9 py-3 rounded-md text-sm sm:text-base font-medium transition-all duration-300 shadow-md'
                    >
                      Show More Images
                    </button>

                  </div>

                )}

              </section>

            )}


            {/* ================= VIDEOS ================= */}

            {videos.length > 0 && (

              <section className='mt-14 sm:mt-16 md:mt-20 border-t border-[#decdb8] pt-10 sm:pt-12'>

                <div className='text-center mb-8 sm:mb-10'>

                  <p className='text-[#a08060] tracking-[3px] sm:tracking-[4px] uppercase text-xs sm:text-sm mb-2'>
                    Our Videos
                  </p>

                  <h2 className='text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-[#c9913a]'>
                    Royal Moments
                  </h2>

                  <div className='w-16 sm:w-20 h-[2px] bg-[#c9913a] mx-auto mt-4'></div>

                </div>


                {/* VIDEOS GRID */}

                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6'>

                  {videos
                    .slice(0, visibleVideos)
                    .map((video, index) => (

                      <button
                        key={`${video}-${index}`}
                        onClick={() => setSelectedVideo(video)}
                        className='relative w-full aspect-video overflow-hidden rounded-lg shadow-md bg-[#eee5d8] cursor-pointer group'
                      >

                        {/* VIDEO SPINNER */}

                        {!loadedVideos[index] && (

                          <div className='absolute inset-0 flex items-center justify-center z-10'>

                            <div className='w-10 h-10 border-4 border-[#c9913a] border-t-transparent rounded-full animate-spin'></div>

                          </div>

                        )}


                        {/* VIDEO PREVIEW */}

                        <video
                          muted
                          preload='metadata'
                          onLoadedData={() => handleVideoLoad(index)}
                          onCanPlay={() => handleVideoLoad(index)}
                          onError={() => handleVideoLoad(index)}
                          className={`
                            w-full
                            h-full
                            object-cover
                            transition-all
                            duration-500
                            group-hover:scale-105
                            ${
                              loadedVideos[index]
                                ? 'opacity-100'
                                : 'opacity-0'
                            }
                          `}
                        >

                          <source
                            src={video}
                            type='video/mp4'
                          />

                        </video>


                        {/* PLAY ICON */}

                        {loadedVideos[index] && (

                          <div className='absolute inset-0 flex items-center justify-center bg-black/20'>

                            <div className='w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white/90 flex items-center justify-center text-[#c9913a] text-xl shadow-lg'>
                              ▶
                            </div>

                          </div>

                        )}

                      </button>

                    ))}

                </div>


                {/* SHOW MORE VIDEOS */}

                {visibleVideos < videos.length && (

                  <div className='flex justify-center mt-8 sm:mt-10'>

                    <button
                      onClick={handleShowMoreVideos}
                      className='bg-[#c9913a] hover:bg-[#ae762b] active:scale-95 text-white px-7 sm:px-9 py-3 rounded-md text-sm sm:text-base font-medium transition-all duration-300 shadow-md'
                    >
                      Show More Videos
                    </button>

                  </div>

                )}

              </section>

            )}


            {/* NO DATA */}

            {myImages.length === 0 && videos.length === 0 && (

              <div className='text-center py-20'>
                <p className='text-[#888888]'>
                  No gallery items available.
                </p>
              </div>

            )}

          </>

        )}

      </div>


      {/* ================= IMAGE MODAL ================= */}

      {selectedImage && (

        <div
          className='fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center p-3 sm:p-6'
          onClick={closeModal}
        >

          {/* CLOSE BUTTON */}

          <button
            onClick={closeModal}
            className='absolute top-3 right-3 sm:top-5 sm:right-5 z-10 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white text-black text-2xl sm:text-3xl flex items-center justify-center hover:scale-110 transition-transform shadow-lg'
            aria-label='Close image'
          >
            ×
          </button>


          {/* IMAGE */}

          <img
            src={selectedImage}
            alt='Full screen gallery'
            onClick={(e) => e.stopPropagation()}
            className='max-w-full max-h-[90vh] sm:max-h-[92vh] object-contain rounded-md'
          />

        </div>

      )}


      {/* ================= VIDEO MODAL ================= */}

      {selectedVideo && (

        <div
          className='fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center p-3 sm:p-6'
          onClick={closeModal}
        >

          {/* CLOSE BUTTON */}

          <button
            onClick={closeModal}
            className='absolute top-3 right-3 sm:top-5 sm:right-5 z-10 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white text-black text-2xl sm:text-3xl flex items-center justify-center hover:scale-110 transition-transform shadow-lg'
            aria-label='Close video'
          >
            ×
          </button>


          {/* VIDEO */}

          <div
            className='w-full max-w-6xl'
            onClick={(e) => e.stopPropagation()}
          >

            <video
              src={selectedVideo}
              controls
              autoPlay
              playsInline
              className='w-full max-h-[85vh] sm:max-h-[90vh] object-contain rounded-md'
            />

          </div>

        </div>

      )}

    </div>
        </>
  )
}

export default Gallery