import Avatar from '@/components/Presence/Avatar';
import TimeAgo from '@/components/Presence/TimeAgo';
import StatusBadge from '@/components/Site/StatusBadge';
import Linkify from 'linkify-react';

import { UserPublicData } from '@/lib/types';

type Props = {
  user: UserPublicData;
};

export default function UserListEntry({ user }: Props) {
  const linkifyOptions = {
    target: '_blank',
    truncate: 30,
  };

  return (
    <div className='p-2 flex gap-2 items-center even:bg-purple-200'>
      <div className='flex flex-row gap-2 items-top grow'>
        <div>
          <Avatar user={user} className='size-8 sm:size-10' />
        </div>
        <div className='flex flex-col grow'>
          <div className='flex flex-row items-center gap-4 sm:gap-8 text-xl'>
            <div className='flex-grow text-sm sm:text-base'>{user.name}</div>
            <div>{user.status !== 'online' && <StatusBadge user={user} />}</div>
          </div>
          <div className='text-sm text-slate-500 mt-2 min-h-[1.4em]'>
            <Linkify options={linkifyOptions}>{user.tagline || ''}</Linkify>
          </div>
          {user.away
            ? user.awayStartedAt && (
                <TimeAgo
                  className='text-xs text-slate-700 self-end'
                  tooltipPrefix={`Connected at ${user?.sessionStartedAt?.toLocaleString()}, away since `}
                  date={user.awayStartedAt}
                />
              )
            : user.sessionStartedAt && (
                <>
                  <TimeAgo
                    className='text-xs text-slate-700 self-end'
                    tooltipPrefix='Connected at '
                    date={user.sessionStartedAt}
                  />
                </>
              )}
        </div>
      </div>
    </div>
  );
}
