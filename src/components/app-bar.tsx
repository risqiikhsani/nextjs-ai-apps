import React from 'react'
import { SidebarTrigger } from './ui/sidebar'
import { ModeToggle } from './mode-toggle'

export default function AppBar() {
  return (
    <nav className="fixed w-full p-4 h-16 z-50 shadow-lg opacity-50 flex gap-2 dark:bg-slate-800 bg-slate-100">
        <SidebarTrigger/>
        <div className='flex-1'></div>
        <ModeToggle/>
    </nav>
  )
}
