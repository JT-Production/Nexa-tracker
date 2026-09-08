'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useNexa } from '@/context/NexaContext';
import { formatMoney, convertCurrencySmallestUnit } from '@/lib/money';
import {
  ArrowLeft,
  Building2,
  RefreshCw,
  Plus,
  Trash2,
  ShieldCheck,
  TrendingUp,
  Tag,
  ArrowUpRight,
  ArrowDownLeft,
} from 'lucide-react';

interface AccountDetailViewProps {
  accountId: string;
}

export function AccountDetailView({ accountId }: AccountDetailViewProps) {
  const router = useRouter();
  const {
    accounts,
    transactions,
    homeCurrency,
    fxRates,
    disconnectAccount,
    setIsAddTxModalOpen,
  } = useNexa();

  const account = accounts.find((a) => a.id === accountId);

  if (!account) {
    return (
      <div className="p-8 text-center space-y-4">
        <p className="text-slate-400 text-sm">Account not found or has been disconnected.</p>
        <Link
          href="/dashboard/accounts"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Accounts</span>
        </Link>
      </div>
    );
  }

  const accountTransactions = transactions.filter((t) => t.accountId === account.id);
  const convertedBalance = convertCurrencySmallestUnit(
    account.balanceSmallestUnit,
    account.currency,
    homeCurrency,
    fxRates
  );

  const handleDisconnect = () => {
    if (confirm(`Are you sure you want to disconnect ${account.name}?`)) {
      disconnectAccount(account.id);
      router.push('/dashboard/accounts');
    }
  };

  return (
    <div className="space-y-6">
      {/* Back button & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/accounts"
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white tracking-tight">{account.name}</h2>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 font-mono text-slate-300 border border-slate-700">
                {account.currency}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {account.institution} · Masked ID: {account.accountNumberMasked || '•••• 8912'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAddTxModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Transaction</span>
          </button>
          <button
            onClick={handleDisconnect}
            className="p-2 rounded-xl bg-slate-900 hover:bg-rose-950/40 border border-slate-800 hover:border-rose-500/40 text-slate-400 hover:text-rose-400 transition-colors"
            title="Disconnect Account"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Hero Balance Card */}
      <div className="p-6 rounded-2xl glass-card border border-indigo-500/30 bg-gradient-to-br from-slate-900/90 via-slate-900/60 to-indigo-950/40 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400">Available Account Balance</span>
          <div className="flex items-center gap-1.5 text-xs text-emerald-400">
            <ShieldCheck className="w-4 h-4" />
            <span>Synced & Verified</span>
          </div>
        </div>

        <div>
          <p className="text-4xl font-extrabold text-white font-sans tracking-tight">
            {formatMoney(account.balanceSmallestUnit, account.currency)}
          </p>
          {account.currency !== homeCurrency && (
            <p className="text-sm font-mono text-slate-300 mt-1">
              ≈ {formatMoney(convertedBalance, homeCurrency)}{' '}
              <span className="text-slate-500 text-xs font-sans">
                (at current live spot rate in {homeCurrency})
              </span>
            </p>
          )}
        </div>
      </div>

      {/* Account Transactions Ledger */}
      <div className="p-6 rounded-2xl glass-card border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white tracking-tight">
            Account Ledger History ({accountTransactions.length})
          </h3>
        </div>

        <div className="divide-y divide-slate-800/60">
          {accountTransactions.map((tx) => {
            const isIncome = tx.type === 'income';
            return (
              <div
                key={tx.id}
                className="py-3.5 flex items-center justify-between gap-3 hover:bg-slate-800/20 px-2 rounded-xl transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center border ${
                      isIncome
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : 'bg-slate-800 text-slate-300 border-slate-700'
                    }`}
                  >
                    {isIncome ? (
                      <ArrowUpRight className="w-4 h-4" />
                    ) : (
                      <ArrowDownLeft className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white">{tx.description}</p>
                    <p className="text-[11px] text-slate-400">
                      {tx.category} · {new Date(tx.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <p
                  className={`text-xs font-bold font-mono ${
                    isIncome ? 'text-emerald-400' : 'text-slate-200'
                  }`}
                >
                  {isIncome ? '+' : '-'}
                  {formatMoney(tx.amountSmallestUnit, tx.currency)}
                </p>
              </div>
            );
          })}

          {accountTransactions.length === 0 && (
            <div className="py-8 text-center text-slate-500 text-xs">
              No transactions recorded for this account yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
