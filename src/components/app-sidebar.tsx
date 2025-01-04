"use client"

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
import { genai_items,audio_items, text_items, visual_items } from "@/const/links"
import { LinkType } from "@/types/links";
import Link from "next/link"
import { usePathname } from "next/navigation"

export function AppSidebar() {
  const pathname = usePathname();

  const MenuItemLink = ({ item }:{item:LinkType}) => {
    const isActive = pathname === item.url;
    
    return (
      <SidebarMenuItem key={item.title}>
        <SidebarMenuButton asChild>
          <Link 
            href={item.url}
            className={`flex items-center gap-2 w-full p-2 rounded-md transition-colors
              ${isActive 
                ? 'bg-cyan-300 text-cyan-900' 
                : 'hover:bg-cyan-100'
              }`}
          >
            <item.icon className={`${isActive ? 'text-cyan-700' : 'text-cyan-500'}`}/>
            <span>{item.title}</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  };

  return (
    <Sidebar className="pt-16 bg-blue-300 dark:bg-slate-900">
      <SidebarHeader className="bg-blue-300 dark:bg-slate-900">
        <SidebarMenuButton asChild>
          <Link href="/" className="hover:text-cyan-600 transition-colors">
            Hypernova AI
          </Link>
        </SidebarMenuButton>
      </SidebarHeader>
      <SidebarContent className="bg-blue-300 dark:bg-slate-900">
      <SidebarGroup>
          <SidebarGroupLabel>Generative AI Examples</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {genai_items.map((item) => (
                <MenuItemLink key={item.title} item={item} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Natural Language Processing</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {text_items.map((item) => (
                <MenuItemLink key={item.title} item={item} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Computer Vision</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {visual_items.map((item) => (
                <MenuItemLink key={item.title} item={item} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Audio</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {audio_items.map((item) => (
                <MenuItemLink key={item.title} item={item} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

export default AppSidebar;