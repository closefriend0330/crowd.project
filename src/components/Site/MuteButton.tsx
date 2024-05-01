'use client';

import { IconBell, IconBellOff } from '@tabler/icons-react';
import { useIsClient } from 'usehooks-ts';

import useSoundEffects from '@/hooks/useSoundEffects';

export default function MuteButton() {
  const { playClick, muted, toggleMuted } = useSoundEffects();
  const isClient = useIsClient();

  if (!isClient) return null;

  const toggle = () => {
    if (muted) playClick({ forceSoundEnabled: true });

    toggleMuted();
  };

  return <div>{muted ? <IconBellOff onClick={toggle} /> : <IconBell onClick={toggle} />}</div>;
}
