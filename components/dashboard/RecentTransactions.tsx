'use client';

import React from 'react';
import Link from 'next/link';
import { useNexa } from '@/context/NexaContext';
import { formatMoney, convertCurrencySmallestUnit } from '@/lib/money';
import {
  ArrowDownLeft,
  ArrowUpRight,
  Briefcase,
  Layers,
  Server,
  Monitor,
  Home,
  Utensils,
  Plane,
  Bitcoin,
  TrendingUp,
  Tag,
} from 'lucide-react';

const CATEGORY_ICONS: Record<string, any> = {
  'Client Payment': Briefcase,
  'Salary & Retainer': Briefcase,
  'Contract Work': Layers,
  'Software & SaaS': Layers,
  'Cloud & Servers': Server,
  'Hardware & Gear': Monitor,
  'Rent & Living': Home,
  'Food & Dining': Utensils,
  'Travel & Transport': Plane,
  'Crypto Trading': Bitcoin,
  'Investment': TrendingUp,
  'Miscellaneous': Tag,
};

export function RecentTransactions() {
  const { transactions, homeCurrency, fxRates, setIsAddTxModalOpen } = useNexa();

  const recentList = transactions.slice(0, 6);

  return (
    <div className="p-6 rounded-2xl glass-card border border-slate-800 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-bold text-white tracking-tight">Recent Ledger Activity</h3>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
            {transactions.length} total
          </span>
        </div>
        <Link
          href="/dashboard/transactions"
          className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
        >
          View Full Ledger →
        </Link>
      </div>

      {/* Transaction List */}
      <div className="divide-y divide-slate-800/60">
        {recentList.map((tx) => {
          const Icon = CATEGORY_ICONS[tx.category] || Tag;
          const isIncome = tx.type === 'income';
          const convertedAmount = convertCurrencySmallestUnit(
            tx.amountSmallestUnit,
            tx.currency,
            homeCurrency,
            fxRates
          );

          return (
            <div
              key={tx.id}
              className="py-3.5 flex items-center justify-between gap-3 hover:bg-slate-800/20 px-2 rounded-xl transition-colors"
            >
              {/* Left: Icon + Description & Account */}
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${
                    isIncome
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      : 'bg-slate-800/80 text-slate-300 border-slate-700/60'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-white truncate leading-snug">{tx.description}</p>
                  <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-400 leading-snug">
                    <span className="truncate">{tx.merchant || tx.category}</span>
                    <span>•</span>
                    <span className="font-mono text-[10px] text-slate-500">{tx.accountName}</span>
                  </div>
                </div>
              </div>

              {/* Right: Amounts (Original + Converted) */}
              <div className="text-right shrink-0">
                <p
                  className={`text-xs font-bold font-mono leading-none ${
                    isIncome ? 'text-emerald-400' : 'text-slate-200'
                  }`}
                >
                  {isIncome ? '+' : '-'}
                  {formatMoney(tx.amountSmallestUnit, tx.currency)}
                </p>

                {tx.currency !== homeCurrency && (
                  <p className="text-[10px] text-slate-400 font-mono mt-1 leading-none">
                    ≈ {formatMoney(convertedAmount, homeCurrency)}
                  </p>
                )}
              </div>
            </div>
          );
        })}

        {recentList.length === 0 && (
          <div className="py-8 text-center text-slate-500 text-xs">
            No transactions found. Click &quot;Add Transaction&quot; to create your first entry.
          </div>
        )}
      </div>

      <button
        onClick={() => setIsAddTxModalOpen(true)}
        className="w-full py-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
      >
        + Record New Transaction
      </button>
    </div>
  );
}
