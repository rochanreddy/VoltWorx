import { cn } from '../../utils/helpers';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

function LoadingSpinner({ size = 'medium', className }: LoadingSpinnerProps) {
  return (
    <div className={cn(
      'relative',
      {
        'h-4 w-4': size === 'small',
        'h-8 w-8': size === 'medium',
        'h-12 w-12': size === 'large',
      },
      className
    )}>
      {/* Outer spinning ring */}
      <div className={cn(
        'absolute inset-0 rounded-full border-t-transparent animate-spin',
        {
          'border-2': size === 'small',
          'border-4': size === 'medium',
          'border-4': size === 'large',
        },
        'border-primary-600'
      )} />
      
      {/* Inner pulsing circle */}
      <div className={cn(
        'absolute inset-0 rounded-full animate-pulse',
        {
          'm-1': size === 'small',
          'm-2': size === 'medium',
          'm-3': size === 'large',
        },
        'bg-primary-600/30'
      )} />
      
      {/* Center dot */}
      <div className={cn(
        'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full',
        {
          'h-1 w-1': size === 'small',
          'h-2 w-2': size === 'medium',
          'h-3 w-3': size === 'large',
        },
        'bg-primary-600'
      )} />
    </div>
  );
}

export default LoadingSpinner;