import { cn } from '@/lib/utils';

type Props = {
  monitor: string;
  maxLength: number;
  countDownAtLeft?: number;
  warningAtLeft?: number;
  className?: string;
  warningClassName?: string;
};

export default function CharactersLeft({
  monitor,
  maxLength,
  countDownAtLeft = 20,
  warningAtLeft = 10,
  className,
  warningClassName = 'text-red-500',
}: Props) {
  return (
    <div
      className={cn(
        'text-xs sm:text-sm text-right mr-2',
        maxLength - monitor.length <= warningAtLeft && warningClassName,
        className
      )}
    >
      {monitor.length >= maxLength - countDownAtLeft && `${monitor.length}/${maxLength}`}
    </div>
  );
}
