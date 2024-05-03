'use client';

import { IconVolume, IconVolumeOff } from '@tabler/icons-react';
import { useIsClient } from 'usehooks-ts';

import Tooltip from '@/components/Site/Tooltip';

import useSoundEffects from '@/hooks/useSoundEffects';

export default function MuteButton() {
  const { playClick, soundEffects, toggleSoundEffects } = useSoundEffects();
  const isClient = useIsClient();

  if (!isClient) return null;

  const toggle = () => {
    // play sound to confirm sound effects are enabled
    if (!soundEffects) playClick({ forceSoundEnabled: true });

    toggleSoundEffects();
  };

  return (
    <Tooltip tooltip='Mute sound effects'>
      {soundEffects ? (
        <IconVolume onClick={toggle} className='size-4' />
      ) : (
        <IconVolumeOff onClick={toggle} className='size-4' />
      )}
    </Tooltip>
  );
}
