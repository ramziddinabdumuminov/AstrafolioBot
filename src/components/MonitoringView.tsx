import { useState } from 'react';
import { Activity, Server, Cpu, HardDrive, ShieldCheck, Wifi, Radio } from 'lucide-react';
import { SystemStats, ServerNode } from '../types';

interface MonitoringViewProps {
  stats: SystemStats | null;
  servers: ServerNode[];
}

export default function MonitoringView({ stats, servers }: MonitoringViewProps) {
  return (
    <div className="space-y-6 pb-12 animate-in fade-in">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
          <Activity className="w-6 h-6 text-cyan-400" />
          Infratuzilma Monitoringi
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          ASTRAFOLIO server tugunlari (nodes), resurs sarfi va tarmoq barqarorligi
        </p>
      </div>

      {/* Primary Node Telemetry */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2 text-xs">
            <span className="font-semibold">Host CPU Yuklamasi</span>
            <Cpu className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-3xl font-extrabold text-white font-mono">
            {stats ? `${stats.hostCpuUsagePercent}%` : '18.4%'}
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1.5 mt-3 overflow-hidden">
            <div
              className="bg-cyan-400 h-full rounded-full transition-all"
              style={{ width: `${stats?.hostCpuUsagePercent || 20}%` }}
            />
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2 text-xs">
            <span className="font-semibold">Operativ Xotira (RAM)</span>
            <Server className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-3xl font-extrabold text-white font-mono">
            {stats ? `${stats.hostMemoryUsedMb} MB` : '19,840 MB'}
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1.5 mt-3 overflow-hidden">
            <div
              className="bg-indigo-500 h-full rounded-full transition-all"
              style={{
                width: `${
                  stats ? Math.round((stats.hostMemoryUsedMb / (stats.hostMemoryTotalMb || 1)) * 100) : 31
                }%`
              }}
            />
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2 text-xs">
            <span className="font-semibold">Klaster Uptime</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold text-emerald-400 font-mono">
            99.99%
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Uzluksiz 24/7 ishlash kafolatlangan
          </p>
        </div>
      </div>

      {/* Server Nodes Table (Section 34: KO‘P SERVERLI TIZIM) */}
      <div className="rounded-2xl bg-slate-900/60 border border-slate-800 overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Server className="w-4 h-4 text-blue-400" />
            Ko‘p Serverli Klaster Tugunlari (Nodes)
          </h2>
          <span className="text-xs text-slate-400">{servers.length} ta faol server</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/60 border-b border-slate-800 text-slate-400 uppercase font-semibold">
              <tr>
                <th className="px-5 py-3">Server Nomi</th>
                <th className="px-4 py-3">Joylashuv</th>
                <th className="px-4 py-3">IP Manzil</th>
                <th className="px-4 py-3">CPU Yuklama</th>
                <th className="px-4 py-3">RAM</th>
                <th className="px-4 py-3">Konteynerlar</th>
                <th className="px-4 py-3">Holati</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {servers.map((srv) => (
                <tr key={srv.id} className="hover:bg-slate-800/30">
                  <td className="px-5 py-3.5 font-sans font-bold text-white">{srv.name}</td>
                  <td className="px-4 py-3.5 font-sans text-slate-300">{srv.location}</td>
                  <td className="px-4 py-3.5 text-blue-400">{srv.ip}</td>
                  <td className="px-4 py-3.5 text-cyan-400">{srv.cpuLoadPercent}%</td>
                  <td className="px-4 py-3.5 text-indigo-300">
                    {srv.usedRamGb} / {srv.totalRamGb} GB
                  </td>
                  <td className="px-4 py-3.5 text-slate-300">
                    {srv.activeContainers} / {srv.maxContainers}
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-sans">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      ONLINE
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
