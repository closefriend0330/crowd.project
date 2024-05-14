import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { IconGripVertical, IconTrash } from '@tabler/icons-react';

import { Checkbox } from '@/components/ui/checkbox';

import useSoundEffects from '@/hooks/useSoundEffects';
import useTodoList from '@/hooks/useTodoList';

import { MAX_OPEN_TODO_LIST_ITEMS } from '@/config';
import { cn } from '@/lib/utils';

import { Todo } from '@/lib/types';

type Props = {
  todo: Todo;
};

export default function TodoItem({ todo }: Props) {
  const { toggleTodo, removeTodo, openTodos } = useTodoList();
  const { playCheckCompleted, playUnCheck } = useSoundEffects();
  const { attributes, listeners, setNodeRef, transform, transition, active } = useSortable({
    id: todo.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  function handleToggle() {
    if (!todo.completed) playCheckCompleted();
    else playUnCheck();

    toggleTodo(todo.id);
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className='group flex flex-row justify-between items-center gap-1 py-1'
    >
      <div {...attributes} {...listeners}>
        <IconGripVertical className='size-5 invisible group-hover:visible cursor-move' />
      </div>
      <label className='flex flex-row items-center gap-2 grow' htmlFor={`todo-${todo.id}`}>
        <Checkbox
          id={`todo-${todo.id}`}
          checked={todo.completed}
          onCheckedChange={handleToggle}
          disabled={openTodos >= MAX_OPEN_TODO_LIST_ITEMS && todo.completed}
          className='size-5 cursor-pointer'
        />
        <div
          className={cn(
            'text-base text-slate-600 px-2',
            todo.completed && 'line-through text-slate-400'
          )}
        >
          {todo.title}
        </div>
      </label>
      <div>
        <IconTrash
          className={cn('size-4 hidden cursor-pointer', !active && 'group-hover:inline-block')}
          onClick={() => removeTodo(todo.id)}
        />
      </div>
    </div>
  );
}
