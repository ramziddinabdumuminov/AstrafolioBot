import { useState } from 'react';
import {
  Server,
  Shield,
  Zap,
  Terminal,
  Cpu,
  Layers,
  CheckCircle2,
  HelpCircle,
  ChevronDown,
  ArrowRight,
  Code2,
  Lock,
  RefreshCw,
  FileCode,
  Activity,
  Check,
  Sparkles
} from 'lucide-react';
import { TariffPlan } from '../types';

interface LandingPageProps {
  onStartCreate: () => void;
  onExplore: () => void;
  tariffs: TariffPlan[];
  onSelectTariff: (tariffId: string) => void;
}

export default function LandingPage({
  onStartCreate,
  onExplore,
  tariffs,
  onSelectTariff,
}: LandingPageProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const features = [
    {
      icon: Server,
      title: 'Python Bot Hosting',
      desc: 'Aiogram, Telebot, PTB, Telethon kabi barcha mashhur Python kutubxonalari uchun optimallashtirilgan arxitektura.'
    },
    {
      icon: Zap,
      title: '24/7 Uzluksiz Ishlash',
      desc: 'Server o‘chmasdan, 99.9% uptime bilan barcha foydalanuvchi xabarlarini kechayu-kunduz tezkor qabul qiladi.'
    },
    {
      icon: Shield,
      title: 'Docker Orqali Izolyatsiya',
      desc: 'Har bir bot alohida xavfsiz Docker konteynerida yuritiladi. Begona jarayonlar va fayllardan to‘liq himoyalangan.'
    },
    {
      icon: Terminal,
      title: 'Haqiqiy Terminal Loglari',
      desc: 'Botning stdout va stderr konsol chiqishlarini soniyalik real vaqt rejimida kuzatish, qidirish va yuklab olish.'
    },
    {
      icon: Activity,
      title: 'Server Resurslarini Kuzatish',
      desc: 'CPU, RAM xotira, disk va tarmoq trafigining real statistikasi, grafiklar va yuklama hisoboti.'
    },
    {
      icon: Lock,
      title: 'Xavfsiz Muhit O‘zgaruvchilari',
      desc: 'Telegram BOT_TOKEN va maxfiy kalitlar shifrlangan holda saqlanadi, loglarda yoki brauzerda hech qachon oshkor bo‘lmaydi.'
    },
    {
      icon: RefreshCw,
      title: 'Tezkor Qayta Ishga Tushirish',
      desc: 'Birgina tugma bilan qayta ishga tushirish (restart) va bot kutilmaganda to‘xtab qolganda avtomatik qayta tiriltirish.'
    },
    {
      icon: FileCode,
      title: 'Veb Kod Muharriri & Fayllar',
      desc: 'Brauzerning o‘zida main.py kodlarini tahrirlash, yangi fayllar yuklash, ZIP arxivdan chiqarish va zaxira olish.'
    }
  ];

  const faqs = [
    {
      q: 'ASTRAFOLIO da qaysi Python kutubxonalari qo‘llab-quvvatlanadi?',
      a: 'aiogram (v3 va v2), python-telegram-bot (v20+), pyTelegramBotAPI (Telebot), Telethon va barcha standart Python paketlari qo‘llab-quvvatlanadi. Loyihangizdagi requirements.txt orqali istalgan kutubxona avtomatik o‘rnatiladi.'
    },
    {
      q: 'Telegram Bot Tokenim qanchalik xavfsiz saqlanadi?',
      a: 'Bot tokeni hech qachon ochiq matnda saqlanmaydi va frontend kodiga berilmaydi. U faqat konteyner ichiga muhit o‘zgaruvchisi (BOT_TOKEN) sifatida xavfsiz uzatiladi va loglarda maskalanadi.'
    },
    {
      q: 'Botim kutilmaganda to‘xtab qolsa nima bo‘ladi?',
      a: 'ASTRAFOLIO da avtomatik qayta ishga tushirish (Auto-restart) tizimi mavjud. Agar Telegram serverida qisqa uzilish yoki kodingizda xatolik bo‘lsa, konteyner nazoratchisi uni bir necha soniyada avtomatik qayta ishga tushiradi.'
    },
    {
      q: 'Bepul tarifda nimalar mavjud?',
      a: 'Bepul tarifda 1 ta to‘liq ishlaydigan Python bot, 256 MB RAM, 512 MB disk va real vaqt loglaridan mutlaqo tekinga foydalanishingiz mumkin.'
    },
    {
      q: 'Loyiha kodlarimni qanday yuklashim mumkin?',
      a: 'Loyiha fayllarini ZIP arxiv shaklida yuklashingiz, GitHub repositoriyangizni ulashingiz yoki tayyor Aiogram/Telebot shablonlaridan 1 ta bosishda foydalanishingiz mumkin.'
    }
  ];

  return (
    <div className="min-h-screen text-slate-200">
      {/* Hero Section */}
      <section className="relative pt-12 pb-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto text-center">
        {/* Glow backdrop */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-gradient-to-r from-blue-600/20 via-indigo-600/15 to-cyan-400/15 blur-[120px] pointer-events-none rounded-full" />

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 border border-blue-500/30 text-blue-400 text-xs font-semibold mb-6 shadow-inner">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Professional Python Telegram Bot Hosting Platformasi</span>
        </div>

        {/* Title */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight">
          Python botlaringizni joylashtiring.{' '}
          <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-400 bg-clip-text text-transparent">
            24/7 ishlating.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-400 mb-10 leading-relaxed">
          Docker izolyatsiyasi, soniyalik konsol loglari, veb kod muharriri va barqaror server infratuzilmasi bilan Telegram botingizni bir daqiqada dunyoga taqdim eting.
        </p>

        {/* Call to Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            id="landing-hero-create-btn"
            onClick={onStartCreate}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-blue-600/25 flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer"
          >
            <span>Bot yaratish</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            id="landing-hero-explore-btn"
            onClick={onExplore}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 font-semibold text-sm border border-slate-700/80 flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer"
          >
            <span>Platformani ko‘rish</span>
          </button>
        </div>

        {/* Live Terminal Preview Mock */}
        <div className="mt-14 max-w-3xl mx-auto rounded-2xl bg-[#0B0F19] border border-slate-800 shadow-2xl overflow-hidden text-left font-mono text-xs">
          <div className="bg-slate-900/90 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-rose-500/80" />
              <div className="w-3 h-3 rounded-full bg-amber-500/80" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
              <span className="ml-2 text-slate-400 text-[11px]">astrafolio-docker-node // terminal</span>
            </div>
            <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              24/7 ACTIVE
            </span>
          </div>
          <div className="p-4 space-y-1.5 text-slate-300">
            <p className="text-slate-500">$ astrafolio deploy --source=./my_telegram_bot --python=3.10</p>
            <p className="text-blue-400">[INFO] requirements.txt aniqlandi: aiogram==3.4.1, pydantic, aiohttp</p>
            <p className="text-indigo-400">[DOCKER] Izolyatsiyalangan konteyner yaratilmoqda: astrafolio-c-7193</p>
            <p className="text-cyan-400">[SECURITY] BOT_TOKEN shifrlangan holda yuklandi (841029****:AAF***)</p>
            <p className="text-emerald-400 font-bold">[SUCCESS] Telegram serveriga ulanish o‘rnatildi. Polling boshlandi!</p>
            <p className="text-slate-400">[24/7 Heartbeat] Xotira: 38.2 MB / 512 MB | CPU: 0.8% | Holat: ISHLAYAPTI</p>
          </div>
        </div>
      </section>

      {/* Services / Features Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto border-t border-slate-800/80">
        <div className="text-center max-w-xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Nega aynan ASTRAFOLIO?
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Python dasturchilari uchun Telegram botlarini uzluksiz, xavfsiz va qulay boshqarish imkoniyati.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-blue-500/40 hover:bg-slate-900/90 transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-600/15 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-4 group-hover:scale-105 transition-transform">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-white mb-2">{feat.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{feat.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Pricing / Tariffs Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto border-t border-slate-800/80">
        <div className="text-center max-w-xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Shaffof va Qulay Tariflar
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            O‘z botingiz talabiga mos resurslarni tanlang. Istalgan vaqtda tarifni oshirish mumkin.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tariffs.map((plan) => {
            const isPopular = plan.id === 'PRO';
            return (
              <div
                key={plan.id}
                className={`relative rounded-2xl p-6 flex flex-col justify-between transition-all ${
                  isPopular
                    ? 'bg-gradient-to-b from-blue-950/40 via-slate-900 to-slate-950 border-2 border-blue-500 shadow-xl shadow-blue-500/10'
                    : 'bg-slate-900/60 border border-slate-800'
                }`}
              >
                {isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-blue-600 text-[10px] font-bold text-white uppercase tracking-wider shadow">
                    Eng ommabop
                  </div>
                )}

                <div>
                  <h3 className="text-lg font-bold text-white mb-1">{plan.name}</h3>
                  <div className="my-4 flex items-baseline gap-1">
                    <span className="text-3xl font-extrabold text-white">
                      {plan.priceMonthlyUzs === 0 ? '0' : plan.priceMonthlyUzs.toLocaleString()}
                    </span>
                    <span className="text-xs text-slate-400">UZS / oy</span>
                  </div>

                  <ul className="space-y-3 my-6 text-xs text-slate-300">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span><strong>{plan.maxBots} ta</strong> gacha Python bot</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span><strong>{plan.ramLimitMb} MB</strong> RAM xotira har bir botga</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span><strong>{plan.cpuLimit} vCPU</strong> yadro kvotasi</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span><strong>{plan.diskLimitMb} MB</strong> SSD disk hajmi</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span>{plan.autoRestart ? 'Avtomatik qayta ishga tushirish (Auto-restart)' : 'Qo‘lda qayta ishga tushirish'}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span>Docker konteyner izolyatsiyasi</span>
                    </li>
                  </ul>
                </div>

                <button
                  onClick={() => onSelectTariff(plan.id)}
                  className={`w-full py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                    isPopular
                      ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/20'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                  }`}
                >
                  {plan.id === 'BEPUL' ? 'Hozir boshlash' : 'Tanlash va faollashtirish'}
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto border-t border-slate-800/80">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Ko‘p Beriladigan Savollar
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            ASTRAFOLIO platformasi haqidagi barcha muhim ma’lumotlar
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="rounded-xl bg-slate-900/60 border border-slate-800/80 overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full px-5 py-4 text-left flex items-center justify-between text-sm font-semibold text-white hover:text-blue-400 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform ${
                      isOpen ? 'rotate-180 text-blue-400' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-4 text-xs text-slate-400 leading-relaxed border-t border-slate-800/50 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-12 px-4 text-center bg-[#05070B]">
        <div className="max-w-6xl mx-auto flex flex-col items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-xs">
              A
            </div>
            <span className="text-lg font-bold text-white tracking-tight">ASTRAFOLIO</span>
          </div>

          <p className="text-sm font-semibold text-slate-400 italic">
            “Joylashtiring. Ishlating. Rivojlantiring.”
          </p>

          <p className="text-xs text-slate-500 max-w-md">
            Python Telegram botlari uchun 24/7 xavfsiz hosting platformasi. O‘zbekiston, Toshkent DC-1 va Yevropa klasteri.
          </p>

          <div className="mt-4 text-[11px] text-slate-600">
            © {new Date().getFullYear()} ASTRAFOLIO. Barcha huquqlar himoyalangan.
          </div>
        </div>
      </footer>
    </div>
  );
}
