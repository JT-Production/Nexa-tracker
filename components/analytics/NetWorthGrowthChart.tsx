'use client';

import React, { useState } from 'react';
import { useNexa } from '@/context/NexaContext';
import { CURRENCY_METADATA } from '@/lib/money';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { TrendingUp } from 'lucide-react';

const TIMEFRAME_DATA: Record<string, Array<{ date: string; value: number }>> = {
  '1M': [
    { date: 'Aug 05', value: 78500 },
    { date: 'Aug 12', value: 81200 },
    { date: 'Aug 19', value: 83900 },
    { date: 'Aug 26', value: 87400 },
    { date: 'Sep 02', value: 92100 },
  ],
  '3M': [
    { date: 'Jun', value: 64200 },
    { date: 'Jul', value: 72800 },
    { date: 'Aug', value: 83500 },
    { date: 'Sep', value: 92100 },
  ],
  '1Y': [
    { date: 'Oct 25', value: 41000 },
    { date: 'Dec 25', value: 52000 },
    { date: 'Feb 26', value: 59000 },
    { date: 'Apr 26', value: 68000 },
    { date: 'Jun 26', value: 76000 },
    { date: 'Aug 26', value: 87000 },
    { date: 'Sep 26', value: 92100 },
  ],
  ALL: [
    { date: '2024', value: 22000 },
    { date: '2025', value: 54000 },
    { date: '2026', value: 92100 },
  ],
};

export function NetWorthGrowthChart() {
  const { homeCurrency, fxRates } = useNexa();
  const [activeRange, setActiveRange] = useState<'1M' | '3M' | '1Y' | 'ALL'>('1Y');

  const symbol = CURRENCY_METADATA[homeCurrency]?.symbol || '$';
  const data = TIMEFRAME_DATA[activeRange];

  // Adjust mock base numbers according to home currency factor
  const rateFactor = fxRates[homeCurrency] || 1.0;
  const normalizedData = data.map((d) => ({
    ...d,
    value: Math.round(d.value * rateFactor),
  }));

  return (
    <div className="p-6 rounded-2xl glass-card border border-slate-800 space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight">
              Net Worth Trajectory ({homeCurrency})
            </h3>
            <p className="text-xs text-slate-400">Historical equity converted at spot rates</p>
          </div>
        </div>

        {/* Timeframe selector pills */}
        <div className="flex bg-slate-900/90 p-1 rounded-xl border border-slate-800 text-xs">
          {(['1M', '3M', '1Y', 'ALL'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setActiveRange(range)}
              className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                activeRange === range
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={normalizedData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="netWorthGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366F1" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#6366F1" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
            <XAxis
              dataKey="date"
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
              tickFormatter={(v) => `${symbol}${v >= 1000 ? (v / 1000).toFixed(0) + 'k' : v}`}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const val = payload[0]?.value as number;
                  return (
                    <div className="p-3 bg-slate-900 border border-slate-700 rounded-xl text-xs shadow-2xl text-white">
                      <p className="text-slate-400 font-medium">{label}</p>
                      <p className="text-emerald-400 font-mono font-bold text-sm mt-0.5">
                        {symbol}
                        {val?.toLocaleString()} {homeCurrency}
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#6366F1"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#netWorthGrad)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
