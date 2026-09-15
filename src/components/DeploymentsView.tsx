import { useState } from 'react';
import { Rocket, CheckCircle2, AlertCircle, RotateCw, Clock, Terminal, ChevronDown } from 'lucide-react';
import { DeploymentRecord } from '../types';

interface DeploymentsViewProps {
  deployments: DeploymentRecord[];
  onSelectBot?: (botId: string) => void;
}

export default function DeploymentsView({ deployments, onSelectBot }: DeploymentsViewProps) {
  const [expandedId, setExpandedId] = useState<string | null>(deployments[0]?.id || null);

  return (
    <div className="space-y-6 pb-12 animate-in fade-in">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
          <Rocket className="w-6 h-6 text-indigo-400" />
          Joylashtirishlar Tarixi (Deployments)
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Barcha Docker build jarayonlari, kutubxona o‘rnatishlari va xatoliklar jurnali
        </p>
      </div>

      <div className="space-y-3">
        {deployments.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-slate-900/60 border border-slate-800 text-slate-400 text-xs">
            Hali hech qanday joylashtirish amalga oshirilmadi.
          </div>
        ) : (
          deployments.map((dep) => {
            const isExpanded = expandedId === dep.id;
            return (
              <div
                key={dep.id}
                className="rounded-2xl bg-slate-900/60 border border-slate-800 overflow-hidden"
              >
                <div
                  onClick={() => setExpandedId(isExpanded ? null : dep.id)}
                  className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 cursor-pointer hover:bg-slate-800/40 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        dep.status === 'SUCCESS'
                          ? 'bg-emerald-400 shadow-sm shadow-emerald-400/50'
                          : dep.status === 'BUILDING'
                          ? 'bg-cyan-400 animate-ping'
                          : 'bg-rose-400'
                      }`}
                    />
                    <div>
                      <div className="font-bold text-sm text-white flex items-center gap-2">
                        <span>{dep.botName}</span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            dep.status === 'SUCCESS'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                              : dep.status === 'BUILDING'
                              ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                              : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                          }`}
                        >
                          {dep.status}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                        {dep.commitOrSource}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-slate-400">
                    <span className="flex items-center gap-1 font-mono">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      {dep.durationSeconds > 0 ? `${dep.durationSeconds}s` : 'Jarayonda...'}
                    </span>
                    <span className="font-mono">
                      {new Date(dep.startedAt).toLocaleString('uz-UZ')}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180 text-blue-400' : ''}`}
                    />
                  </div>
                </div>

                {isExpanded && (
                  <div className="p-4 bg-slate-950 border-t border-slate-800 font-mono text-xs text-slate-300 space-y-1">
                    <div className="text-slate-500 mb-2 font-sans font-semibold text-[11px]">
                      DOCKER BUILD & DEPLOY TERMINAL LOGS:
                    </div>
                    {dep.logs.map((line, i) => (
                      <div key={i} className="text-slate-300 leading-relaxed">
                        {line}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
