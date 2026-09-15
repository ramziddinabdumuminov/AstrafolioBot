import { useState } from 'react';
import { CreditCard, Check, Sparkles, Shield, Zap } from 'lucide-react';
import { TariffPlan, User } from '../types';

interface PricingViewProps {
  tariffs: TariffPlan[];
  currentUser: User | null;
  onUpgrade: (planId: string) => void;
}

export default function PricingView({ tariffs, currentUser, onUpgrade }: PricingViewProps) {
  return (
    <div className="space-y-6 pb-12 animate-in fade-in max-w-5xl mx-auto">
      <div className="text-center max-w-xl mx-auto">
        <h1 className="text-3xl font-extrabold text-white flex items-center justify-center gap-2">
          <CreditCard className="w-7 h-7 text-blue-400" />
          Tarif Rejalari
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-2">
          Telegram botlaringiz miqyosiga mos tarifni tanlang. Istalgan vaqtda rejani oshirishingiz mumkin.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
        {tariffs.map((plan) => {
          const isCurrent = currentUser?.plan === plan.id;
          const isPro = plan.id === 'PRO';
          return (
            <div
              key={plan.id}
              className={`relative rounded-2xl p-6 flex flex-col justify-between transition-all ${
                isPro
                  ? 'bg-gradient-to-b from-blue-950/40 via-slate-900 to-slate-950 border-2 border-blue-500 shadow-xl shadow-blue-500/10'
                  : 'bg-slate-900/60 border border-slate-800'
              }`}
            >
              {isPro && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-blue-600 text-[10px] font-bold text-white uppercase tracking-wider shadow">
                  Tavsiya etiladi
                </div>
              )}

              <div>
                <h3 className="text-lg font-bold text-white">{plan.name}</h3>
                <div className="my-4 flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-white">
                    {plan.priceMonthlyUzs === 0 ? '0' : plan.priceMonthlyUzs.toLocaleString()}
                  </span>
                  <span className="text-xs text-slate-400">UZS / oy</span>
                </div>

                <ul className="space-y-3 my-6 text-xs text-slate-300">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span><strong>{plan.maxBots} ta</strong> Telegram bot</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span><strong>{plan.ramLimitMb} MB</strong> RAM xotira</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span><strong>{plan.cpuLimit} vCPU</strong> yadro</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span><strong>{plan.diskLimitMb} MB</strong> NVMe SSD disk</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>{plan.autoRestart ? 'Avtomatik qayta ishga tushirish (Auto-restart)' : 'Qo‘lda restart'}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>Docker konteyner izolyatsiyasi</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => onUpgrade(plan.id)}
                disabled={isCurrent}
                className={`w-full py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                  isCurrent
                    ? 'bg-slate-800 text-slate-400 cursor-default'
                    : isPro
                    ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/20'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                }`}
              >
                {isCurrent ? 'Hozirgi Tarifingiz' : 'Tanlash va faollashtirish'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
