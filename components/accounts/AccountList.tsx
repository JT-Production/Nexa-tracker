'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useNexa } from '@/context/NexaContext';
import { formatMoney, convertCurrencySmallestUnit } from '@/lib/money';
import {
  Plus,
  ArrowRight,
  Trash2,
} from 'lucide-react';

export function AccountList() {
  const { accounts, homeCurrency, fxRates, setIsConnectModalOpen, disconnectAccount } = useNexa();
  const [filterType, setFilterType] = useState<string>('all');

  const filteredAccounts = accounts.filter((acc) => {
    if (filterType === 'all') return true;
    return acc.type === filterType;
  });

  return (
    <div className="space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Accounts</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Connected institutions, multi-currency balances, and settlement accounts
          </p>
        </div>

        <button
          onClick={() => setIsConnectModalOpen(true)}
          className="flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs shadow-2xs transition-colors active:scale-95 cursor-pointer w-full sm:w-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Connect account</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs gap-1 w-full sm:w-fit">
        {[
          { id: 'all', label: 'All accounts' },
          { id: 'bank', label: 'Banks' },
          { id: 'fintech', label: 'FinTech' },
          { id: 'crypto', label: 'Crypto & Vaults' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterType(tab.id)}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              filterType === tab.id
                ? 'bg-white text-slate-900 font-semibold shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Accounts List Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAccounts.map((account) => {
          const converted = convertCurrencySmallestUnit(
            account.balanceSmallestUnit,
            account.currency,
            homeCurrency,
            fxRates
          );

          return (
            <div
              key={account.id}
              className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 shadow-2xs transition-colors flex flex-col justify-between h-52"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold shrink-0"
                      style={{
                        backgroundColor: `${account.institutionColor || '#475569'}18`,
                        color: account.institutionColor || '#334155',
                      }}
                    >
                      {account.currency}
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900">
                        {account.name}
                      </h3>
                      <p className="text-[11px] text-slate-500 capitalize">
                        {account.institution} ({account.accountNumberMasked || 'Active'})
                      </p>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                    {account.type}
                  </span>
                </div>

                <div className="mt-4">
                  <p className="text-2xl font-bold font-sans text-slate-950 tracking-tight">
                    {formatMoney(account.balanceSmallestUnit, account.currency)}
                  </p>
                  {account.currency !== homeCurrency && (
                    <p className="text-xs text-slate-500 font-mono mt-0.5">
                      ≈ {formatMoney(converted, homeCurrency)}{' '}
                      <span className="text-[11px] text-slate-400 font-sans">
                        in {homeCurrency}
                      </span>
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
                <button
                  onClick={() => {
                    if (confirm(`Disconnect ${account.name}?`)) {
                      disconnectAccount(account.id);
                    }
                  }}
                  className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                  title="Disconnect account"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <Link
                  href={`/dashboard/accounts/${account.id}`}
                  className="flex items-center gap-1 font-semibold text-slate-800 hover:text-slate-950 transition-colors"
                >
                  <span>View ledger</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
