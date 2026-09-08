'use client';

import React, { useState, useEffect } from 'react';
import { useNexa } from '@/context/NexaContext';
import { CURRENCY_METADATA, formatMoney, fromSmallestUnit } from '@/lib/money';
import { TrendingUp, ArrowUpRight, ShieldCheck, Sparkles, RefreshCw } from 'lucide-react';

export function NetWorthCard() {
  const { totalNetWorthSmallestUnit, homeCurrency, accounts, refreshFXRates } = useNexa();
  const [displayValue, setDisplayValue] = useState(totalNetWorthSmallestUnit);
  const [isTicking, setIsTicking] = useState(false);

  useEffect(() => {
    setIsTicking(true);
    const timeout = setTimeout(() => {
      setDisplayValue(totalNetWorthSmallestUnit);
      setIsTicking(false);
    }, 150);
    return () => clearTimeout(timeout);
  }, [totalNetWorthSmallestUnit]);

  const meta = CURRENCY_METADATA[homeCurrency] || CURRENCY_METADATA.USD;
  const rawAmount = fromSmallestUnit(displayValue, homeCurrency);

  return (
    <div className="relative overflow-hidden rounded-2xl p-6 sm:p-7 glass-card border border-indigo-500/20 shadow-2xl bg-gradient-to-br from-slate-900/90 via-slate-900/70 to-indigo-950/40">
      {/* Background ambient glow circles */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
      <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col gap-6">
        {/* Top row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              Live Converted Net Worth
            </span>
            <span className="text-xs text-slate-400 font-mono">
              ({accounts.length} linked accounts)
            </span>
          </div>

          <button
            onClick={refreshFXRates}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5 text-indigo-400" />
            <span>FX Live</span>
          </button>
        </div>

        {/* Big Headline Number */}
        <div className="flex flex-col gap-2">
          <div className="flex items-baseline gap-2.5 flex-wrap">
            <span className="text-4xl sm:text-5xl font-black tracking-tight text-white font-sans transition-all duration-300">
              {meta.symbol}
              {rawAmount.toLocaleString('en-US', {
                minimumFractionDigits: meta.decimals,
                maximumFractionDigits: meta.decimals,
              })}
            </span>
            <span className="text-2xl font-bold font-mono text-slate-400">{homeCurrency}</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+14.2%</span>
            </div>
            <span className="text-xs text-slate-400">vs. last month (across all FX positions)</span>
          </div>
        </div>

        {/* Currency distribution pills */}
        <div className="pt-4 border-t border-slate-800/80 flex flex-col gap-2.5">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Multi-Currency Holding Breakdown
          </p>
          <div className="flex flex-wrap gap-2.5">
            {accounts.map((acc) => (
              <div
                key={acc.id}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs shadow-sm"
              >
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: acc.institutionColor || '#6366F1' }}
                />
                <span className="font-semibold text-slate-200">{acc.currency}</span>
                <span className="font-mono text-slate-400 text-[11px]">
                  {formatMoney(acc.balanceSmallestUnit, acc.currency)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
