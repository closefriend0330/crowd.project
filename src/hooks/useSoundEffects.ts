import useSound from 'use-sound';
import { useLocalStorage } from 'usehooks-ts';

export default function useSoundEffects() {
  const [muted, setMuted] = useLocalStorage('CP_soundEffectsMuted', false);
  const soundOptions = { soundEnabled: !muted };

  const toggleMuted = () => setMuted((prev) => !prev);

  const [playUserJoined] = useSound('/sounds/userJoined.wav', { ...soundOptions, volume: 0.5 });
  const [playUserLeft] = useSound('/sounds/userLeft.wav', { ...soundOptions, volume: 0.5 });
  const [playUserTaglineUpdated] = useSound('/sounds/userTaglineUpdated.wav', {
    ...soundOptions,
    volume: 0.5,
  });
  const [playListTaglineUpdated] = useSound('/sounds/listTaglineUpdated.wav', {
    ...soundOptions,
    volume: 0.5,
  });
  const [playClick] = useSound('/sounds/click.wav', soundOptions);
  const [playConnectionChange] = useSound('/sounds/connectionChange.wav', soundOptions);

  return {
    muted,
    toggleMuted,
    playUserJoined,
    playUserLeft,
    playUserTaglineUpdated,
    playListTaglineUpdated,
    playClick,
    playConnectionChange,
  };
}
