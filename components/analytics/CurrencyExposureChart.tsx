'use client';

import React from 'react';
import { useNexa } from '@/context/NexaContext';
import { convertCurrencySmallestUnit, formatMoney } from '@/lib/money';
import { Globe2 } from 'lucide-react';

export function CurrencyExposureChart() {
  const { accounts, homeCurrency, fxRates, totalNetWorthSmallestUnit } = useNexa();

  // Aggregate balance by currency
  const currencyMap = new Map<string, number>();

  accounts.forEach((acc) => {
    const converted = convertCurrencySmallestUnit(
      acc.balanceSmallestUnit,
      acc.currency,
      homeCurrency,
      fxRates
    );
    const current = currencyMap.get(acc.currency) || 0;
    currencyMap.set(acc.currency, current + converted);
  });

  const exposureList = Array.from(currencyMap.entries())
    .map(([curr, convertedSmallest]) => {
      const percentage =
        totalNetWorthSmallestUnit > 0
          ? Math.round((convertedSmallest / totalNetWorthSmallestUnit) * 100)
          : 0;
      return {
        currency: curr,
        convertedSmallest,
        percentage,
      };
    })
    .sort((a, b) => b.percentage - a.percentage);

  return (
    <div className="p-6 rounded-2xl glass-card border border-slate-800 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400">
            <Globe2 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight">FX Currency Exposure</h3>
            <p className="text-xs text-slate-400">Portfolio distribution by asset denomination</p>
          </div>
        </div>
      </div>

      {/* Multi-segmented progress bar */}
      <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden flex">
        {exposureList.map((item, idx) => {
          const colors = ['#10B981', '#6366F1', '#F59E0B', '#EC4899', '#06B6D4', '#8B5CF6'];
          return (
            <div
              key={item.currency}
              style={{
                width: `${item.percentage}%`,
                backgroundColor: colors[idx % colors.length],
              }}
              className="h-full first:rounded-l-full last:rounded-r-full hover:opacity-80 transition-opacity"
              title={`${item.currency}: ${item.percentage}%`}
            />
          );
        })}
      </div>

      {/* Breakdown list */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
        {exposureList.map((item, idx) => {
          const colors = ['#10B981', '#6366F1', '#F59E0B', '#EC4899', '#06B6D4', '#8B5CF6'];
          return (
            <div
              key={item.currency}
              className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-1"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: colors[idx % colors.length] }}
                  />
                  <span className="text-xs font-bold text-white font-mono">{item.currency}</span>
                </div>
                <span className="text-xs font-bold text-indigo-300">{item.percentage}%</span>
              </div>
              <p className="text-[11px] font-mono text-slate-400">
                {formatMoney(item.convertedSmallest, homeCurrency)}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
