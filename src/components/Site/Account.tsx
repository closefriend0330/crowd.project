'use client';

import { signIn, useSession } from 'next-auth/react';

import Avatar from '@/components/Presence/Avatar';
import AccountMenu from '@/components/Site/AccountMenu';
import { Button } from '@/components/ui/button';

export default function User() {
  const { data: session } = useSession();
  const user = session?.user;

  return user ? (
    <AccountMenu user={user}>
      <Avatar user={user} />
    </AccountMenu>
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
