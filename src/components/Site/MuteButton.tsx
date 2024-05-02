'use client';

import { IconVolume, IconVolumeOff } from '@tabler/icons-react';
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
      {muted ? (
        <IconVolumeOff onClick={toggle} className='size-4' />
      ) : (
        <IconVolume onClick={toggle} className='size-4' />
      )}
    </Tooltip>
  );
}
