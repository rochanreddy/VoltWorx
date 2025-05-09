import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { X } from 'lucide-react';
import { createPortal } from 'react-dom';
import { cn } from '../../utils/helpers';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: ToastType) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prevToasts) => [...prevToasts, { id, message, type }]);

    // Auto remove after 5 seconds
    setTimeout(() => {
      setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
    }, 5000);
  };

  const handleRemoveToast = (id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <Toaster toasts={toasts} onRemove={handleRemoveToast} />
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

interface ToasterProps {
  toasts: Toast[];
  onRemove: (id: string) => void;
}

export const Toaster = ({ toasts = [], onRemove = () => {} }: ToasterProps) => {
  return createPortal(
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts && toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            'flex items-center justify-between p-4 rounded-lg shadow-lg min-w-[300px] max-w-md animate-slide-up',
            {
              'bg-success-100 text-success-800 border-l-4 border-success-600': toast.type === 'success',
              'bg-error-100 text-error-800 border-l-4 border-error-600': toast.type === 'error',
              'bg-primary-100 text-primary-800 border-l-4 border-primary-600': toast.type === 'info',
              'bg-warning-100 text-warning-800 border-l-4 border-warning-600': toast.type === 'warning',
            }
          )}
        >
          <p className="text-sm font-medium">{toast.message}</p>
          <button
            onClick={() => onRemove(toast.id)}
            className="ml-4 text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>,
    document.body
  );
};