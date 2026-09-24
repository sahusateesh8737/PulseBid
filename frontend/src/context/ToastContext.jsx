import React, { createContext, useContext, useState, useCallback } from 'react';
import { ToastContainer } from '../components/ui/ToastContainer';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(({ title, message, type = 'info', duration = 4000, action }) => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const newToast = { id, title, message, type, duration, action };

    setToasts((prev) => [newToast, ...prev.slice(0, 4)]); // Keep max 5

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }

    return id;
  }, [removeToast]);

  const notifyOutbid = useCallback(({ auctionTitle, newAmount, auctionId }) => {
    return addToast({
      title: "⚡ You've been outbid!",
      message: `A higher bid of $${newAmount.toLocaleString()} was placed on "${auctionTitle}".`,
      type: 'outbid',
      duration: 6000,
      action: {
        label: 'Counter Bid',
        auctionId,
      },
    });
  }, [addToast]);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, notifyOutbid }}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
