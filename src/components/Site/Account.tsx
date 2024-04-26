'use client';

import {
  IconBrandDiscord,
  IconBrandTwitch,
  IconFriends,
  IconLoader2,
  IconMoodSmile,
} from '@tabler/icons-react';
import { signIn, useSession } from 'next-auth/react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import Avatar from '@/components/Presence/Avatar';
import AccountMenu from '@/components/Site/AccountMenu';

export default function User() {
  const { data: session, status } = useSession();
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const user = session?.user;

  return user ? (
    <AccountMenu user={user}>
      <Avatar user={user} />
    </AccountMenu>
  ) : (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='secondary' className='text-sm sm:text-base h-8 sm:h-10 px-2 sm:px-4'>
          {status === 'loading' || isLoggingIn ? (
            <IconLoader2 className='size-5 animate-spin' />
          ) : (
            <>
              <IconFriends className='size-5 mr-2 text-purple-700' />
              Join us!
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent onCloseAutoFocus={(e) => e.preventDefault()} align='end'>
        <DropdownMenuLabel className='flex gap-2 items-center'>
          <IconMoodSmile className='size-6 w-6 text-yellow-500 inline-block' />
          Welcome, friend!
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={() => {
            setIsLoggingIn(true);
            signIn('twitch');
          }}
          className='flex gap-2 items-center'
        >
          <IconBrandTwitch className='size-6 text-purple-700 w-6' />
          Twitch
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            setIsLoggingIn(true);
            signIn('discord');
          }}
          className='flex gap-2 items-center'
        >
          <IconBrandDiscord className='size-6 text-blue-700 w-6' />
          Discord
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
