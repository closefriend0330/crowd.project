import humanizeDuration from 'humanize-duration';
import { useEffect, useState } from 'react';

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
  date: number;
  className?: string;
  updateInterval?: number;
};

export default function TimeAgo({ date, className, updateInterval = UPDATE_INTERVAL }: Props) {
  const [timeAgo, setTimeAgo] = useState<string>(humanize(date));

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeAgo(humanize(date));
    }, updateInterval);

    return () => clearInterval(interval);
  }, [date, updateInterval]);

  return (
    <Tooltip tooltip={`connected ${new Date(date).toLocaleString()}`} asChild>
      <div className={className}>{timeAgo}</div>
    </Tooltip>
  );
}
