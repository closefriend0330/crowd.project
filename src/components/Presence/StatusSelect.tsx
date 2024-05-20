import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons';
import { KeyboardEvent, useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';

import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { FormControl, FormItem } from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

import { cn } from '@/lib/utils';
import { userSelectableStatusOptions, userStatusConfig } from '@/statusOptions';

import { StatusUpdateForm, StatusUpdateFormField } from '@/components/Presence/StatusUpdate';

type StatusOptionsProps = {
  status: string;
  color?: boolean;
};
function StatusOption({ status, color }: StatusOptionsProps) {
  const Icon = userStatusConfig[status]?.icon;

  return (
    <div className='flex items-center gap-4'>
      <div className='w-5 hidden xs:block'>{Icon && <Icon className='size-5' />}</div>
      <div className='text-sm'>{status}</div>
    </div>
  );
}

type Props = {
  field: StatusUpdateFormField<'status'>;
  selectedStatus: string;
  form: StatusUpdateForm;
  handleKeyDown: (event: KeyboardEvent<HTMLTextAreaElement | HTMLButtonElement>) => void;
};
export default function StatusSelect({ field, selectedStatus, form, handleKeyDown }: Props) {
  const [statusOpen, setStatusOpen] = useState(false);

  useHotkeys(
    's',
    () => {
      console.log('status focus');
      setStatusOpen(true);
    },
    { preventDefault: true }
  );

  return (
    <FormItem className='flex flex-col'>
      <Popover open={statusOpen} onOpenChange={setStatusOpen}>
        <PopoverTrigger asChild>
          <FormControl>
            <Button
              variant='outline'
              role='combobox'
              className={cn(
                'w-min justify-between',
                selectedStatus
                  ? [userStatusConfig[selectedStatus]?.color, 'text-white font-bold']
                  : 'text-black bg-white',
                !field.value && 'text-muted-foreground'
              )}
              onKeyDown={handleKeyDown}
            >
              {field.value ? <StatusOption status={field.value} /> : 'Select your status'}
              <CaretSortIcon className='ml-2 h-4 w-4 shrink-0 opacity-50' />
            </Button>
          </FormControl>
        </PopoverTrigger>
        <PopoverContent
          align='start'
          className='w-min p-0'
          style={{
            maxHeight: 'calc(var(--radix-popover-content-available-height) - 22px)',
            overflowY: 'hidden',
          }}
        >
          <Command>
            <CommandInput placeholder='Search statuses...' className='h-9' />
            <CommandEmpty>No status found.</CommandEmpty>
            <CommandGroup>
              <CommandList className='max-h-status-popover-list '>
                {userSelectableStatusOptions.map((status) => (
                  <CommandItem
                    value={status}
                    key={status}
                    onSelect={() => {
                      form.setValue('status', status, { shouldDirty: true });
                      setStatusOpen(false);
                    }}
                  >
                    <StatusOption status={status} color />
                    <CheckIcon
                      className={cn(
                        'ml-auto h-4 w-4',
                        status === field.value ? 'opacity-100' : 'opacity-0'
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandList>
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </FormItem>
  );
}
