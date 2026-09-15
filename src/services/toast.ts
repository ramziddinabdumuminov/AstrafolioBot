export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastItem {
  id: string;
  type: ToastType;
  message: string;
}

type Listener = (toasts: ToastItem[]) => void;
let toasts: ToastItem[] = [];
let listeners: Listener[] = [];

function notify() {
  listeners.forEach((l) => l([...toasts]));
}

export const toast = {
  show: (message: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    const item: ToastItem = { id, type, message };
    toasts = [...toasts, item];
    notify();

    setTimeout(() => {
      toasts = toasts.filter((t) => t.id !== id);
      notify();
    }, 3800);
  },
  success: (message: string) => toast.show(message, 'success'),
  error: (message: string) => toast.show(message, 'error'),
  warning: (message: string) => toast.show(message, 'warning'),
  info: (message: string) => toast.show(message, 'info'),
  dismiss: (id: string) => {
    toasts = toasts.filter((t) => t.id !== id);
    notify();
  },
  subscribe: (listener: Listener) => {
    listeners.push(listener);
    listener([...toasts]);
    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  }
};
