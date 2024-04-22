/* eslint-disable @next/next/no-img-element */
'use client';

import { IconUser } from '@tabler/icons-react';
import { signIn, signOut, useSession } from 'next-auth/react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

import Tooltip from '@/components/Site/Tooltip';

export default function User() {
  const { data: session } = useSession();

  const initials = session?.user?.name
    ? session.user?.name
        .split(' ')
        .map((n) => n[0].toUpperCase())
        .slice(0, 3)
        .join('')
    : '';

  return session?.user ? (
    <>
      <Tooltip tooltip={`${session.user.name} (${session.user.email})}`}>
        <Avatar className='size-8 sm:size-10 border-white border-[1px]'>
          <AvatarImage src={session.user.image || undefined} />
          <AvatarFallback className='text-black text-sm sm:text-base'>
            {initials || <IconUser className='size-4 sm:size-5' />}
          </AvatarFallback>
        </Avatar>
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
