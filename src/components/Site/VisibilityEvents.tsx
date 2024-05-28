'use client';

import { useAtomValue } from 'jotai';
import { useSession } from 'next-auth/react';
import posthog from 'posthog-js';
import { useRef } from 'react';

import usePageVisibility from '@/hooks/usePageVisibility';
import useUserData from '@/hooks/useUserData';

import { AWAY_TIME_THRESHOLD } from '@/config';
import { buildClientMessage } from '@/lib/messages';
import { debug } from '@/lib/utils';
import { partySocketAtom } from '@/stores/jotai';

import { ClientMessageVisibilityStatus } from '@/lib/clientMessages';

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

    debug('Page visibility changed', { isVisible, AWAY_TIME_THRESHOLD, userStatus: user.status });

    if (isVisible) {
      if (awayTimeout) clearTimeout(awayTimeout);

      // let the server report back if the user is fully away or not based on all connections
      ws.send(
        buildClientMessage<ClientMessageVisibilityStatus>({
          type: 'visibilityStatus',
          visible: true,
        })
      );

      const awayTime = awayStartTimeRef.current
        ? new Date().getTime() - awayStartTimeRef.current
        : null;
      posthog.capture('User no longer away', { userId: user?.id, awayTime });

      awayStartTimeRef.current = null;
    } else {
      // wait for the page to not be for a while before considering the user away
      awayTimeout = setTimeout(() => {
        // can't rely on isVisible here because it's in a closure?
        if (document.visibilityState === 'hidden') {
          debug('Away status threshold reached');

          ws.send(
            buildClientMessage<ClientMessageVisibilityStatus>({
              type: 'visibilityStatus',
              visible: false,
            })
          );
          awayStartTimeRef.current = now.getTime();

          // TODO: this isn't technically accurate because it's tab specific
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
