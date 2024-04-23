import { useSession } from 'next-auth/react';
import usePartySocket from 'partysocket/react';
import { useEffect } from 'react';

import useUserList from '@/hooks/useUserList';

export default function usePartyKit() {
  const { data: session } = useSession();
  const { setUserList } = useUserList();

  const ws = usePartySocket({
    host: process.env.NEXT_PUBLIC_PARTYKIT_URL,
    room: 'main',

    onOpen() {
      console.log('connected');
    },
    onMessage(e) {
      console.log('message', e.data);

      try {
        const msg = JSON.parse(e.data);

        console.log('parsed message', msg);
        if (msg.type === 'list') {
          setUserList(msg.users);
        }
      } catch (e) {
        console.error('Error parsing message:', e);
      }
    },
    onClose() {
      console.log('closed');
    },
    onError(e) {
      console.log('error');
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
}
