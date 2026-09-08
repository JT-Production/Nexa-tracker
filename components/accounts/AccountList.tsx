'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useNexa } from '@/context/NexaContext';
import { AccountType } from '@/types';
import { formatMoney, convertCurrencySmallestUnit } from '@/lib/money';
import {
  Building2,
  Plus,
  ArrowRight,
  Trash2,
  ExternalLink,
  Shield,
  Layers,
  Sparkles,
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
          <h2 className="text-xl font-bold text-white tracking-tight">Connected Accounts</h2>
          <p className="text-xs text-slate-400 mt-1">
            Manage your fiat bank accounts, multi-currency fintech wallets, and crypto vaults
          </p>
        </div>

        <button
          onClick={() => setIsConnectModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all active:scale-95"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Connect New Institution</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex bg-slate-900/80 p-1 rounded-xl border border-slate-800 text-xs w-fit">
        {[
          { id: 'all', label: 'All Accounts' },
          { id: 'bank', label: 'Banks' },
          { id: 'fintech', label: 'FinTech (Wise/Revolut)' },
          { id: 'crypto', label: 'Crypto & Vaults' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterType(tab.id)}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              filterType === tab.id
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
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
              className="p-5 rounded-2xl glass-card border border-slate-800 hover:border-indigo-500/40 transition-all flex flex-col justify-between h-52 relative group"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold border border-white/10"
                      style={{
                        backgroundColor: `${account.institutionColor || '#6366F1'}25`,
                        color: account.institutionColor || '#6366F1',
                      }}
                    >
                      {account.currency}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">
                        {account.name}
                      </h3>
                      <p className="text-[11px] text-slate-400 capitalize">
                        {account.institution} · {account.accountNumberMasked || 'Active'}
                      </p>
                    </div>
                  </div>

                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-mono">
                    {account.currency}
                  </span>
                </div>

                <div className="mt-4">
                  <p className="text-2xl font-bold font-sans text-white tracking-tight">
                    {formatMoney(account.balanceSmallestUnit, account.currency)}
                  </p>
                  {account.currency !== homeCurrency && (
                    <p className="text-xs text-slate-400 font-mono mt-0.5">
                      ≈ {formatMoney(converted, homeCurrency)}{' '}
                      <span className="text-slate-500 font-sans">in {homeCurrency}</span>
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 text-xs">
                <Link
                  href={`/dashboard/accounts/${account.id}`}
                  className="flex items-center gap-1.5 text-indigo-400 hover:text-indigo-300 font-semibold"
                >
                  <span>View History</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                <button
                  onClick={() => disconnectAccount(account.id)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                  title="Disconnect account"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
