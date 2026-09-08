'use client';

import React from 'react';
import { useNexa } from '@/context/NexaContext';
import { convertCurrencySmallestUnit, formatMoney, fromSmallestUnit } from '@/lib/money';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Briefcase } from 'lucide-react';

export function IncomeBySourceBar() {
  const { transactions, homeCurrency, fxRates } = useNexa();

  // Aggregate income by client/source
  const incomeMap = new Map<string, number>();

  transactions
    .filter((t) => t.type === 'income')
    .forEach((tx) => {
      const sourceName = tx.merchant || tx.category;
      const converted = convertCurrencySmallestUnit(
        tx.amountSmallestUnit,
        tx.currency,
        homeCurrency,
        fxRates
      );
      const current = incomeMap.get(sourceName) || 0;
      incomeMap.set(sourceName, current + converted);
    });

  const chartData = Array.from(incomeMap.entries())
    .map(([source, smallestUnit]) => ({
      source: source.length > 18 ? source.slice(0, 16) + '…' : source,
      fullName: source,
      value: fromSmallestUnit(smallestUnit, homeCurrency),
      smallestUnit,
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  return (
    <div className="p-6 rounded-2xl glass-card border border-slate-800 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
            <Briefcase className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight">Income by Source / Client</h3>
            <p className="text-xs text-slate-400">Comparing revenue channels in {homeCurrency}</p>
          </div>
        </div>
      </div>

      <div className="h-60 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
            <XAxis
              dataKey="source"
              stroke="#64748B"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#1E293B' }}
            />
            <YAxis
              stroke="#64748B"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#1E293B' }}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const d = payload[0].payload;
                  return (
                    <div className="p-3 bg-slate-900 border border-slate-700 rounded-xl text-xs shadow-2xl text-white">
                      <p className="font-bold">{d.fullName}</p>
                      <p className="text-emerald-400 font-mono font-bold mt-1">
                        {formatMoney(d.smallestUnit, homeCurrency)}
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="value" fill="#10B981" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
