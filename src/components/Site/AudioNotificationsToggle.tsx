'use client';

import { IconVolume, IconVolumeOff } from '@tabler/icons-react';
import posthog from 'posthog-js';
import { useIsClient } from 'usehooks-ts';

import Tooltip from '@/components/Site/Tooltip';

import useSoundEffects from '@/hooks/useSoundEffects';

export default function AudioNotificationsToggle() {
  const { playClick, soundEffects, toggleSoundEffects } = useSoundEffects();
  const isClient = useIsClient();

  if (!isClient) return null;

  const toggle = () => {
    posthog.capture('Audio notifications toggled', { enabled: !soundEffects });

    // play sound to confirm sound effects are enabled
    if (!soundEffects) playClick({ forceSoundEnabled: true });

    toggleSoundEffects();
  };

  return (
    <Tooltip tooltip='Audio notifications' delayDuration={2000}>
      {soundEffects ? (
        <IconVolume onClick={toggle} className='size-4' />
      ) : (
        <IconVolumeOff onClick={toggle} className='size-4' />
      )}
    </Tooltip>
  );
}
