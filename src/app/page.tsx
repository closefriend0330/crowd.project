'use client';

import { useSession } from 'next-auth/react';

import TagLine from '@/components/Presence/TagLine';
import UserList from '@/components/Presence/UserList';

export default function Home() {
  const { data: session } = useSession();

  return (
    <main className='px-4'>
      {session && <TagLine />}
      <UserList />
    </main>
  );
}
