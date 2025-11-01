import { useCallback } from 'react';

export const useCustomToast = () => {
  const showToast = useCallback((message: string, type: 'success' | 'error' = 'success') => {
    // Dispatch a custom event to the ToastManager
    window.dispatchEvent(new CustomEvent('custom-toast', {
      detail: { message, type }
    }));
  }, []);

  const showSuccess = useCallback((message: string) => {
    showToast(message, 'success');
  }, [showToast]);

  const showError = useCallback((message: string) => {
    showToast(message, 'error');
  }, [showToast]);

  return { showSuccess, showError };
};
