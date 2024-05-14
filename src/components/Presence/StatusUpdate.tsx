'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { pickBy } from 'lodash';
import posthog from 'posthog-js';
import { KeyboardEvent, useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';

import CharactersLeft from '@/components/CharactersLeft';
import StatusSelect from '@/components/Presence/StatusSelect';

import useConfetti from '@/hooks/useConfetti';
import useSoundEffects from '@/hooks/useSoundEffects';
import useUserData from '@/hooks/useUserData';

import { MAX_TAGLINE_LENGTH } from '@/config';
import { cn } from '@/lib/utils';

const statusFormSchema = z.object({
  tagline: z
    .string()
    .max(MAX_TAGLINE_LENGTH, {
      message: `Max tagline length is ${MAX_TAGLINE_LENGTH} characters.`,
    })
    .optional(),
  status: z.string().optional(),
});
type StatusFormValues = z.infer<typeof statusFormSchema>;

type Props = {
  className?: string;
};

export default function StatusUpdate({ className }: Props) {
  const { playUserUpdatePosted } = useSoundEffects();
  const { updateUserData, userData } = useUserData();
  const status = userData?.status || 'online';
  const form = useForm({
    resolver: zodResolver(statusFormSchema),
    defaultValues: {
      tagline: '',
      status: userData?.status,
    },
  });
  const { shootConfetti } = useConfetti();
  const update = form.watch('tagline');

  useEffect(() => {
    form.setValue('status', status);
  }, [form, status]);

  const onSubmit = useCallback(
    (values: StatusFormValues) => {
      const updatedValues: Partial<StatusFormValues> = pickBy(
        values,
        (_: any, key: keyof typeof values) => form.formState.dirtyFields?.[key]
      );
      updateUserData({ data: updatedValues });

      form.reset({ status: values.status, tagline: '' });

      posthog.capture('status update', {
        updateLength: updatedValues?.tagline?.length,
        status: updatedValues?.status,
      });

      if (updatedValues.tagline) {
        playUserUpdatePosted();
        shootConfetti({ source: 'status update' });
      }
    },
    [form, playUserUpdatePosted, shootConfetti, updateUserData]
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLTextAreaElement>) => {
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        form.handleSubmit(onSubmit)();
      }
    },
    [form, onSubmit]
  );

  return (
    <div className={cn('pb-8', className)}>
      <h2 className='text-lg sm:text-xl font-header font-bold pb-2'>Status Update</h2>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
          <div className='flex flex-col gap-4'>
            <div>
              <FormField
                control={form.control}
                name='tagline'
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        className='bg-white'
                        onKeyDown={handleKeyDown}
                        placeholder={`what's happening?`}
                        maxLength={MAX_TAGLINE_LENGTH}
                        autoFocus
                        autoComplete='off'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className='flex flex-row justify-between items-center'>
              <div>
                <FormField
                  control={form.control}
                  name='status'
                  render={({ field }) => (
                    <FormControl>
                      <FormItem>
                        <StatusSelect
                          field={field}
                          selectedStatus={form.watch('status') || 'online'}
                        />
                      </FormItem>
                    </FormControl>
                  )}
                />
              </div>
              <CharactersLeft monitor={update} maxLength={MAX_TAGLINE_LENGTH} className='w-full' />
              <Button variant='outline' type='submit' disabled={!form.formState.isDirty}>
                Post
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
