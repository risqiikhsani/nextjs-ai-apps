import Image from 'next/image'
import React from 'react'

export default function SpinnerAI() {
  return (
    <div className="flex justify-center items-center m-20">
      <Image 
        src="/icons/ai1.png" 
        alt="spinner" 
        height={100} 
        width={100} 
        className="animate-spin"
      />
    </div>
  )
}
