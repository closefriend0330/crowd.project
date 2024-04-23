'use client';

import { ReactNode } from 'react';

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
      <TooltipProvider>{children}</TooltipProvider>
    </SessionProvider>
  );
}
