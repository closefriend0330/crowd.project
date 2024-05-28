'use client';

import Linkify from 'linkify-react';

import Avatar from '@/components/Presence/Avatar';
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

export default function UserListEntry({ user }: Props) {
  return (
    <div className='px-2 py-3 flex flex-col gap-3 even:bg-purple-200'>
      <div className='flex flex-row gap-2 items-center'>
        <Avatar user={user} className='size-8 sm:size-10' />
        <div className='text-base sm:text-lg grow'>{user.name}</div>
      </div>
      <UserListUpdate user={user} />
      <div className='flex flex-row justify-between items-center gap-2'>
        <UserCompletionRate user={user} />
        <StatusBadge className='' user={user} />
      </div>
    </div>
  );
}
