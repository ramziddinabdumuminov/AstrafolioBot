import React, { useState } from 'react';
import { Lock, Mail, User, X, ArrowRight, Shield, CheckCircle2 } from 'lucide-react';
import { User as UserType } from '../types';
import { api } from '../services/api';
import { toast } from '../services/toast';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: UserType) => void;
  initialMode?: 'login' | 'register';
}

export default function AuthModal({
  isOpen,
  onClose,
  onSuccess,
  initialMode = 'login',
}: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>(initialMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === 'login') {
        const res = await api.login(email, password);
        onSuccess(res.user);
        onClose();
      } else if (mode === 'register') {
        const username = name.toLowerCase().trim().replace(/[^a-z0-9_]/g, '_') || `user_${Date.now()}`;
        const res = await api.register(name, username, email, password);
        onSuccess(res.user);
        onClose();
      } else {
        toast.info('Parolni tiklash havolasi emailingizga yuborildi!');
        setMode('login');
      }
    } catch (err: any) {
      setError(err.message || 'Xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-5 top-5 text-slate-500 hover:text-white p-1"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6">
          <div className="w-10 h-10 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-3">
            <Shield className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold text-white">
            {mode === 'login'
              ? 'Tizimga Kirish'
              : mode === 'register'
              ? 'Ro‘yxatdan O‘tish'
              : 'Parolni Tiklash'}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            ASTRAFOLIO Python Telegram bot xosting platformasi
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {mode === 'register' && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                To‘liq Ismingiz
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ali Valiyev"
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Email Manzilingiz
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="developer@example.com"
                className="w-full pl-9 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {mode !== 'forgot' && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-300">
                  Parol
                </label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => setMode('forgot')}
                    className="text-[11px] text-blue-400 hover:underline"
                  >
                    Unutdingizmi?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 mt-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <span>
              {loading
                ? 'Kutilmoqda...'
                : mode === 'login'
                ? 'Kirish'
                : mode === 'register'
                ? 'Hisob Yaratish'
                : 'Tiklash havolasini yuborish'}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-slate-800/80 text-center text-xs text-slate-400">
          {mode === 'login' ? (
            <p>
              Hisobingiz yo‘qmi?{' '}
              <button
                onClick={() => setMode('register')}
                className="text-blue-400 font-bold hover:underline"
              >
                Ro‘yxatdan o‘tish
              </button>
            </p>
          ) : (
            <p>
              Hisobingiz bormi?{' '}
              <button
                onClick={() => setMode('login')}
                className="text-blue-400 font-bold hover:underline"
              >
                Kirish
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
