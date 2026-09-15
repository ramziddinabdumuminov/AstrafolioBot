import { useState } from 'react';
import {
  Server,
  Cpu,
  HardDrive,
  Activity,
  Play,
  Square,
  RotateCw,
  PlusCircle,
  ExternalLink,
  Terminal,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  RefreshCw,
  ChevronRight,
  ShieldCheck,
  Layers,
  ArrowUpRight,
  FileCode
} from 'lucide-react';
import { BotItem, BotStatus, DeploymentRecord, SystemStats } from '../types';

interface DashboardViewProps {
  bots: BotItem[];
  stats: SystemStats | null;
  deployments: DeploymentRecord[];
  onSelectBot: (botId: string) => void;
  onNewBot: (initialSource?: 'python_file' | 'template' | 'zip' | 'github') => void;
  onBotAction: (botId: string, action: 'start' | 'stop' | 'restart' | 'rebuild') => void;
  onRefresh: () => void;
}

export default function DashboardView({
  bots,
  stats,
  deployments,
  onSelectBot,
  onNewBot,
  onBotAction,
  onRefresh,
}: DashboardViewProps) {
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const formatUptime = (seconds: number) => {
    if (!seconds || seconds <= 0) return '0 daq';
    const d = Math.floor(seconds / (3600 * 24));
    const h = Math.floor((seconds % (3600 * 24)) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    if (d > 0) return `${d}k ${h}s`;
    if (h > 0) return `${h}s ${m}d`;
    return `${m} daq`;
  };

  const getStatusBadge = (status: BotStatus) => {
    switch (status) {
      case 'ISHLAYAPTI':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            ISHLAYAPTI
          </span>
        );
      case 'TO‘XTATILGAN':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-400 border border-slate-700">
            <span className="w-2 h-2 rounded-full bg-slate-500" />
            TO‘XTATILGAN
          </span>
        );
      case 'ISHGA TUSHMOQDA':
      case 'QURILMOQDA':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
            <RotateCw className="w-3 h-3 animate-spin" />
            {status}
          </span>
        );
      case 'TO‘XTATILMOQDA':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30">
            <RotateCw className="w-3 h-3 animate-spin" />
            TO‘XTATILMOQDA
          </span>
        );
      case 'ISHDAN CHIQDI':
      case 'XATOLIK':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/15 text-rose-400 border border-rose-500/30">
            <AlertCircle className="w-3 h-3" />
            {status}
          </span>
        );
    }
  };

  const handleAction = async (botId: string, action: 'start' | 'stop' | 'restart' | 'rebuild') => {
    setActionLoading(`${botId}-${action}`);
    try {
      await onBotAction(botId, action);
    } finally {
      setTimeout(() => setActionLoading(null), 800);
    }
  };

  const runningCount = bots.filter((b) => b.status === 'ISHLAYAPTI').length;
  const stoppedCount = bots.filter((b) => b.status === 'TO‘XTATILGAN').length;

  return (
    <div className="space-y-6 pb-12">
      {/* Page Title and Quick Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-2.5">
            Boshqaruv Paneli
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Python Telegram botlaringizning 24/7 server faoliyati va resurslar monitoringi
          </p>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <button
            id="dashboard-refresh-btn"
            onClick={onRefresh}
            className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            title="Yangilash"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            id="dashboard-upload-py-btn"
            onClick={() => onNewBot('python_file')}
            className="flex-1 sm:flex-initial px-3.5 py-2.5 rounded-xl bg-emerald-600/15 border border-emerald-500/30 hover:bg-emerald-600/25 text-emerald-400 font-semibold text-xs flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer"
            title="Kompyuteringizdan .py fayl yuklab yangi bot yaratish"
          >
            <FileCode className="w-4 h-4 text-emerald-400" />
            <span>Python fayl yuklash</span>
          </button>

          <button
            id="dashboard-create-bot-btn"
            onClick={() => onNewBot('template')}
            className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 active:scale-95 transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Yangi bot yaratish</span>
          </button>
        </div>
      </div>

      {/* Metric Cards (Section 5) */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3.5">
        {/* Total Bots */}
        <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800/80 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Jami botlar</span>
            <Server className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-extrabold text-white">{bots.length}</div>
          <div className="mt-1 text-[11px] text-slate-400">Izolyatsiyalangan</div>
        </div>

        {/* Running Bots */}
        <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800/80 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Ishlayotgan</span>
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-400">{runningCount}</div>
          <div className="mt-1 text-[11px] text-emerald-400/80">24/7 Polling faol</div>
        </div>

        {/* Stopped Bots */}
        <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800/80 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">To‘xtatilgan</span>
            <Square className="w-4 h-4 text-slate-500" />
          </div>
          <div className="text-2xl font-extrabold text-slate-300">{stoppedCount}</div>
          <div className="mt-1 text-[11px] text-slate-500">Kutish rejimida</div>
        </div>

        {/* CPU Usage */}
        <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800/80 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">CPU ishlatilishi</span>
            <Cpu className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-extrabold text-white">
            {stats ? `${stats.hostCpuUsagePercent}%` : '12%'}
          </div>
          <div className="mt-1 text-[11px] text-cyan-400/80">Yadro yuklamasi</div>
        </div>

        {/* RAM Usage */}
        <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800/80 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">RAM ishlatilishi</span>
            <Activity className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-extrabold text-white">
            {stats
              ? `${Math.round((stats.hostMemoryUsedMb / (stats.hostMemoryTotalMb || 1000)) * 100)}%`
              : '28%'}
          </div>
          <div className="mt-1 text-[11px] text-indigo-400/80">
            {stats ? `${stats.hostMemoryUsedMb} MB` : '512 MB'}
          </div>
        </div>

        {/* Disk Usage */}
        <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800/80 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Disk xotira</span>
            <HardDrive className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-extrabold text-white">
            {stats ? `${stats.hostDiskUsedGb} GB` : '14.2 GB'}
          </div>
          <div className="mt-1 text-[11px] text-purple-400/80">NVMe SSD</div>
        </div>
      </div>

      {/* Bot List Table / Cards (Section 5 & 11) */}
      <div className="rounded-2xl bg-slate-900/60 border border-slate-800/80 overflow-hidden shadow-xl">
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Server className="w-4 h-4 text-blue-400" />
              Telegram Botlar Ro‘yxati
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Konteynerlar holati, Python versiyalari va tezkor boshqaruv tugmalari
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-400 bg-slate-800/70 px-2.5 py-1 rounded-lg">
            {bots.length} ta bot
          </span>
        </div>

        {bots.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-12 h-12 rounded-2xl bg-blue-600/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mx-auto mb-3">
              <PlusCircle className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-white">Hech qanday bot mavjud emas</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Ilk Python Telegram botingizni yaratish uchun “Yangi bot yaratish” tugmasini bosing.
            </p>
            <div className="mt-4 flex items-center justify-center gap-3">
              <button
                onClick={() => onNewBot('python_file')}
                className="px-4 py-2 rounded-xl bg-emerald-600/20 border border-emerald-500/30 hover:bg-emerald-600/30 text-emerald-400 font-semibold text-xs flex items-center gap-2 cursor-pointer transition-colors"
              >
                <FileCode className="w-4 h-4" />
                <span>Python fayl yuklash (.py)</span>
              </button>
              <button
                onClick={() => onNewBot('template')}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-md shadow-blue-600/20 cursor-pointer transition-colors"
              >
                Shablondan yaratish
              </button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/60 border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="px-5 py-3.5">Bot nomi</th>
                  <th className="px-4 py-3.5">Holati</th>
                  <th className="px-4 py-3.5">Kutubxona & Python</th>
                  <th className="px-4 py-3.5">CPU & RAM</th>
                  <th className="px-4 py-3.5">Ishlash vaqti</th>
                  <th className="px-4 py-3.5">Yaratilgan</th>
                  <th className="px-5 py-3.5 text-right">Boshqaruv</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {bots.map((bot) => {
                  const isRunning = bot.status === 'ISHLAYAPTI';
                  return (
                    <tr
                      key={bot.id}
                      className="hover:bg-slate-800/40 transition-colors group cursor-pointer"
                      onClick={() => onSelectBot(bot.id)}
                    >
                      {/* Name and Container ID */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-bold group-hover:scale-105 transition-transform flex-shrink-0">
                            🤖
                          </div>
                          <div>
                            <div className="font-bold text-white text-sm group-hover:text-blue-400 transition-colors flex items-center gap-1.5">
                              <span>{bot.name}</span>
                              <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-blue-400" />
                            </div>
                            <div className="text-[11px] text-slate-500 font-mono">
                              ID: {bot.containerId} • {bot.mainFile}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-4">{getStatusBadge(bot.status)}</td>

                      {/* Python and Library */}
                      <td className="px-4 py-4">
                        <div className="font-medium text-slate-200">{bot.library}</div>
                        <div className="text-[11px] text-slate-500 font-mono">
                          Python {bot.pythonVersion}
                        </div>
                      </td>

                      {/* CPU & RAM metrics */}
                      <td className="px-4 py-4">
                        <div className="text-slate-200 font-mono">
                          {isRunning ? `${bot.metrics.cpuUsagePercent}% CPU` : '0% CPU'}
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono">
                          {isRunning ? `${bot.metrics.memoryUsageMb} MB` : '0 MB'} /{' '}
                          {bot.resourceLimits.ramMb} MB
                        </div>
                      </td>

                      {/* Uptime */}
                      <td className="px-4 py-4 font-mono text-slate-300">
                        {isRunning ? formatUptime(bot.metrics.uptimeSeconds) : '—'}
                      </td>

                      {/* Created At */}
                      <td className="px-4 py-4 text-slate-400">
                        {new Date(bot.createdAt).toLocaleDateString('uz-UZ', {
                          day: '2-digit',
                          month: 'short'
                        })}
                      </td>

                      {/* Action buttons (Section 11) */}
                      <td className="px-5 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          {isRunning ? (
                            <button
                              id={`bot-stop-btn-${bot.id}`}
                              onClick={() => handleAction(bot.id, 'stop')}
                              disabled={actionLoading !== null}
                              className="p-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 transition-colors cursor-pointer"
                              title="To‘xtatish"
                            >
                              <Square className="w-3.5 h-3.5" />
                            </button>
                          ) : (
                            <button
                              id={`bot-start-btn-${bot.id}`}
                              onClick={() => handleAction(bot.id, 'start')}
                              disabled={actionLoading !== null}
                              className="p-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition-colors cursor-pointer"
                              title="Ishga tushirish"
                            >
                              <Play className="w-3.5 h-3.5" />
                            </button>
                          )}

                          <button
                            id={`bot-restart-btn-${bot.id}`}
                            onClick={() => handleAction(bot.id, 'restart')}
                            disabled={actionLoading !== null}
                            className="p-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 transition-colors cursor-pointer"
                            title="Qayta ishga tushirish"
                          >
                            <RotateCw
                              className={`w-3.5 h-3.5 ${
                                actionLoading === `${bot.id}-restart` ? 'animate-spin' : ''
                              }`}
                            />
                          </button>

                          <button
                            id={`bot-open-details-btn-${bot.id}`}
                            onClick={() => onSelectBot(bot.id)}
                            className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            <span>Boshqarish</span>
                            <ChevronRight className="w-3 h-3 text-slate-400" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Recent Deployments Table (Section 5) */}
      <div className="rounded-2xl bg-slate-900/60 border border-slate-800/80 p-5 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-400" />
            Oxirgi Joylashtirishlar (Deployments)
          </h2>
          <span className="text-xs text-slate-400">Haqiqiy build tarixi</span>
        </div>

        {deployments.length === 0 ? (
          <p className="text-xs text-slate-500 py-4 text-center">
            Hozircha joylashtirishlar tarixi mavjud emas.
          </p>
        ) : (
          <div className="space-y-2.5">
            {deployments.slice(0, 4).map((dep) => (
              <div
                key={dep.id}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/70 text-xs"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      dep.status === 'SUCCESS'
                        ? 'bg-emerald-400'
                        : dep.status === 'BUILDING'
                        ? 'bg-cyan-400 animate-ping'
                        : 'bg-rose-400'
                    }`}
                  />
                  <div>
                    <span className="font-bold text-white">{dep.botName}</span>
                    <span className="text-slate-400 ml-2 font-mono">({dep.commitOrSource})</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-slate-400 text-[11px] font-mono">
                  <span>Vaqt: {dep.durationSeconds > 0 ? `${dep.durationSeconds}s` : 'Qurilmoqda...'}</span>
                  <span>{new Date(dep.startedAt).toLocaleTimeString('uz-UZ')}</span>
                  <span
                    className={`px-2 py-0.5 rounded font-bold ${
                      dep.status === 'SUCCESS'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : dep.status === 'BUILDING'
                        ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                        : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    }`}
                  >
                    {dep.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
