'use client';

import { IconBell, IconBellOff } from '@tabler/icons-react';
import { useIsClient } from 'usehooks-ts';

import Tooltip from '@/components/Site/Tooltip';

import useSoundEffects from '@/hooks/useSoundEffects';

export default function MuteButton() {
  const { playClick, muted, toggleMuted } = useSoundEffects();
  const isClient = useIsClient();

  if (!isClient) return null;

  const toggle = () => {
    if (muted) playClick({ forceSoundEnabled: true });

    toggleMuted();
  };

  return (
    <Tooltip tooltip='Mute sound effects'>
      {muted ? <IconBellOff onClick={toggle} /> : <IconBell onClick={toggle} />}
    </Tooltip>
  );
}
