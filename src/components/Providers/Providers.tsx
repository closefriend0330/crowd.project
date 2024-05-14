'use client';

import { Provider as JotaiProvider } from 'jotai';
import { Session } from 'next-auth';
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

import { TodoStoreProvider } from '@/components/Providers/ZustandStoreProvider';

type Props = {
  children: ReactNode;
  session: Session | null;
};

export default function Providers({ children, session }: Props) {
  return (
    <PostHogProvider client={posthog}>
      <SessionProvider session={session}>
        <JotaiProvider>
          <TodoStoreProvider>
            <Toaster richColors position='bottom-center' offset='40px' />
            <TooltipProvider>{children}</TooltipProvider>
          </TodoStoreProvider>
        </JotaiProvider>
      </SessionProvider>
    </PostHogProvider>
  );
}
