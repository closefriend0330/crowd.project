import { Badge } from '@/components/ui/badge';

import TimeAgo from '@/components/Presence/TimeAgo';

import { cn } from '@/lib/utils';
import { userStatusConfig } from '@/statusOptions';

import { UserPublicData } from '@/lib/types';

type Props = {
  user: UserPublicData;
  className?: string;
};
export default function StatusBadge({ user, className }: Props) {
  const Icon = userStatusConfig[user.status].icon;

  if (user.status === 'online') return null;

  return (
    <div className={className}>
      <Badge
        variant='default'
        className={cn(
          'flex flex-row items-center gap-2 text-xs xs:text-sm hover:bg-opacity-75',
          userStatusConfig[user.status].color
        )}
      >
        {user.status}
        {user.statusChangedAt && (
          <TimeAgo date={user.statusChangedAt} prefix='(' suffix=')' disableTooltip />
        )}
        {Icon && <Icon strokeWidth={2} className='size-4 xs:size-5' />}
      </Badge>
    </div>
  );
}
