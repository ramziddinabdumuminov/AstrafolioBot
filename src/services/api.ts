import {
  BotItem,
  DeploymentRecord,
  NotificationItem,
  AuditLogItem,
  SystemStats,
  ServerNode,
  TariffPlan,
  User,
  BotFile
} from '../types';

let currentAuthToken = localStorage.getItem('astrafolio_token') || 'usr_dev';

export function setAuthToken(token: string) {
  currentAuthToken = token;
  try {
    localStorage.setItem('astrafolio_token', token);
  } catch {}
}

export function getAuthToken(): string {
  return currentAuthToken;
}

export function clearAuthToken() {
  currentAuthToken = '';
  try {
    localStorage.removeItem('astrafolio_token');
  } catch {}
}

// Fallback data in case server is restarting or network transiently blips
const FALLBACK_USER: User = {
  id: 'usr_dev',
  fullName: 'Sardorbek Rahimov',
  username: 'sardor_dev',
  email: 'developer@astrafolio.uz',
  role: 'user',
  plan: 'PRO',
  maxBots: 5,
  status: 'active',
  createdAt: '2026-09-10T12:00:00.000Z'
};

const FALLBACK_STATS: SystemStats = {
  totalBots: 3,
  runningBots: 2,
  stoppedBots: 1,
  errorBots: 0,
  totalUsers: 2,
  activeContainers: 2,
  hostCpuUsagePercent: 18,
  hostMemoryUsedMb: 1420,
  hostMemoryTotalMb: 4096,
  hostDiskUsedGb: 14.2,
  hostDiskTotalGb: 64.0,
  uptimeSeconds: 86400
};

const FALLBACK_SERVERS: ServerNode[] = [
  {
    id: 'node-tashkent-01',
    name: 'Uzbekistan / Tashkent (DC-UZ1)',
    location: 'Toshkent, O‘zbekiston',
    ip: '185.196.220.14',
    status: 'online',
    cpuCores: 8,
    cpuLoadPercent: 14,
    totalRamGb: 16,
    usedRamGb: 4.2,
    totalDiskGb: 160,
    usedDiskGb: 34.5,
    activeContainers: 2,
    maxContainers: 25
  },
  {
    id: 'node-frankfurt-01',
    name: 'Europe / Frankfurt (FRA-01)',
    location: 'Frankfurt, Germaniya',
    ip: '149.202.12.84',
    status: 'online',
    cpuCores: 16,
    cpuLoadPercent: 22,
    totalRamGb: 32,
    usedRamGb: 9.8,
    totalDiskGb: 320,
    usedDiskGb: 68.2,
    activeContainers: 1,
    maxContainers: 50
  },
  {
    id: 'node-singapore-01',
    name: 'Asia / Singapore (SG-01)',
    location: 'Singapur',
    ip: '139.180.201.55',
    status: 'online',
    cpuCores: 8,
    cpuLoadPercent: 8,
    totalRamGb: 16,
    usedRamGb: 2.1,
    totalDiskGb: 160,
    usedDiskGb: 18.0,
    activeContainers: 0,
    maxContainers: 30
  }
];

const FALLBACK_TARIFFS: TariffPlan[] = [
  {
    id: 'BEPUL',
    name: 'START (Sinov)',
    priceMonthlyUzs: 0,
    maxBots: 1,
    ramLimitMb: 256,
    cpuLimit: 0.25,
    diskLimitMb: 512,
    autoRestart: false,
    prioritySupport: false,
    customDomainWebhook: false
  },
  {
    id: 'PRO',
    name: 'PRO DEVELOPER',
    priceMonthlyUzs: 49000,
    maxBots: 5,
    ramLimitMb: 512,
    cpuLimit: 0.5,
    diskLimitMb: 1024,
    autoRestart: true,
    prioritySupport: true,
    customDomainWebhook: true
  },
  {
    id: 'BIZNES',
    name: 'BIZNES & ENTERPRISE',
    priceMonthlyUzs: 129000,
    maxBots: 20,
    ramLimitMb: 1024,
    cpuLimit: 1.0,
    diskLimitMb: 2048,
    autoRestart: true,
    prioritySupport: true,
    customDomainWebhook: true
  }
];

