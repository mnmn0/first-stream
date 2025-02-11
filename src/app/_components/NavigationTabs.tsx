import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';
import type React from 'react';

export interface TabItem {
  id: string;
  label: string;
  href: string;
  icon?: LucideIcon;
}

interface NavigationTabsProps {
  tabs: TabItem[];
  selectedTab: TabItem;
  onTabChange: (tab: TabItem) => void;
}

export const NavigationTabs: React.FC<NavigationTabsProps> = ({
  tabs,
  selectedTab,
  onTabChange,
}) => {
  return (
    <div className="flex w-full space-x-1 p-1">
      {tabs.map(tab => {
        const Icon = tab.icon;
        return (
          <button
            key={tab.id}
            className={cn(
              'inline-flex w-full items-center justify-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
              tab.id === selectedTab.id
                ? 'bg-primary text-primary-foreground shadow hover:bg-primary/90'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            )}
            onClick={() => onTabChange(tab)}
            role="tab"
            aria-selected={tab.id === selectedTab.id}
            aria-controls={`${tab.id}-panel`}
          >
            {Icon && <Icon className="h-4 w-4" />}
            {tab.label}
          </button>
        );
      })}
    </div>
  );
};

export default NavigationTabs;
