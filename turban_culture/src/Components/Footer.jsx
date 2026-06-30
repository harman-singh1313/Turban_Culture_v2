import React from 'react'
import Button from './Button'
import { NavLink } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className='bg-gray-100 border-t border-gray-200'>

      <div className='max-w-7xl mx-auto px-6 py-12'>

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10'>

          {/* Brand */}
          <div>
            <h1 className='font-serif text-[#c9913a] text-2xl mb-4'>
              TURBAN CULTURE
            </h1>

            <p className='text-[#555] leading-7'>
              Preserving the dignity and tradition of
              turban tying for the modern gentleman.
            </p>
          </div>

          {/* Quick Links */}
         <div className="flex flex-col gap-3">
  <h1 className="font-bold mb-2">
    QUICK LINKS
  </h1>

  {[
    { name: "Home", path: "/" },
    { name: "Services", path: "/Services" },
    { name: "Gallery", path: "/Gallery" },
    { name: "Reviews", path: "/Reviews" },
    { name: "Booking", path: "/Booking" },
  ].map((link) => (
    <NavLink
      key={link.path}
      to={link.path}
      className={({ isActive }) =>
        `relative w-fit text-[#555] transition-colors duration-300
        hover:text-[#c9913a]
        after:absolute after:left-0 after:-bottom-1
        after:h-[2px] after:bg-[#c9913a]
        after:transition-all after:duration-300
        ${
          isActive
            ? "text-[#c9913a] after:w-full"
            : "after:w-0 hover:after:w-full"
        }`
      }
    >
      {link.name}
    </NavLink>
  ))}
</div>

          {/* Support */}
          {/* <div className='flex flex-col gap-3'>
            <h1 className='font-bold mb-2'>
              SUPPORT
            </h1>

            <Button Name="Reviews" />
            <Button Name="Contact" />
            <Button Name="Privacy Policy" />
            <Button Name="Terms of Service" />
          </div> */}

          {/* Newsletter */}
          <div>
            <h1 className='font-bold mb-3'>
              NEWSLETTER
            </h1>

            <p className='text-sm text-[#555] mb-5'>
              Join our list for wedding styling tips
              and seasonal offers.
            </p>

            <button className='w-full flex justify-between items-center border-b border-[#a08060] pb-2'>
              <span className='text-[#888888]'>
                Email Address
              </span>

              <span className='text-[#c9913a] text-lg'>
                ➜
              </span>
            </button>
          </div>

        </div>

        {/* Bottom Line */}
        <div className='border-t border-gray-300 mt-10 pt-6 text-center text-sm text-[#777]'>
          © {new Date().getFullYear()} Turban Culture. All Rights Reserved.
        </div>

      </div>

    </footer>
  )
}

export default Footer