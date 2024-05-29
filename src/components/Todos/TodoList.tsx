'use client';

import {
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

import { Separator } from '@/components/ui/separator';

import TodoItem from '@/components/Todos/TodoItem';

import useTodoList from '@/hooks/useTodoList';

import { Todo } from '@/lib/types';

export default function TodoList() {
  const { todos, moveTodoItem } = useTodoList();
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    moveTodoItem(active, over);
  }

  const prioritiesCompleted = todos.slice(0, 3).every((t) => t.status === 'completed');
  const allCompleted = todos.every((t) => t.status === 'completed');

  return (
    <div className='py-6'>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={todos} strategy={verticalListSortingStrategy}>
          {todos.map((todo: Todo, index: number) => (
            <>
              {index === 3 && (
                <>
                  {prioritiesCompleted && (todos.length <= 3 || !allCompleted) && (
                    <div className='flex justify-center w-full text-sm text-slate-500 pt-2'>
                      Well done on getting your important tasks done! 😀
                    </div>
                  )}
                  <div className='flex justify-center w-full'>
                    <Separator className='mt-5 mb-4 bg-zinc-300 w-4/5 bg-center' key='separator' />
                  </div>
                </>
              )}
              <TodoItem key={todo.id} todo={todo} index={index} />
            </>
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
}
