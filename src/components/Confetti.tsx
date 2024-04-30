'use client';

import { useSetAtom } from 'jotai';
import posthog from 'posthog-js';
import { useState } from 'react';
import Realistic from 'react-canvas-confetti/dist/presets/realistic';
import { TConductorInstance } from 'react-canvas-confetti/dist/types';

import { CONFETTI_DELAY_MIN } from '@/config';
import { confettiAtom } from '@/store';

export default function Confetti() {
  const setConfetti = useSetAtom(confettiAtom);
  const [conductor, setConductor] = useState<TConductorInstance | null>(null);

  const shoot = ({ delay = CONFETTI_DELAY_MIN, source = '(none)' } = {}) => {
    setTimeout(() => conductor?.shoot(), delay);

    posthog.capture('confetti shot', { source });
  };

  setConfetti({ shoot });

  return (
    <Realistic
      onInit={({ conductor }) => {
        setConductor(conductor);
      }}
      decorateOptions={() => ({
        startVelocity: 120,
        particleCount: 500,
        spread: 120,
        origin: { x: 0.5, y: 1.5 },
      })}
    />
  );
}
