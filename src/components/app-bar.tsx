import React from 'react'

import { ModeToggle } from './mode-toggle'
import Link from 'next/link'
import Image from 'next/image'
import { HeartIcon } from 'lucide-react'
import { Button } from './ui/button'

export default function AppBar() {
  return (
    <nav className="fixed z-50 top-0 w-full flex gap-2 justify-between p-2 backdrop-blur-md items-center">
        <Link href="/"><Image src="/icons/keyboard.png" width={50} height={50} alt='logo'/></Link>
        <div className='flex-1'></div>
        <Button asChild><Link href="/buy-me-coffee">Buy me coffee <HeartIcon/></Link></Button>
        <ModeToggle/>
    </nav>
  )
}
