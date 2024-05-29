'use client';

import { IconEye, IconEyeOff } from '@tabler/icons-react';
import { Dispatch, SetStateAction } from 'react';

import Tooltip from '@/components/Site/Tooltip';

import useTodoList from '@/hooks/useTodoList';

type Props = {
  showTodos: boolean;
  setShowTodos: Dispatch<SetStateAction<boolean>>;
};

export default function TodoHeader({ showTodos, setShowTodos }: Props) {
  const { todos, completedTodos, totalTodos } = useTodoList();

  const toggleItems = () => setShowTodos((prev: boolean) => !prev);

  return (
    <div className='flex flex-row items-center gap-2 pb-2 group'>
      <h2 className='text-lg sm:text-xl font-header font-bold' onClick={toggleItems}>
        Tasks
      </h2>
      <div className='invisible group-hover:visible grow'>
        {showTodos ? (
          <Tooltip tooltip='Hide items'>
            <IconEyeOff onClick={toggleItems} className='size-4 cursor-pointer inline-block' />
          </Tooltip>
        ) : (
          <Tooltip tooltip='Show items'>
            <IconEye onClick={toggleItems} className='size-4 cursor-pointer inline-block' />
          </Tooltip>
        )}
      </div>

      {todos.length > 0 && (
        <>
          <div>
            {completedTodos} / {totalTodos}{' '}
          </div>
          {completedTodos === todos.length && !showTodos && <div> 🎉</div>}
        </>
      )}
    </div>
  );
}
