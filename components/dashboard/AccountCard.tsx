'use client';

import React from 'react';
import Link from 'next/link';
import { Account } from '@/types';
import { useNexa } from '@/context/NexaContext';
import { convertCurrencySmallestUnit, formatMoney } from '@/lib/money';
import { ArrowUpRight, Shield, ArrowRight } from 'lucide-react';

interface AccountCardProps {
  account: Account;
}

export function AccountCard({ account }: AccountCardProps) {
  const { homeCurrency, fxRates } = useNexa();

  const convertedSmallestUnit = convertCurrencySmallestUnit(
    account.balanceSmallestUnit,
    account.currency,
    homeCurrency,
    fxRates
  );

  return (
    <Link
      href={`/dashboard/accounts/${account.id}`}
      className="group relative p-5 rounded-2xl glass-card glass-card-hover border border-slate-800 flex flex-col justify-between h-44 overflow-hidden"
    >
      {/* Glow dot according to institution color */}
      <div
        className="absolute top-0 right-0 w-32 h-32 rounded-full blur-2xl opacity-15 pointer-events-none -mr-10 -mt-10"
        style={{ backgroundColor: account.institutionColor || '#6366F1' }}
      />

      {/* Top row: institution & currency tag */}
      <div className="flex items-start justify-between relative z-10">
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold border border-white/10"
            style={{
              backgroundColor: `${account.institutionColor || '#6366F1'}25`,
              color: account.institutionColor || '#6366F1',
            }}
          >
            {account.currency}
          </div>
          <div>
            <h4 className="text-xs font-semibold text-white group-hover:text-indigo-300 transition-colors">
              {account.name}
            </h4>
            <p className="text-[10px] text-slate-400 capitalize">
              {account.institution} · {account.accountNumberMasked || 'Active'}
            </p>
          </div>
        </div>

        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
          {account.currency}
        </span>
      </div>

      {/* Middle: Native balance + Converted home currency */}
      <div className="relative z-10 my-auto">
        <p className="text-xl font-bold font-sans text-white tracking-tight">
          {formatMoney(account.balanceSmallestUnit, account.currency)}
        </p>

        {account.currency !== homeCurrency && (
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            ≈ {formatMoney(convertedSmallestUnit, homeCurrency)}{' '}
            <span className="text-[10px] text-slate-500 font-sans">in {homeCurrency}</span>
          </p>
        )}
      </div>

      {/* Bottom row: Sparkline / Updated status & Arrow */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[10px] text-slate-400 relative z-10">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span>Synced {account.updatedAt || 'Just now'}</span>
        </div>
        <div className="flex items-center gap-1 text-slate-400 group-hover:text-indigo-400 transition-colors font-medium">
          <span>Details</span>
          <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
        </div>
      </div>
    </Link>
  );
}
