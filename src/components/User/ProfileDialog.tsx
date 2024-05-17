'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { omit, pickBy } from 'lodash';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import useCopyIcon from '@/hooks/useCopyIcons';
import useDialog from '@/hooks/useDialog';
import useUserData from '@/hooks/useUserData';

import { cn, getErrorMessage } from '@/lib/utils';

const formSchema = z.object({
  name: z.string().min(2, {
    message: 'Name must be at least 2 characters.',
  }),
  apiKey: z.string(),
});

function maskApiKey(apiKey: string | undefined | null) {
  if (!apiKey || apiKey.length < 1) return '';

  const [start, ...rest] = apiKey.split('-');
  return `${start}-${rest.join('-').replaceAll(/[A-Za-z0-9]/g, '*')}`;
}

export default function ProfileDialog() {
  const { user, updateUser } = useUserData();
  const { isOpen, close, setIsOpen } = useDialog('profile');
  const apiKey = user?.apiKey || '';

  const { copy, setCopied, CopyIcon, copied } = useCopyIcon();

  const form = useForm({
    resolver: zodResolver(formSchema),
    values: {
      name: user?.name || '',
      apiKey: maskApiKey(apiKey),
    },
  });

  function copyApiKey() {
    copy(user?.apiKey || '');
    setCopied(true);
    toast.success('API key copied to clipboard');
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const updatedValues = pickBy(
        omit(values, ['apiKey']),
        (_, key) => form.formState.dirtyFields?.[key as keyof typeof values]
      );

      if (Object.keys(updatedValues).length > 0) {
        updateUser({ data: updatedValues, successMessage: 'Profile updated' });
      } else toast.info('No changes to update');

      close();
    } catch (err) {
      toast.error(`Failed to update profile: ${getErrorMessage(err)}`);
    }
  }

  function onOpenChange(isOpen: boolean) {
    if (!isOpen) {
      if (form.formState.isDirty) toast.warning('Warning: Profile changes were not saved');

      form.reset();
    }

    setIsOpen(isOpen);
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
            <DialogHeader>
              <DialogTitle className='mb-2'>Edit Profile</DialogTitle>
              <DialogDescription>
                <FormField
                  control={form.control}
                  name='name'
                  render={({ field }) => (
                    <FormItem className='mb-4'>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input {...field} className='w-64' data-1p-ignore />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='apiKey'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Api Key</FormLabel>
                      <FormControl>
                        <div className='flex gap-2 items-center'>
                          <Input {...field} readOnly />
                          <CopyIcon
                            className={cn('inline-block', copied && 'scale-125')}
                            onClick={() => copyApiKey()}
                          />
                        </div>
                      </FormControl>
                      <FormDescription>
                        Update your status{' '}
                        <a target='_blank' href='https://github.com/jschuur/coworking.party?#api'>
                          via the API
                        </a>
                        .
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button disabled={!form.formState.isDirty} type='submit'>
                Update
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
