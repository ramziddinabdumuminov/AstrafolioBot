import { Bell, Check, X, Info, AlertTriangle, AlertCircle } from 'lucide-react';
import { NotificationItem } from '../types';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onMarkAllRead: () => void;
}

export default function NotificationsModal({
  isOpen,
  onClose,
  notifications,
  onMarkAllRead,
}: NotificationsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-blue-400" />
            <h2 className="text-base font-bold text-white">Xabarnomalar Markazi</h2>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onMarkAllRead}
              className="text-xs text-blue-400 hover:text-blue-300 font-semibold"
            >
              Hammasini o‘qilgan deb belgilash
            </button>
            <button onClick={onClose} className="text-slate-500 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="py-4 max-h-96 overflow-y-auto space-y-2.5">
          {notifications.length === 0 ? (
            <div className="text-center py-8 text-slate-500 text-xs">
              Hech qanday yangi bildirishnoma yo‘q
            </div>
          ) : (
            notifications.map((n) => {
              const isRead = n.isRead ?? n.read ?? false;
              const typeLower = n.type?.toLowerCase();
              const timestamp = n.createdAt || n.timestamp || new Date().toISOString();
              return (
                <div
                  key={n.id}
                  className={`p-3.5 rounded-2xl border transition-colors flex items-start gap-3 ${
                    isRead
                      ? 'bg-slate-950/40 border-slate-800/60 opacity-70'
                      : 'bg-slate-950 border-blue-500/30'
                  }`}
                >
                  <div className="mt-0.5">
                    {typeLower === 'error' ? (
                      <AlertCircle className="w-4 h-4 text-rose-400" />
                    ) : typeLower === 'warning' ? (
                      <AlertTriangle className="w-4 h-4 text-amber-400" />
                    ) : (
                      <Info className="w-4 h-4 text-blue-400" />
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-white">{n.title}</span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {new Date(timestamp).toLocaleTimeString('uz-UZ', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">{n.message}</p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
