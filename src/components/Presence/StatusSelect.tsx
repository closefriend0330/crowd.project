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
import { userSelectableStatusOptions, userStatusConfig } from '@/statusConfig';

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
            ? [userStatusConfig[selectedStatus]?.backgroundColor, 'text-white font-bold']
            : 'text-black bg-white'
        )}
      >
        <SelectValue placeholder='Select your status' />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>
            <div className='flex flex-row justify-between items-center'>
              <div>Status</div>{' '}
              <div className='font-normal'>({userSelectableStatusOptions.length})</div>
            </div>
          </SelectLabel>
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
