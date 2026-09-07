'use client';

import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';

export default function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin');

  if (isAdminRoute) {
    return <main className="min-h-screen">{children}</main>;
  }

  return (
    <>
      <Navbar />
      <main className="flex-grow pt-16">
        {children}
      </main>
      <Footer />
    </>
  );
}
