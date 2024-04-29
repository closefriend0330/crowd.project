'use client';

import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';
import { Toaster } from 'sonner';

import { TooltipProvider } from '@/components/ui/tooltip';

type Props = {
  children: ReactNode;
};

export default function Providers({ children }: Props) {
  return (
    <SessionProvider>
      <Toaster richColors position='bottom-center' offset='40px' />
      <TooltipProvider>{children}</TooltipProvider>
    </SessionProvider>
  );
}
