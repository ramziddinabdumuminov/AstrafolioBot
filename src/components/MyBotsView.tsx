import { useState } from 'react';
import {
  Server,
  PlusCircle,
  Search,
  Filter,
  Play,
  Square,
  RotateCw,
  ChevronRight,
  ExternalLink,
  Cpu,
  Layers,
  FileCode
} from 'lucide-react';
import { BotItem, BotStatus } from '../types';

interface MyBotsViewProps {
  bots: BotItem[];
  onSelectBot: (botId: string) => void;
  onNewBot: (initialSource?: 'python_file' | 'template' | 'zip' | 'github') => void;
  onBotAction: (botId: string, action: 'start' | 'stop' | 'restart' | 'rebuild') => void;
}

export default function MyBotsView({
  bots,
  onSelectBot,
  onNewBot,
  onBotAction,
}: MyBotsViewProps) {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredBots = bots.filter((b) => {
    if (search && !b.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterStatus !== 'all' && b.status !== filterStatus) return false;
    return true;
  });

  return (
    <div className="space-y-6 pb-12 animate-in fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <Server className="w-6 h-6 text-blue-400" />
            Mening Telegram Botlarim
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Barcha Python Telegram botlaringiz, konteynerlar va ularning faoliyati
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => onNewBot('python_file')}
            className="px-3.5 py-2.5 rounded-xl bg-emerald-600/15 border border-emerald-500/30 hover:bg-emerald-600/25 text-emerald-400 font-bold text-xs flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer"
            title="Kompyuteringizdan .py fayl yuklab bot yaratish"
          >
            <FileCode className="w-4 h-4 text-emerald-400" />
            <span>Python fayl yuklash</span>
          </button>

          <button
            onClick={() => onNewBot('template')}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 active:scale-95 transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Yangi Bot Yaratish</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-slate-900/60 p-3 rounded-2xl border border-slate-800">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Bot nomi bo‘yicha qidirish..."
            className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto">
          {['all', 'ISHLAYAPTI', 'TO‘XTATILGAN', 'XATOLIK'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors ${
                filterStatus === st
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {st === 'all' ? 'Barchasi' : st}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Bots */}
      {filteredBots.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-slate-800/80">
          <p className="text-xs text-slate-400">Hech qanday bot topilmadi.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredBots.map((bot) => {
            const isRunning = bot.status === 'ISHLAYAPTI';
            return (
              <div
                key={bot.id}
                onClick={() => onSelectBot(bot.id)}
                className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800/80 hover:border-blue-500/40 transition-all group cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-xl bg-blue-600/15 border border-blue-500/20 flex items-center justify-center text-blue-400 font-bold text-base flex-shrink-0">
                        🤖
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">
                          {bot.name}
                        </h3>
                        <span className="text-[10px] font-mono text-slate-500">
                          ID: {bot.containerId}
                        </span>
                      </div>
                    </div>

                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        isRunning
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                          : 'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}
                    >
                      {bot.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-4">
                    {bot.description || 'Tavsif berilmagan'}
                  </p>

                  <div className="grid grid-cols-3 gap-2 py-2 border-y border-slate-800/60 text-[11px] font-mono text-slate-400">
                    <div>
                      <span className="block text-slate-600 text-[9px] uppercase">Python</span>
                      <span className="text-slate-300 font-bold">{bot.pythonVersion}</span>
                    </div>
                    <div>
                      <span className="block text-slate-600 text-[9px] uppercase">CPU</span>
                      <span className="text-cyan-400 font-bold">
                        {isRunning ? `${bot.metrics.cpuUsagePercent}%` : '0%'}
                      </span>
                    </div>
                    <div>
                      <span className="block text-slate-600 text-[9px] uppercase">RAM</span>
                      <span className="text-indigo-400 font-bold">
                        {isRunning ? `${bot.metrics.memoryUsageMb} MB` : '0 MB'}
                      </span>
                    </div>
                  </div>
                </div>

                <div
                  className="mt-4 pt-2 flex items-center justify-between"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center gap-1.5">
                    {isRunning ? (
                      <button
                        onClick={() => onBotAction(bot.id, 'stop')}
                        className="p-2 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs"
                        title="To‘xtatish"
                      >
                        <Square className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <button
                        onClick={() => onBotAction(bot.id, 'start')}
                        className="p-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs"
                        title="Ishga tushirish"
                      >
                        <Play className="w-3.5 h-3.5" />
                      </button>
                    )}

                    <button
                      onClick={() => onBotAction(bot.id, 'restart')}
                      className="p-2 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 text-xs"
                      title="Qayta ishga tushirish"
                    >
                      <RotateCw className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    onClick={() => onSelectBot(bot.id)}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1"
                  >
                    <span>Boshqaruv</span>
                    <ChevronRight className="w-3 h-3 text-slate-400" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
