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
    <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4 flex flex-col justify-between">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-slate-900 tracking-tight">Cash Flow Dynamics</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Normalized monthly cash movement in {homeCurrency}
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-600" />
            <span className="text-slate-600 font-medium">Income</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-600" />
            <span className="text-slate-600 font-medium">Expenses</span>
          </div>
        </div>
      </div>

      {/* Recharts Area Chart */}
      <div className="h-56 sm:h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={CASH_FLOW_MOCK} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
            <defs>
              <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#059669" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#059669" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#E11D48" stopOpacity={0.12} />
                <stop offset="95%" stopColor="#E11D48" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
            <XAxis
              dataKey="month"
              stroke="#64748B"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#E2E8F0' }}
            />
            <YAxis
              stroke="#64748B"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#E2E8F0' }}
              tickFormatter={(v) => `${symbol}${v >= 1000 ? (v / 1000).toFixed(0) + 'k' : v}`}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const inc = payload[0]?.value as number;
                  const exp = payload[1]?.value as number;
                  const net = inc - exp;
                  return (
                    <div className="p-3 bg-white border border-slate-200 rounded-xl text-xs shadow-lg space-y-1.5 min-w-[150px]">
                      <p className="font-semibold text-slate-900 border-b border-slate-100 pb-1">{label}</p>
                      <div className="flex justify-between items-center text-emerald-700">
                        <span>Inflow:</span>
                        <span className="font-mono font-semibold">
                          {symbol}
                          {inc?.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-rose-700">
                        <span>Outflow:</span>
                        <span className="font-mono font-semibold">
                          {symbol}
                          {exp?.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-slate-900 pt-1 border-t border-slate-100 font-semibold">
                        <span>Net:</span>
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
              stroke="#059669"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#incomeGrad)"
            />
            <Area
              type="monotone"
              dataKey="expense"
              stroke="#E11D48"
              strokeWidth={1.5}
              fillOpacity={1}
              fill="url(#expenseGrad)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
