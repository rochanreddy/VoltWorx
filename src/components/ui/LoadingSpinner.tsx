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
      {/* Blue ring */}
      <div className={cn(
        'absolute inset-0 rounded-full border-2 border-blue-500/30',
        {
          'border-2': size === 'small',
          'border-3': size === 'medium',
          'border-4': size === 'large',
        }
      )} />
      
      {/* Rotating purple spinner */}
      <div className={cn(
        'absolute inset-0 rounded-full animate-spin',
        {
          'border-2': size === 'small',
          'border-3': size === 'medium',
          'border-4': size === 'large',
        },
        'border-t-purple-500 border-r-purple-500/30 border-b-purple-500/30 border-l-purple-500/30'
      )} />
    </div>
  );
}

export default LoadingSpinner;