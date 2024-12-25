"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem,
} from "@/components/ui/sidebar"
import {Calendar, Inbox, Search, Settings, Home} from "lucide-react";
import React, {useState} from "react";
import {CreateProjectButton} from "@/app/_components/CreateProjectButton";
import CreateProjectModal, {CreateProjectModalProps} from "@/app/_components/CreateProjectModal";

const items = [
  {
    title: "Home",
    url: "/chart",
    icon: Home,
  },
  {
    title: "Inbox",
    url: "#",
    icon: Inbox,
  },
  {
    title: "Calendar",
    url: "#",
    icon: Calendar,
  },
  {
    title: "Search",
    url: "#",
    icon: Search,
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
  },
] as const;

const AppSidebar: React.FC = () => {

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const handleCreateClick = () => {
    setIsModalOpen(true);
  };

  const handleOpenChange: CreateProjectModalProps['onOpenChange'] = (open) => {
    setIsModalOpen(open);
  };

  return (
    <>
      <Sidebar>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Application</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <CreateProjectButton onClick={handleCreateClick} />
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

      <CreateProjectModal
        open={isModalOpen}
        onOpenChange={handleOpenChange}
      />
    </>



  )
}

export default AppSidebar;
