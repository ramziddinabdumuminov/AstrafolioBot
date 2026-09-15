export type BotStatus =
  | 'ISHLAYAPTI'
  | 'TO‘XTATILGAN'
  | 'ISHGA TUSHMOQDA'
  | 'TO‘XTATILMOQDA'
  | 'QURILMOQDA'
  | 'XATOLIK'
  | 'ISHDAN CHIQDI';

export type PythonVersion = '3.10' | '3.11' | '3.12' | '3.13';

export type RestartPolicy = 'always' | 'on-failure' | 'never';

export interface EnvVariable {
  key: string;
  value: string;
  isSecret?: boolean;
}

export interface BotResourceLimits {
  cpu: number; // e.g. 0.25 cores
  ramMb: number; // e.g. 256 MB
  diskMb: number; // e.g. 512 MB
}

export interface BotFile {
  name: string;
  path: string;
  size: number;
  isDirectory: boolean;
  updatedAt: string;
  content?: string;
}

export interface BotMetrics {
  cpuUsagePercent: number;
  memoryUsageMb: number;
  memoryLimitMb: number;
  diskUsageMb: number;
  diskLimitMb: number;
  uptimeSeconds: number;
  restartsCount: number;
  networkRxKb: number;
  networkTxKb: number;
  history: Array<{
    time: string;
    cpu: number;
    ram: number;
  }>;
}

export interface BotItem {
  id: string;
  userId: string;
  name: string;
  description: string;
  status: BotStatus;
  pythonVersion: PythonVersion;
  mainFile: string;
  library: 'aiogram' | 'python-telegram-bot' | 'pyTelegramBotAPI' | 'Telethon' | 'custom';
  tokenMasked: string;
  hasToken: boolean;
  sourceType: 'python_file' | 'zip' | 'github' | 'template';
  githubRepo?: string;
  containerId: string;
  serverNodeId: string;
  restartPolicy: RestartPolicy;
  autoRestartEnabled: boolean;
  resourceLimits: BotResourceLimits;
  metrics: BotMetrics;
  createdAt: string;
  updatedAt: string;
  lastDeployedAt: string;
}

export interface DeploymentRecord {
  id: string;
  botId: string;
  botName: string;
  status: 'SUCCESS' | 'FAILED' | 'BUILDING';
  commitOrSource: string;
  startedAt: string;
  finishedAt: string;
  durationSeconds: number;
  logs: string[];
}

export interface User {
  id: string;
  fullName: string;
  name?: string;
  username: string;
  email: string;
  role: 'user' | 'admin' | 'ADMIN' | 'USER';
  plan: 'BEPUL' | 'PRO' | 'BIZNES';
  maxBots: number;
  status: 'active' | 'blocked' | 'ACTIVE' | 'BLOCKED';
  createdAt: string;
}

export interface ServerNode {
  id: string;
  name: string;
  location: string;
  ip: string;
  status: 'online' | 'warning' | 'offline';
  cpuCores: number;
  cpuLoadPercent: number;
  totalRamGb: number;
  usedRamGb: number;
  totalDiskGb: number;
  usedDiskGb: number;
  activeContainers: number;
  maxContainers: number;
}

export interface NotificationItem {
  id: string;
  userId: string;
  botId?: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';
  isRead: boolean;
  read?: boolean;
  createdAt: string;
  timestamp?: string;
}

export interface AuditLogItem {
  id: string;
  userId: string;
  userName: string;
  action: string;
  details: string;
  ipAddress: string;
  status: 'SUCCESS' | 'DENIED' | 'FAILED';
  createdAt: string;
  timestamp?: string;
}

export type AuditLog = AuditLogItem;

export interface SystemStats {
  totalBots: number;
  runningBots: number;
  stoppedBots: number;
  errorBots: number;
  totalUsers: number;
  activeContainers: number;
  hostCpuUsagePercent: number;
  hostMemoryUsedMb: number;
  hostMemoryTotalMb: number;
  hostDiskUsedGb: number;
  hostDiskTotalGb: number;
  uptimeSeconds: number;
}

export interface TariffPlan {
  id: 'BEPUL' | 'PRO' | 'BIZNES';
  name: string;
  priceMonthlyUzs: number;
  maxBots: number;
  cpuLimit: number;
  ramLimitMb: number;
  diskLimitMb: number;
  autoRestart: boolean;
  prioritySupport: boolean;
  customDomainWebhook: boolean;
}
