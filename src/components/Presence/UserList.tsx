'use client';

import { partition } from 'lodash';
import { useEffect, useState } from 'react';

import UserListEntry from '@/components/Presence/UserListEntry';

import useConfetti from '@/hooks/useConfetti';
import useUserListStore from '@/hooks/useUserListStore';

import { CONFETTI_DELAY_MAX, CONFETTI_DELAY_MIN } from '@/config';

import { UserPublicData } from '@/lib/types';

type UserListSegmentProps = {
  users: UserPublicData[];
  title: string;
  className?: string;
};

function UserListSegment({ users, title, className }: UserListSegmentProps) {
  if (users.length === 0) return null;

  return (
    <div className={className}>
      <h2 className='text-lg sm:text-xl font-header font-bold border-b pb-2 border-gray-400 text-right'>
        {title} ({users.length})
      </h2>
      <div>
        {users.map((user) => (
          <UserListEntry key={user.userId} user={user} />
        ))}
      </div>
    </div>
  );
}

type Props = {
  className?: string;
};

export default function UserList({ className }: Props) {
  const { users } = useUserListStore();
  const { shootConfetti } = useConfetti();
  const [shot, setShot] = useState(false);

  const [awayUsers, connectedUsers] = partition(users, (user) => user.away);

  useEffect(() => {
    if (!shot) {
      setShot(true);

      shootConfetti({
        delay: Math.floor(Math.random() * CONFETTI_DELAY_MIN) + CONFETTI_DELAY_MAX,
        source: 'user list load',
      });
    }
  }, [shootConfetti, shot]);

  return users?.length > 0 ? (
    <div className={className}>
      <UserListSegment users={connectedUsers} title='Online' className='mb-4' />
      <UserListSegment users={awayUsers} title='Away' />
    </div>
  ) : (
    <div className='italic'>No active users right now. Come join the party!</div>
  );
}
