'use client';

import { IconPointFilled } from '@tabler/icons-react';
import { useAtomValue } from 'jotai';

import Tooltip from '@/components/Site/Tooltip';

import { cn } from '@/lib/utils';
import { connectionStatusAtom } from '@/store';

export default function ConnectionStatus() {
  const connectionStatus = useAtomValue(connectionStatusAtom);

  const color =
    connectionStatus === 'disconnected'
      ? 'text-red-500'
      : connectionStatus === 'fully connected'
      ? 'text-green-500'
      : 'text-yellow-500';

  let toolTip = `Status: ${connectionStatus}`;

  return (
    <Tooltip tooltip={toolTip} delayDuration={0}>
      <IconPointFilled className={cn('size-5', color)} />
    </Tooltip>
  );
}
