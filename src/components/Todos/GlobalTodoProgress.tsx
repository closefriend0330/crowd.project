'use client';

import { useAtomValue } from 'jotai';
import pluralize from 'pluralize';
import { useEffect, useState } from 'react';

import { Progress } from '@/components/ui/progress';

import Tooltip from '@/components/Site/Tooltip';

import { cn, debug } from '@/lib/utils';
import { connectionStatusAtom, roomDataAtom } from '@/stores/jotai';

export default function GlobalTodoProgress() {
  const [progress, setProgress] = useState(0);
  const [tooltip, setTooltip] = useState('No online users with priorities yet.');
  const roomData = useAtomValue(roomDataAtom);
  const connectionStatus = useAtomValue(connectionStatusAtom);

  const generateTooltip = () => tooltip;

  useEffect(() => {
    debug({ roomData });

    if (!roomData) return;

    const { openTodos, completedTodos, todoUserCount } = roomData;
    const totalTodos = openTodos + completedTodos;
    const completionRate = totalTodos === 0 ? 0 : Math.round((completedTodos / totalTodos) * 100);

    if (totalTodos === 0) return;

    const timer = setTimeout(() => setProgress(completionRate), 500);

    let tooltip = `${pluralize('online user', todoUserCount, true)} ${
      todoUserCount === 1 ? 'has' : 'have'
    }  completed ${completionRate}% of ${pluralize('priority', totalTodos, true)}`;
    if (completionRate === 100) tooltip += ' 🎉';
    setTooltip(tooltip);

    return () => clearTimeout(timer);
  }, [roomData]);

  if (!roomData || connectionStatus !== 'fully connected' || roomData.todoUserCount === 0)
    return null;

  return (
    <Tooltip tooltip={generateTooltip} delayDuration={0} asChild>
      <div className='w-[120px] flex flex-col gap-1 sm:mr-4'>
        <div className='hidden sm:block text-xs ml-[1px]'>Community</div>
        <Progress
          value={progress}
          className={cn('w-full', progress === 100 ? '[&>*]:bg-green-500' : '[&>*]:bg-blue-600')}
        />
      </div>
    </Tooltip>
  );
}
