import { IconPointFilled, IconUser } from '@tabler/icons-react';

import { AvatarFallback, AvatarImage, Avatar as AvatarRoot } from '@/components/ui/avatar';

import { cn } from '@/lib/utils';

import { User } from 'next-auth';

type Props = {
  user: User;
  className?: string;
  status?: 'online' | 'offline';
};

export default function Avatar({ user, className, status }: Props) {
  const initials = user?.name
    ? user?.name
        .split(' ')
        .map((n) => n[0].toUpperCase())
        .slice(0, 3)
        .join('')
    : '';

  return (
    <div className='relative'>
      <AvatarRoot className={cn('size-8 sm:size-10 border-white border-[1px]', className)}>
        <AvatarImage className='select-none  pointer-events-none' src={user.image || undefined} />
        <AvatarFallback className='text-black text-sm sm:text-base'>
          {initials || <IconUser className='size-4 sm:size-5' />}
        </AvatarFallback>
      </AvatarRoot>
      {status === 'online' && (
        <IconPointFilled className='absolute -bottom-[6px] -right-[6px] text-green-500' />
      )}
    </div>
  );
}
