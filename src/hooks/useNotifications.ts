import posthog from 'posthog-js';
import { useEffect, useState } from 'react';
import { useLocalStorage } from 'usehooks-ts';

type NotificationPermission = 'default' | 'granted' | 'denied' | 'disabled';

export default function useNotifications() {
  const [supported, setSupported] = useState<boolean>(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [enabled, setEnabled] = useLocalStorage<boolean>('CP_notifications', false);

  useEffect(() => {
    if ('Notification' in window) {
      setSupported(true);

      if (Notification.permission === 'granted') {
        posthog.capture('Web push notifications access granted');

        setPermission('granted');
        setEnabled(true);
      } else if (Notification.permission === 'denied') {
        posthog.capture('Web push notifications access denied');

        setPermission('denied');
      }
    }
  }, [setEnabled]);

  const requestPermission = async () => {
    const permissionRequest = await Notification.requestPermission();

    setPermission(permissionRequest);
    if (permissionRequest === 'granted') {
      setEnabled(true);
    }
  };

  const notify = (title: string, options?: NotificationOptions) => {
    if (permission === 'granted' && enabled) {
      new Notification(title, options);
    }
  };

  return {
    supported,
    permission,
    requestPermission,
    enabled,
    setEnabled,
    notify,
  };
}
