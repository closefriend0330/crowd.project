'use client';

import { useAtomValue } from 'jotai';
import { useSession } from 'next-auth/react';
import posthog from 'posthog-js';
import { useRef } from 'react';

import usePageVisibility from '@/hooks/usePageVisibility';
import useUserData from '@/hooks/useUserData';

import { AWAY_TIME_THRESHOLD } from '@/config';
import { debug } from '@/lib/utils';
import { partySocketAtom } from '@/stores/jotai';

export default function VisibilityEvents() {
  const { data: session } = useSession();
  const { updateUser, user } = useUserData();
  const ws = useAtomValue(partySocketAtom);
  const awayStartTimeRef = useRef<number | null>(null);

  usePageVisibility((isVisible: boolean) => {
    if (!user) return;

    let awayTimeout: NodeJS.Timeout | undefined = undefined;
    const now = new Date();

    if (!session || !ws) {
      console.error("Couldn't send visibility change: ", { ws, session });
      return;
    }

    debug('Page visibility changed', { isVisible, AWAY_TIME_THRESHOLD });

    if (isVisible) {
      if (awayTimeout) clearTimeout(awayTimeout);

      if (user.away) {
        updateUser({ data: { away: false, awayChangedAt: now } });

        const awayTime = awayStartTimeRef.current
          ? new Date().getTime() - awayStartTimeRef.current
          : null;
        posthog.capture('User no longer away', { userId: user?.id, awayTime });
      }

      awayStartTimeRef.current = null;
    } else {
      // wait for the page to not be for a while before considering the user away
      awayTimeout = setTimeout(() => {
        // can't rely on isVisible here because it's in a closure?
        if (document.visibilityState === 'hidden') {
          debug('Away status threshold reached');

          updateUser({ data: { away: true, awayChangedAt: now } });
          awayStartTimeRef.current = now.getTime();

          posthog.capture('User away', {
            userId: user?.id,
            threshold: AWAY_TIME_THRESHOLD,
          });
        }
      }, AWAY_TIME_THRESHOLD);
    }
  });

  return null;
}
