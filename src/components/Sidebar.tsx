import {
  LayoutDashboard,
  Bot,
  PlusCircle,
  Rocket,
  FolderTree,
  Activity,
  Bell,
  CreditCard,
  FileText,
  Settings,
  ShieldCheck,
  Server,
  Terminal,
  HelpCircle,
  ExternalLink,
  ChevronRight,
  Radio,
  AlertTriangle
} from 'lucide-react';
import { User, SystemStats } from '../types';
import { Language, translations } from '../services/i18n';

interface SidebarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  user: User | null;
  stats: SystemStats | null;
  unreadCount: number;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  currentLang: Language;
}

export default function Sidebar({
  currentView,
  onNavigate,
  user,
  stats,
  unreadCount,
  isOpenMobile,
  onCloseMobile,
  currentLang,
}: SidebarProps) {
  const t = translations[currentLang];

  const mainNav = [
    { id: 'dashboard', label: t.dashboard, icon: LayoutDashboard, badge: null },
    { id: 'my-bots', label: t.myBots, icon: Bot, badge: stats?.totalBots || null },
    { id: 'new-bot', label: t.newBot, icon: PlusCircle, badge: 'Yangi', isHighlight: true },
    { id: 'deployments', label: t.deployments, icon: Rocket, badge: null },
    { id: 'monitoring', label: t.monitoring, icon: Activity, badge: null },
    { id: 'files-hub', label: t.files, icon: FolderTree, badge: null },
    { id: 'notifications', label: t.notifications, icon: Bell, badge: unreadCount > 0 ? unreadCount : null },
    { id: 'tariffs', label: t.tariffs, icon: CreditCard, badge: null },
    { id: 'audit-logs', label: t.auditLogs, icon: FileText, badge: null },
    { id: 'settings', label: t.settings, icon: Settings, badge: null },
  ];

  const adminNav = [
    { id: 'admin', label: 'Boshqaruv paneli', icon: ShieldCheck },
    { id: 'admin-users', label: 'Foydalanuvchilar', icon: Bot },
    { id: 'admin-servers', label: 'Serverlar & Klaster', icon: Server },
    { id: 'admin-logs', label: 'Tizim loglari', icon: Terminal },
  ];

  const errorNav = [
    { id: 'error-404', label: '404 Sahifasi', code: '404' },
    { id: 'error-403', label: '403 Taqiqlangan', code: '403' },
    { id: 'error-500', label: '500 Server xatosi', code: '500' },
    { id: 'error-503', label: '503 Texnik xizmat', code: '503' },
  ];

  const handleNavClick = (id: string) => {
    onNavigate(id);
    onCloseMobile();
  };

  return (
    <>
      {/* Backdrop for Mobile */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      <aside
        id="astrafolio-sidebar"
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#080B11] border-r border-slate-800/80 flex flex-col pt-16 lg:pt-0 transition-transform duration-300 lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        } lg:static lg:z-30`}
      >
        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {/* Main User Controls */}
          <div>
            <div className="px-3 mb-2 flex items-center justify-between text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <span>Asosiy menyu</span>
              <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
            </div>

            <nav className="space-y-1">
              {mainNav.map((item) => {
                const Icon = item.icon;
                const isActive = currentView === item.id;
                return (
                  <button
                    key={item.id}
                    id={`nav-item-${item.id}`}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all group cursor-pointer ${
                      isActive
                        ? 'bg-blue-600/15 text-blue-400 border border-blue-500/30 shadow-sm shadow-blue-500/10'
                        : item.isHighlight
                        ? 'text-cyan-300 hover:bg-cyan-500/10 hover:text-cyan-200'
                        : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/80'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon
                        className={`w-4 h-4 transition-colors ${
                          isActive
                            ? 'text-blue-400'
                            : item.isHighlight
                            ? 'text-cyan-400'
                            : 'text-slate-400 group-hover:text-slate-200'
                        }`}
                      />
                      <span>{item.label}</span>
                    </div>

                    {item.badge !== null && (
                      <span
                        className={`px-1.5 py-0.5 text-[10px] font-bold rounded-md ${
                          item.badge === 'Yangi'
                            ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                            : typeof item.badge === 'number' && item.id === 'notifications'
                            ? 'bg-rose-500/20 text-rose-300'
                            : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Administrator Section */}
          {(user?.role === 'admin' || true) && (
            <div className="pt-2 border-t border-slate-800/60">
              <div className="px-3 mb-2 flex items-center justify-between text-[11px] font-bold text-purple-400/90 uppercase tracking-wider">
                <span>Administrator paneli</span>
                <span className="text-[9px] bg-purple-500/20 px-1 py-0.2 rounded text-purple-300 border border-purple-500/30">
                  Superuser
                </span>
              </div>
              <nav className="space-y-1">
                {adminNav.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentView === item.id;
                  return (
                    <button
                      key={item.id}
                      id={`admin-nav-item-${item.id}`}
                      onClick={() => handleNavClick(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all group cursor-pointer ${
                        isActive
                          ? 'bg-purple-600/15 text-purple-300 border border-purple-500/30'
                          : 'text-slate-400 hover:text-purple-200 hover:bg-slate-900/80'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-4 h-4 text-purple-400" />
                        <span>{item.label}</span>
                      </div>
                      <ChevronRight className="w-3 h-3 text-slate-600 group-hover:text-purple-400 transition-transform group-hover:translate-x-0.5" />
                    </button>
                  );
                })}
              </nav>
            </div>
          )}

          {/* System Error Pages (Section 36) */}
          <div className="pt-2 border-t border-slate-800/60">
            <div className="px-3 mb-2 flex items-center justify-between text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <span>Xatolik sahifalari</span>
              <AlertTriangle className="w-3 h-3 text-amber-500/70" />
            </div>
            <div className="grid grid-cols-2 gap-1.5 px-1">
              {errorNav.map((e) => (
                <button
                  key={e.id}
                  onClick={() => handleNavClick(e.id)}
                  className={`px-2.5 py-1.5 rounded-lg text-[11px] font-mono border text-center transition-colors ${
                    currentView === e.id
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      : 'bg-slate-900/40 text-slate-400 border-slate-800/80 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  {e.code} Xatosi
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Server Node Badge */}
        <div className="p-3 m-3 rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-slate-800/80 text-xs">
          <div className="flex items-center justify-between mb-1.5">
            <span className="font-semibold text-slate-200 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse"></span>
              Toshkent DC-1
            </span>
            <span className="text-[10px] text-emerald-400 font-mono">185.196.110.12</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Docker izolyatsiyasi faol. Python 3.10-3.13 tayyor.
          </p>
          <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
            <span>Domen: <strong className="text-blue-400">astrafolio.uz</strong></span>
            <span className="text-slate-500">v2.4.0</span>
          </div>
        </div>
      </aside>
    </>
  );
}
