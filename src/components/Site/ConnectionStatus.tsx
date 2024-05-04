'use client';

import { IconPointFilled } from '@tabler/icons-react';
import { useAtomValue } from 'jotai';

import Tooltip from '@/components/Site/Tooltip';

import { cn, humanizeDurationShort } from '@/lib/utils';
import { connectionStatusAtom, serverMetaDataAtom } from '@/store';

export default function ConnectionStatus() {
  const connectionStatus = useAtomValue(connectionStatusAtom);
  const { timeSinceOnStart } = useAtomValue(serverMetaDataAtom) || {};

  const color =
    connectionStatus === 'disconnected'
      ? 'text-red-500'
      : connectionStatus === 'fully connected'
      ? 'text-green-500'
      : 'text-yellow-500';

  const generateTooltip = () => {
    let tooltip = `Status: ${connectionStatus}`;

    if (timeSinceOnStart) {
      tooltip += `. Last onStart: ${humanizeDurationShort(Date.now() - timeSinceOnStart.getTime(), {
        round: true,
      })} ago`;
    }

    return tooltip;
  };

  return (
    <Tooltip tooltip={generateTooltip} delayDuration={0}>
      <IconPointFilled className={cn('size-5', color)} />
    </Tooltip>
  );
}
