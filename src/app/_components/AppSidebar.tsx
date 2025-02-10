'use client';

import { CreateProjectButton } from '@/app/_components/CreateProjectButton';
import CreateProjectModal, {
  type CreateProjectModalProps,
} from '@/app/_components/CreateProjectModal';
import { NavigationTabs, TabItem } from '@/app/_components/NavigationTabs';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, Home, Inbox, Search, Settings, User, Users, FolderKanban } from 'lucide-react';
import type React from 'react';
import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useUser } from '@/hooks/use-user';
import { useProject } from '@/hooks/use-project';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

const navigationTabs: TabItem[] = [
  {
    id: 'person',
    label: 'Persons',
    href: '/person',
    icon: Users,
  },
  {
    id: 'projects',
    label: 'Projects',
    href: '/project',
    icon: FolderKanban,
  },
];

const AppSidebar: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedTab, setSelectedTab] = useState<TabItem>(navigationTabs[0]);
  const router = useRouter();
  const pathname = usePathname();
  const { data: userData, isLoading: isLoadingUsers, error: userError } = useUser().users;
  const { data: projectData, isLoading: isLoadingProjects, error: projectError } = useProject().projects;
  const { data: currentUser } = useUser().currentUser;

  const handleCreateClick = () => {
    setIsModalOpen(true);
  };

  const handleOpenChange: CreateProjectModalProps['onOpenChange'] = open => {
    setIsModalOpen(open);
  };

  const handleTabChange = (tab: TabItem) => {
    setSelectedTab(tab);
    router.push(tab.href);
  };

  const handleUserClick = (userId: string) => {
    router.push(`/person/${userId}`);
  };

  const handleProjectClick = (projectId: string) => {
    router.push(`/project/${projectId}`);
  };

  const renderContent = () => {
    if (selectedTab.id === 'person') {
      if (isLoadingUsers) {
        return Array.from({ length: 5 }).map((_, i) => (
          <SidebarMenuSkeleton key={i} showIcon />
        ));
      }

      if (userError) {
        return (
          <div className="px-2 py-4 text-sm text-destructive">
            Error loading users
          </div>
        );
      }

      return userData?.map(user => (
        <SidebarMenuItem key={user.id}>
          <Tooltip>
            <TooltipTrigger asChild>
              <SidebarMenuButton
                asChild
                isActive={pathname === `/person/${user.id}`}
              >
                <a onClick={() => handleUserClick(user.id)}>
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.imageUrl ?? undefined} alt={user.name} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span>{user.name}</span>
                </a>
              </SidebarMenuButton>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>View {user.name}'s profile</p>
            </TooltipContent>
          </Tooltip>
        </SidebarMenuItem>
      ));
    }

    if (selectedTab.id === 'projects') {
      if (isLoadingProjects) {
        return Array.from({ length: 5 }).map((_, i) => (
          <SidebarMenuSkeleton key={i} showIcon />
        ));
      }

      if (projectError) {
        return (
          <div className="px-2 py-4 text-sm text-destructive">
            Error loading projects
          </div>
        );
      }

      return projectData?.map(project => (
        <SidebarMenuItem key={project.id}>
          <Tooltip>
            <TooltipTrigger asChild>
              <SidebarMenuButton
                asChild
                isActive={pathname === `/project/${project.id}`}
              >
                <a onClick={() => handleProjectClick(project.id)}>
                  <FolderKanban className="h-4 w-4" />
                  <span>{project.name}</span>
                </a>
              </SidebarMenuButton>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>View project: {project.name}</p>
            </TooltipContent>
          </Tooltip>
        </SidebarMenuItem>
      ));
    }
  };

  return (
    <>
      <Sidebar className="min-w-[240px]">
        <SidebarContent>
          <NavigationTabs
            tabs={navigationTabs}
            selectedTab={selectedTab}
            onTabChange={handleTabChange}
          />
          <SidebarGroup>
            <SidebarGroupLabel>
              {selectedTab.label}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {selectedTab.id === 'projects' && (
                  <CreateProjectButton onClick={handleCreateClick} />
                )}
                {renderContent()}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          {currentUser && (
            <div className="flex items-center gap-3 px-3 py-2">
              <Avatar>
                <AvatarImage
                  src={currentUser.imageUrl ?? undefined}
                  alt={currentUser.name}
                />
                <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium">{currentUser.name}</span>
            </div>
          )}
        </SidebarFooter>
      </Sidebar>

      <CreateProjectModal open={isModalOpen} onOpenChange={handleOpenChange} />
    </>
  );
};

export default AppSidebar;
