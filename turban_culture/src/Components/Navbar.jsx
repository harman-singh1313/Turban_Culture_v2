import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Button from './Button'
import NavLink from './NavLink'
import transparent1 from '../assets/transparent1.png'

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  return (
    <div className='fixed top-0 left-0 w-full bg-[#fdfaf6]/95 backdrop-blur-md z-50 border-b border-[#c9913a]/15 shadow-sm'>

      {/* Main Navbar */}
      <div className='h-26 md:h-20 flex justify-between items-center px-4 md:px-8 lg:px-12'>

        {/* Logo */}
        <div
          className='flex items-center cursor-pointer'
          onClick={() => navigate('/')}
        >
          <img
            src={transparent1}
            alt="logo"
            className='w-36 md:w-52 h-16 md:h-20 object-contain hover:scale-105 transition-transform duration-300' />
        </div>

        {/* Desktop Menu */}
        <div className='hidden md:flex gap-8 items-center text-sm font-medium'>
          <NavLink to="/">home</NavLink>

          <NavLink to="/Services">Services</NavLink>
          <NavLink to="/Gallery">Gallery</NavLink>
          {/* <NavLink to="/Reviews">Reviews</NavLink> */}
          <Button path="/Booking" Name="Book Now" />
        </div>

        {/* Mobile Hamburger */}
        <button
          className='md:hidden w-9 h-9 flex flex-col justify-center items-center gap-1.5 text-[#c9913a]'
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span className={`block w-6 h-0.5 bg-[#c9913a] transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block w-6 h-0.5 bg-[#c9913a] transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-6 h-0.5 bg-[#c9913a] transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden bg-[#fdfaf6] border-t border-[#c9913a]/10 shadow-lg overflow-hidden transition-all duration-300 ${menuOpen ? 'max-h-72 opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className='flex flex-col py-5 px-6 gap-4 text-center'>
          <NavLink to="/">Home</NavLink>
          <NavLink to="/Services">Services</NavLink>
          <NavLink to="/Gallery">Gallery</NavLink>
          <div className='pt-1'>
            <Button path="/Booking" Name="Book Now" />
          </div>
        </div>
      </div>

    </div>
  )
}

export default Navbar