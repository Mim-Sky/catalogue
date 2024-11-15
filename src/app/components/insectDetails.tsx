'use client'

import React from "react";
import { BsClock } from "react-icons/bs";
import { LuMountain } from "react-icons/lu";
import { BsGraphUpArrow } from "react-icons/bs";
import { HiKey } from "react-icons/hi";
import { GiPathDistance } from "react-icons/gi"



const InsectDetails = () => {

  return (
  <div className='grid-element-1 row-span-2'>
    <div className="flex flex-col">
      {/* Icon section start */}
      
    {/* Icon section end*/}

    {/* Detail field start */}
      <div className="bg-earth-gray/20 p-6 flex flex-col">
        <div className="flex flex-col gap-4 2xl:gap-6 justify-center items-center">
          <div className="flex items-center gap-3 2xl:gap-6">
            <LuMountain className="w-8 h-8 text-black" />
            <h2 className="text-lg font-semibold text-black">Height: 1000 m</h2>
          </div>
          <div className="flex items-center gap-3">
            <GiPathDistance className="w-6 h-6 md:w-8 md:h-8 text-black" />
            <h2 className="text-lg font-semibold text-black">Distance: 20 km</h2>
          </div>
          <div className="flex items-center gap-3 2xl:gap-6">
            <BsClock className="w-6 h-6 md:w-8 md:h-8 text-black" />
            <h2 className="text-lg font-semibold text-black">Ascend time: 10 hrs</h2>
          </div>
          <div className="flex items-center gap-3 2xl:gap-6">
            <BsGraphUpArrow className="w-6 h-6 md:w-8 md:h-8 text-black" />
            <h2 className="text-lg font-semibold text-black">Elevation: 300 m</h2>
          </div>
          <div className="flex items-center gap-3 2xl:gap-6">
            <HiKey className="w-6 h-6 md:w-8 md:h-8 text-black" />
            <h2 className="text-lg font-semibold text-black">Difficulty: 6/10</h2>
          </div>       
        </div>
      </div>
    {/* Detail field end */}
    </div>
  </div>

  )
};

export default InsectDetails;





