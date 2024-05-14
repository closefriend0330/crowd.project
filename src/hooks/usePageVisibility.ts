import { useAtom } from 'jotai';
import { useEffect } from 'react';

import { visibilityAtom } from '@/stores/jotai';

export default function usePageVisibility(onVisibilityChange?: (isVisible: boolean) => void) {
  const [isVisible, setIsVisible] = useAtom(visibilityAtom);

  useEffect(() => {
    const handleVisibilityChange = () => {
      const isVisible = document.visibilityState === 'visible';

      setIsVisible(isVisible);

      if (typeof onVisibilityChange === 'function') onVisibilityChange(isVisible);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [onVisibilityChange, setIsVisible]);

  return isVisible;
}
