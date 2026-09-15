import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import LandingPage from './components/LandingPage';
import DashboardView from './components/DashboardView';
import MyBotsView from './components/MyBotsView';
import NewBotWizard from './components/NewBotWizard';
import BotDetailView from './components/BotDetailView';
import DeploymentsView from './components/DeploymentsView';
import MonitoringView from './components/MonitoringView';
import PricingView from './components/PricingView';
import AuditLogView from './components/AuditLogView';
import AdminPanelView from './components/AdminPanelView';
import SettingsView from './components/SettingsView';
import AuthModal from './components/AuthModal';
import NotificationsModal from './components/NotificationsModal';
import ToastContainer from './components/ToastContainer';
import { toast } from './services/toast';

import {
  User,
  BotItem,
  SystemStats,
  DeploymentRecord,
  AuditLog,
  NotificationItem,
  ServerNode,
  TariffPlan
} from './types';
import { Language } from './services/i18n';
import { api } from './services/api';

export default function App() {
  // Navigation & UI state
  const [currentView, setCurrentView] = useState<string>('landing');
  const [selectedBotId, setSelectedBotId] = useState<string | null>(null);
  const [currentLang, setCurrentLang] = useState<Language>('uz');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [wizardSourceType, setWizardSourceType] = useState<'python_file' | 'template' | 'zip' | 'github'>('template');

  // App Data State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [bots, setBots] = useState<BotItem[]>([]);
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [deployments, setDeployments] = useState<DeploymentRecord[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [servers, setServers] = useState<ServerNode[]>([]);
  const [tariffs, setTariffs] = useState<TariffPlan[]>([]);

  // Modals
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authInitialMode, setAuthInitialMode] = useState<'login' | 'register'>('login');
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  // Initial load
  const loadInitialData = async () => {
    try {
      const [userRes, botsRes, statsRes, depRes, auditRes, notifRes, srvRes, tarRes] =
        await Promise.all([
          api.getCurrentUser().catch(() => ({ user: null })),
          api.getBots().catch(() => []),
          api.getStats().catch(() => null),
          api.getDeployments().catch(() => []),
          api.getAuditLogs().catch(() => []),
          api.getNotifications().catch(() => []),
          api.getServers().catch(() => []),
          api.getTariffs().catch(() => [])
        ]);

      if (userRes && (userRes as any).user) setCurrentUser((userRes as any).user);
      setBots(Array.isArray(botsRes) ? botsRes : []);
      setStats(statsRes);
      setDeployments(Array.isArray(depRes) ? depRes : []);
      setAuditLogs(Array.isArray(auditRes) ? auditRes : []);
      setNotifications(Array.isArray(notifRes) ? notifRes : []);
      setServers(Array.isArray(srvRes) ? srvRes : []);
      setTariffs(Array.isArray(tarRes) ? tarRes : []);
    } catch (e) {
      console.error('Initial load error:', e);
    }
  };

  // Periodic polling for real-time stats and bot loads
  useEffect(() => {
    loadInitialData();

    const interval = setInterval(async () => {
      try {
        const [botsRes, statsRes] = await Promise.all([
          api.getBots().catch(() => []),
          api.getStats().catch(() => null)
        ]);
        setBots(Array.isArray(botsRes) ? botsRes : []);
        if (statsRes) setStats(statsRes);
      } catch (err) {
        // silent polling catch
      }
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  // Bot actions (start, stop, restart, rebuild)
  const handleBotAction = async (botId: string, action: 'start' | 'stop' | 'restart' | 'rebuild') => {
    try {
      await api.botAction(botId, action);
      const updatedBots = await api.getBots();
      setBots(Array.isArray(updatedBots) ? updatedBots : []);
      const updatedStats = await api.getStats();
      setStats(updatedStats);
      const actionLabels: Record<string, string> = {
        start: 'Bot ishga tushirildi',
        stop: 'Bot to‘xtatildi',
        restart: 'Bot qayta ishga tushirildi',
        rebuild: 'Bot qayta qurilmoqda'
      };
      toast.success(actionLabels[action] || 'Amal muvaffaqiyatli bajarildi');
    } catch (e: any) {
      toast.error('Amalni bajarishda xatolik: ' + e.message);
    }
  };

  // Upgrade Tariff
  const handleUpgradePlan = async (planId: string) => {
    try {
      const res = await api.upgradePlan(planId);
      if (res.user) setCurrentUser(res.user);
      toast.success(`Tarifingiz muvaffaqiyatli ${planId} rejasiga oshirildi!`);
    } catch (e: any) {
      toast.error('Xatolik: ' + e.message);
    }
  };

  const handleOpenAuth = (mode: 'login' | 'register') => {
    setAuthInitialMode(mode);
    setAuthModalOpen(true);
  };

  const handleLogout = async () => {
    await api.logout();
    setCurrentUser(null);
    setCurrentView('landing');
  };

  const handleMarkAllRead = async () => {
    await api.markNotificationsRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true, read: true })));
  };

  const isLanding = currentView === 'landing';
  const unreadCount = notifications.filter((n) => !n.isRead && !n.read).length;

  return (
    <div className="min-h-screen bg-[#080B11] text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Global Top Navbar */}
      <Navbar
        user={currentUser}
        stats={stats}
        unreadCount={unreadCount}
        currentLang={currentLang}
        onSelectLang={(l) => setCurrentLang(l)}
        onOpenNotifications={() => setNotificationsOpen(true)}
        onOpenAuth={() => handleOpenAuth('login')}
        onLogout={handleLogout}
        onNavigate={(view) => {
          if (view === 'bot-detail' && !selectedBotId && bots.length > 0) {
            setSelectedBotId(bots[0].id);
          }
          setCurrentView(view);
        }}
        currentView={currentView}
        onToggleMobileSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)}
      />

      {/* Main Layout Body */}
      {isLanding ? (
        <LandingPage
          onStartCreate={() => {
            if (currentUser) {
              setCurrentView('new-bot');
            } else {
              handleOpenAuth('register');
            }
          }}
          onExplore={() => {
            setCurrentView('dashboard');
          }}
          tariffs={tariffs}
          onSelectTariff={(tariffId) => {
            if (!currentUser) {
              handleOpenAuth('register');
            } else {
              handleUpgradePlan(tariffId);
            }
          }}
        />
      ) : (
        <div className="flex-1 flex max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 gap-6">
          {/* Dashboard Left Sidebar */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <Sidebar
              currentView={currentView}
              onNavigate={(view) => {
                if (view === 'bot-detail' && !selectedBotId && bots.length > 0) {
                  setSelectedBotId(bots[0].id);
                }
                setCurrentView(view);
              }}
              user={currentUser}
              stats={stats}
              unreadCount={unreadCount}
              isOpenMobile={mobileSidebarOpen}
              onCloseMobile={() => setMobileSidebarOpen(false)}
              currentLang={currentLang}
            />
          </div>

          {/* Primary View Container */}
          <main className="flex-1 min-w-0">
            {currentView === 'dashboard' && (
              <DashboardView
                bots={bots}
                stats={stats}
                deployments={deployments}
                onSelectBot={(botId) => {
                  setSelectedBotId(botId);
                  setCurrentView('bot-detail');
                }}
                onNewBot={(src = 'template') => {
                  setWizardSourceType(src);
                  setCurrentView('new-bot');
                }}
                onBotAction={handleBotAction}
                onRefresh={loadInitialData}
              />
            )}

            {currentView === 'my-bots' && (
              <MyBotsView
                bots={bots}
                onSelectBot={(botId) => {
                  setSelectedBotId(botId);
                  setCurrentView('bot-detail');
                }}
                onNewBot={(src = 'template') => {
                  setWizardSourceType(src);
                  setCurrentView('new-bot');
                }}
                onBotAction={handleBotAction}
              />
            )}

            {currentView === 'new-bot' && (
              <NewBotWizard
                initialSourceType={wizardSourceType}
                onSuccess={(newBot) => {
                  setBots((prev) => [newBot, ...prev]);
                  setSelectedBotId(newBot.id);
                  setCurrentView('bot-detail');
                }}
                onCancel={() => setCurrentView('dashboard')}
              />
            )}

            {currentView === 'bot-detail' && selectedBotId && (
              <BotDetailView
                botId={selectedBotId}
                onBack={() => setCurrentView('my-bots')}
                onBotUpdated={(updated) => {
                  setBots((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));
                }}
                onBotDeleted={(deletedId) => {
                  setBots((prev) => prev.filter((b) => b.id !== deletedId));
                  setSelectedBotId(null);
                  setCurrentView('my-bots');
                }}
              />
            )}

            {currentView === 'deployments' && (
              <DeploymentsView
                deployments={deployments}
                onSelectBot={(botId) => {
                  setSelectedBotId(botId);
                  setCurrentView('bot-detail');
                }}
              />
            )}

            {currentView === 'monitoring' && (
              <MonitoringView stats={stats} servers={servers} />
            )}

            {currentView === 'pricing' && (
              <PricingView
                tariffs={tariffs}
                currentUser={currentUser}
                onUpgrade={handleUpgradePlan}
              />
            )}

            {currentView === 'audit' && <AuditLogView logs={auditLogs} />}

            {currentView === 'admin' && (
              <AdminPanelView
                currentUser={currentUser}
                bots={bots}
                servers={servers}
                onRefresh={loadInitialData}
              />
            )}

            {currentView === 'settings' && (
              <SettingsView
                currentUser={currentUser}
                onUserUpdate={(u) => setCurrentUser(u)}
                onLogout={handleLogout}
              />
            )}
          </main>
        </div>
      )}

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        initialMode={authInitialMode}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={(user) => {
          setCurrentUser(user);
          setCurrentView('dashboard');
        }}
      />

      {/* Notifications Modal */}
      <NotificationsModal
        isOpen={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
        notifications={notifications}
        onMarkAllRead={handleMarkAllRead}
      />

      {/* Global In-App Toast Notifications */}
      <ToastContainer />
    </div>
  );
}
