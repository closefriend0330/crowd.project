import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { IconGripVertical, IconTrash } from '@tabler/icons-react';

import { Checkbox } from '@/components/ui/checkbox';

import useSoundEffects from '@/hooks/useSoundEffects';
import useTodoList from '@/hooks/useTodoList';

import { MAX_OPEN_TODO_LIST_ITEMS } from '@/config';
import { cn, ordinal } from '@/lib/utils';

import { Badge } from '@/components/ui/badge';
import { Todo } from '@/lib/types';

type Props = {
  todo: Todo;
  index: number;
};

export default function TodoItem({ todo, index }: Props) {
  const { updateTodoItem, removeTodoItem, openTodos } = useTodoList();
  const { playCheckCompleted, playUnCheck } = useSoundEffects();
  const { attributes, listeners, setNodeRef, transform, transition, active } = useSortable({
    id: todo.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  function handleToggle() {
    if (todo.status !== 'completed') {
      playCheckCompleted();
      updateTodoItem({ id: todo.id, data: { status: 'completed', completedAt: new Date() } });
    } else {
      playUnCheck();
      updateTodoItem({ id: todo.id, data: { status: 'open', completedAt: null } });
    }
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn('group flex flex-row justify-between items-center gap-1 py-1')}
    >
      <div {...attributes} {...listeners}>
        <IconGripVertical className='size-5 invisible group-hover:visible cursor-move' />
      </div>
      <label className='flex flex-row items-center grow' htmlFor={`todo-${todo.id}`}>
        <Checkbox
          id={`todo-${todo.id}`}
          checked={todo.status === 'completed'}
          onCheckedChange={handleToggle}
          disabled={openTodos >= MAX_OPEN_TODO_LIST_ITEMS && todo.status === 'completed'}
          className='size-5  invisible group-hover:visible  cursor-pointer'
        />
        <div
          className={cn(
            'text-base text-slate-600 px-2',
            todo.status === 'completed' && 'line-through text-slate-400'
          )}
        >
          <div className={cn('flex flex-row items-start', index < 3 && 'py-1')}>
            {index < 3 && (
              <div>
                <Badge
                  className={cn(
                    'h-6 sm:h-7 px-[6px] sm:px-2 w-10 sm:w-[49px] text-white mr-2 sm:mr-4 text-sm sm:text-base',
                    index === 0 ? 'bg-red-500' : index === 1 ? 'bg-orange-500' : 'bg-yellow-500'
                  )}
                >
                  {ordinal(index + 1)}
                </Badge>
              </div>
            )}
            <div className={cn(index < 3 && 'text-lg sm:text-xl', index === 0 && 'font-semibold')}>
              {todo.title}
            </div>
          </div>
        </div>
      </label>
      <div>
        <IconTrash
          className={cn('size-4 invisible cursor-pointer', !active && 'group-hover:visible')}
          onClick={() => removeTodoItem({ id: todo.id })}
        />
      </div>
    </div>
  );
}
