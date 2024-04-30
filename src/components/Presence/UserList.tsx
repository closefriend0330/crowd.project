'use client';

import { useEffect, useState } from 'react';

import UserListEntry from '@/components/Presence/UserListEntry';

import useConfetti from '@/hooks/useConfetti';
import useUserListStore from '@/hooks/useUserListStore';

import { CONFETTI_DELAY_MAX, CONFETTI_DELAY_MIN } from '@/config';

export default function UserList() {
  const { users } = useUserListStore();
  const { shootConfetti } = useConfetti();
  const [shot, setShot] = useState(false);

  useEffect(() => {
    if (!shot) {
      console.log('confetti shot');
      setShot(true);
      shootConfetti({
        delay: Math.floor(Math.random() * CONFETTI_DELAY_MIN) + CONFETTI_DELAY_MAX,
        source: 'user list load',
      });
    }
  }, [shootConfetti, shot]);

  return users?.length > 0 ? (
    <>
      <h2 className='text-lg sm:text-xl font-header font-bold border-b pb-1 border-black text-right'>
        Online ({users.length})
      </h2>
      <div>
        {users.map((user) => (
          <UserListEntry key={user.userId} user={user} />
        ))}
      </div>
    </>
  ) : (
    <div className='italic'>No active users right now. Come join the party!</div>
  );
}
