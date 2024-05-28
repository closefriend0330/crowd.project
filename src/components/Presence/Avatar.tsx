import { IconUser } from '@tabler/icons-react';
import { User } from 'next-auth';

import { AvatarFallback, AvatarImage, Avatar as AvatarRoot } from '@/components/ui/avatar';

import { cn } from '@/lib/utils';

import { UserPublic } from '@/lib/types';

type Props = {
  user: User | UserPublic;
  className?: string;
};

const statusStyle = {
  online: 'border-green-500',
  away: 'border-yellow-500',
  offline: 'border-white',
};

export default function Avatar({ user, className }: Props) {
  const initials = user?.name
    ? user?.name
        .split(' ')
        .map((n) => n[0].toUpperCase())
        .slice(0, 3)
        .join('')
    : '';

  return (
    <AvatarRoot
      className={cn(
        'size-8 sm:size-10 border-white-500 border-[3px]',
        statusStyle[user.connectionStatus],
        className
      )}
    >
      <AvatarImage
        className={cn(
          'select-none pointer-events-none',
          user.connectionStatus === 'away' && 'opacity-50'
        )}
        src={user.image || undefined}
      />
      <AvatarFallback className='text-black text-sm sm:text-base'>
        {initials || <IconUser className='size-4 sm:size-5' />}
      </AvatarFallback>
    </AvatarRoot>
  );
}
