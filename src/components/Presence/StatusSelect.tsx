import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useSession } from 'next-auth/react';

import useUserData from '@/hooks/useUserData';

import { cn } from '@/lib/utils';
import { userSelectableStatusOptions, userStatusConfig } from '@/statusConfig';
import posthog from 'posthog-js';

export default function StatusSelect() {
  const { userData, updateUserData } = useUserData();
  const { data: session } = useSession();
  const currentStatus = userData?.status;

  if (!session?.user) return null;

  const updateStatus = (status: string) => {
    if (status) {
      posthog.capture('status update', { status, oldStatus: currentStatus });

      updateUserData({ status, statusChangedAt: new Date() });
    }
  };

  return (
    <Select onValueChange={updateStatus} defaultValue={currentStatus} value={currentStatus}>
      <SelectTrigger
        className={cn(
          'w-min',
          currentStatus
            ? [userStatusConfig[userData.status].backgroundColor, 'text-white font-bold']
            : 'text-black bg-white'
        )}
      >
        <SelectValue placeholder='Select your status' />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Status</SelectLabel>
          {userSelectableStatusOptions.map((status) => {
            const Icon = userStatusConfig[status].icon;

            return (
              <SelectItem key={status} value={status}>
                <div className='flex items-center gap-4'>
                  <div className='w-5 hidden xs:block'>{Icon && <Icon className='size-5' />}</div>
                  <div className='text-sm'>{status}</div>
                </div>
              </SelectItem>
            );
          })}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
