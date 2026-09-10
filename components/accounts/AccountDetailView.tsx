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
            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 transition-colors shadow-2xs"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">{account.name}</h2>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 font-mono text-slate-700 border border-slate-200">
                {account.currency}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {account.institution} ({account.accountNumberMasked || '•••• 8912'})
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAddTxModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs shadow-2xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Record transaction</span>
          </button>
          <button
            onClick={handleDisconnect}
            className="p-2 rounded-xl bg-white hover:bg-rose-50 border border-slate-200 hover:border-rose-300 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer shadow-2xs"
            title="Disconnect account"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Hero Balance Card */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500">Available balance</span>
          <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-medium">
            <ShieldCheck className="w-4 h-4" />
            <span>Verified balance</span>
          </div>
        </div>

        <div>
          <p className="text-3xl sm:text-4xl font-bold text-slate-950 font-sans tracking-tight">
            {formatMoney(account.balanceSmallestUnit, account.currency)}
          </p>
          {account.currency !== homeCurrency && (
            <p className="text-xs font-mono text-slate-500 mt-1">
              ≈ {formatMoney(convertedBalance, homeCurrency)}{' '}
              <span className="text-slate-400 font-sans">
                (at current spot rate in {homeCurrency})
              </span>
            </p>
          )}
        </div>
      </div>

      {/* Account Transactions Ledger */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 tracking-tight">
            Account Ledger ({accountTransactions.length})
          </h3>
        </div>

        <div className="divide-y divide-slate-100">
          {accountTransactions.map((tx) => {
            const isIncome = tx.type === 'income';
            return (
              <div
                key={tx.id}
                className="py-3.5 flex items-center justify-between gap-3 hover:bg-slate-50 px-2 rounded-xl transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center border ${
                      isIncome
                        ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
                        : 'bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    {isIncome ? (
                      <ArrowUpRight className="w-4 h-4" />
                    ) : (
                      <ArrowDownLeft className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-900">{tx.description}</p>
                    <p className="text-[11px] text-slate-500">
                      {tx.category} · {new Date(tx.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <p
                  className={`text-xs font-bold font-mono ${
                    isIncome ? 'text-emerald-600' : 'text-slate-900'
                  }`}
                >
                  {isIncome ? '+' : '-'}
                  {formatMoney(tx.amountSmallestUnit, tx.currency)}
                </p>
              </div>
            );
          })}

          {accountTransactions.length === 0 && (
            <div className="py-8 text-center text-slate-400 text-xs">
              No transactions recorded for this account yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
