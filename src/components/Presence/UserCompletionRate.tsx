'use client';

import {
  IconPercentage0,
  IconPercentage10,
  IconPercentage100,
  IconPercentage20,
  IconPercentage30,
  IconPercentage40,
  IconPercentage50,
  IconPercentage60,
  IconPercentage70,
  IconPercentage80,
  IconPercentage90,
} from '@tabler/icons-react';
import { useAtomValue } from 'jotai';
import pluralize from 'pluralize';
import { useEffect, useState } from 'react';

import Tooltip from '@/components/Site/Tooltip';

import { UserPublic } from '@/lib/types';
import { cn } from '@/lib/utils';
import { roomDataAtom } from '@/stores/jotai';

type Props = {
  user: UserPublic;
};

const ProgressIcons = [
  IconPercentage0,
  IconPercentage10,
  IconPercentage20,
  IconPercentage30,
  IconPercentage40,
  IconPercentage50,
  IconPercentage60,
  IconPercentage70,
  IconPercentage80,
  IconPercentage90,
  IconPercentage100,
];

function ProgressIcon(completionRate: number) {
  let index = Math.floor(completionRate / 10);
  return ProgressIcons[index];
}

function completionColorClass(completionRate: number) {
  if (completionRate === 0) return 'text-slate-500';
  if (completionRate <= 20) return 'text-red-500';
  if (completionRate <= 20) return 'text-red-500';
  if (completionRate <= 50) return 'text-orange-500';
  if (completionRate < 100) return 'text-yellow-500';
  return 'text-green-500';
}

export default function UserCompletionRate({ user }: Props) {
  const roomData = useAtomValue(roomDataAtom);
  const [completionRate, setCompletionRate] = useState(0);
  const [totalTodos, setTotalTodos] = useState(0);

  useEffect(() => {
    if (roomData && roomData.userProgress[user.id]) {
      const openTodos = roomData.userProgress[user.id].openTodos;
      const completedTodos = roomData.userProgress[user.id].completedTodos;
      const totalTodos = openTodos + completedTodos;

      if (totalTodos > 0) {
        setCompletionRate(Math.round((completedTodos / totalTodos) * 100));
        setTotalTodos(totalTodos);

        return;
      }
    }

    setCompletionRate(0);
    setTotalTodos(0);
  }, [roomData, user.id]);

  const generateTooltip = () => {
    return `${completionRate}% complete with ${pluralize('task', totalTodos, true)}`;
  };

  const CompletionIcon = ProgressIcon(completionRate);
  const completionIconColor = completionColorClass(completionRate);

  return (
    <div>
      {totalTodos > 0 && (
        <Tooltip tooltip={generateTooltip} delayDuration={0}>
          <CompletionIcon
            strokeWidth={1}
            className={cn('size-6 sm:size-7 ml-1 sm:ml-[6px]', completionIconColor)}
          />
        </Tooltip>
      )}
    </div>
  );
}
