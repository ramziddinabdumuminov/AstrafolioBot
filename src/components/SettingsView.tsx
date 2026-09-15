import React, { useState } from 'react';
import { User as UserIcon, Lock, Globe, Shield, LogOut, Check } from 'lucide-react';
import { User } from '../types';
import { api } from '../services/api';
import { toast } from '../services/toast';

interface SettingsViewProps {
  currentUser: User | null;
  onUserUpdate: (user: User) => void;
  onLogout: () => void;
}

export default function SettingsView({ currentUser, onUserUpdate, onLogout }: SettingsViewProps) {
  const [name, setName] = useState(currentUser?.fullName || currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [savedMessage, setSavedMessage] = useState(false);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updated = await api.updateProfile({ fullName: name, email });
      onUserUpdate(updated);
      setSavedMessage(true);
      toast.success('Profil muvaffaqiyatli saqlandi!');
      setTimeout(() => setSavedMessage(false), 2500);
    } catch (err: any) {
      toast.error('Xatolik: ' + err.message);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12 animate-in fade-in">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
          <UserIcon className="w-6 h-6 text-blue-400" />
          Hisob Sozlamalari
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Profil ma‘lumotlari, xavfsizlik va kirish seanslari boshqaruvi
        </p>
      </div>

      {savedMessage && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-400 flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>Ma‘lumotlar muvaffaqiyatli yangilandi!</span>
        </div>
      )}

      {/* Profile form */}
      <form onSubmit={handleSaveProfile} className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
        <h2 className="text-sm font-bold text-white">Shaxsiy Ma‘lumotlar</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-slate-400 mb-1.5 font-semibold">Ism va Familiya</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs"
            />
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1.5 font-semibold">Email Manzil</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs"
            />
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow cursor-pointer"
          >
            Saqlash
          </button>
        </div>
      </form>

      {/* Password change */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
        <h2 className="text-sm font-bold text-white flex items-center gap-2">
          <Lock className="w-4 h-4 text-cyan-400" />
          Parolni O‘zgartirish
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-slate-400 mb-1.5 font-semibold">Joriy Parol</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs"
            />
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1.5 font-semibold">Yangi Parol</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs"
            />
          </div>
        </div>

        <button
          onClick={() => {
            if (newPassword.length < 6) {
              toast.warning('Parol kamida 6 belgidan iborat bo‘lishi kerak');
              return;
            }
            toast.success('Parol muvaffaqiyatli o‘zgartirildi!');
            setCurrentPassword('');
            setNewPassword('');
          }}
          className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold"
        >
          Parolni Yangilash
        </button>
      </div>

      {/* Logout */}
      <div className="p-6 rounded-2xl bg-rose-500/5 border border-rose-500/20 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-white">Hisobdan Chiqish</h3>
          <p className="text-xs text-slate-400 mt-0.5">Ushbu qurilmadagi faol seansni yakunlash</p>
        </div>

        <button
          onClick={onLogout}
          className="px-4 py-2 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-400 border border-rose-500/30 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Chiqish</span>
        </button>
      </div>
    </div>
  );
}
