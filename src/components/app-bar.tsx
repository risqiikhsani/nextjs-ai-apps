import React from 'react'

import { ModeToggle } from './mode-toggle'
import Link from 'next/link'
import Image from 'next/image'

export default function AppBar() {
  return (
    <nav className="fixed z-50 top-0 w-full flex gap-2 justify-between p-2 backdrop-blur-md ">
        <Link href="/"><Image src="/icons/keyboard.png" width={50} height={50} alt='logo'/></Link>
        <div className='flex-1'></div>
        <ModeToggle/>
    </nav>
  )
}
