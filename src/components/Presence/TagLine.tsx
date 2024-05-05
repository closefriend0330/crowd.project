'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import posthog from 'posthog-js';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import useConfetti from '@/hooks/useConfetti';
import useSoundEffects from '@/hooks/useSoundEffects';
import useUserData from '@/hooks/useUserData';

import { MAX_TAGLINE_LENGTH } from '@/config';
import { cn } from '@/lib/utils';

const formSchema = z.object({
  tagline: z
    .string()
    .min(1, { message: 'Min tagline length is 1 character' })
    .max(MAX_TAGLINE_LENGTH, {
      message: `Max tagline length is ${MAX_TAGLINE_LENGTH} characters.`,
    }),
});

export default function TagLine() {
  const { playUserUpdatePosted } = useSoundEffects();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tagline: '',
    },
  });
  const { updateUserData } = useUserData();
  const { shootConfetti } = useConfetti();
  const tagline = form.watch('tagline');

  const onSubmit = ({ tagline }: z.infer<typeof formSchema>) => {
    updateUserData({ tagline });
    form.reset();

    posthog.capture('tagline update', { length: tagline.length });

    playUserUpdatePosted();
    shootConfetti({ source: 'tagline update' });
  };

  return (
    <div className='py-4'>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
          <div className='flex flex-col'>
            <FormField
              control={form.control}
              name='tagline'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      className='bg-white'
                      placeholder='what are you up to?'
                      maxLength={MAX_TAGLINE_LENGTH}
                      autoFocus
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div
              className={cn(
                'mt-2 text-sm text-end min-h-8',
                MAX_TAGLINE_LENGTH - tagline.length <= 10 && 'text-red-500'
              )}
            >
              {tagline.length >= MAX_TAGLINE_LENGTH - 20 &&
                `${tagline.length}/${MAX_TAGLINE_LENGTH}`}
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
