'use client';

import { SessionProvider } from 'next-auth/react';
import posthog from 'posthog-js';
import { PostHogProvider } from 'posthog-js/react';
import { ReactNode } from 'react';
import { Toaster } from 'sonner';

if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_POSTHOG_KEY) {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
  });
}

import { TooltipProvider } from '@/components/ui/tooltip';

type Props = {
  children: ReactNode;
};

export default function Providers({ children }: Props) {
  return (
    <PostHogProvider client={posthog}>
      <SessionProvider>
        <Toaster richColors position='bottom-center' offset='40px' />
        <TooltipProvider>{children}</TooltipProvider>
      </SessionProvider>
    </PostHogProvider>
  );
}
