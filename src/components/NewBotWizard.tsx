import { useState, useRef } from 'react';
import {
  Server,
  Upload,
  Github,
  FileCode,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Terminal,
  Shield,
  Zap,
  RotateCw,
  Cpu,
  Layers,
  Sparkles,
  Check,
  Eye,
  EyeOff,
  Code
} from 'lucide-react';
import { BotItem, PythonVersion, RestartPolicy } from '../types';
import { BOT_TEMPLATES, BotTemplate } from '../services/templates';
import { api } from '../services/api';
import { toast } from '../services/toast';

interface NewBotWizardProps {
  onSuccess: (bot: BotItem) => void;
  onCancel: () => void;
  initialSourceType?: 'python_file' | 'template' | 'zip' | 'github';
}

export default function NewBotWizard({ onSuccess, onCancel, initialSourceType = 'template' }: NewBotWizardProps) {
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [library, setLibrary] = useState<'aiogram' | 'python-telegram-bot' | 'pyTelegramBotAPI' | 'Telethon' | 'custom'>('aiogram');
  const [sourceType, setSourceType] = useState<'python_file' | 'template' | 'zip' | 'github'>(initialSourceType);
  const [selectedTemplate, setSelectedTemplate] = useState<BotTemplate>(BOT_TEMPLATES[0]);
  const [githubUrl, setGithubUrl] = useState('');
  const [uploadedZipName, setUploadedZipName] = useState<string | null>(null);
  const [uploadedZipBase64, setUploadedZipBase64] = useState<string | null>(null);

  // Python File Upload State
  const [uploadedPyFiles, setUploadedPyFiles] = useState<Array<{ name: string; content: string; size: number }>>([]);
  const [uploadedPyFileName, setUploadedPyFileName] = useState<string | null>(null);
  const [uploadedPyContent, setUploadedPyContent] = useState<string>('');
  const [isDraggingPy, setIsDraggingPy] = useState(false);
  const pyFileInputRef = useRef<HTMLInputElement>(null);

  const [pythonVersion, setPythonVersion] = useState<PythonVersion>('3.10');
  const [mainFile, setMainFile] = useState('main.py');
  const [requirementsContent, setRequirementsContent] = useState('aiogram>=3.4.0\npython-dotenv>=1.0.0');

  // Token & Env State
  const [token, setToken] = useState('');
  const [showToken, setShowToken] = useState(false);
  const [tokenVerifying, setTokenVerifying] = useState(false);
  const [tokenStatus, setTokenStatus] = useState<{
    tested: boolean;
    valid: boolean;
    message?: string;
    botInfo?: any;
  }>({ tested: false, valid: false });

  const [customEnv, setCustomEnv] = useState<Array<{ key: string; value: string }>>([
    { key: 'ENVIRONMENT', value: 'production' }
  ]);

  // Resource State
  const [cpuLimit, setCpuLimit] = useState<number>(0.5);
  const [ramLimitMb, setRamLimitMb] = useState<number>(512);
  const [diskLimitMb, setDiskLimitMb] = useState<number>(1024);
  const [autoRestart, setAutoRestart] = useState(true);
  const [restartPolicy, setRestartPolicy] = useState<RestartPolicy>('on-failure');

  // Deployment Pipeline State
  const [isDeploying, setIsDeploying] = useState(false);
  const [deployLogs, setDeployLogs] = useState<string[]>([]);
  const [deployStepIndex, setDeployStepIndex] = useState(0);
  const [createdBot, setCreatedBot] = useState<BotItem | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const pipelineStages = [
    'Yuklanmoqda',
    'Fayllar tekshirilmoqda',
    'Docker image qurilmoqda',
    'pip install -r requirements.txt',
    'Konteyner yaratilmoqda',
    'Bot ishga tushirilmoqda',
    'Telegram polling tekshirilmoqda',
    'ISHLAYAPTI'
  ];

  // Handle template switch
  const handleSelectTemplate = (tpl: BotTemplate) => {
    setSelectedTemplate(tpl);
    setLibrary(tpl.library);
    setMainFile(tpl.mainFile);
    const reqFile = tpl.files.find((f) => f.name === 'requirements.txt');
    if (reqFile) {
      setRequirementsContent(reqFile.content);
    }
  };

  // Handle Python files upload (.py)
  const handlePythonFiles = (filesList: FileList | File[]) => {
    const filesArray = Array.from(filesList);
    if (filesArray.length === 0) return;

    const readers: Promise<{ name: string; content: string; size: number }>[] = [];

    filesArray.forEach((file) => {
      readers.push(
        new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = () => {
            resolve({
              name: file.name,
              content: (reader.result as string) || '',
              size: file.size
            });
          };
          reader.readAsText(file);
        })
      );
    });

    Promise.all(readers).then((loaded) => {
      setUploadedPyFiles(loaded);

      // Prefer main.py, bot.py, app.py or first .py file
      const primaryPy =
        loaded.find((f) => f.name === 'main.py') ||
        loaded.find((f) => f.name === 'bot.py') ||
        loaded.find((f) => f.name === 'app.py') ||
        loaded.find((f) => f.name.endsWith('.py')) ||
        loaded[0];

      if (primaryPy) {
        setUploadedPyFileName(primaryPy.name);
        setUploadedPyContent(primaryPy.content);
        setMainFile(primaryPy.name);

        // Auto-detect library from code
        const code = primaryPy.content;
        if (code.includes('aiogram') || code.includes('from aiogram') || code.includes('import aiogram')) {
          setLibrary('aiogram');
          setRequirementsContent('aiogram>=3.4.0\npython-dotenv>=1.0.0\naiohttp>=3.9.0');
        } else if (code.includes('telebot') || code.includes('from telebot') || code.includes('import telebot')) {
          setLibrary('pyTelegramBotAPI');
          setRequirementsContent('pyTelegramBotAPI>=4.14.0\npython-dotenv>=1.0.0\nrequests>=2.31.0');
        } else if (code.includes('telegram') || code.includes('from telegram.ext')) {
          setLibrary('python-telegram-bot');
          setRequirementsContent('python-telegram-bot>=20.7\npython-dotenv>=1.0.0');
        } else if (code.includes('telethon')) {
          setLibrary('Telethon');
          setRequirementsContent('telethon>=1.34.0\npython-dotenv>=1.0.0');
        }

        // Check if requirements.txt was also uploaded
        const reqUploaded = loaded.find((f) => f.name.toLowerCase() === 'requirements.txt');
        if (reqUploaded) {
          setRequirementsContent(reqUploaded.content);
        }

        // Detect bot token in code if present
        const tokenMatch = code.match(/([0-9]{8,10}:[a-zA-Z0-9_-]{35})/);
        if (tokenMatch && tokenMatch[1] && !token) {
          setToken(tokenMatch[1]);
          toast.info('Python faylidan bot tokeni aniqlandi va avtomatik kiritildi!');
        }

        // Auto-set bot name if empty
        if (!name.trim()) {
          const cleanName = primaryPy.name.replace('.py', '').replace(/[^a-zA-Z0-9_]/g, '_');
          setName(cleanName.charAt(0).toUpperCase() + cleanName.slice(1) + '_Bot');
        }

        const lines = primaryPy.content.split('\n').length;
        toast.success(`"${primaryPy.name}" Python fayli muvaffaqiyatli yuklandi (${lines} qator)`);
      }
    });
  };

  // Handle Zip file selection
  const handleZipFile = (file: File) => {
    if (!file.name.endsWith('.zip')) {
      toast.warning('Iltimos, faqat .zip formatidagi Python loyihani yuklang.');
      return;
    }
    setUploadedZipName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = (reader.result as string).split(',')[1];
      setUploadedZipBase64(base64);
    };
    reader.readAsDataURL(file);
  };

  // Verify Telegram Token with Telegram API
  const handleVerifyToken = async () => {
    if (!token.trim()) return;
    setTokenVerifying(true);
    try {
      const res = await api.verifyTelegramToken(token.trim());
      setTokenStatus({
        tested: true,
        valid: res.valid,
        message: res.message,
        botInfo: res.botInfo
      });
      if (res.botInfo?.username && !name) {
        setName(res.botInfo.username);
      }
    } catch (err: any) {
      setTokenStatus({
        tested: true,
        valid: false,
        message: err.message
      });
    } finally {
      setTokenVerifying(false);
    }
  };

  // Step 7: Trigger deployment
  const startDeployment = async () => {
    setCurrentStep(7);
    setIsDeploying(true);
    setDeployLogs(['[ASTRAFOLIO] Joylashtirish boshlandi...']);

    // Build files payload
    let templateFiles = undefined;
    if (sourceType === 'template') {
      templateFiles = selectedTemplate.files;
    } else if (sourceType === 'python_file') {
      const filesToSend: { name: string; content: string }[] = [];
      const primaryName = mainFile || uploadedPyFileName || 'main.py';
      filesToSend.push({
        name: primaryName,
        content: uploadedPyContent || '# Python Bot\nimport os\nprint("Bot ishga tushdi")\n'
      });
      filesToSend.push({
        name: 'requirements.txt',
        content: requirementsContent
      });
      uploadedPyFiles.forEach((f) => {
        if (f.name !== primaryName && f.name.toLowerCase() !== 'requirements.txt') {
          filesToSend.push({ name: f.name, content: f.content });
        }
      });
      templateFiles = filesToSend;
    }

    try {
      // Advance pipeline animation
      for (let i = 0; i < pipelineStages.length; i++) {
        setDeployStepIndex(i);
        setDeployLogs((prev) => [...prev, `[${new Date().toLocaleTimeString('uz-UZ')}] -> ${pipelineStages[i]}...`]);
        await new Promise((r) => setTimeout(r, 450));
      }

      const botPayload = {
        name: name || 'Mening_Python_Botim',
        description,
        pythonVersion,
        library,
        mainFile,
        token: token.trim(),
        sourceType,
        githubRepo: githubUrl,
        envVars: customEnv,
        resourceLimits: {
          cpu: cpuLimit,
          ramMb: ramLimitMb,
          diskMb: diskLimitMb
        },
        autoRestartEnabled: autoRestart,
        restartPolicy,
        templateFiles,
        zipBase64: uploadedZipBase64
      };

      const newBot = await api.createBot(botPayload);
      setCreatedBot(newBot);
      setDeployLogs((prev) => [
        ...prev,
        `[${new Date().toLocaleTimeString('uz-UZ')}] [SUCCESS] Bot muvaffaqiyatli ishga tushdi! (Konteyner: ${newBot.containerId})`
      ]);

      setTimeout(() => {
        setIsDeploying(false);
        setCurrentStep(8);
      }, 700);
    } catch (err: any) {
      setDeployLogs((prev) => [...prev, `[XATOLIK] Joylashtirishda muammo: ${err.message}`]);
      setIsDeploying(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-16">
      {/* Wizard Header & Steps Progress (Section 46) */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-blue-400" />
              Yangi Bot Yaratish
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              8 bosqichli xavfsiz Docker joylashtirish ustasi
            </p>
          </div>
          <button
            onClick={onCancel}
            className="text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-lg border border-slate-800"
          >
            Bekor qilish
          </button>
        </div>

        {/* Steps Bar */}
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5 bg-slate-900/80 p-2 rounded-2xl border border-slate-800">
          {[
            { num: 1, title: 'Ma‘lumot' },
            { num: 2, title: 'Manba' },
            { num: 3, title: 'Python' },
            { num: 4, title: 'Token & ENV' },
            { num: 5, title: 'Resurslar' },
            { num: 6, title: 'Tekshirish' },
            { num: 7, title: 'Joylashtirish' },
            { num: 8, title: 'Natija' }
          ].map((s) => {
            const isCompleted = currentStep > s.num;
            const isCurrent = currentStep === s.num;
            return (
              <div
                key={s.num}
                className={`flex flex-col items-center justify-center p-2 rounded-xl text-center transition-all ${
                  isCurrent
                    ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-600/30'
                    : isCompleted
                    ? 'bg-slate-800/80 text-emerald-400'
                    : 'text-slate-500'
                }`}
              >
                <span className="text-xs font-mono">{s.num}</span>
                <span className="text-[10px] truncate max-w-full hidden sm:block mt-0.5">
                  {s.title}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Step Content Container */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 sm:p-8 shadow-2xl min-h-[420px] flex flex-col justify-between">
        {/* STEP 1: Bot ma'lumotlari */}
        {currentStep === 1 && (
          <div className="space-y-5 animate-in fade-in">
            <div>
              <h2 className="text-lg font-bold text-white">1-BOSQICH: Bot Ma‘lumotlari</h2>
              <p className="text-xs text-slate-400">
                Botning identifikatsiyasi va qaysi Python kutubxonasidan foydalanishingizni belgilang.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Bot Nomi <span className="text-rose-400">*</span>
                </label>
                <input
                  id="bot-name-input"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Masalan: Savdo_Telegram_Bot yoki MyHelperBot"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Bot Tavsifi
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Botning asosiy vazifasi va foydalanuvchilar soni haqida qisqacha..."
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Asosiy Telegram Kutubxonasi
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {(['aiogram', 'python-telegram-bot', 'pyTelegramBotAPI', 'Telethon'] as const).map(
                    (lib) => (
                      <button
                        key={lib}
                        type="button"
                        onClick={() => setLibrary(lib)}
                        className={`p-3 rounded-xl border text-xs font-semibold text-left transition-all cursor-pointer ${
                          library === lib
                            ? 'bg-blue-600/20 border-blue-500 text-blue-400 shadow-sm'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <div className="font-bold">{lib}</div>
                        <div className="text-[10px] text-slate-500 mt-1">Python Library</div>
                      </button>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Loyiha yuklash */}
        {currentStep === 2 && (
          <div className="space-y-5 animate-in fade-in">
            <div>
              <h2 className="text-lg font-bold text-white">2-BOSQICH: Python Loyihasini Yuklash</h2>
              <p className="text-xs text-slate-400">
                Loyiha kodlarini qanday usulda serverga taqdim etishni tanlang.
              </p>
            </div>

            {/* Source Type Switcher */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <button
                type="button"
                onClick={() => setSourceType('python_file')}
                className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                  sourceType === 'python_file'
                    ? 'bg-emerald-600/15 border-emerald-500 text-emerald-400 shadow-sm'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <FileCode className="w-5 h-5 mb-2 text-emerald-400" />
                <div className="text-xs font-bold text-white">Python Fayl (.py)</div>
                <div className="text-[10px] text-slate-500 mt-0.5">Kompyuterdan .py fayl</div>
              </button>

              <button
                type="button"
                onClick={() => setSourceType('template')}
                className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                  sourceType === 'template'
                    ? 'bg-blue-600/15 border-blue-500 text-blue-400 shadow-sm'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Sparkles className="w-5 h-5 mb-2 text-blue-400" />
                <div className="text-xs font-bold text-white">Tayyor Shablon</div>
                <div className="text-[10px] text-slate-500 mt-0.5">1-bosishda ishga tushirish</div>
              </button>

              <button
                type="button"
                onClick={() => setSourceType('zip')}
                className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                  sourceType === 'zip'
                    ? 'bg-amber-600/15 border-amber-500 text-amber-400 shadow-sm'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Upload className="w-5 h-5 mb-2 text-amber-400" />
                <div className="text-xs font-bold text-white">ZIP Arxiv</div>
                <div className="text-[10px] text-slate-500 mt-0.5">Kompyuterdan arxiv</div>
              </button>

              <button
                type="button"
                onClick={() => setSourceType('github')}
                className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                  sourceType === 'github'
                    ? 'bg-purple-600/15 border-purple-500 text-purple-400 shadow-sm'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Github className="w-5 h-5 mb-2 text-purple-400" />
                <div className="text-xs font-bold text-white">GitHub Repo</div>
                <div className="text-[10px] text-slate-500 mt-0.5">Git orqali ulanish</div>
              </button>
            </div>

            {/* Python File Upload Dropzone */}
            {sourceType === 'python_file' && (
              <div className="pt-2 space-y-4">
                <input
                  type="file"
                  ref={pyFileInputRef}
                  accept=".py,.txt,.json,.env"
                  multiple
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      handlePythonFiles(e.target.files);
                    }
                  }}
                />

                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDraggingPy(true);
                  }}
                  onDragLeave={() => setIsDraggingPy(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDraggingPy(false);
                    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                      handlePythonFiles(e.dataTransfer.files);
                    }
                  }}
                  onClick={() => pyFileInputRef.current?.click()}
                  className={`p-8 border-2 border-dashed rounded-2xl text-center cursor-pointer transition-all ${
                    isDraggingPy
                      ? 'border-emerald-500 bg-emerald-500/10 scale-[1.01]'
                      : uploadedPyFileName
                      ? 'border-emerald-500/40 bg-emerald-500/5 hover:border-emerald-500/60'
                      : 'border-slate-800 hover:border-emerald-500/60 bg-slate-950/50'
                  }`}
                >
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-3">
                    <FileCode className="w-6 h-6" />
                  </div>

                  {uploadedPyFileName ? (
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-center gap-2 text-emerald-400 font-bold text-sm">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>{uploadedPyFileName} yuklandi!</span>
                      </div>
                      <p className="text-xs text-slate-300 font-mono">
                        Hajmi: {(uploadedPyContent.length / 1024).toFixed(1)} KB • {uploadedPyContent.split('\n').length} qator
                        {uploadedPyFiles.length > 1 && ` (+${uploadedPyFiles.length - 1} ta qo‘shimcha fayl)`}
                      </p>
                      <p className="text-[11px] text-slate-500 pt-1">
                        Boshqa Python fayl tanlash uchun bu yerga bosing yoki sudrab tashlang
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-xs font-bold text-white">
                        Python (.py) faylingizni bu yerga tashlang yoki fayl tanlash uchun bosing
                      </p>
                      <p className="text-[11px] text-slate-500 mt-1">
                        Masalan: main.py, bot.py yoki bir nechta loyiha fayllari (.py, requirements.txt, .env)
                      </p>
                    </div>
                  )}
                </div>

                {/* Quick Code Preview if uploaded */}
                {uploadedPyContent && (
                  <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-300 flex items-center gap-2">
                        <Code className="w-3.5 h-3.5 text-emerald-400" />
                        {uploadedPyFileName} — Kod ko‘rinishi & tahriri:
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        Kutubxona: {library}
                      </span>
                    </div>
                    <textarea
                      value={uploadedPyContent}
                      onChange={(e) => setUploadedPyContent(e.target.value)}
                      rows={6}
                      className="w-full p-3 rounded-lg bg-slate-900 border border-slate-800 text-emerald-300 font-mono text-xs focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Template picker */}
            {sourceType === 'template' && (
              <div className="space-y-3 pt-2">
                <label className="text-xs font-semibold text-slate-300">
                  Mos Shablonni Tanlang:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {BOT_TEMPLATES.map((tpl) => (
                    <div
                      key={tpl.id}
                      onClick={() => handleSelectTemplate(tpl)}
                      className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                        selectedTemplate.id === tpl.id
                          ? 'bg-slate-950 border-blue-500 ring-1 ring-blue-500/50'
                          : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-white">{tpl.name}</span>
                        {selectedTemplate.id === tpl.id && (
                          <CheckCircle2 className="w-4 h-4 text-blue-400" />
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed">
                        {tpl.description}
                      </p>
                      <div className="mt-2 text-[10px] font-mono text-cyan-400">
                        Asosiy fayl: {tpl.mainFile}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ZIP Upload Dropzone */}
            {sourceType === 'zip' && (
              <div className="pt-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept=".zip"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files?.[0]) handleZipFile(e.target.files[0]);
                  }}
                />
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="p-8 border-2 border-dashed border-slate-800 hover:border-blue-500/60 rounded-2xl text-center bg-slate-950/50 cursor-pointer transition-colors"
                >
                  <Upload className="w-10 h-10 text-slate-500 mx-auto mb-3" />
                  <p className="text-xs font-bold text-white">
                    {uploadedZipName
                      ? `Tanlangan ZIP: ${uploadedZipName}`
                      : 'Python loyihangizning .ZIP arxivini bu yerga tashlang yoki bosing'}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Arxiv ichida main.py va requirements.txt bo‘lishi tavsiya etiladi (Maks: 50MB)
                  </p>
                </div>
              </div>
            )}

            {/* GitHub Repo */}
            {sourceType === 'github' && (
              <div className="pt-2 space-y-3">
                <label className="text-xs font-semibold text-slate-300">
                  GitHub Repositoriya URL manzili:
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="url"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    placeholder="https://github.com/username/my-telegram-bot.git"
                    className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>
                <p className="text-[11px] text-slate-500">
                  Private repositoriyalar uchun avtomatik deploy kaliti biriktirilishi mumkin.
                </p>
              </div>
            )}
          </div>
        )}

        {/* STEP 3: Python versiyasi va Asosiy fayl */}
        {currentStep === 3 && (
          <div className="space-y-5 animate-in fade-in">
            <div>
              <h2 className="text-lg font-bold text-white">
                3-BOSQICH: Python Versiyasi & requirements.txt
              </h2>
              <p className="text-xs text-slate-400">
                Konteyner ichidagi Python talqini va asosiy ishga tushish faylini tanlang.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Python Versiyasi
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(['3.10', '3.11', '3.12', '3.13'] as PythonVersion[]).map((ver) => (
                    <button
                      key={ver}
                      type="button"
                      onClick={() => setPythonVersion(ver)}
                      className={`p-3 rounded-xl border text-center font-mono text-xs font-semibold cursor-pointer transition-all ${
                        pythonVersion === ver
                          ? 'bg-blue-600/20 border-blue-500 text-blue-400'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      Python {ver}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Asosiy Python Fayli
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['main.py', 'bot.py', 'app.py'].map((f) => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => setMainFile(f)}
                      className={`p-3 rounded-xl border text-center font-mono text-xs cursor-pointer transition-all ${
                        mainFile === f
                          ? 'bg-blue-600/20 border-blue-500 text-blue-400 font-bold'
                          : 'bg-slate-950 border-slate-800 text-slate-400'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  value={mainFile}
                  onChange={(e) => setMainFile(e.target.value)}
                  placeholder="Yoki o'z fayl nomingizni kiriting"
                  className="mt-2 w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-mono"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  requirements.txt (Avtomatik o‘rnatiladigan paketlar):
                </label>
                <span className="text-[10px] text-emerald-400 font-mono">
                  pip install -r requirements.txt
                </span>
              </div>
              <textarea
                value={requirementsContent}
                onChange={(e) => setRequirementsContent(e.target.value)}
                rows={3}
                className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-cyan-300 font-mono text-xs focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* If a Python file was uploaded, allow editing its content */}
            {uploadedPyContent && (
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <FileCode className="w-3.5 h-3.5 text-emerald-400" />
                    Asosiy Python Kodingiz ({mainFile}):
                  </label>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {uploadedPyContent.split('\n').length} qator • {(uploadedPyContent.length / 1024).toFixed(1)} KB
                  </span>
                </div>
                <textarea
                  value={uploadedPyContent}
                  onChange={(e) => setUploadedPyContent(e.target.value)}
                  rows={8}
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-emerald-300 font-mono text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>
            )}
          </div>
        )}

        {/* STEP 4: Muhit o'zgaruvchilari (Token & ENV) */}
        {currentStep === 4 && (
          <div className="space-y-5 animate-in fade-in">
            <div>
              <h2 className="text-lg font-bold text-white">
                4-BOSQICH: Telegram Bot Tokeni & Muhit O‘zgaruvchilari
              </h2>
              <p className="text-xs text-slate-400">
                Telegram Bot tokeningiz xavfsiz shifrlanadi va faqat bot konteyneriga uzatiladi.
              </p>
            </div>

            {/* Token Input with Telegram API check */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <label className="block text-xs font-semibold text-slate-200">
                Telegram Bot Token (@BotFather dan olingan):
              </label>

              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <input
                    type={showToken ? 'text' : 'password'}
                    value={token}
                    onChange={(e) => {
                      setToken(e.target.value);
                      setTokenStatus({ tested: false, valid: false });
                    }}
                    placeholder="Masalan: 7183920194:AAFz9a_B0xXyz..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-mono pr-10 focus:outline-none focus:border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowToken(!showToken)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-white"
                  >
                    {showToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleVerifyToken}
                  disabled={tokenVerifying || !token.trim()}
                  className="px-4 py-2.5 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 text-xs font-semibold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {tokenVerifying ? (
                    <>
                      <RotateCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Tekshirilmoqda...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Tasdiqlash</span>
                    </>
                  )}
                </button>
              </div>

              {/* Token verification feedback */}
              {tokenStatus.tested && (
                <div
                  className={`p-3 rounded-xl text-xs flex items-start gap-2.5 ${
                    tokenStatus.valid
                      ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300'
                      : 'bg-rose-500/10 border border-rose-500/30 text-rose-300'
                  }`}
                >
                  {tokenStatus.valid ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                  )}
                  <div>
                    <div className="font-bold">
                      {tokenStatus.valid ? 'Token Muvaffaqiyatli Tasdiqlandi' : 'Xatolik'}
                    </div>
                    <div className="text-[11px] mt-0.5">{tokenStatus.message}</div>
                  </div>
                </div>
              )}
            </div>

            {/* Custom ENV variables */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-slate-300">
                  Qo‘shimcha Muhit O‘zgaruvchilari (.ENV):
                </label>
                <button
                  type="button"
                  onClick={() => setCustomEnv([...customEnv, { key: '', value: '' }])}
                  className="text-xs text-blue-400 hover:text-blue-300 font-semibold"
                >
                  + O‘zgaruvchi qo‘shish
                </button>
              </div>

              <div className="space-y-2">
                {customEnv.map((env, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={env.key}
                      onChange={(e) => {
                        const copy = [...customEnv];
                        copy[idx].key = e.target.value;
                        setCustomEnv(copy);
                      }}
                      placeholder="KEY (masalan: DATABASE_URL)"
                      className="w-1/3 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-white"
                    />
                    <input
                      type="text"
                      value={env.value}
                      onChange={(e) => {
                        const copy = [...customEnv];
                        copy[idx].value = e.target.value;
                        setCustomEnv(copy);
                      }}
                      placeholder="QIYMAT (masalan: postgresql://...)"
                      className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-white"
                    />
                    <button
                      type="button"
                      onClick={() => setCustomEnv(customEnv.filter((_, i) => i !== idx))}
                      className="p-2 text-slate-500 hover:text-rose-400"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: Resurslar */}
        {currentStep === 5 && (
          <div className="space-y-5 animate-in fade-in">
            <div>
              <h2 className="text-lg font-bold text-white">5-BOSQICH: Server Resurslari & Chegaralar</h2>
              <p className="text-xs text-slate-400">
                Konteynerga ajratiladigan CPU, RAM xotira va avtomatik qayta ishga tushirish siyosati.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* CPU */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-300 mb-2">
                  <span>CPU Chegarasi:</span>
                  <span className="text-cyan-400 font-mono">{cpuLimit} vCPU</span>
                </div>
                <input
                  type="range"
                  min="0.25"
                  max="1.0"
                  step="0.25"
                  value={cpuLimit}
                  onChange={(e) => setCpuLimit(parseFloat(e.target.value))}
                  className="w-full accent-blue-500"
                />
                <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
                  <span>0.25</span>
                  <span>0.50</span>
                  <span>1.0</span>
                </div>
              </div>

              {/* RAM */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-300 mb-2">
                  <span>Operativ Xotira (RAM):</span>
                  <span className="text-indigo-400 font-mono">{ramLimitMb} MB</span>
                </div>
                <input
                  type="range"
                  min="256"
                  max="1024"
                  step="256"
                  value={ramLimitMb}
                  onChange={(e) => setRamLimitMb(parseInt(e.target.value))}
                  className="w-full accent-indigo-500"
                />
                <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
                  <span>256MB</span>
                  <span>512MB</span>
                  <span>1024MB</span>
                </div>
              </div>

              {/* Disk */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-300 mb-2">
                  <span>SSD Disk:</span>
                  <span className="text-purple-400 font-mono">{diskLimitMb} MB</span>
                </div>
                <input
                  type="range"
                  min="512"
                  max="2048"
                  step="512"
                  value={diskLimitMb}
                  onChange={(e) => setDiskLimitMb(parseInt(e.target.value))}
                  className="w-full accent-purple-500"
                />
                <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
                  <span>512MB</span>
                  <span>1024MB</span>
                  <span>2048MB</span>
                </div>
              </div>
            </div>

            {/* Auto Restart Settings (Section 16) */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-white">
                    Avtomatik Qayta Ishga Tushirish (Auto-restart)
                  </span>
                  <p className="text-[11px] text-slate-400">
                    Bot kutilmaganda to‘xtab qolsa, konteyner uni avtomatik tiriltiradi
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoRestart}
                    onChange={(e) => setAutoRestart(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              {autoRestart && (
                <div className="pt-2 border-t border-slate-800/80 flex items-center gap-3">
                  <span className="text-xs text-slate-400">Qayta ishga tushish siyosati:</span>
                  {(['on-failure', 'always', 'never'] as RestartPolicy[]).map((pol) => (
                    <button
                      key={pol}
                      type="button"
                      onClick={() => setRestartPolicy(pol)}
                      className={`px-3 py-1 rounded-lg text-xs font-mono cursor-pointer transition-colors ${
                        restartPolicy === pol
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-900 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {pol === 'on-failure' ? 'Xatolikdan keyin' : pol === 'always' ? 'Har doim' : 'Hech qachon'}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* STEP 6: Tekshirish (Pre-flight Review) */}
        {currentStep === 6 && (
          <div className="space-y-5 animate-in fade-in">
            <div>
              <h2 className="text-lg font-bold text-white">6-BOSQICH: Tekshirish & Tasdiqlash</h2>
              <p className="text-xs text-slate-400">
                Barcha konfiguratsiyalar to‘g‘ri ekanligini ko‘zdan kechiring va joylashtirishni tasdiqlang.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="text-slate-500 font-sans font-semibold">BOT MA‘LUMOTLARI</div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Nomi:</span>
                  <span className="text-white font-bold">{name || 'Nomsiz_Bot'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Kutubxona:</span>
                  <span className="text-blue-400">{library}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Python talqini:</span>
                  <span className="text-cyan-400">{pythonVersion}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Asosiy fayl:</span>
                  <span className="text-slate-200">{mainFile}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Manba:</span>
                  <span className="text-emerald-400">
                    {sourceType === 'python_file'
                      ? `Python fayli (${uploadedPyFileName || mainFile})`
                      : sourceType === 'zip'
                      ? `ZIP arxiv (${uploadedZipName || 'arxiv.zip'})`
                      : sourceType === 'github'
                      ? 'GitHub repozitoriya'
                      : `Shablon (${selectedTemplate.name})`}
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="text-slate-500 font-sans font-semibold">DOCKER & RESURSLAR</div>
                <div className="flex justify-between">
                  <span className="text-slate-400">CPU Kvotasi:</span>
                  <span className="text-cyan-400">{cpuLimit} vCPU</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">RAM Chegarasi:</span>
                  <span className="text-indigo-400">{ramLimitMb} MB</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">SSD Disk:</span>
                  <span className="text-purple-400">{diskLimitMb} MB</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Auto-restart:</span>
                  <span className={autoRestart ? 'text-emerald-400' : 'text-slate-500'}>
                    {autoRestart ? `Ha (${restartPolicy})` : 'Yo‘q'}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-blue-600/10 border border-blue-500/20 text-xs text-blue-300 flex items-center gap-3">
              <Shield className="w-5 h-5 text-blue-400 flex-shrink-0" />
              <span>
                ASTRAFOLIO konteyner izolyatsiyasi faol. Bot tokeningiz shifrlangan va xavfsiz.
              </span>
            </div>
          </div>
        )}

        {/* STEP 7: Joylashtirish (Live Pipeline Animation) */}
        {currentStep === 7 && (
          <div className="space-y-6 animate-in fade-in py-6 text-center">
            <div>
              <h2 className="text-xl font-bold text-white mb-1">
                7-BOSQICH: Bot Joylashtirilmoqda...
              </h2>
              <p className="text-xs text-slate-400">
                Docker image tayyorlanmoqda, kutubxonalar tekshirilmoqda va konteyner ishga tushirilmoqda.
              </p>
            </div>

            {/* Pipeline Step Badges */}
            <div className="max-w-md mx-auto space-y-2 text-left">
              {pipelineStages.map((stage, idx) => {
                const isPast = deployStepIndex > idx;
                const isCurrent = deployStepIndex === idx;
                return (
                  <div
                    key={idx}
                    className={`flex items-center justify-between p-2.5 rounded-xl text-xs transition-all ${
                      isCurrent
                        ? 'bg-blue-600/20 border border-blue-500 text-blue-400'
                        : isPast
                        ? 'bg-slate-950/80 text-emerald-400'
                        : 'text-slate-600'
                    }`}
                  >
                    <span className="font-mono">{stage}</span>
                    {isPast && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                    {isCurrent && <RotateCw className="w-4 h-4 text-blue-400 animate-spin" />}
                  </div>
                );
              })}
            </div>

            {/* Terminal output box */}
            <div className="max-w-md mx-auto p-3 rounded-xl bg-slate-950 border border-slate-800 text-left font-mono text-[11px] text-slate-400 max-h-32 overflow-y-auto">
              {deployLogs.map((l, i) => (
                <div key={i}>{l}</div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 8: Natija (Success Outcome) */}
        {currentStep === 8 && (
          <div className="space-y-6 animate-in fade-in text-center py-8">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/20">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-white">Bot Muvaffaqiyatli Ishga Tushdi!</h2>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                {name || 'Bot'} ASTRAFOLIO 24/7 serverida Docker konteynerida muvaffaqiyatli ishga tushirildi.
              </p>
            </div>

            <div className="max-w-xs mx-auto p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-left space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-400">Holat:</span>
                <span className="text-emerald-400 font-bold">ISHLAYAPTI</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Konteyner:</span>
                <span className="text-cyan-400">{createdBot?.containerId || 'astrafolio-c-7193'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Server Node:</span>
                <span className="text-slate-200">Toshkent DC-1</span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => {
                  if (createdBot) onSuccess(createdBot);
                  else onCancel();
                }}
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/25 cursor-pointer"
              >
                Boshqaruv Paneliga O‘tish
              </button>
            </div>
          </div>
        )}

        {/* Wizard Footer Navigation Buttons */}
        {currentStep < 7 && (
          <div className="flex items-center justify-between pt-6 border-t border-slate-800/80 mt-6">
            <button
              type="button"
              disabled={currentStep === 1}
              onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
              className="px-4 py-2 rounded-xl border border-slate-800 text-xs text-slate-300 hover:bg-slate-800 disabled:opacity-40 disabled:pointer-events-none flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Orqaga</span>
            </button>

            {currentStep < 6 ? (
              <button
                type="button"
                onClick={() => setCurrentStep((prev) => prev + 1)}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-blue-600/25 cursor-pointer"
              >
                <span>Keyingi bosqich</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={startDeployment}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold flex items-center gap-2 shadow-xl shadow-blue-600/30 cursor-pointer"
              >
                <Zap className="w-4 h-4" />
                <span>Joylashtirish (Deploy)</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
