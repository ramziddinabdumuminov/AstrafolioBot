import { useState, useEffect } from 'react';
import { Shield, Users, Server, HardDrive, Ban, CheckCircle2, RotateCw } from 'lucide-react';
import { User, BotItem, ServerNode } from '../types';
import { api } from '../services/api';
import { toast } from '../services/toast';

interface AdminPanelViewProps {
  currentUser: User | null;
  bots: BotItem[];
  servers: ServerNode[];
  onRefresh: () => void;
}

export default function AdminPanelView({ currentUser, bots, servers, onRefresh }: AdminPanelViewProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const data = await api.getAdminUsers();
      setUsers(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleBlock = async (targetUser: User) => {
    try {
      await api.toggleUserBlock(targetUser.id);
      toast.success(`${targetUser.username} holati yangilandi`);
      fetchUsers();
    } catch (e: any) {
      toast.error('Xatolik: ' + e.message);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="space-y-6 pb-12 animate-in fade-in">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
          <Shield className="w-6 h-6 text-purple-400" />
          SuperAdmin Boshqaruv Markazi
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          ASTRAFOLIO platformasi barcha foydalanuvchilari, serverlari va konteynerlarini global nazorat qilish
        </p>
      </div>

      {/* Overview stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div className="text-xs text-slate-400 mb-1 flex items-center gap-1.5">
            <Users className="w-4 h-4 text-blue-400" />
            Jami Foydalanuvchilar
          </div>
          <div className="text-2xl font-bold text-white font-mono">{users.length}</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div className="text-xs text-slate-400 mb-1 flex items-center gap-1.5">
            <Server className="w-4 h-4 text-emerald-400" />
            Jami Bot Konteynerlari
          </div>
          <div className="text-2xl font-bold text-white font-mono">{bots.length}</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div className="text-xs text-slate-400 mb-1 flex items-center gap-1.5">
            <HardDrive className="w-4 h-4 text-cyan-400" />
            Klaster Serverlari
          </div>
          <div className="text-2xl font-bold text-white font-mono">{servers.length}</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div className="text-xs text-slate-400 mb-1">Xavfsizlik Holati</div>
          <div className="text-sm font-bold text-emerald-400 font-mono mt-2 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" />
            HIMOYALANGAN
          </div>
        </div>
      </div>

      {/* Users table */}
      <div className="rounded-2xl bg-slate-900/60 border border-slate-800 overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Users className="w-4 h-4 text-blue-400" />
            Ro‘yxatdan O‘tgan Foydalanuvchilar
          </h2>
          <button
            onClick={fetchUsers}
            className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>Yangilash</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/60 border-b border-slate-800 text-slate-400 uppercase font-semibold">
              <tr>
                <th className="px-5 py-3">Foydalanuvchi</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Rol</th>
                <th className="px-4 py-3">Tarif</th>
                <th className="px-4 py-3">Holat</th>
                <th className="px-4 py-3">Amallar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-800/30">
                  <td className="px-5 py-3.5 font-bold text-white">{u.fullName || u.name || u.username}</td>
                  <td className="px-4 py-3.5 text-slate-400 font-mono">{u.email}</td>
                  <td className="px-4 py-3.5">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        u.role?.toLowerCase() === 'admin'
                          ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-blue-400 font-bold">{u.plan}</td>
                  <td className="px-4 py-3.5">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        u.status === 'active' || u.status === 'ACTIVE'
                          ? 'bg-emerald-500/15 text-emerald-400'
                          : 'bg-rose-500/15 text-rose-400'
                      }`}
                    >
                      {u.status}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    {u.id !== currentUser?.id && (
                      <button
                        onClick={() => handleToggleBlock(u)}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                          u.status === 'active' || u.status === 'ACTIVE'
                            ? 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30'
                            : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        }`}
                      >
                        {u.status === 'active' || u.status === 'ACTIVE' ? 'Bloklash' : 'Faollashtirish'}
                      </button>
                    )}
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
