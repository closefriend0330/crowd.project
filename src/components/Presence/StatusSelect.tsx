import { IconWifiOff } from '@tabler/icons-react';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { cn } from '@/lib/utils';
import { userSelectableStatusOptions, userStatusConfig } from '@/statusOptions';

type Props = {
  field: any;
  selectedStatus: string;
};
export default function StatusSelect({ field, selectedStatus }: Props) {
  return (
    <Select onValueChange={field.onChange} defaultValue={field.value} {...field}>
      <SelectTrigger
        className={cn(
          'w-min',
          selectedStatus
            ? [userStatusConfig[selectedStatus]?.color, 'text-white font-bold']
            : 'text-black bg-white'
        )}
      >
        <SelectValue placeholder='Select your status' />
      </SelectTrigger>
      <SelectContent
        style={{
          maxHeight: 'min(var(--radix-select-content-available-height), 380px)',
        }}
      >
        <SelectGroup>
          <SelectLabel>
            <div className='flex flex-row justify-between items-center'>
              <div>Status</div>{' '}
              <div className='font-normal'>({userSelectableStatusOptions.length})</div>
            </div>
          </SelectLabel>
          <SelectItem disabled key={'offline'} value={'offline'}>
            <div className='flex items-center gap-4'>
              <div className='w-5 hidden xs:block'>{<IconWifiOff className='size-5' />}</div>
              <div className='text-sm'>offline</div>
            </div>
          </SelectItem>

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
