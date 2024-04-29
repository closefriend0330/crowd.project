'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import posthog from 'posthog-js';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import useUserData from '@/hooks/useUserData';

const formSchema = z.object({
  tagline: z.string().min(1, { message: 'Min tagline length is 1 character' }).max(120, {
    message: 'Max tagline length is 120 characters.',
  }),
});

export default function TagLine() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tagline: '',
    },
  });
  const { updateUserData } = useUserData();

  const onSubmit = ({ tagline }: z.infer<typeof formSchema>) => {
    updateUserData({ tagline });
    posthog.capture('tagline update', { length: tagline.length });

    form.reset();
  };

  return (
    <div className='py-4'>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
          <FormField
            control={form.control}
            name='tagline'
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input className='bg-white' placeholder='what are you up to?' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  );
}
