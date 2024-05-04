'use client';

import { useSetAtom } from 'jotai';
import { useSession } from 'next-auth/react';
import usePartySocket from 'partysocket/react';
import posthog from 'posthog-js';
import { useEffect, useRef } from 'react';
import { toast } from 'sonner';

import usePageVisibility from '@/hooks/usePageVisibility';
import useSoundEffects from '@/hooks/useSoundEffects';
import useUserData from '@/hooks/useUserData';
import useUserList from '@/hooks/useUserList';

import { AWAY_TIME_THRESHOLD } from '@/config';
import { debug } from '@/lib/utils';
import { connectionStatusAtom, partySocketAtom } from '@/store';

export default function PartyKit() {
  const { data: session } = useSession();
  const { updateUserData, userData } = useUserData();
  const setIsConnected = useSetAtom(connectedAtom);
  const setPartySocket = useSetAtom(partySocketAtom);
  const { playConnectionChange } = useSoundEffects();
  const awayStartTimeRef = useRef<number | null>(null);

  const ws = usePartySocket({
    host: process.env.NEXT_PUBLIC_PARTYKIT_URL,
    room: 'main',
    query: session ? { userId: session.user.id } : { userId: undefined },

    onOpen() {
      debug('Connection created');

      setConnectionStatusAtom('partially connected');
    },
    async onMessage(event: MessageEvent) {
      debug('Server message received: ', event.data);

      await processSeverMessage({ message: event.data });
    },
    onClose() {
      debug('Connection closed');
      toast.warning('Connection closed');

      setConnectionStatusAtom('disconnected');

      playConnectionChange();
    },
    onError(e) {
      const message = JSON.stringify(e);

      console.error(`Connection error: ${message}`);
    },
  });

  usePageVisibility((isVisible: boolean) => {
    let awayTimeout: NodeJS.Timeout | undefined = undefined;

    if (!session || !ws) {
      console.error("Couldn't send visibility change: ", { ws, session });
      return;
    }

    if (isVisible) {
      if (awayTimeout) clearTimeout(awayTimeout);

      updateUserData({ away: false });
      awayStartTimeRef.current = null;

      const awayTime = awayStartTimeRef.current
        ? new Date().getTime() - awayStartTimeRef.current
        : null;

      posthog.capture('user no longer away', { userId: userData?.userId, awayTime });
    } else {
      // wait for the page to not be for a while before considering the user away
      awayTimeout = setTimeout(() => {
        // can't rely on isVisible here because it's in a closure?
        if (document.visibilityState === 'hidden') {
          updateUserData({ away: true, awayStartedAt: new Date() });
          awayStartTimeRef.current = new Date().getTime();

          posthog.capture('user away', {
            userId: userData?.userId,
            threshold: AWAY_TIME_THRESHOLD,
          });
        }
      }, AWAY_TIME_THRESHOLD);
    }
  });

  useEffect(() => {
    setPartySocket(ws);
  }, [ws, setPartySocket]);

  const { processSeverMessage } = useUserList({ ws });

  return null;
}
