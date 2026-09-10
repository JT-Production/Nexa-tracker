'use client';

import React from 'react';
import Link from 'next/link';
import { useNexa } from '@/context/NexaContext';
import { formatMoney, convertCurrencySmallestUnit } from '@/lib/money';
import { ArrowDownLeft, ArrowUpRight, Plus } from 'lucide-react';

export function RecentTransactions() {
  const { transactions, homeCurrency, fxRates, setIsAddTxModalOpen } = useNexa();

  const recentList = transactions.slice(0, 6);

  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-bold text-slate-900 tracking-tight">Recent Transactions</h3>
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200 font-medium">
            {transactions.length} total
          </span>
        </div>
        <Link
          href="/dashboard/transactions"
          className="text-xs font-semibold text-slate-700 hover:text-slate-950 transition-colors"
        >
          View all →
        </Link>
      </div>

      {/* Transaction List */}
      <div className="divide-y divide-slate-100">
        {recentList.map((tx) => {
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
              className="py-3 flex items-center justify-between gap-3 hover:bg-slate-50 px-2 rounded-xl transition-colors"
            >
              {/* Left: Directional Flow Indicator + Description & Account */}
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border ${
                    isIncome
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-slate-100 text-slate-600 border-slate-200'
                  }`}
                >
                  {isIncome ? (
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  ) : (
                    <ArrowDownLeft className="w-3.5 h-3.5" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-slate-900 truncate leading-snug">
                    {tx.description}
                  </p>
                  <p className="text-[11px] text-slate-500 truncate leading-snug mt-0.5">
                    {tx.merchant || tx.category} ({tx.accountName || 'Primary'})
                  </p>
                </div>
              </div>

              {/* Right: Amounts (Original + Converted) */}
              <div className="text-right shrink-0">
                <p
                  className={`text-xs font-semibold font-mono leading-none ${
                    isIncome ? 'text-emerald-700' : 'text-slate-900'
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
            No transactions recorded yet — record your first transaction above.
          </div>
        )}
      </div>

      {/* Record action link */}
      <button
        onClick={() => setIsAddTxModalOpen(true)}
        className="w-full py-2 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-medium text-slate-700 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
      >
        <Plus className="w-3.5 h-3.5" />
        <span>Record a transaction</span>
      </button>
    </div>
  );
}
