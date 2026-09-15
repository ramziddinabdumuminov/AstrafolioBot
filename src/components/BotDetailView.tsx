import React, { useState, useEffect, useRef } from 'react';
import {
  Server,
  Play,
  Square,
  RotateCw,
  Trash2,
  Terminal as TerminalIcon,
  FileCode,
  Activity,
  Settings,
  Key,
  Download,
  Upload,
  Plus,
  Save,
  Search,
  Filter,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Cpu,
  HardDrive,
  Check,
  ChevronRight,
  ArrowLeft,
  Copy,
  FolderTree,
  Send,
  ShieldAlert
} from 'lucide-react';
import { BotItem, BotFile, BotStatus } from '../types';
import { api } from '../services/api';
import { toast } from '../services/toast';

interface BotDetailViewProps {
  botId: string;
  onBack: () => void;
  onBotUpdated: (bot: BotItem) => void;
  onBotDeleted: (botId: string) => void;
}

export default function BotDetailView({
  botId,
  onBack,
  onBotUpdated,
  onBotDeleted,
}: BotDetailViewProps) {
  const [bot, setBot] = useState<BotItem | null>(null);
  const [activeTab, setActiveTab] = useState<
    'overview' | 'logs' | 'terminal' | 'files' | 'env' | 'monitoring' | 'settings'
  >('overview');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Logs state
  const [logs, setLogs] = useState<string[]>([]);
  const [searchLog, setSearchLog] = useState('');
  const [logFilter, setLogFilter] = useState<'all' | 'info' | 'warn' | 'error'>('all');
  const logsEndRef = useRef<HTMLDivElement>(null);

  // Terminal state
  const [terminalHistory, setTerminalHistory] = useState<
    Array<{ type: 'input' | 'output'; text: string }>
  >([
    {
      type: 'output',
      text: 'ASTRAFOLIO Container Sandbox Shell v2.4\nRuxsat etilgan buyruqlar: python3 -V, ls -la, cat <fayl>, uptime, date, pwd\n'
    }
  ]);
  const [terminalInput, setTerminalInput] = useState('');
  const [terminalRunning, setTerminalRunning] = useState(false);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  // Files & Editor state
  const [files, setFiles] = useState<BotFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<string | null>('main.py');
  const [fileContent, setFileContent] = useState<string>('');
  const [isSavingFile, setIsSavingFile] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [isCreatingFile, setIsCreatingFile] = useState(false);
  const [isUploadingFile, setIsUploadingFile] = useState(false);
  const [isDraggingFile, setIsDraggingFile] = useState(false);
  const fileUploadInputRef = useRef<HTMLInputElement>(null);

  // Env variables
  const [envList, setEnvList] = useState<Array<{ key: string; value: string; isSecret?: boolean }>>([]);
  const [newEnvKey, setNewEnvKey] = useState('');
  const [newEnvVal, setNewEnvVal] = useState('');

  // Fetch bot details
  const fetchBot = async () => {
    try {
      const data = await api.getBot(botId);
      setBot(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch logs
  const fetchLogs = async () => {
    try {
      const data = await api.getBotLogs(botId);
      setLogs(data.logs || []);
    } catch (e) {
      console.error(e);
    }
  };

  // Fetch files
  const fetchFiles = async () => {
    try {
      const data = await api.getBotFiles(botId);
      setFiles(data.files || []);
      if (!selectedFile && data.files.length > 0) {
        loadFile(data.files[0].path);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Load single file content
  const loadFile = async (filePath: string) => {
    try {
      setSelectedFile(filePath);
      const data = await api.getFileContent(botId, filePath);
      setFileContent(data.content || '');
    } catch (e) {
      console.error(e);
    }
  };

  // Save current file
  const handleSaveFile = async () => {
    if (!selectedFile) return;
    setIsSavingFile(true);
    try {
      await api.saveFileContent(botId, selectedFile, fileContent);
      toast.success('Fayl muvaffaqiyatli saqlandi!');
      fetchFiles();
    } catch (err: any) {
      toast.error('Faylni saqlashda xatolik: ' + err.message);
    } finally {
      setIsSavingFile(false);
    }
  };

  // Create new file
  const handleCreateFile = async () => {
    if (!newFileName.trim()) return;
    try {
      await api.saveFileContent(botId, newFileName.trim(), '# Yangi Python fayli\n');
      setNewFileName('');
      setIsCreatingFile(false);
      fetchFiles();
      loadFile(newFileName.trim());
      toast.success('Yangi fayl yaratildi');
    } catch (e: any) {
      toast.error('Xatolik: ' + e.message);
    }
  };

  // Delete a file
  const handleDeleteFile = async (filePath: string) => {
    if (filePath === 'main.py') {
      toast.warning('Asosiy main.py faylini o‘chirish mumkin emas.');
      return;
    }
    if (!confirm(`${filePath} faylini o‘chirishni tasdiqlaysizmi?`)) return;
    try {
      await api.deleteFile(botId, filePath);
      fetchFiles();
      if (selectedFile === filePath) {
        setSelectedFile('main.py');
        loadFile('main.py');
      }
      toast.success('Fayl muvaffaqiyatli o‘chirildi');
    } catch (e: any) {
      toast.error('O‘chirishda xatolik: ' + e.message);
    }
  };

  // Upload single or multiple Python / project files
  const handleUploadFiles = async (filesToUpload: FileList | File[]) => {
    const list = Array.from(filesToUpload);
    if (list.length === 0) return;
    setIsUploadingFile(true);

    try {
      let lastUploadedName = '';
      for (const file of list) {
        const text = await file.text();
        await api.uploadFile(botId, file.name, text, false);
        lastUploadedName = file.name;
      }

      await fetchFiles();
      if (lastUploadedName) {
        await loadFile(lastUploadedName);
      }

      if (list.length === 1) {
        toast.success(`"${list[0].name}" fayli muvaffaqiyatli yuklandi!`);
      } else {
        toast.success(`${list.length} ta fayl muvaffaqiyatli yuklandi!`);
      }
    } catch (err: any) {
      toast.error('Fayl yuklashda xatolik: ' + (err.message || 'Noma‘lum xato'));
    } finally {
      setIsUploadingFile(false);
      if (fileUploadInputRef.current) {
        fileUploadInputRef.current.value = '';
      }
    }
  };

  // Execute terminal command
  const handleExecuteTerminal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!terminalInput.trim() || terminalRunning) return;

    const cmd = terminalInput.trim();
    setTerminalHistory((prev) => [...prev, { type: 'input', text: cmd }]);
    setTerminalInput('');
    setTerminalRunning(true);

    try {
      const res = await api.executeTerminal(botId, cmd);
      setTerminalHistory((prev) => [...prev, { type: 'output', text: res.output }]);
    } catch (err: any) {
      setTerminalHistory((prev) => [
        ...prev,
        { type: 'output', text: `Xatolik: ${err.message}` }
      ]);
    } finally {
      setTerminalRunning(false);
      setTimeout(() => {
        terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 50);
    }
  };

  // Bot actions (Start, Stop, Restart, Rebuild)
  const handleAction = async (action: 'start' | 'stop' | 'restart' | 'rebuild') => {
    setActionLoading(action);
    try {
      await api.botAction(botId, action);
      await fetchBot();
      await fetchLogs();
    } finally {
      setTimeout(() => setActionLoading(null), 700);
    }
  };

  // Bot delete
  const handleDeleteBot = async () => {
    if (!confirm(`Haqiqatdan ham "${bot?.name}" botini va uning barcha fayllarini o‘chirib tashlamoqchimisiz?`)) {
      return;
    }
    try {
      await api.deleteBot(botId);
      toast.success(`"${bot?.name}" muvaffaqiyatli o‘chirildi`);
      onBotDeleted(botId);
    } catch (e: any) {
      toast.error('O‘chirishda xatolik: ' + e.message);
    }
  };

  // Initial load and polling
  useEffect(() => {
    fetchBot();
    fetchLogs();
    fetchFiles();
    loadFile('main.py');

    const interval = setInterval(() => {
      fetchBot();
      if (activeTab === 'logs') fetchLogs();
    }, 4000);

    return () => clearInterval(interval);
  }, [botId, activeTab]);

  if (loading || !bot) {
    return (
      <div className="p-12 text-center text-slate-400">
        <RotateCw className="w-8 h-8 animate-spin mx-auto mb-3 text-blue-500" />
        <p className="text-xs">Bot ma‘lumotlari yuklanmoqda...</p>
      </div>
    );
  }

  const isRunning = bot.status === 'ISHLAYAPTI';

  // Filter logs
  const filteredLogs = logs.filter((line) => {
    if (searchLog && !line.toLowerCase().includes(searchLog.toLowerCase())) return false;
    if (logFilter === 'info' && !line.includes('[INFO]') && !line.includes('ASTRAFOLIO')) return false;
    if (logFilter === 'warn' && !line.includes('[WARN]')) return false;
    if (logFilter === 'error' && !line.includes('[ERROR]') && !line.includes('[STDERR]') && !line.includes('XATOLIK')) return false;
    return true;
  });

  return (
    <div className="space-y-6 pb-16">
      {/* Top Bar: Back & Bot Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 p-4 sm:p-6 rounded-2xl">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
            title="Orqaga qaytish"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-bold text-white">{bot.name}</h1>
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-semibold flex items-center gap-1.5 ${
                  isRunning
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                    : 'bg-slate-800 text-slate-400 border border-slate-700'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    isRunning ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'
                  }`}
                />
                {bot.status}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 font-mono">
              Konteyner: <span className="text-blue-400">{bot.containerId}</span> • Python {bot.pythonVersion} • {bot.mainFile}
            </p>
          </div>
        </div>

        {/* Action Buttons (Section 11) */}
        <div className="flex items-center gap-2 flex-wrap">
          {isRunning ? (
            <button
              onClick={() => handleAction('stop')}
              disabled={actionLoading !== null}
              className="px-3.5 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-400 border border-amber-500/30 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Square className="w-3.5 h-3.5" />
              <span>To‘xtatish</span>
            </button>
          ) : (
            <button
              onClick={() => handleAction('start')}
              disabled={actionLoading !== null}
              className="px-3.5 py-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/30 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Play className="w-3.5 h-3.5" />
              <span>Ishga tushirish</span>
            </button>
          )}

          <button
            onClick={() => handleAction('restart')}
            disabled={actionLoading !== null}
            className="px-3.5 py-2 rounded-xl bg-blue-600/15 hover:bg-blue-600/25 text-blue-400 border border-blue-500/30 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RotateCw
              className={`w-3.5 h-3.5 ${actionLoading === 'restart' ? 'animate-spin' : ''}`}
            />
            <span>Qayta ishga tushirish</span>
          </button>

          <button
            onClick={() => handleAction('rebuild')}
            disabled={actionLoading !== null}
            className="px-3.5 py-2 rounded-xl bg-purple-600/15 hover:bg-purple-600/25 text-purple-400 border border-purple-500/30 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RotateCw
              className={`w-3.5 h-3.5 ${actionLoading === 'rebuild' ? 'animate-spin' : ''}`}
            />
            <span>Qayta qurish</span>
          </button>

          <button
            onClick={handleDeleteBot}
            className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition-colors cursor-pointer"
            title="Botni o‘chirish"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto text-xs font-semibold">
        {[
          { id: 'overview', label: 'Umumiy ko‘rinish', icon: Server },
          { id: 'logs', label: 'Haqiqiy Loglar', icon: FileCode },
          { id: 'terminal', label: 'Web Terminal', icon: TerminalIcon },
          { id: 'files', label: 'Fayllar & Kod Muharriri', icon: FolderTree },
          { id: 'env', label: 'Muhit O‘zgaruvchilari', icon: Key },
          { id: 'monitoring', label: 'Monitoring & Resurslar', icon: Activity },
          { id: 'settings', label: 'Sozlamalar', icon: Settings },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in">
          {/* Main Info Card */}
          <div className="md:col-span-2 space-y-6">
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
              <h2 className="text-base font-bold text-white">Bot Holati va Infratuzilma</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80">
                  <div className="text-slate-500 mb-1">CPU Yuklama</div>
                  <div className="text-lg font-bold text-cyan-400 font-mono">
                    {bot.metrics.cpuUsagePercent}%
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80">
                  <div className="text-slate-500 mb-1">RAM Xotira</div>
                  <div className="text-lg font-bold text-indigo-400 font-mono">
                    {bot.metrics.memoryUsageMb} MB
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80">
                  <div className="text-slate-500 mb-1">Qayta tushishlar</div>
                  <div className="text-lg font-bold text-white font-mono">
                    {bot.metrics.restartsCount} ta
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80">
                  <div className="text-slate-500 mb-1">Uptime</div>
                  <div className="text-lg font-bold text-emerald-400 font-mono">
                    {Math.floor(bot.metrics.uptimeSeconds / 60)} daq
                  </div>
                </div>
              </div>

              <div className="pt-2 text-xs text-slate-300 leading-relaxed">
                <strong>Tavsif:</strong> {bot.description || 'Tavsif kiritilmagan'}
              </div>
            </div>

            {/* Quick Log Snippet */}
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <FileCode className="w-4 h-4 text-blue-400" />
                  Oxirgi Terminal Chiqishlari
                </h3>
                <button
                  onClick={() => setActiveTab('logs')}
                  className="text-xs text-blue-400 hover:underline"
                >
                  To‘liq loglarni ko‘rish →
                </button>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 space-y-1 max-h-48 overflow-y-auto">
                {logs.slice(-6).map((line, idx) => (
                  <div key={idx} className="truncate">
                    {line}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Side Info / Quick Actions */}
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3 text-xs">
              <h3 className="text-sm font-bold text-white">Xavfsizlik & Konteyner</h3>
              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-400">Telegram Token:</span>
                <span className="text-slate-200 font-mono">{bot.tokenMasked || 'Yashirin'}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-400">Server Node:</span>
                <span className="text-blue-400 font-semibold">Toshkent DC-1 (Primary)</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-400">Auto-Restart:</span>
                <span className={bot.autoRestartEnabled ? 'text-emerald-400' : 'text-slate-500'}>
                  {bot.autoRestartEnabled ? `Yoqilgan (${bot.restartPolicy})` : 'O‘chirilgan'}
                </span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-400">Yaratilgan sana:</span>
                <span className="text-slate-300">{new Date(bot.createdAt).toLocaleDateString()}</span>
              </div>

              <div className="pt-2">
                <a
                  href={api.getBackupUrl(bot.id)}
                  download
                  className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Zaxira (Backup ZIP) Yuklab Olish</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: LIVE TERMINAL LOGS (Section 12) */}
      {activeTab === 'logs' && (
        <div className="rounded-2xl bg-slate-900/60 border border-slate-800 overflow-hidden animate-in fade-in">
          {/* Logs Control Bar */}
          <div className="p-4 bg-slate-950/80 border-b border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  value={searchLog}
                  onChange={(e) => setSearchLog(e.target.value)}
                  placeholder="Loglarda qidirish..."
                  className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Filters */}
              <div className="flex items-center gap-1 bg-slate-900 p-0.5 rounded-lg border border-slate-800">
                {(['all', 'info', 'warn', 'error'] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setLogFilter(f)}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-semibold uppercase cursor-pointer ${
                      logFilter === f ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={fetchLogs}
                className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700 flex items-center gap-1.5"
                title="Loglarni yangilash"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Yangilash</span>
              </button>

              <button
                onClick={async () => {
                  await api.clearBotLogs(bot.id);
                  fetchLogs();
                }}
                className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700 flex items-center gap-1.5"
              >
                <span>Tozalash</span>
              </button>

              <button
                onClick={() => {
                  const blob = new Blob([logs.join('\n')], { type: 'text/plain' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `${bot.name}_terminal.log`;
                  a.click();
                }}
                className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Yuklab olish</span>
              </button>
            </div>
          </div>

          {/* Real terminal console view */}
          <div className="p-4 bg-[#070A10] font-mono text-xs text-slate-300 min-h-[420px] max-h-[580px] overflow-y-auto space-y-1 selection:bg-blue-600">
            {filteredLogs.length === 0 ? (
              <div className="text-slate-600 text-center py-12">Loglar topilmadi</div>
            ) : (
              filteredLogs.map((line, idx) => {
                const isError = line.includes('XATOLIK') || line.includes('[STDERR]') || line.includes('ERROR');
                const isSuccess = line.includes('[SUCCESS]') || line.includes('muvaffaqiyatli');
                const isWarn = line.includes('[WARN]');
                return (
                  <div
                    key={idx}
                    className={`leading-relaxed ${
                      isError
                        ? 'text-rose-400'
                        : isSuccess
                        ? 'text-emerald-400'
                        : isWarn
                        ? 'text-amber-300'
                        : 'text-slate-300'
                    }`}
                  >
                    {line}
                  </div>
                );
              })
            )}
            <div ref={logsEndRef} />
          </div>
        </div>
      )}

      {/* TAB 3: WEB TERMINAL (Section 13) */}
      {activeTab === 'terminal' && (
        <div className="rounded-2xl bg-slate-900/60 border border-slate-800 overflow-hidden animate-in fade-in">
          <div className="p-3.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between text-xs">
            <span className="font-mono text-slate-300 flex items-center gap-2">
              <TerminalIcon className="w-4 h-4 text-cyan-400" />
              astrafolio-docker // {bot.containerId} shell
            </span>
            <span className="text-[11px] text-emerald-400 font-mono">Xavfsiz Sandbox</span>
          </div>

          <div className="p-4 bg-[#06080F] min-h-[380px] max-h-[500px] overflow-y-auto font-mono text-xs text-slate-200 space-y-2">
            {terminalHistory.map((item, idx) => (
              <div key={idx} className="leading-relaxed">
                {item.type === 'input' ? (
                  <div className="text-blue-400 font-bold flex items-center gap-1.5">
                    <span>$</span>
                    <span>{item.text}</span>
                  </div>
                ) : (
                  <pre className="text-slate-300 whitespace-pre-wrap font-mono mt-0.5">
                    {item.text}
                  </pre>
                )}
              </div>
            ))}
            <div ref={terminalEndRef} />
          </div>

          <form
            onSubmit={handleExecuteTerminal}
            className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2"
          >
            <span className="font-mono text-blue-400 font-bold">$</span>
            <input
              type="text"
              value={terminalInput}
              onChange={(e) => setTerminalInput(e.target.value)}
              placeholder="Buyruq kiriting (masalan: python3 -V, ls -la, cat main.py, uptime)..."
              disabled={terminalRunning}
              className="flex-1 bg-transparent border-none text-white text-xs font-mono focus:outline-none"
            />
            <button
              type="submit"
              disabled={terminalRunning || !terminalInput.trim()}
              className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center gap-1 cursor-pointer disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Yuborish</span>
            </button>
          </form>
        </div>
      )}

      {/* TAB 4: FILE MANAGER & CODE EDITOR (Section 14) */}
      {activeTab === 'files' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 animate-in fade-in">
          {/* Hidden File Input */}
          <input
            type="file"
            ref={fileUploadInputRef}
            accept=".py,.txt,.json,.env,.sql,.md,.cfg,.ini"
            multiple
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                handleUploadFiles(e.target.files);
              }
            }}
          />

          {/* File Browser Sidebar */}
          <div className="lg:col-span-1 p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Fayllar Ro‘yxati
              </h3>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setIsCreatingFile(true)}
                  className="p-1.5 rounded-lg bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 transition-colors"
                  title="Yangi bo‘sh fayl yaratish"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => fileUploadInputRef.current?.click()}
                  disabled={isUploadingFile}
                  className="p-1.5 rounded-lg bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30 transition-colors disabled:opacity-50"
                  title="Python fayl yuklash (.py)"
                >
                  <Upload className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Create file modal inline */}
            {isCreatingFile && (
              <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
                <input
                  type="text"
                  value={newFileName}
                  onChange={(e) => setNewFileName(e.target.value)}
                  placeholder="fayl_nomi.py"
                  className="w-full px-2 py-1 bg-slate-900 border border-slate-800 rounded text-xs font-mono text-white"
                />
                <div className="flex gap-1">
                  <button
                    onClick={handleCreateFile}
                    className="flex-1 py-1 bg-blue-600 text-white rounded text-[11px] font-bold"
                  >
                    Yaratish
                  </button>
                  <button
                    onClick={() => setIsCreatingFile(false)}
                    className="px-2 py-1 bg-slate-800 text-slate-300 rounded text-[11px]"
                  >
                    Bekor
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-1">
              {files.map((f) => (
                <div
                  key={f.path}
                  onClick={() => loadFile(f.path)}
                  className={`flex items-center justify-between p-2 rounded-xl text-xs font-mono cursor-pointer transition-colors ${
                    selectedFile === f.path
                      ? 'bg-blue-600/20 border border-blue-500/40 text-blue-300'
                      : 'hover:bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <FileCode className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                    <span className="truncate">{f.name}</span>
                  </div>

                  {f.name !== 'main.py' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteFile(f.path);
                      }}
                      className="text-slate-600 hover:text-rose-400 p-1"
                      title="O‘chirish"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Python / File Upload Dropzone */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDraggingFile(true);
              }}
              onDragLeave={() => setIsDraggingFile(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDraggingFile(false);
                if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                  handleUploadFiles(e.dataTransfer.files);
                }
              }}
              onClick={() => fileUploadInputRef.current?.click()}
              className={`p-3.5 rounded-xl border-2 border-dashed text-center cursor-pointer transition-all ${
                isDraggingFile
                  ? 'border-emerald-500 bg-emerald-500/15 scale-[1.01]'
                  : 'border-slate-800 hover:border-emerald-500/50 bg-slate-950/40'
              }`}
            >
              <Upload className="w-4 h-4 text-emerald-400 mx-auto mb-1.5" />
              <p className="text-[11px] font-bold text-slate-200">
                {isUploadingFile ? 'Yuklanmoqda...' : 'Python fayl yuklash (.py)'}
              </p>
              <p className="text-[10px] text-slate-500 mt-0.5">
                Faylni bu yerga tashlang yoki bosing
              </p>
            </div>
          </div>

          {/* Code Editor */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDraggingFile(true);
            }}
            onDragLeave={() => setIsDraggingFile(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDraggingFile(false);
              if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                handleUploadFiles(e.dataTransfer.files);
              }
            }}
            className={`lg:col-span-3 rounded-2xl bg-slate-900/60 border overflow-hidden flex flex-col transition-all ${
              isDraggingFile ? 'border-emerald-500 ring-2 ring-emerald-500/20' : 'border-slate-800'
            }`}
          >
            <div className="p-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-white flex items-center gap-2">
                <FileCode className="w-4 h-4 text-cyan-400" />
                {selectedFile || 'Fayl tanlanmagan'}
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => fileUploadInputRef.current?.click()}
                  disabled={isUploadingFile}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50 transition-colors"
                  title="Yangi Python faylini yuklash"
                >
                  <Upload className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="hidden sm:inline">
                    {isUploadingFile ? 'Yuklanmoqda...' : 'Fayl yuklash'}
                  </span>
                </button>

                <button
                  onClick={handleSaveFile}
                  disabled={isSavingFile}
                  className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50 transition-colors"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{isSavingFile ? 'Saqlanmoqda...' : 'Saqlash'}</span>
                </button>

                <button
                  onClick={async () => {
                    await handleSaveFile();
                    handleAction('rebuild');
                  }}
                  className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1 cursor-pointer transition-colors"
                  title="Saqlash va qayta qurish"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Saqlash & Qayta ishga tushirish</span>
                </button>
              </div>
            </div>

            <div className="flex-1 p-4 bg-[#080B12]">
              <textarea
                value={fileContent}
                onChange={(e) => setFileContent(e.target.value)}
                rows={22}
                spellCheck={false}
                className="w-full h-full bg-transparent font-mono text-xs text-slate-200 resize-none focus:outline-none leading-relaxed selection:bg-blue-600"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: ENV VARIABLES */}
      {activeTab === 'env' && (
        <div className="max-w-2xl mx-auto p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-6 animate-in fade-in">
          <div>
            <h2 className="text-base font-bold text-white">Muhit O‘zgaruvchilari (ENV)</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Xavfsiz kalitlar va parametrlar to‘g‘ridan-to‘g‘ri Docker konteyneriga uzatiladi.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="text-xs font-bold text-slate-300">BOT_TOKEN (Xavfsiz shifrlangan):</div>
            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-emerald-400">
              {bot.tokenMasked || 'Kiritilmagan'}
            </div>
          </div>

          <div className="space-y-3">
            <div className="text-xs font-bold text-slate-300">Yangi O‘zgaruvchi Qo‘shish:</div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newEnvKey}
                onChange={(e) => setNewEnvKey(e.target.value)}
                placeholder="KALIT (masalan: API_KEY)"
                className="w-1/3 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-white"
              />
              <input
                type="text"
                value={newEnvVal}
                onChange={(e) => setNewEnvVal(e.target.value)}
                placeholder="QIYMAT"
                className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-white"
              />
              <button
                onClick={() => {
                  if (newEnvKey.trim()) {
                    setEnvList([...envList, { key: newEnvKey.trim(), value: newEnvVal.trim() }]);
                    setNewEnvKey('');
                    setNewEnvVal('');
                    toast.success('Muhit o‘zgaruvchisi saqlandi. Qayta ishga tushirish tavsiya etiladi.');
                  }
                }}
                className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold"
              >
                Qo‘shish
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: MONITORING & TELEMETRY (Section 17) */}
      {activeTab === 'monitoring' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
              <div className="text-xs text-slate-400 mb-1">CPU Ishlatilishi</div>
              <div className="text-2xl font-extrabold text-cyan-400 font-mono">
                {bot.metrics.cpuUsagePercent}%
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                Limit: {bot.resourceLimits.cpu} vCPU
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
              <div className="text-xs text-slate-400 mb-1">Operativ Xotira (RAM)</div>
              <div className="text-2xl font-extrabold text-indigo-400 font-mono">
                {bot.metrics.memoryUsageMb} MB
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                Limit: {bot.resourceLimits.ramMb} MB
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
              <div className="text-xs text-slate-400 mb-1">Disk Xotira</div>
              <div className="text-2xl font-extrabold text-purple-400 font-mono">
                {bot.metrics.diskUsageMb} MB
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                Limit: {bot.resourceLimits.diskMb} MB
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
              <div className="text-xs text-slate-400 mb-1">Tarmoq Trafigi</div>
              <div className="text-sm font-bold text-white font-mono mt-1">
                RX: {bot.metrics.networkRxKb} KB | TX: {bot.metrics.networkTxKb} KB
              </div>
              <div className="text-[11px] text-slate-500 mt-1">Telegram polling trafigi</div>
            </div>
          </div>

          {/* Live Graph Simulation */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
            <h3 className="text-sm font-bold text-white mb-4">
              Real Vaqt Resurslar Dinamikasi (CPU & RAM)
            </h3>
            <div className="h-44 flex items-end gap-2 pt-6 border-b border-slate-800">
              {(bot.metrics.history || []).map((pt, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    style={{ height: `${Math.max(10, pt.cpu * 30)}px` }}
                    className="w-full rounded-t bg-gradient-to-t from-blue-600 to-cyan-400 opacity-90"
                    title={`CPU: ${pt.cpu}%`}
                  />
                  <span className="text-[9px] text-slate-500 font-mono truncate w-full text-center">
                    {pt.time.slice(3)}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-4 mt-3 text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded bg-cyan-400" />
                <span>CPU Yuklamasi (%)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded bg-indigo-500" />
                <span>RAM (MB)</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 7: BOT SETTINGS (Section 30) */}
      {activeTab === 'settings' && (
        <div className="max-w-2xl mx-auto p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-6 animate-in fade-in">
          <div>
            <h2 className="text-base font-bold text-white">Bot Sozlamalari</h2>
            <p className="text-xs text-slate-400">
              Bot nomi, Python konfiguratsiyasi va avtomatik qayta ishga tushirish siyosati.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Bot Nomi:</label>
              <input
                type="text"
                value={bot.name}
                onChange={(e) => setBot({ ...bot, name: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Asosiy Fayl:
              </label>
              <input
                type="text"
                value={bot.mainFile}
                onChange={(e) => setBot({ ...bot, mainFile: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-mono"
              />
            </div>

            <div className="pt-2">
              <button
                onClick={async () => {
                  await api.updateBot(bot.id, {
                    name: bot.name,
                    mainFile: bot.mainFile
                  });
                  toast.success('Sozlamalar saqlandi!');
                }}
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold"
              >
                O‘zgarishlarni Saqlash
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
