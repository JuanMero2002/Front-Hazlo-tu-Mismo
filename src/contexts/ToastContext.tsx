// src/contexts/ToastContext.tsx
import React, { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import { useToast } from '../hooks/useToast';
import { ToastContainer } from '../components/ui/ToastContainer';

interface ToastContextType {
  showSuccess: (message: string, duration?: number) => void;
  showError: (message: string, duration?: number) => void;
  showWarning: (message: string, duration?: number) => void;
  showInfo: (message: string, duration?: number) => void;
  clearAllToasts: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToastContext = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToastContext must be used within a ToastProvider');
  }
  return context;
};

interface ToastProviderProps {
  children: ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const { 
    toasts, 
    showSuccess, 
    showError, 
    showWarning, 
    showInfo, 
    removeToast, 
    clearAllToasts 
  } = useToast();

  // Escuchar eventos globales de toast desde axios interceptor
  React.useEffect(() => {
    const handleGlobalToast = (event: CustomEvent) => {
      const { message, type } = event.detail;
      switch (type) {
        case 'success':
          showSuccess(message);
          break;
        case 'error':
          showError(message);
          break;
        case 'warning':
          showWarning(message);
          break;
        case 'info':
          showInfo(message);
          break;
      }
    };

    window.addEventListener('show-toast', handleGlobalToast as EventListener);
    
    return () => {
      window.removeEventListener('show-toast', handleGlobalToast as EventListener);
    };
  }, [showSuccess, showError, showWarning, showInfo]);

  return (
    <ToastContext.Provider value={{
      showSuccess,
      showError,
      showWarning,
      showInfo,
      clearAllToasts
    }}>
      {children}
      <ToastContainer toasts={toasts} onRemoveToast={removeToast} />
    </ToastContext.Provider>
  );
};
