import { cn } from '../../utils/helpers';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

function LoadingSpinner({ size = 'medium', className }: LoadingSpinnerProps) {
  return (
    <div className={cn(
      'animate-spin rounded-full border-t-transparent',
      {
        'h-4 w-4 border-2': size === 'small',
        'h-8 w-8 border-4': size === 'medium',
        'h-12 w-12 border-4': size === 'large',
      },
      'border-primary-600',
      className
    )} />
  );
}

export default LoadingSpinner;