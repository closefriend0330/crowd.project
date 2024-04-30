'use client';

import { useSession } from 'next-auth/react';

import Confetti from '@/components/Confetti';
import PartyKit from '@/components/Presence/PartyKit';
import TagLine from '@/components/Presence/TagLine';
import UserList from '@/components/Presence/UserList';

export default function Home() {
  const { data: session } = useSession();
  const user = session?.user;

  return (
    <main className='px-4'>
      <Confetti />

      {user ? (
        <>
          <PartyKit />
          <TagLine />
          <UserList />
        </>
      ) : (
        <div className='italic'>Connect via Discord or Twitch and join the party!</div>
      )}
    </main>
  );
}
