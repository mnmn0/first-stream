'use client';

import { CreateProjectButton } from '@/app/_components/CreateProjectButton';
import CreateProjectModal, {
  type CreateProjectModalProps,
} from '@/app/_components/CreateProjectModal';
import {NavigationTabs, TabItem} from "@/app/_components/NavigationTabs";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useProject } from '@/hooks/use-project';
import { useUser } from '@/hooks/use-user';
import { Calendar, FolderKanban, Home, Inbox, LogOut, Search, Settings, Shield, User, Users } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import type React from 'react';
import { useState } from 'react';

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

  const handleSignOut = () => {
    signOut();
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

          {currentUser?.isAdmin && (
            <SidebarGroup>
              <SidebarGroupLabel>Administration</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <SidebarMenuButton
                          asChild
                          isActive={pathname === '/admin/users'}
                        >
                          <a href="/admin/users">
                            <Shield className="h-4 w-4" />
                            <span>User Management</span>
                          </a>
                        </SidebarMenuButton>
                      </TooltipTrigger>
                      <TooltipContent side="right">
                        <p>Manage user access and permissions</p>
                      </TooltipContent>
                    </Tooltip>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          )}
        </SidebarContent>
        <SidebarFooter>
          {currentUser && (
            <Popover>
              <PopoverTrigger asChild>
                <button className="flex w-full items-center gap-3 px-3 py-2 hover:bg-accent">
                  <Avatar>
                    <AvatarImage
                      src={currentUser.imageUrl ?? undefined}
                      alt={currentUser.name}
                    />
                    <AvatarFallback>{currentUser.name}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-1 flex-col text-left">
                    <span className="text-sm font-medium">{currentUser.name}</span>
                    {currentUser.isAdmin && (
                      <span className="text-xs text-muted-foreground">Administrator</span>
                    )}
                  </div>
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-56" align="start" side="top">
                {currentUser?.isAdmin && (
                  <a
                    href="/admin/users"
                    className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent"
                  >
                    <Shield className="h-4 w-4" />
                    <span>ユーザー管理</span>
                  </a>
                )}
                <button
                  onClick={handleSignOut}
                  className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent"
                >
                  <LogOut className="h-4 w-4" />
                  <span>ログアウト</span>
                </button>
              </PopoverContent>
            </Popover>
          )}
        </SidebarFooter>
      </Sidebar>

      <CreateProjectModal open={isModalOpen} onOpenChange={handleOpenChange} />
    </>
  );
};

export default AppSidebar;
