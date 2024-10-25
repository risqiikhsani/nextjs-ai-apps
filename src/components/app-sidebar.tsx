import { Calendar, Home, Inbox, Search, Settings } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

// Menu items.
const text_items = [
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
    title: "Text Summarization",
    url: "/summarization",
    icon: Inbox,
  },
  {
    title: "Text Classification",
    url: "/text-classification",
    icon: Inbox,
  },
]

const visual_items = [
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
      <SidebarHeader>
        HypernovaAI
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Natural Language Processing</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {text_items.map((item) => (
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
        <SidebarGroup>
          <SidebarGroupLabel>Computer Vision</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {visual_items.map((item) => (
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
