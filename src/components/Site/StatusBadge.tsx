import { Badge } from '@/components/ui/badge';

import { userStatusConfig } from '@/statusConfig';
import { cn } from '@/lib/utils';

import { UserPublicData } from '@/lib/types';

type Props = {
  user: UserPublicData;
};
export default function StatusBadge({ user }: Props) {
  const Icon = userStatusConfig[user.status].icon;

  return (
    <Badge
      variant='default'
      className={cn(
        'flex flex-row items-center gap-2 text-sm hover:bg-opacity-75',
        userStatusConfig[user.status].backgroundColor
      )}
    >
      {user.status}
      {Icon && <Icon strokeWidth={2} className='size-5' />}
    </Badge>
  );
}
