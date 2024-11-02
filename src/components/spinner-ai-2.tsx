"use client"

import Image from 'next/image';
import React, { useEffect, useState } from 'react';

export default function SpinnerAI2() {
  const [time, setTime] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(prev => prev + 10);
    }, 10);

    // Clear interval on component unmount
    return () => clearInterval(timer);
  }, []);

  // Calculate seconds and milliseconds
  const seconds = Math.floor(time / 1000);
  const milliseconds = time % 1000;

  return (
    <div className="flex flex-col gap-2 justify-center items-center m-20">
      
        <Image 
          src="/icons/dots.png" 
          alt="spinner" 
          height={100} 
          width={100} 
          className="animate-bounce"
        />
        <span className="text-lg font-medium">
          {seconds}s {milliseconds}ms
        </span>
    </div>
  );
}
