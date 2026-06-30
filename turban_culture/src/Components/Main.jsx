import React from 'react'
import { Link } from 'react-router-dom'

const Main = (props) => {
  return (
    <div className='relative overflow-hidden w-full'>

      {/* Image - Ken Burns */}
      <img
        src={props.image}
        alt="Turban Service"
        className='w-full h-[100dvh] object-cover object-[75%_center] md:object-center animate-kenburns'
      />

      {/* Blurred copy — sirf bottom te dikh di, upar clip hundi */}


      {/* Strong bottom fade — image completely background vich ghul jaaye */}
      <div
        className='absolute inset-x-0 bottom-0'
        style={{
          height: '45%',
          background: 'linear-gradient(to top, #fdfaf6 0%, #fdfaf6 15%, rgba(253,250,246,0.95) 35%, rgba(253,250,246,0.7) 55%, rgba(253,250,246,0) 100%)'
        }}
      />

      {/* Left side content fade */}
      <div
        className='absolute inset-0 w-full h-full'
        style={{
          background: 'linear-gradient(to right, rgba(253,250,246,0.95) 35%, rgba(253,250,246,0.15) 75%, rgba(253,250,246,0) 100%)'
        }}
      />
      {/* Content */}
      <div className='absolute inset-0 flex flex-col justify-center px-6 sm:px-12 lg:px-24 w-full md:max-w-xl lg:max-w-2xl'>
        {/* Tag */}
        <p
          style={{ animationDelay: '300ms' }}
          className='text-[#c9913a] text-[10px] sm:text-xs tracking-[3px] uppercase mb-4 sm:mb-6 flex items-center gap-3 opacity-0 animate-slidein'
        >
          <span className='w-7 h-px bg-[#c9913a] flex-shrink-0'></span>
          {props.text}
        </p>

        {/* Title */}
        <h1
          style={{ animationDelay: '800ms' }}
          className='font-serif text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-2 text-[#1a1a1a] opacity-0 animate-slidein'
        >
          {props.head1}<br />{props.head2}
          <span className='text-[#c9913a] block'>{props.head3}</span>
        </h1>

        {/* Subtitle */}
        {props.test2 && (
          <p
            style={{ animationDelay: '1200ms' }}
            className='font-serif text-lg sm:text-2xl italic text-[#888888] mb-4 opacity-0 animate-slidein'
          >
            {props.test2}
          </p>
        )}

        {/* Divider */}
        <div
          style={{ animationDelay: '1500ms' }}
          className='w-12 h-px bg-[#c9913a] mb-4 sm:mb-6 opacity-0 animate-fadein'
        />

        {/* Description */}
        <p
          style={{ animationDelay: '1800ms' }}
          className='text-[#a08060] font-light text-sm leading-relaxed mb-6 sm:mb-8 max-w-md opacity-0 animate-slidein'
        >
          {props.line}
        </p>

        {/* Button */}
<Link
  to="/Booking"
  style={{ animationDelay: "2100ms" }}
  className="group relative inline-flex w-fit items-center gap-1.5 overflow-hidden bg-gradient-to-r from-[#c9913a] via-[#d4a574] to-[#c9913a] text-white text-[10px] font-semibold px-3 py-1.5 rounded-full shadow-xl shadow-[#c9913a]/30 hover:shadow-2xl hover:shadow-[#c9913a]/50 transition-all duration-500 hover:scale-105 opacity-0 animate-slidein"
>
  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
  <span className="relative z-10">
    {props.button || "BOOK NOW"}
  </span>
  <svg
    className="relative z-10 w-3 h-3 group-hover:translate-x-1 transition-transform duration-300"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
  </svg>
</Link>
      </div>
    </div>
  )
}

export default Main