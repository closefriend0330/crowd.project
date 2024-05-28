import { Badge } from '@/components/ui/badge';

import TimeAgo from '@/components/Presence/TimeAgo';

import { cn } from '@/lib/utils';
import { DEFAULT_STATUS, userStatusConfig } from '@/statusOptions';

import { UserPublic } from '@/lib/types';

type Props = {
  user: UserPublic;
  className?: string;
};
export default function StatusBadge({ user, className }: Props) {
  const Icon = userStatusConfig[user.status]?.icon;
  const color = userStatusConfig[user.status]?.color;

  if (user.status === DEFAULT_STATUS) return null;

  return (
    <div className={className}>
      <Badge
        variant='default'
        className={cn(
          'flex flex-row items-center gap-2 text-xs xs:text-sm hover:bg-opacity-75',
          color
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
