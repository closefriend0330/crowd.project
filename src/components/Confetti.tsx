'use client';

import Realistic from 'react-canvas-confetti/dist/presets/realistic';

import useConfetti from '@/hooks/useConfetti';

export default function Confetti() {
  const { setConfettiConductor } = useConfetti();

  return (
    <Realistic
      onInit={({ conductor }) => {
        setConfettiConductor(conductor);
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
