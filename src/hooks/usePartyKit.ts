import { useSession } from 'next-auth/react';
import usePartySocket from 'partysocket/react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import useUserList from '@/hooks/useUserList';
import { debug } from '@/lib/utils';

export default function usePartyKit() {
  const { data: session } = useSession();
  const { setUserList } = useUserList();
  const [isConnected, setIsConnected] = useState(false);

  const ws = usePartySocket({
    host: process.env.NEXT_PUBLIC_PARTYKIT_URL,
    room: 'main',

    onOpen() {
      setIsConnected(true);
      debug('connection opened');
    },
    onMessage(e) {
      debug('message', e.data);

      try {
        const msg = JSON.parse(e.data);

        if (msg.type === 'list') {
          setUserList(msg.users);
        }
      } catch (e) {
        console.error('Error parsing message:', e);
      }
    },
    onClose() {
      setIsConnected(false);
      debug('connection closed');
    },
    onError(e) {
      const errors = JSON.stringify(e);

      console.error(`connection error ${errors}`);
      toast.error(`Connection error: ${errors}`);
    },
  });

  useEffect(() => {
    if (session && ws) {
      ws.send(
        JSON.stringify({
          type: 'presence',
          user: { id: session?.user?.id, name: session?.user?.name, image: session?.user?.image },
          status: 'online',
        })
      );
    }
  }, [session, ws]);

  return { ws, isConnected };
}
