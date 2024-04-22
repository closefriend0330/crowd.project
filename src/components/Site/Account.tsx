/* eslint-disable @next/next/no-img-element */
'use client';

import { signIn, signOut, useSession } from 'next-auth/react';

export default function User() {
  const { data: session } = useSession();

  return session?.user ? (
    <>
      {session.user.image && (
        <img
          className='rounded-full size-8 sm:size-10 border-white border-[1px]'
          src={session.user.image}
          alt={session.user.name || session.user.email || 'Unknown User'}
        />
      )}
      <button
        className='rounded-md border-[1px] border-white px-2 py-1 text-sm sm:text-base hover:bg-purple-300'
        onClick={() => signOut()}
      >
        Logout
      </button>
    </>
  ) : (
    <button
      className='rounded-md border-[1px] text-sm sm:text-base border-white px-2 py-1'
      onClick={() => signIn()}
    >
      Login
    </button>
  );
}
