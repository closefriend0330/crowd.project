'use client';

import { signIn, signOut, useSession } from 'next-auth/react';

import Avatar from '@/components/Presence/Avatar';
import Tooltip from '@/components/Site/Tooltip';
import { Button } from '@/components/ui/button';

export default function User() {
  const { data: session } = useSession();
  const user = session?.user;

  return user ? (
    <>
      <Tooltip tooltip={`${user.name} (${user.email})`}>
        <Avatar user={user} />
      </Tooltip>
      <Button
        variant='outline'
        className='text-sm sm:text-base bg-transparent h-8 sm:h-10 px-2 sm:px-4 hover:bg-purple-300'
        onClick={() => signOut()}
      >
        Logout
      </Button>
    </>
  ) : (
    <Button
      variant='secondary'
      className='text-sm sm:text-base h-8 sm:h-10 px-2 sm:px-4'
      onClick={() => signIn()}
    >
      Login
    </Button>
  );
}
