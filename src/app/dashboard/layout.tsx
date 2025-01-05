import AppSidebar from '@/components/app-sidebar'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import React, { ReactNode } from 'react'

export default function Layout({children}:{children:ReactNode}) {
  return (
    <SidebarProvider>
    <AppSidebar />
    <main className="flex flex-col p-2 gap-2 w-full">
    <SidebarTrigger/>
      {children}
    </main>
  </SidebarProvider>
  )
}
