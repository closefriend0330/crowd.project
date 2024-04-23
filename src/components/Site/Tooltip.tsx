import { ReactNode } from 'react';

import { TooltipContent, Tooltip as TooltipRoot, TooltipTrigger } from '@/components/ui/tooltip';

type Props = {
  tooltip: string;
  delayDuration?: number;
  children: ReactNode;
  asChild?: boolean;
};

export default function Tooltip({ children, tooltip, delayDuration = 700, asChild }: Props) {
  return (
    <TooltipRoot delayDuration={delayDuration}>
      <TooltipTrigger asChild={asChild}>{children}</TooltipTrigger>
      <TooltipContent className='z-10'>
        <p>{tooltip}</p>
      </TooltipContent>
    </TooltipRoot>
  );
}
