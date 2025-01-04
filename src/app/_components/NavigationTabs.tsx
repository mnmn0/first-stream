export type TabItem = {
  id: string;
  label: string;
  href: string;
};

import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavigationTabsProps {
  tabs: TabItem[];
  className?: string;
}

export const NavigationTabs = ({ tabs, className }: NavigationTabsProps) => {
  const pathname = usePathname();

  return (
    <nav
      className={cn(
        'w-full grid grid-cols-2 rounded-lg gap-1 bg-gray-100 p-1',
        className,
      )}
    >
      {tabs.map(tab => {
        const isActive = pathname === tab.href;

        return (
          <Link
            key={tab.id}
            href={tab.href}
            className={cn(
              'flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors',
              'hover:bg-white hover:text-gray-900',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-0',
              isActive ? 'bg-white text-gray-900 shadow' : 'text-gray-600',
            )}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
};