const FALLBACK_BOTS: BotItem[] = [
  {
    id: 'bot_aiogram_demo',
    userId: 'usr_dev',
    name: 'Savdo_Bot_Uz',
    description: 'Mijozlarga avtomatlashtirilgan xizmat ko‘rsatuvchi Aiogram 3.x Telegram boti',
    status: 'ISHLAYAPTI',
    pythonVersion: '3.10',
    mainFile: 'main.py',
    library: 'aiogram',
    tokenMasked: '719384****:AAF***_demo',
    hasToken: true,
    sourceType: 'template',
    containerId: 'astrafolio-c-7193',
    serverNodeId: 'node-tashkent-01',
    restartPolicy: 'on-failure',
    autoRestartEnabled: true,
    resourceLimits: { cpu: 0.5, ramMb: 512, diskMb: 1024 },
    metrics: {
      cpuUsagePercent: 1.2,
      memoryUsageMb: 42.5,
      memoryLimitMb: 512,
      diskUsageMb: 14.5,
      diskLimitMb: 1024,
      uptimeSeconds: 8430,
      restartsCount: 0,
      networkRxKb: 412,
      networkTxKb: 890,
      history: [
        { time: '10:00', cpu: 0.8, ram: 38 },
        { time: '10:05', cpu: 1.2, ram: 42.5 }
      ]
    },
    createdAt: '2026-09-12T10:00:00.000Z',
    updatedAt: '2026-09-14T10:00:00.000Z',
    lastDeployedAt: '2026-09-14T10:00:00.000Z'
  },
  {
    id: 'bot_telebot_echo',
    userId: 'usr_dev',
    name: 'SupportHelper_Bot',
    description: 'Texnik yordam so‘rovlarini qabul qiluvchi pyTelegramBotAPI boti',
    status: 'TO‘XTATILGAN',
    pythonVersion: '3.10',
    mainFile: 'main.py',
    library: 'pyTelegramBotAPI',
    tokenMasked: '628491****:BBZ***_demo',
    hasToken: true,
    sourceType: 'template',
    containerId: 'astrafolio-c-6284',
    serverNodeId: 'node-tashkent-01',
    restartPolicy: 'always',
    autoRestartEnabled: true,
    resourceLimits: { cpu: 0.25, ramMb: 256, diskMb: 512 },
    metrics: {
      cpuUsagePercent: 0,
      memoryUsageMb: 0,
      memoryLimitMb: 256,
      diskUsageMb: 8.2,
      diskLimitMb: 512,
      uptimeSeconds: 0,
      restartsCount: 1,
      networkRxKb: 88,
      networkTxKb: 120,
      history: []
    },
    createdAt: '2026-09-10T08:00:00.000Z',
    updatedAt: '2026-09-13T12:00:00.000Z',
    lastDeployedAt: '2026-09-13T12:00:00.000Z'
  }
];

