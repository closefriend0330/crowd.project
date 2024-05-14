import { useAtom, useAtomValue } from 'jotai';
import posthog from 'posthog-js';
import { useState } from 'react';

import { CONFETTI_DELAY_MIN, CONFETTI_RESET_DELAY } from '@/config';
import { confettiConductorAtom, visibilityAtom } from '@/stores/jotai';

export default function useConfetti() {
  const [confettiConductor, setConfettiConductor] = useAtom(confettiConductorAtom);
  const isVisible = useAtomValue(visibilityAtom);
  const [recentlyShot, setRecentlyShot] = useState(false);

  const shootConfetti = ({
    delay = CONFETTI_DELAY_MIN,
    resetDelay = CONFETTI_RESET_DELAY,
    source = '(none)',
  } = {}) => {
    if (!confettiConductor || !isVisible || recentlyShot) return;

    setTimeout(() => {
      confettiConductor.shoot();
      setRecentlyShot(true);

      setTimeout(() => {
        setRecentlyShot(false);
      }, CONFETTI_RESET_DELAY);
    }, delay);

    posthog.capture('confetti shot', { source });
  };

  return { confetti: confettiConductor, shootConfetti, setConfettiConductor };
}
