'use client';

import { IconPointFilled } from '@tabler/icons-react';
import { useAtomValue } from 'jotai';

import Tooltip from '@/components/Site/Tooltip';

import { cn } from '@/lib/utils';
import { connectedAtom } from '@/store';

export default function Footer() {
  const isConnected = useAtomValue(connectedAtom);

  return (
    <Tooltip tooltip={`Status: ${isConnected ? 'connected' : 'disconnected'}`} delayDuration={0}>
      <IconPointFilled
        className={cn('size-4 sm:size-5', isConnected ? 'text-green-500' : 'text-red-500')}
      />
    </Tooltip>
  );
}
