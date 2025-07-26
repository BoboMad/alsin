import { cn } from '@/lib/utils';

interface SpinnerProps {
  size?: number;
  className?: string;
}

export function Spinner({ size = 24, className }: SpinnerProps) {
  return (
    <div
      className={cn('animate-spin rounded-full border-4 border-t-transparent border-gray-300 border-t-spinner', className)}
      style={{ width: size, height: size, borderTopColor: 'oklch(0.6953 0.1064 135.34)' }}
    />
  );
}
