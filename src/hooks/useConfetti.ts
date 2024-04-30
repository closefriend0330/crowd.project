import { useAtom } from 'jotai';
import posthog from 'posthog-js';

import { CONFETTI_DELAY_MIN } from '@/config';
import { confettiConductorAtom } from '@/store';

export default function useConfetti() {
  const [confettiConductor, setConfettiConductor] = useAtom(confettiConductorAtom);

  const shootConfetti = ({ delay = CONFETTI_DELAY_MIN, source = '(none)' } = {}) => {
    if (!confettiConductor) return;

    setTimeout(() => confettiConductor.shoot(), delay);

    posthog.capture('confetti shot', { source });
  };

  return { confetti: confettiConductor, shootConfetti, setConfettiConductor };
}
