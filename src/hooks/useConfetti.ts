import { useAtom, useAtomValue } from 'jotai';
import posthog from 'posthog-js';

import { CONFETTI_DELAY_MIN } from '@/config';
import { confettiConductorAtom, visibilityAtom } from '@/store';

export default function useConfetti() {
  const [confettiConductor, setConfettiConductor] = useAtom(confettiConductorAtom);
  const isVisible = useAtomValue(visibilityAtom);

  const shootConfetti = ({ delay = CONFETTI_DELAY_MIN, source = '(none)' } = {}) => {
    if (!confettiConductor || !isVisible) return;

    setTimeout(() => confettiConductor.shoot(), delay);

    posthog.capture('confetti shot', { source });
  };

  return { confetti: confettiConductor, shootConfetti, setConfettiConductor };
}
