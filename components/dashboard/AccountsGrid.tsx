'use client';

import React from 'react';
import { useNexa } from '@/context/NexaContext';
import { AccountCard } from './AccountCard';
import { Plus, Building2 } from 'lucide-react';
import Link from 'next/link';

export function AccountsGrid() {
  const { accounts, setIsConnectModalOpen } = useNexa();

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-bold text-white tracking-tight">Connected Accounts</h3>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-slate-800 text-slate-300 border border-slate-700">
            {accounts.length}
          </span>
        </div>
        <Link
          href="/dashboard/accounts"
          className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
        >
          View All Accounts →
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {accounts.map((account) => (
          <AccountCard key={account.id} account={account} />
        ))}

        {/* Connect New Account Action Card */}
        <button
          onClick={() => setIsConnectModalOpen(true)}
          className="group p-5 rounded-2xl border border-dashed border-slate-700/80 hover:border-indigo-500/50 bg-slate-900/30 hover:bg-slate-900/60 transition-all flex flex-col items-center justify-center text-center gap-2 h-44 cursor-pointer"
        >
          <div className="w-10 h-10 rounded-xl bg-slate-800 group-hover:bg-indigo-600/20 text-slate-400 group-hover:text-indigo-400 border border-slate-700 group-hover:border-indigo-500/30 flex items-center justify-center transition-all">
            <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-300 group-hover:text-white transition-colors">
              + Link Another Account
            </p>
            <p className="text-[10px] text-slate-400 mt-0.5">
              Chase, Wise, Revolut, GTBank, Binance
            </p>
          </div>
        </button>
      </div>
    </div>
  );
}
