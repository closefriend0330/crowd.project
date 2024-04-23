'use client';

import { ReactNode } from 'react';
import { Toaster } from 'sonner';

import { TooltipProvider } from '@/components/ui/tooltip';
import { SessionProvider } from 'next-auth/react';

import usePartyKit from '@/hooks/usePartyKit';

type Props = {
  children: ReactNode;
};

const PartyKit = () => {
  usePartyKit();

  return null;
};

export default function Providers({ children }: Props) {
  return (
    <SessionProvider>
      <PartyKit />
      <Toaster richColors position='bottom-center' offset='40px' />
      <TooltipProvider>{children}</TooltipProvider>
    </SessionProvider>
  );
}
