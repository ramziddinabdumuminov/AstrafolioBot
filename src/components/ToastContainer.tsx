import React, { useState, useEffect } from 'react';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';
import { toast, ToastItem } from '../services/toast';

export default function ToastContainer() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    const unsubscribe = toast.subscribe((newToasts) => {
      setToasts(newToasts);
    });
    return unsubscribe;
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl border shadow-xl backdrop-blur-md transition-all duration-300 animate-in fade-in slide-in-from-bottom-2 ${
            t.type === 'success'
              ? 'bg-emerald-950/90 border-emerald-500/40 text-emerald-200'
              : t.type === 'error'
              ? 'bg-rose-950/90 border-rose-500/40 text-rose-200'
              : t.type === 'warning'
              ? 'bg-amber-950/90 border-amber-500/40 text-amber-200'
              : 'bg-slate-900/90 border-blue-500/40 text-blue-200'
          }`}
        >
          <div className="mt-0.5 flex-shrink-0">
            {t.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
            {t.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-400" />}
            {t.type === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-400" />}
            {t.type === 'info' && <Info className="w-4 h-4 text-blue-400" />}
          </div>
          <div className="flex-1 text-xs font-medium leading-relaxed break-words">
            {t.message}
          </div>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="text-slate-400 hover:text-white p-0.5 rounded cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}
