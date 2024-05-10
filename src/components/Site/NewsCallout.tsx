'use client';

import { Cross2Icon } from '@radix-ui/react-icons';
import crypto from 'crypto';
import { ReactNode, useMemo } from 'react';
import { useLocalStorage } from 'usehooks-ts';

type Props = {
  title: string;
  children: ReactNode;
};
export function NewsCallout({ title, children }: Props) {
  const [closedCallouts, setClosedCallouts] = useLocalStorage<string[]>('closedCallouts', []);
  const hash = useMemo(
    () => crypto.createHash('md5').update(`${title}-${children}`).digest('hex'),
    [title, children]
  );

  if (closedCallouts.includes(hash)) return null;

  const onClose = () => {
    closedCallouts.push(hash);
    setClosedCallouts([...new Set(closedCallouts)]);
  };

  return (
    <div className='relative bg-yellow-50 rounded py-2 pl-4 pr-8 mb-2 border-slate-300 border'>
      <h3 className='text-sm sm:text-base font-medium mb-1'>{title}</h3>
      <div className='text-xs sm:text-sm text-slate-7004'>{children}</div>

      <Cross2Icon className='absolute top-2 right-2 h-4 w-4 cursor-pointer' onClick={onClose} />
    </div>
  );
}
