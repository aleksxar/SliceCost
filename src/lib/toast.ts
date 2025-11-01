import { toast as sonnerToast } from 'sonner';

export const toast = {
  success: (message: string) => {
    sonnerToast.success(message, {
      style: {
        background: 'rgba(28, 28, 28, 0.95)',
        border: '1px solid #6c6c6c',
        color: '#f9fafb',
      },
    });
  },
  
  error: (message: string) => {
    sonnerToast.error(message, {
      style: {
        background: 'rgba(239, 68, 68, 0.1)',
        border: '1px solid #ef4444',
        color: '#ef4444',
      },
    });
  },
  
  info: (message: string) => {
    sonnerToast.info(message, {
      style: {
        background: 'rgba(28, 28, 28, 0.95)',
        border: '1px solid #6c6c6c',
        color: '#f9fafb',
      },
    });
  },
  
  warning: (message: string) => {
    sonnerToast.warning(message, {
      style: {
        background: 'rgba(28, 28, 28, 0.95)',
        border: '1px solid #6c6c6c',
        color: '#f9fafb',
      },
    });
  },
};
