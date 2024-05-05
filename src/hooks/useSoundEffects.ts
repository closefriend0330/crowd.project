import useSound from 'use-sound';
import { useLocalStorage } from 'usehooks-ts';

export default function useSoundEffects() {
  const [soundEffects, setSoundEffects] = useLocalStorage('CP_soundEffects', false);
  const soundOptions = { soundEnabled: soundEffects };

  const toggleSoundEffects = () => setSoundEffects((prev) => !prev);

  const [playUserJoined] = useSound('/sounds/userJoined.mp3', { ...soundOptions, volume: 0.5 });
  const [playUserLeft] = useSound('/sounds/userLeft.mp3', { ...soundOptions, volume: 0.5 });
  const [playUserUpdatePosted] = useSound('/sounds/userUpdatePosted.mp3', {
    ...soundOptions,
    volume: 0.5,
  });
  const [playListStatusUpdated] = useSound('/sounds/listStatusUpdated.mp3', {
    ...soundOptions,
    volume: 0.5,
  });
  const [playClick] = useSound('/sounds/click.mp3', soundOptions);
  const [playConnectionChange] = useSound('/sounds/connectionChange.mp3', soundOptions);

  return {
    soundEffects,
    toggleSoundEffects,
    playUserJoined,
    playUserLeft,
    playUserUpdatePosted,
    playListStatusUpdated,
    playClick,
    playConnectionChange,
  };
}