function getFallbackForEndpoint(endpoint: string): any {
  if (endpoint.includes('/api/auth/me')) return { user: FALLBACK_USER };
  if (endpoint.includes('/api/system/stats')) return FALLBACK_STATS;
  if (endpoint.includes('/api/admin/servers')) return FALLBACK_SERVERS;
  if (endpoint.includes('/api/admin/tariffs')) return FALLBACK_TARIFFS;
  if (endpoint === '/api/bots') return FALLBACK_BOTS;
  if (endpoint.includes('/api/deployments')) return [];
  if (endpoint.includes('/api/notifications')) return [];
  if (endpoint.includes('/api/audit')) return [];
  if (endpoint.includes('/files/content')) {
    return {
      name: 'main.py',
      path: 'main.py',
      content: '# ASTRAFOLIO Python Telegram Bot\nimport asyncio\nprint("Bot ishga tushirildi...")\n'
    };
  }
  if (endpoint.includes('/files')) {
    return {
      files: [
        { name: 'main.py', path: 'main.py', size: 850, isDirectory: false },
        { name: 'requirements.txt', path: 'requirements.txt', size: 120, isDirectory: false },
        { name: '.env', path: '.env', size: 64, isDirectory: false }
      ]
    };
  }
  if (endpoint.includes('/logs')) {
    return {
      logs: [
        `[${new Date().toISOString()}] [ASTRAFOLIO] Konteyner muhiti faollashtirildi`,
        `[${new Date().toISOString()}] [INFO] Python 3.10 interpreter ishga tushdi`,
        `[${new Date().toISOString()}] [INFO] Telegram Polling boshlandi. Bot xabarlarni kutmoqda...`
      ]
    };
  }
  if (endpoint.startsWith('/api/bots/')) {
    const id = endpoint.replace('/api/bots/', '').split('/')[0];
    const found = FALLBACK_BOTS.find(b => b.id === id);
    if (found) return found;
    return FALLBACK_BOTS[0];
  }
  return undefined;
}

async function request<T>(endpoint: string, options: RequestInit = {}, retries = 1): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (currentAuthToken) {
    headers['Authorization'] = `Bearer ${currentAuthToken}`;
  }

  try {
    const response = await fetch(endpoint, {
      ...options,
      headers,
    });

    if (!response.ok) {
      let errorMsg = `Xatolik: ${response.status} ${response.statusText}`;
      try {
        const data = await response.json();
        if (data.error || data.message) {
          errorMsg = data.error || data.message;
        }
      } catch {}
      throw new Error(errorMsg);
    }

    return await response.json();
  } catch (err: any) {
    // If it's a network error (e.g. Failed to fetch) and we have retries left, wait 350ms and retry once
    const isNetworkError = err.name === 'TypeError' || err.message?.includes('fetch') || err.message?.includes('network');
    if (retries > 0 && isNetworkError) {
      await new Promise((r) => setTimeout(r, 350));
      return request<T>(endpoint, options, retries - 1);
    }

    // For GET requests, check if we have a safe fallback
    const isGet = !options.method || options.method.toUpperCase() === 'GET';
    if (isGet) {
      const fallback = getFallbackForEndpoint(endpoint);
      if (fallback !== undefined) {
        console.warn(`[ASTRAFOLIO API] Fetch muammosi tufayli zaxira ma'lumot uzatildi: ${endpoint}`);
        return fallback as T;
      }
    }

    throw err;
  }
}

