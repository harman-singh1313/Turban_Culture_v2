import React from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
const Button = ({Name,path}) => {
  const Navigate= useNavigate()
  return (
    <div>
        
 <button className="
      relative
      border-none
      bg-transparent
      text-black
      hover:text-[#a08060]
      transition-colors duration-300
      after:content-['']
      after:absolute
      after:bottom-0
      after:left-0
      after:h-[2px]
      after:w-0
      after:bg-[#a08060]
      after:transition-all after:duration-300
      hover:after:w-full
      cursor-pointer
      px-2 py-2
    "
     onClick={()=>Navigate(path)}
    >
     {Name}
    </button>
        
    </div>
  )
}

export default Button