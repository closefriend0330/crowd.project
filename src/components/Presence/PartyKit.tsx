'use client';

import { useSetAtom } from 'jotai';
import usePartySocket from 'partysocket/react';
import { useEffect } from 'react';
import { toast } from 'sonner';

import useUserList from '@/hooks/useServerMessages';
import useSoundEffects from '@/hooks/useSoundEffects';

import { debug } from '@/lib/utils';
import { connectionStatusAtom, partySocketAtom } from '@/store';

type Props = {
  sessionToken: string;
};
export default function PartyKit({ sessionToken }: Props) {
  const setConnectionStatusAtom = useSetAtom(connectionStatusAtom);
  const setPartySocket = useSetAtom(partySocketAtom);
  const { playConnectionChange } = useSoundEffects();

  const ws = usePartySocket({
    host: process.env.NEXT_PUBLIC_PARTYKIT_URL,
    room: 'main',
    query: { sessionToken },

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

  useEffect(() => {
    setPartySocket(ws);
  }, [ws, setPartySocket]);

  const processSeverMessage = useUserList({ ws });

  return null;
}
