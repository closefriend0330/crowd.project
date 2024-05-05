import humanizeDuration from 'humanize-duration';
import { useEffect, useRef, useState } from 'react';

import Tooltip from '@/components/Site/Tooltip';

const shortEnglishHumanizer = humanizeDuration.humanizer({
  language: 'shortEn',
  languages: {
    shortEn: {
      y: () => 'y',
      mo: () => 'mo',
      w: () => 'w',
      d: () => 'd',
      h: () => 'h',
      m: () => 'm',
      s: () => 's',
      ms: () => 'ms',
    },
  },
});

const humanize = (date: number) => {
  const duration = new Date().getTime() - date;

  return duration > 60
    ? shortEnglishHumanizer(duration, {
        round: true,
        units: ['y', 'mo', 'w', 'd', 'h', 'm'],
      })
    : 'just now';
};

const UPDATE_INTERVAL = 60000;

type Props = {
  date: Date;
  className?: string;
  tooltipPrefix?: string;
  disableTooltip?: boolean;
  prefix?: string;
  suffix?: string;
  updateInterval?: number;
};

export default function TimeAgo({
  date,
  className,
  updateInterval = UPDATE_INTERVAL,
  tooltipPrefix,
  disableTooltip,
  prefix,
  suffix,
}: Props) {
  const [timeAgo, setTimeAgo] = useState<string>('');
  const intervalRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (!date) return;

    if (intervalRef.current) clearInterval(intervalRef.current);
    setTimeAgo(humanize(new Date(date).getTime()));

    intervalRef.current = setInterval(() => {
      setTimeAgo(humanize(new Date(date).getTime()));
    }, updateInterval);

    return () => clearInterval(intervalRef.current);
  }, [date, updateInterval]);

  if (!date) return null;
  if (timeAgo === 'just now' || timeAgo === '0 m') return;

  return disableTooltip ? (
    <div className={className}>
      {prefix}
      {timeAgo}
      {suffix}
    </div>
  ) : (
    <Tooltip tooltip={`${tooltipPrefix || ''}${new Date(date).toLocaleString()}`} asChild>
      <div className={className}>
        {prefix}
        {timeAgo}
        {suffix}
      </div>
    </Tooltip>
  );
}
