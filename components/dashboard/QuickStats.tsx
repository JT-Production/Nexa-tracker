'use client';

import React from 'react';
import { useNexa } from '@/context/NexaContext';
import { formatMoney } from '@/lib/money';
import { ArrowDownLeft, ArrowUpRight, PiggyBank, Hourglass } from 'lucide-react';

export function QuickStats() {
  const {
    totalIncomeSmallestUnit,
    totalExpenseSmallestUnit,
    netSavingsRatePercent,
    runwayMonths,
    homeCurrency,
  } = useNexa();

  const stats = [
    {
      title: 'Monthly Cash Inflow',
      value: formatMoney(totalIncomeSmallestUnit, homeCurrency),
      change: '+18.5%',
      isPositive: true,
      subtext: 'Client retainers & payouts',
      icon: ArrowUpRight,
      color: 'text-emerald-400',
      bgGlow: 'from-emerald-500/10 to-transparent',
      borderColor: 'border-emerald-500/20',
    },
    {
      title: 'Monthly Burn / Spend',
      value: formatMoney(totalExpenseSmallestUnit, homeCurrency),
      change: '-4.2%',
      isPositive: true,
      subtext: 'Software, servers & living',
      icon: ArrowDownLeft,
      color: 'text-rose-400',
      bgGlow: 'from-rose-500/10 to-transparent',
      borderColor: 'border-rose-500/20',
    },
    {
      title: 'Net Savings Rate',
      value: `${netSavingsRatePercent}%`,
      change: '+6.1%',
      isPositive: true,
      subtext: 'Target is 50%+',
      icon: PiggyBank,
      color: 'text-indigo-400',
      bgGlow: 'from-indigo-500/10 to-transparent',
      borderColor: 'border-indigo-500/20',
    },
    {
      title: 'Estimated Runway',
      value: `${runwayMonths} mo`,
      change: 'Safe zone',
      isPositive: true,
      subtext: 'At current burn rate',
      icon: Hourglass,
      color: 'text-amber-400',
      bgGlow: 'from-amber-500/10 to-transparent',
      borderColor: 'border-amber-500/20',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <div
            key={idx}
            className={`p-5 rounded-2xl glass-card border ${stat.borderColor} bg-gradient-to-br ${stat.bgGlow} hover:border-slate-600 transition-all flex flex-col justify-between gap-4`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">{stat.title}</span>
              <div className={`p-2 rounded-xl bg-slate-800/80 ${stat.color} shrink-0`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <p className="text-2xl font-bold font-sans text-white tracking-tight leading-none">{stat.value}</p>
              <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-[11px]">
                <span className="text-slate-400">{stat.subtext}</span>
                <span className={`font-semibold ${stat.isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {stat.change}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
