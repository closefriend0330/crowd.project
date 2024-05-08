'use client';

import Linkify from 'linkify-react';

import Avatar from '@/components/Presence/Avatar';
import TimeAgo from '@/components/Presence/TimeAgo';
import StatusBadge from '@/components/Site/StatusBadge';

import { UserPublicData } from '@/lib/types';

type Props = {
  user: UserPublicData;
};

function UserListTagline({ user }: { user: UserPublicData }) {
  const linkifyOptions = {
    target: '_blank',
    truncate: 30,
  };
  return (
    <div className='text-sm text-slate-500 break-words'>
      <Linkify options={linkifyOptions}>{user.tagline || ''}</Linkify>
    </div>
  );
}

function UserListTimestamp({ user, className }: { user: UserPublicData; className?: string }) {
  return (
    <div className={className}>
      {user.away && user.awayStartedAt && (
        <TimeAgo
          className='text-xs text-slate-700 self-end'
          tooltipPrefix={`Connected at ${user?.sessionStartedAt?.toLocaleString()}, away since `}
          date={user.awayStartedAt}
        />
      )}
    </div>
  );
}

export default function UserListEntry({ user }: Props) {
  return (
    <div className='px-2 py-3 flex flex-col gap-3 even:bg-purple-200'>
      <div className='flex flex-row gap-2 items-center'>
        <Avatar user={user} className='size-8 sm:size-10' />
        <div className='text-base sm:text-lg grow'>{user.name}</div>
        <UserListTimestamp className='flex flex-col items-start' user={user} />
      </div>
      <UserListTagline user={user} />
      <StatusBadge className='flex justify-end' user={user} />
    </div>
  );
}
