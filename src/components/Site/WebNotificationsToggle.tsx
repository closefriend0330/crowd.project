'use client';

import {
  IconMessage2,
  IconMessage2Cancel,
  IconMessageOff,
  IconMessagePlus,
} from '@tabler/icons-react';
import posthog from 'posthog-js';

import Tooltip from '@/components/Site/Tooltip';

import useNotifications from '@/hooks/useNotifications';

export default function NotificationsButton() {
  const { supported, permission, enabled, setEnabled, requestPermission } = useNotifications();

  const toggleNotifications = () => {
    posthog.capture('Web push notifications toggled', { enabled: !enabled });

    setEnabled(!enabled);
  };

  if (!supported) return null;

  if (permission === 'default')
    return (
      <Tooltip tooltip='Authorise web notifications' delayDuration={0}>
        <IconMessagePlus className='size-5 text-slate-500' onClick={requestPermission} />
      </Tooltip>
    );

  if (permission === 'denied')
    return (
      <Tooltip tooltip='Web Notifications are disabled' delayDuration={2000}>
        <IconMessage2Cancel className='size-5 text-red-500 cursor-default' />
      </Tooltip>
    );

  return (
    <Tooltip tooltip='Web notifications' delayDuration={2000}>
      {enabled ? (
        <IconMessage2 className='size-5' onClick={toggleNotifications} />
      ) : (
        <IconMessageOff className='size-5' onClick={toggleNotifications} />
      )}
    </Tooltip>
  );
}
