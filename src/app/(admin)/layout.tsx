'use client';

import {SidebarNav} from '@/app/(admin)/_components/SidebarNav';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='space-y-6 p-6 pb-16'>
      <div className='flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0'>
        <aside className='lg:w-1/5'>
          <SidebarNav />
        </aside>
        <div className='flex-1'>{children}</div>
      </div>
    </div>
  );
}