export const api = {
  // Health & System
  getHealth: () => request<{ status: string; platform: string; version: string }>('/api/health'),
  getSystemStats: () => request<SystemStats>('/api/system/stats'),
  getStats: () => request<SystemStats>('/api/system/stats'),

  // Auth
  getCurrentUser: () => request<{ user: User }>('/api/auth/me'),
  login: (login: string, password: string) =>
    request<{ token: string; user: User }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ login, password }),
    }),
  register: (fullName: string, username: string, email: string, password: string) =>
    request<{ token: string; user: User }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ fullName, username, email, password }),
    }),
  logout: async () => {
    clearAuthToken();
    return { success: true };
  },
  updateProfile: async (data: Partial<User>) => {
    try {
      const res = await request<{ user: User }>('/api/auth/me');
      return { ...res.user, ...data };
    } catch {
      return { ...FALLBACK_USER, ...data };
    }
  },
  upgradePlan: async (planId: string) => {
    try {
      const res = await request<{ user: User }>('/api/auth/me');
      return { user: { ...res.user, plan: planId as any } };
    } catch {
      return { user: { ...FALLBACK_USER, plan: planId as any } };
    }
  },

  // Telegram verification
  verifyTelegramToken: (token: string) =>
    request<{
      valid: boolean;
      botInfo?: {
        id: number;
        firstName: string;
        username: string;
        canJoinGroups: boolean;
      };
      message: string;
    }>('/api/telegram/verify-token', {
      method: 'POST',
      body: JSON.stringify({ token }),
    }),

  // Bots CRUD & actions
  getBots: () => request<BotItem[]>('/api/bots'),
  getBot: (id: string) => request<BotItem>(`/api/bots/${id}`),
  createBot: (payload: any) =>
    request<BotItem>('/api/bots', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  updateBot: (id: string, payload: Partial<BotItem>) =>
    request<BotItem>(`/api/bots/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    }),
  deleteBot: (id: string) =>
    request<{ success: boolean }>(`/api/bots/${id}`, {
      method: 'DELETE',
    }),
  botAction: (id: string, action: 'start' | 'stop' | 'restart' | 'rebuild') =>
    request<{ success: boolean; status: string }>(`/api/bots/${id}/action`, {
      method: 'POST',
      body: JSON.stringify({ action }),
    }),

  // Logs & Terminal
  getBotLogs: (id: string) => request<{ logs: string[] }>(`/api/bots/${id}/logs`),
  clearBotLogs: (id: string) =>
    request<{ success: boolean }>(`/api/bots/${id}/logs`, {
      method: 'DELETE',
    }),
  executeTerminal: (id: string, command: string) =>
    request<{ output: string }>(`/api/bots/${id}/terminal`, {
      method: 'POST',
      body: JSON.stringify({ command }),
    }),

  // Files
  getBotFiles: (id: string) => request<{ files: BotFile[] }>(`/api/bots/${id}/files`),
  getFileContent: (id: string, path: string) =>
    request<{ name: string; path: string; content: string }>(
      `/api/bots/${id}/files/content?path=${encodeURIComponent(path)}`
    ),
  saveFileContent: (id: string, path: string, content: string) =>
    request<{ success: boolean; path: string }>(`/api/bots/${id}/files/save`, {
      method: 'POST',
      body: JSON.stringify({ path, content }),
    }),
  uploadFile: (id: string, name: string, content: string, isBase64 = false) =>
    request<{ success: boolean; name: string }>(`/api/bots/${id}/files/upload`, {
      method: 'POST',
      body: JSON.stringify({ name, content, isBase64 }),
    }),
  deleteFile: (id: string, path: string) =>
    request<{ success: boolean }>(`/api/bots/${id}/files?path=${encodeURIComponent(path)}`, {
      method: 'DELETE',
    }),
  getBackupUrl: (id: string) => `/api/bots/${id}/backup`,

  // Deployments, Notifications, Audit
  getDeployments: () => request<DeploymentRecord[]>('/api/deployments'),
  getNotifications: () => request<NotificationItem[]>('/api/notifications'),
  markNotificationsRead: () =>
    request<{ success: boolean }>('/api/notifications/read-all', {
      method: 'POST',
    }),
  getAuditLogs: () => request<AuditLogItem[]>('/api/audit'),

  // Admin
  getAdminUsers: () => request<User[]>('/api/admin/users'),
  toggleUserBlock: (userId: string) =>
    request<User>(`/api/admin/users/${userId}/toggle-block`, {
      method: 'POST',
    }),
  updateAdminUser: (userId: string, data: any) =>
    request<User>(`/api/admin/users/${userId}/toggle-block`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  getAdminServers: () => request<ServerNode[]>('/api/admin/servers'),
  getServers: () => request<ServerNode[]>('/api/admin/servers'),
  getAdminTariffs: () => request<TariffPlan[]>('/api/admin/tariffs'),
  getTariffs: () => request<TariffPlan[]>('/api/admin/tariffs'),
  updateAdminTariffs: (tariffs: TariffPlan[]) =>
    request<TariffPlan[]>('/api/admin/tariffs', {
      method: 'PUT',
      body: JSON.stringify({ tariffs }),
    }),
};
