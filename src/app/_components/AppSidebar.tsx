'use client';

import { CreateProjectButton } from '@/app/_components/CreateProjectButton';
import CreateProjectModal, {
  type CreateProjectModalProps,
} from '@/app/_components/CreateProjectModal';
import { NavigationTabs, type TabItem } from '@/app/_components/NavigationTabs';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { Calendar, Home, Inbox, Search, Settings } from 'lucide-react';
import type React from 'react';
import { useState } from 'react';

const navigationTabs: TabItem[] = [
  {
    id: 'person',
    label: 'Persons',
    href: '/person',
  },
  {
    id: 'projects',
    label: 'Projects',
    href: '/project',
  },
];

const items = [
  {
    title: 'Home',
    url: '/chart',
    icon: Home,
  },
  {
    title: 'Inbox',
    url: '#',
    icon: Inbox,
  },
  {
    title: 'Calendar',
    url: '#',
    icon: Calendar,
  },
  {
    title: 'Search',
    url: '#',
    icon: Search,
  },
  {
    title: 'Settings',
    url: '#',
    icon: Settings,
  },
] as const;

const AppSidebar: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const handleCreateClick = () => {
    setIsModalOpen(true);
  };

  const handleOpenChange: CreateProjectModalProps['onOpenChange'] = open => {
    setIsModalOpen(open);
  };

  return (
    <>
      <Sidebar className='min-w-[240px]'>
        <SidebarContent>
          <NavigationTabs tabs={navigationTabs} />
          <SidebarGroup>
            <SidebarGroupLabel>Application</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <CreateProjectButton onClick={handleCreateClick} />
                {items.map(item => (
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

      <CreateProjectModal open={isModalOpen} onOpenChange={handleOpenChange} />
    </>
  );
};

export default AppSidebar;
