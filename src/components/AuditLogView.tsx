import { useState } from 'react';
import { ShieldCheck, Search, Filter, Clock, User, Download } from 'lucide-react';
import { AuditLog } from '../types';

interface AuditLogViewProps {
  logs: AuditLog[];
}

export default function AuditLogView({ logs }: AuditLogViewProps) {
  const [search, setSearch] = useState('');

  const filtered = logs.filter(
    (l) =>
      l.action.toLowerCase().includes(search.toLowerCase()) ||
      l.details.toLowerCase().includes(search.toLowerCase()) ||
      l.userName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12 animate-in fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <ShieldCheck className="w-6 h-6 text-emerald-400" />
            Audit va Xavfsizlik Jurnali
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Tizimdagi barcha muhim harakatlar, kirishlar va buyruqlar qaydnomasi
          </p>
        </div>

        <button
          onClick={() => {
            const csv = ['ID,Foydalanuvchi,Harakat,Tafsilot,IP,Sana', ...filtered.map((l) => `${l.id},${l.userName},${l.action},"${l.details}",${l.ipAddress},${l.timestamp}`)].join('\n');
            const blob = new Blob([csv], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `astrafolio_audit_${Date.now()}.csv`;
            a.click();
          }}
          className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-2"
        >
          <Download className="w-3.5 h-3.5" />
          <span>CSV Export</span>
        </button>
      </div>

      <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-2xl">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Audit jurnali bo‘yicha qidirish..."
            className="w-full pl-9 pr-4 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      <div className="rounded-2xl bg-slate-900/60 border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/60 border-b border-slate-800 text-slate-400 uppercase font-semibold">
              <tr>
                <th className="px-5 py-3">Harakat</th>
                <th className="px-4 py-3">Foydalanuvchi</th>
                <th className="px-4 py-3">Tafsilot</th>
                <th className="px-4 py-3">IP Manzil</th>
                <th className="px-4 py-3">Vaqt</th>
                <th className="px-4 py-3">Holat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-slate-800/30">
                  <td className="px-5 py-3.5 font-bold text-white font-mono">{item.action}</td>
                  <td className="px-4 py-3.5 text-slate-300 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-slate-500" />
                    <span>{item.userName}</span>
                  </td>
                  <td className="px-4 py-3.5 text-slate-400 max-w-md truncate">{item.details}</td>
                  <td className="px-4 py-3.5 font-mono text-blue-400">{item.ipAddress}</td>
                  <td className="px-4 py-3.5 text-slate-400 font-mono">
                    {new Date(item.timestamp).toLocaleString('uz-UZ')}
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-mono">
                      {item.status}
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
