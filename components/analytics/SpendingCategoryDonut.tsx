'use client';

import React from 'react';
import { useNexa } from '@/context/NexaContext';
import { convertCurrencySmallestUnit, formatMoney, fromSmallestUnit } from '@/lib/money';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { PieChart as PieIcon } from 'lucide-react';

const PALETTE = [
  '#6366F1', // Indigo
  '#10B981', // Emerald
  '#F59E0B', // Amber
  '#EC4899', // Pink
  '#06B6D4', // Cyan
  '#8B5CF6', // Purple
  '#F43F5E', // Rose
  '#3B82F6', // Blue
];

export function SpendingCategoryDonut() {
  const { transactions, homeCurrency, fxRates } = useNexa();

  // Aggregate expenses by category
  const expenseMap = new Map<string, number>();
  let totalExpense = 0;

  transactions
    .filter((t) => t.type === 'expense')
    .forEach((tx) => {
      const converted = convertCurrencySmallestUnit(
        tx.amountSmallestUnit,
        tx.currency,
        homeCurrency,
        fxRates
      );
      const current = expenseMap.get(tx.category) || 0;
      expenseMap.set(tx.category, current + converted);
      totalExpense += converted;
    });

  const chartData = Array.from(expenseMap.entries())
    .map(([name, smallestUnit]) => ({
      name,
      value: fromSmallestUnit(smallestUnit, homeCurrency),
      smallestUnit,
      percentage: totalExpense > 0 ? Math.round((smallestUnit / totalExpense) * 100) : 0,
    }))
    .sort((a, b) => b.value - a.value);

  return (
    <div className="p-6 rounded-2xl glass-card border border-slate-800 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400">
            <PieIcon className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-white tracking-tight">Spending by Category</h3>
        </div>
        <span className="text-xs font-mono text-slate-400">
          Total: <strong className="text-white">{formatMoney(totalExpense, homeCurrency)}</strong>
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
        {/* Donut chart */}
        <div className="h-56 w-full relative flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={4}
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={PALETTE[index % PALETTE.length]}
                    stroke="#0F172A"
                    strokeWidth={2}
                  />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs shadow-2xl text-white">
                        <p className="font-bold">{data.name}</p>
                        <p className="text-emerald-400 font-mono mt-0.5">
                          {formatMoney(data.smallestUnit, homeCurrency)} ({data.percentage}%)
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
            </PieChart>
          </ResponsiveContainer>

          {/* Center text in donut */}
          <div className="absolute flex flex-col items-center justify-center pointer-events-none">
            <span className="text-[10px] text-slate-400 font-medium">Top Category</span>
            <span className="text-xs font-bold text-white truncate max-w-[90px]">
              {chartData[0]?.name || 'N/A'}
            </span>
          </div>
        </div>

        {/* Legend list with progress indicators */}
        <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
          {chartData.map((item, idx) => (
            <div key={item.name} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: PALETTE[idx % PALETTE.length] }}
                  />
                  <span className="text-slate-300 font-medium">{item.name}</span>
                </div>
                <span className="font-mono text-slate-400 text-[11px]">
                  {formatMoney(item.smallestUnit, homeCurrency)} ({item.percentage}%)
                </span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${item.percentage}%`,
                    backgroundColor: PALETTE[idx % PALETTE.length],
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
