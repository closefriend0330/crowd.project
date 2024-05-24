'use client';

import Linkify from 'linkify-react';

import Avatar from '@/components/Presence/Avatar';
import TimeAgo from '@/components/Presence/TimeAgo';
import UserCompletionRate from '@/components/Presence/UserCompletionRate';
import StatusBadge from '@/components/Site/StatusBadge';

import { UserPublic } from '@/lib/types';

type Props = {
  user: UserPublic;
};

function UserListUpdate({ user }: { user: UserPublic }) {
  const linkifyOptions = {
    target: '_blank',
    truncate: 30,
  };
  return (
    <div className='text-sm text-slate-500 break-words'>
      <Linkify options={linkifyOptions}>{user.update || ''}</Linkify>
    </div>
  );
}

function UserListTimestamp({ user, className }: { user: UserPublic; className?: string }) {
  return (
    <div className={className}>
      {user.away && user.awayChangedAt && (
        <TimeAgo
          className='text-xs text-slate-700 self-end'
          tooltipPrefix={`Connected at ${user?.sessionStartedAt?.toLocaleString()}, away since `}
          date={user.awayChangedAt}
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
      <UserListUpdate user={user} />
      <div className='flex flex-row justify-between items-center gap-2'>
        <UserCompletionRate user={user} />
        <StatusBadge className='' user={user} />
      </div>
    </div>
  );
}
