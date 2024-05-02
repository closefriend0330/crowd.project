import useSound from 'use-sound';
import { useLocalStorage } from 'usehooks-ts';

export default function useSoundEffects() {
  const [muted, setMuted] = useLocalStorage('CP_soundEffectsMuted', false);
  const soundOptions = { soundEnabled: !muted };

  const toggleMuted = () => setMuted((prev) => !prev);

  const [playUserJoined] = useSound('/sounds/userJoined.mp3', { ...soundOptions, volume: 0.5 });
  const [playUserLeft] = useSound('/sounds/userLeft.mp3', { ...soundOptions, volume: 0.5 });
  const [playUserTaglineUpdated] = useSound('/sounds/userTaglineUpdated.mp3', {
    ...soundOptions,
    volume: 0.5,
  });
  const [playListTaglineUpdated] = useSound('/sounds/listTaglineUpdated.mp3', {
    ...soundOptions,
    volume: 0.5,
  });
  const [playClick] = useSound('/sounds/click.mp3', soundOptions);
  const [playConnectionChange] = useSound('/sounds/connectionChange.mp3', soundOptions);

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
