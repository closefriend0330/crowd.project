'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import CharactersLeft from '@/components/CharactersLeft';

import useTodos from '@/hooks/useTodoList';

import {
  MAX_OPEN_TODO_LIST_ITEMS,
  MAX_TODO_ITEM_LENGTH,
  TODO_LIST_WARNING_THRESHOLD,
} from '@/config';
import { cn } from '@/lib/utils';

const todoFormSchema = z.object({
  title: z
    .string()
    .min(1, { message: 'Title needed for new item.' })
    .max(MAX_TODO_ITEM_LENGTH, {
      message: `Max item length is ${MAX_TODO_ITEM_LENGTH} characters.`,
    }),
});
type TodoFormValues = z.infer<typeof todoFormSchema>;

type Props = {
  className?: string;
};

export default function NewTodo({ className }: Props) {
  const { addTodo, todos, openTodos, todoSlotsLeft, allCompleted } = useTodos();
  const form = useForm({
    resolver: zodResolver(todoFormSchema),
    defaultValues: {
      title: '',
    },
  });
  const title = form.watch('title');

  function onSubmit({ title }: TodoFormValues) {
    addTodo(title.trim());

    form.reset();
  }

  const pastWarningThreshold = todoSlotsLeft < TODO_LIST_WARNING_THRESHOLD;

  let placeholder =
    todoSlotsLeft === 0
      ? 'slow down! finish some items first!'
      : todos.length === 0
      ? "what's your #1 priority today?"
      : 'any more priorities for today?';

  if (todoSlotsLeft > 0 && pastWarningThreshold)
    placeholder += ` (${MAX_OPEN_TODO_LIST_ITEMS - openTodos} left)`;
  else if (allCompleted) placeholder += " don't overdo it!";

  return (
    <div className={cn(className)}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
          <FormField
            control={form.control}
            name='title'
            render={({ field }) => (
              <FormItem className='w-full grow'>
                <FormControl>
                  <Input
                    placeholder={placeholder}
                    maxLength={MAX_TODO_ITEM_LENGTH}
                    disabled={todoSlotsLeft <= 0}
                    {...field}
                    className='bg-white grow'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
      <CharactersLeft monitor={title} maxLength={MAX_TODO_ITEM_LENGTH} />
    </div>
  );
}
