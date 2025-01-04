import AppSidebar from '@/components/app-sidebar'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import React, { ReactNode } from 'react'

export default function Layout({children}:{children:ReactNode}) {
  return (
    <SidebarProvider>
    <AppSidebar />
    <main className="container mx-auto max-w-7xl ">
    <SidebarTrigger/>
      {children}
    </main>
  </SidebarProvider>
  )
}
