import React from 'react'
import { RiMoneyRupeeCircleLine } from "react-icons/ri";

const PackagesCard = ({ name, tag, icon, price, features, onBook, isFeatured }) => {
  return (
    <div className='w-full py-8 px-5 bg-[#fbf8f4] text-sm border-[#786b5e] shadow-sm hover:bg-[#f8f2ea] transition duration-300 rounded-xl hover:scale-105 relative'>

      {isFeatured && (
        <span className="absolute top-2 right-2 bg-amber-400 text-white text-xs px-2 py-0.5 rounded-full">
          Featured ⭐
        </span>
      )}

      <p className='text-[#a08060]'>{tag}</p>
      <h1 className='text-gray-700 font-serif text-xl my-3'>
        {icon} {name}
      </h1>

      <ul className='flex flex-col gap-3 my-3'>
        {features?.map((feature, i) => (
          <li key={i} className='flex gap-2 items-center text-[#9a9438]'>
            ✦ <span className='text-[#786b5e]'>{feature}</span>
          </li>
        ))}
      </ul>

      <h1 className='flex items-center gap-1 text-2xl'>
        <RiMoneyRupeeCircleLine />
        <span className='text-sm'>₹{price}</span>
      </h1>

      <button
        onClick={() => onBook && onBook({ name, tag, icon, price, features })}
        className='bg-gray-700 py-1 px-4 rounded-xl w-full mt-10 text-white cursor-pointer hover:bg-gray-800 shadow-md'
      >
        Book Now
      </button>
    </div>
  )
}

export default PackagesCard