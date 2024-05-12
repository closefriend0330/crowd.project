'use client';

import { IconLock, IconTrash } from '@tabler/icons-react';
import { useState } from 'react';

import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible';

import Tooltip from '@/components/Site/Tooltip';
import NewTodo from '@/components/Todos/NewTodo';
import TodoHeader from '@/components/Todos/TodoHeader';
import TodoList from '@/components/Todos/TodoList';
import TodoProgress from '@/components/Todos/TodoProgress';

import useTodoList from '@/hooks/useTodoList';

export default function Todos() {
  const { todos, removeAllTodos } = useTodoList();
  const [showTodos, setShowTodos] = useState(true);

  return (
    <div className='w-full py-4'>
      <Collapsible open={showTodos} onOpenChange={setShowTodos}>
        <TodoHeader showTodos={showTodos} setShowTodos={setShowTodos} />
        <div className='flex flex-row items-center gap-4 w-full'>
          <NewTodo className='grow' />
          {todos.length > 5 && showTodos && (
            <Tooltip tooltip='Delete all items'>
              <IconTrash className='size-4 cursor-pointer' onClick={removeAllTodos} />
            </Tooltip>
          )}
        </div>
        <CollapsibleContent>
          {todos.length === 0 ? (
            <div className='text-xs text-slate-700 pt-4 flex flex-row items-center gap-2'>
              <IconLock className='size-6 inline-block mb-0.5' />
              <div>
                Your priorities are private and stored on your device. Only the completion rate is
                shared with the room.
              </div>
            </div>
          ) : (
            <>
              <TodoList />
              <TodoProgress />
            </>
          )}
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
