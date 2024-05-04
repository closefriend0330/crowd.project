import { ReactNode, useState } from 'react';

import { TooltipContent, Tooltip as TooltipRoot, TooltipTrigger } from '@/components/ui/tooltip';

type Props = {
  tooltip: string | (() => string);
  delayDuration?: number;
  children: ReactNode;
  asChild?: boolean;
};

export default function Tooltip({ children, tooltip, delayDuration = 700, asChild }: Props) {
  const [content, setContent] = useState<string | undefined>(
    typeof tooltip === 'function' ? tooltip() : tooltip
  );

  const updateContent = (open: boolean) => {
    if (open && typeof tooltip === 'function') {
      setContent(tooltip());
    }
  };

  return (
    <TooltipRoot onOpenChange={updateContent} delayDuration={delayDuration}>
      <TooltipTrigger asChild={asChild}>{children}</TooltipTrigger>
      <TooltipContent className='z-10'>
        <p>{content}</p>
      </TooltipContent>
    </TooltipRoot>
  );
}
