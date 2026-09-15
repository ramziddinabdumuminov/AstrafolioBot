import { useState } from 'react';
import {
  Cpu,
  Server,
  Bell,
  User as UserIcon,
  Globe,
  Terminal,
  LogOut,
  Shield,
  PlusCircle,
  Menu,
  X
} from 'lucide-react';
import { User, SystemStats } from '../types';
import { Language, translations } from '../services/i18n';

interface NavbarProps {
  user: User | null;
  stats: SystemStats | null;
  unreadCount: number;
  currentLang: Language;
  onSelectLang: (lang: Language) => void;
  onOpenNotifications: () => void;
  onOpenAuth: () => void;
  onLogout: () => void;
  onNavigate: (view: string) => void;
  currentView: string;
  onToggleMobileSidebar: () => void;
}

export default function Navbar({
  user,
  stats,
  unreadCount,
  currentLang,
  onSelectLang,
  onOpenNotifications,
  onOpenAuth,
  onLogout,
  onNavigate,
  currentView,
  onToggleMobileSidebar,
}: NavbarProps) {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const t = translations[currentLang];

  return (
    <header
      id="astrafolio-navbar"
      className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#080B11]/90 backdrop-blur-md px-4 lg:px-6 py-3 transition-all"
    >
      <div className="flex items-center justify-between gap-4 max-w-[1600px] mx-auto">
        {/* Left: Brand Logo & Mobile toggle */}
        <div className="flex items-center gap-3">
          <button
            id="mobile-sidebar-toggle-btn"
            onClick={onToggleMobileSidebar}
            className="p-2 -ml-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 lg:hidden"
            aria-label="Toggle Navigation"
          >
            <Menu className="w-5 h-5" />
          </button>

          <button
            id="navbar-brand-logo-btn"
            onClick={() => onNavigate('landing')}
            className="flex items-center gap-2.5 text-left group cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-all">
              <Terminal className="w-5 h-5 text-white stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                  ASTRAFOLIO
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-blue-500/10 border border-blue-500/30 text-blue-400 rounded-md uppercase tracking-wider">
                  24/7 Cloud
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Python Telegram Bot Hosting
              </p>
            </div>
          </button>
        </div>

        {/* Center: Cluster Quick Status (Desktop) */}
        {stats && (
          <div className="hidden xl:flex items-center gap-6 px-4 py-1.5 rounded-full bg-slate-900/60 border border-slate-800/60 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-slate-400">Klaster:</span>
              <span className="font-semibold text-emerald-400">99.99% Online</span>
            </div>

            <div className="w-px h-3.5 bg-slate-800" />

            <div className="flex items-center gap-1.5">
              <Server className="w-3.5 h-3.5 text-blue-400" />
              <span className="text-slate-400">Faol botlar:</span>
              <span className="font-semibold text-white">
                {stats.runningBots} / {stats.totalBots}
              </span>
            </div>

            <div className="w-px h-3.5 bg-slate-800" />

            <div className="flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-slate-400">Server CPU:</span>
              <span className="font-semibold text-white">{stats.hostCpuUsagePercent}%</span>
            </div>
          </div>
        )}

        {/* Right: Actions, Language, Notifications, User */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Quick Create Bot Button */}
          <button
            id="navbar-new-bot-btn"
            onClick={() => onNavigate('new-bot')}
            className="flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-md shadow-blue-600/25 active:scale-95 transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span className="hidden sm:inline">Yangi bot</span>
          </button>

          {/* Language Switcher */}
          <div className="relative">
            <button
              id="lang-switcher-btn"
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/70 border border-slate-800 flex items-center gap-1 text-xs font-medium cursor-pointer"
              title="Tilni o'zgartirish"
            >
              <Globe className="w-4 h-4 text-slate-400" />
              <span className="uppercase font-semibold">{currentLang}</span>
            </button>

            {langMenuOpen && (
              <div className="absolute right-0 mt-2 w-32 py-1.5 bg-slate-900 border border-slate-700/80 rounded-xl shadow-xl z-50 animate-in fade-in">
                <button
                  onClick={() => {
                    onSelectLang('uz');
                    setLangMenuOpen(false);
                  }}
                  className={`w-full px-3 py-1.5 text-left text-xs flex items-center justify-between hover:bg-slate-800 ${
                    currentLang === 'uz' ? 'text-blue-400 font-bold' : 'text-slate-300'
                  }`}
                >
                  <span>O‘zbekcha</span>
                  {currentLang === 'uz' && <span className="text-[10px] bg-blue-500/20 px-1 rounded">Asosiy</span>}
                </button>
                <button
                  onClick={() => {
                    onSelectLang('en');
                    setLangMenuOpen(false);
                  }}
                  className={`w-full px-3 py-1.5 text-left text-xs flex items-center justify-between hover:bg-slate-800 ${
                    currentLang === 'en' ? 'text-blue-400 font-bold' : 'text-slate-300'
                  }`}
                >
                  <span>English</span>
                </button>
                <button
                  onClick={() => {
                    onSelectLang('ru');
                    setLangMenuOpen(false);
                  }}
                  className={`w-full px-3 py-1.5 text-left text-xs flex items-center justify-between hover:bg-slate-800 ${
                    currentLang === 'ru' ? 'text-blue-400 font-bold' : 'text-slate-300'
                  }`}
                >
                  <span>Русский</span>
                </button>
              </div>
            )}
          </div>

          {/* Notifications Bell */}
          <button
            id="notifications-bell-btn"
            onClick={onOpenNotifications}
            className="relative p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/70 border border-slate-800 transition-colors cursor-pointer"
            title="Bildirishnomalar"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white shadow">
                {unreadCount}
              </span>
            )}
          </button>

          {/* User Profile / Auth */}
          {user ? (
            <div className="relative">
              <button
                id="user-profile-menu-btn"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 p-1.5 pl-2.5 rounded-lg border border-slate-800 bg-slate-900/80 hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <div className="w-6 h-6 rounded-md bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-xs font-bold text-white uppercase">
                  {user.username.charAt(0)}
                </div>
                <span className="text-xs font-medium text-slate-200 hidden md:block max-w-[100px] truncate">
                  {user.username}
                </span>
                <span className="text-[10px] font-semibold text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded border border-blue-500/20">
                  {user.plan}
                </span>
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 py-2 bg-slate-900 border border-slate-700/80 rounded-xl shadow-2xl z-50 divide-y divide-slate-800">
                  <div className="px-3.5 py-2">
                    <p className="text-xs font-bold text-white">{user.fullName}</p>
                    <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                    <div className="mt-1 flex items-center gap-1.5">
                      <span className="px-1.5 py-0.5 text-[9px] font-semibold rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
                        {user.plan} tarif
                      </span>
                      {user.role === 'admin' && (
                        <span className="px-1.5 py-0.5 text-[9px] font-semibold rounded bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center gap-0.5">
                          <Shield className="w-2.5 h-2.5" /> Admin
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => {
                        onNavigate('dashboard');
                        setUserMenuOpen(false);
                      }}
                      className="w-full px-3.5 py-1.5 text-left text-xs text-slate-300 hover:text-white hover:bg-slate-800 flex items-center gap-2"
                    >
                      <Terminal className="w-3.5 h-3.5 text-blue-400" />
                      {t.dashboard}
                    </button>
                    <button
                      onClick={() => {
                        onNavigate('my-bots');
                        setUserMenuOpen(false);
                      }}
                      className="w-full px-3.5 py-1.5 text-left text-xs text-slate-300 hover:text-white hover:bg-slate-800 flex items-center gap-2"
                    >
                      <Server className="w-3.5 h-3.5 text-indigo-400" />
                      {t.myBots}
                    </button>
                    <button
                      onClick={() => {
                        onNavigate('settings');
                        setUserMenuOpen(false);
                      }}
                      className="w-full px-3.5 py-1.5 text-left text-xs text-slate-300 hover:text-white hover:bg-slate-800 flex items-center gap-2"
                    >
                      <UserIcon className="w-3.5 h-3.5 text-cyan-400" />
                      {t.settings}
                    </button>
                    {user.role === 'admin' && (
                      <button
                        onClick={() => {
                          onNavigate('admin');
                          setUserMenuOpen(false);
                        }}
                        className="w-full px-3.5 py-1.5 text-left text-xs text-purple-300 hover:text-purple-200 hover:bg-slate-800 flex items-center gap-2 font-medium"
                      >
                        <Shield className="w-3.5 h-3.5 text-purple-400" />
                        {t.adminPanel}
                      </button>
                    )}
                  </div>

                  <div className="pt-1">
                    <button
                      onClick={() => {
                        onLogout();
                        setUserMenuOpen(false);
                      }}
                      className="w-full px-3.5 py-1.5 text-left text-xs text-rose-400 hover:bg-rose-500/10 flex items-center gap-2"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      {t.logout}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              id="login-register-btn"
              onClick={onOpenAuth}
              className="px-3.5 py-1.5 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors"
            >
              {t.login}
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
