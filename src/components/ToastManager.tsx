import React, { useState, useEffect } from 'react';
import CustomToast from './CustomToast';

interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error';
}

const ToastManager: React.FC = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    // Listen for custom toast events
    const handleCustomToast = (event: CustomEvent) => {
      const { message, type } = event.detail;
      const id = Date.now();
      setToasts(prev => [...prev, { id, message, type }]);
      
      // Auto-remove after 5 seconds
      setTimeout(() => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
      }, 5000);
    };

    window.addEventListener('custom-toast', handleCustomToast as EventListener);
    
    return () => {
      window.removeEventListener('custom-toast', handleCustomToast as EventListener);
    };
  }, []);

  const removeToast = (id: number) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  return (
    <>
      {toasts.map(toast => (
        <CustomToast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </>
  );
};

export default ToastManager;
