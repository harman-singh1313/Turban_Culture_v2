import React from 'react'
import { NavLink as RouterNavLink } from 'react-router-dom'

const NavLink = ({ to, children }) => {
  return (
    <RouterNavLink
      to={to}
      className={({ isActive }) =>
        `
        relative
        border-none
        bg-transparent
        transition-colors duration-300
        cursor-pointer
        px-2 py-2
        after:content-['']
        after:absolute
        after:bottom-0
        after:left-0
        after:h-[2px]
        after:bg-[#a08060]
        after:transition-all
        after:duration-300
        
        ${
          isActive
            ? "text-[#a08060] after:w-full"
            : "text-black hover:text-[#a08060] after:w-0 hover:after:w-full"
        }
        `
      }
    >
      {children}
    </RouterNavLink>
  )
}

export default NavLink