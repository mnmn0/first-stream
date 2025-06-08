'use client';

import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {cn} from '@/lib/utils';
import {FileText, Settings, Shield, Users} from 'lucide-react';

const sidebarNavItems = [
  {
    title: 'User Management',
    href: '/admin/users',
    icon: Users,
    description: 'Manage user accounts and permissions',
  },
  {
    title: 'Access Control',
    href: '/admin/access',
    icon: Shield,
    description: 'Configure access policies and roles',
  },
  {
    title: 'System Settings',
    href: '/admin/settings',
    icon: Settings,
    description: 'Configure system-wide settings',
  },
  {
    title: 'Audit Logs',
    href: '/admin/logs',
    icon: FileText,
    description: 'View system and user activity logs',
  },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <nav className='flex flex-col space-y-2'>
      <div className='px-3 py-2'>
        <h2 className='mb-2 text-lg font-semibold tracking-tight'>
          Administration
        </h2>
        <p className='text-sm text-muted-foreground'>
          Manage your system settings and user access
        </p>
      </div>
      <div className='flex flex-col space-y-1 px-1'>
        {sidebarNavItems.map(item => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'group flex flex-col space-y-0.5 rounded-md px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground',
                pathname === item.href ? 'bg-accent' : 'transparent',
              )}
            >
              <div className='flex items-center gap-3'>
                <Icon className='h-4 w-4'/>
                <span className='font-medium'>{item.title}</span>
              </div>
              <p className='text-xs text-muted-foreground group-hover:text-accent-foreground/70'>
                {item.description}
              </p>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
