import { ReactNode } from 'react';

import { TooltipContent, Tooltip as TooltipRoot, TooltipTrigger } from '@/components/ui/tooltip';

type Props = {
  tooltip: string;
  delayDuration?: number;
  children: ReactNode;
};

export default function Tooltip({ children, tooltip, delayDuration = 700 }: Props) {
  return (
    <TooltipRoot delayDuration={delayDuration}>
      <TooltipTrigger>{children}</TooltipTrigger>
      <TooltipContent className='z-10'>
        <p>{tooltip}</p>
      </TooltipContent>
    </TooltipRoot>
  );
}
