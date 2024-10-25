import { Calendar, Home, Inbox, Search, Settings } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

// Menu items.
const items = [
  {
    title: "Chat Basic",
    url: "/chat",
    icon: Home,
  },
  {
    title: "Chat Conversation",
    url: "/chat-conv",
    icon: Inbox,
  },
  {
    title: "Image Generator",
    url: "/text-to-image",
    icon: Calendar,
  },
  {
    title: "Image To Text",
    url: "/image-to-text",
    icon: Search,
  },
  {
    title: "Image Classification",
    url: "/image-classification",
    icon: Settings,
  },
  {
    title: "Image Illustrator",
    url: "/image-to-image",
    icon: Settings,
  },
]

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
