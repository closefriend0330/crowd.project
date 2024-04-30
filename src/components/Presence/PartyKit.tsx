'use client';

import { useSetAtom } from 'jotai';
import { useSession } from 'next-auth/react';
import usePartySocket from 'partysocket/react';
import { useEffect } from 'react';
import { toast } from 'sonner';

import useUserList from '@/hooks/useUserList';

import { debug } from '@/lib/utils';
import { connectedAtom, partySocketAtom } from '@/store';

export default function PartyKit() {
  const { data: session } = useSession();
  const setIsConnected = useSetAtom(connectedAtom);
  const setPartySocket = useSetAtom(partySocketAtom);

  const ws = usePartySocket({
    host: process.env.NEXT_PUBLIC_PARTYKIT_URL,
    room: 'main',
    query: session ? { userId: session.user.id } : { userId: undefined },

    onOpen() {
      debug('Connection created');

      setIsConnected(true);
    },
    async onMessage(event: MessageEvent) {
      debug('Server message received: ', event.data);

      await processSeverMessage({ message: event.data });
    },
    onClose() {
      debug('Connection closed');
      toast('Connection closed');

      setIsConnected(false);
    },
    onError(e) {
      const message = JSON.stringify(e);

      console.error(`Connection error: ${message}`);
    },
  });

  useEffect(() => {
    setPartySocket(ws);
  }, [ws, setPartySocket]);

  const { processSeverMessage } = useUserList({ ws });

  return null;
}
