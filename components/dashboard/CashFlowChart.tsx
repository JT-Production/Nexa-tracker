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
import { TrendingUp, ArrowUpRight, ArrowDownLeft } from 'lucide-react';

const CASH_FLOW_MOCK = [
  { month: 'Apr', income: 8400, expense: 3200, net: 5200 },
  { month: 'May', income: 11200, expense: 4100, net: 7100 },
  { month: 'Jun', income: 9800, expense: 3900, net: 5900 },
  { month: 'Jul', income: 14600, expense: 4800, net: 9800 },
  { month: 'Aug', income: 16800, expense: 5100, net: 11700 },
  { month: 'Sep (est)', income: 18200, expense: 4900, net: 13300 },
];

export function CashFlowChart() {
  const { homeCurrency } = useNexa();
  const [timeframe, setTimeframe] = useState<'6M' | '1Y'>('6M');

  const symbol = CURRENCY_METADATA[homeCurrency]?.symbol || '$';

  return (
    <div className="p-6 rounded-2xl glass-card border border-slate-800 space-y-4 flex flex-col justify-between">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-white tracking-tight">Cash Flow Dynamics</h3>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/20">
              Inflow vs Outflow ({homeCurrency})
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Normalized monthly cash movement across all currency accounts
          </p>
        </div>

        {/* Legend pills */}
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <span className="text-slate-300">Income</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
            <span className="text-slate-300">Expenses</span>
          </div>
        </div>
      </div>

      {/* Recharts Area Chart */}
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={CASH_FLOW_MOCK} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
            <defs>
              <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#F43F5E" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#F43F5E" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
            <XAxis
              dataKey="month"
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
                  const inc = payload[0]?.value as number;
                  const exp = payload[1]?.value as number;
                  const net = inc - exp;
                  return (
                    <div className="p-3 bg-slate-900 border border-slate-700/80 rounded-xl text-xs shadow-2xl space-y-1.5 min-w-[150px]">
                      <p className="font-bold text-white border-b border-slate-800 pb-1">{label}</p>
                      <div className="flex justify-between items-center text-emerald-400">
                        <span>Inflow:</span>
                        <span className="font-mono font-bold">
                          {symbol}
                          {inc?.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-rose-400">
                        <span>Outflow:</span>
                        <span className="font-mono font-bold">
                          {symbol}
                          {exp?.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-indigo-300 pt-1 border-t border-slate-800 font-semibold">
                        <span>Net Profit:</span>
                        <span className="font-mono">
                          {symbol}
                          {net?.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area
              type="monotone"
              dataKey="income"
              stroke="#10B981"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#incomeGrad)"
            />
            <Area
              type="monotone"
              dataKey="expense"
              stroke="#F43F5E"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#expenseGrad)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
