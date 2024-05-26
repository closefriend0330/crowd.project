'use client';

import { useEffect, useState } from 'react';

import { Progress } from '@/components/ui/progress';

import Tooltip from '@/components/Site/Tooltip';

import useTodoList from '@/hooks/useTodoList';

import { MAX_OPEN_TODO_LIST_ITEMS } from '@/config';

export default function TodoProgress() {
  const [progress, setProgress] = useState(0);
  const { totalTodos, completedTodos, openTodos, completionRate } = useTodoList();

  const generateTooltip = () => `${completionRate}% done (加油!)`;

  useEffect(() => {
    if (totalTodos === 0) return;

    const timer = setTimeout(() => setProgress(completionRate), 500);

    return () => clearTimeout(timer);
  }, [completedTodos, completionRate, totalTodos]);

  if (totalTodos === 0 || completedTodos == 0) return null;

  return (
    <div>
      <Tooltip tooltip={generateTooltip} delayDuration={0} asChild>
        <Progress value={progress} className='w-full [&>*]:bg-purple-600' />
      </Tooltip>
      <div className='text-lg text-slate-700 pt-2 flex flex-row items-center gap-2 justify-center'>
        {totalTodos > 0 && totalTodos == completedTodos && (
          <div className='flex flex-row gap-2 items-center max-w-[350px]'>
            <div>🎉</div>
            <div className='text-xs text-balance text-center'>
              You completed everything on the list! Congrats, that&apos;s amazing! Don&apos;t forget
              to take breaks!
            </div>
            <span>🎉</span>
          </div>
        )}
        {openTodos >= MAX_OPEN_TODO_LIST_ITEMS && (
          <div className='flex flex-row gap-2 items-center max-w-[350px]'>
            <div>😳</div>
            <div className='text-xs text-balance text-center'>
              That&apos;s a lot of unfinished items. Don&apos;t burn out! Complete some before
              adding more.
            </div>
            <div>😳</div>
          </div>
        )}
      </div>
    </div>
  );
}
