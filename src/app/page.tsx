'use client';

import { useAtomValue } from 'jotai';
import { useSession } from 'next-auth/react';

import Confetti from '@/components/Confetti';
import PartyKit from '@/components/Presence/PartyKit';
import TagLine from '@/components/Presence/TagLine';
import UserList from '@/components/Presence/UserList';
import Error from '@/components/Site/Error';
import LoggedOutHomepage from '@/components/Site/LoggedOutHomepage';
import VisibilityEvents from '@/components/Site/VisibilityEvents';

import { connectionStatusAtom } from '@/store';

export default function Home() {
  const { data: session } = useSession();
  const user = session?.user;

  const connectionStatus = useAtomValue(connectionStatusAtom);

  if (!user) return <LoggedOutHomepage />;

  return (
    <div>
      <Confetti />
      <PartyKit />
      <VisibilityEvents />
      {connectionStatus === 'fully connected' && (
        <div>
          <TagLine />
          <UserList />
        </div>
      )}
      {connectionStatus === 'partially connected' && <Error />}
    </div>
  );
}
