'use client';

import React from 'react';
import Link from 'next/link';
import { useNexa } from '@/context/NexaContext';
import { CURRENCY_METADATA } from '@/lib/money';
import { CurrencyCode } from '@/types';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { NetWorthCard } from '@/components/dashboard/NetWorthCard';
import { QuickStats } from '@/components/dashboard/QuickStats';
import { AccountsGrid } from '@/components/dashboard/AccountsGrid';
import { CashFlowChart } from '@/components/dashboard/CashFlowChart';
import { RecentTransactions } from '@/components/dashboard/RecentTransactions';
import { QuickExchangeCalc } from '@/components/dashboard/QuickExchangeCalc';
import { ConnectAccountModal } from '@/components/modals/ConnectAccountModal';
import { AddTransactionModal } from '@/components/modals/AddTransactionModal';
import { AIQueryModal } from '@/components/modals/AIQueryModal';
import { CommandPalette } from '@/components/modals/CommandPalette';
import {
  Sparkles,
  RotateCcw,
  Bot,
  Plus,
  Building2,
  CheckCircle2,
  Globe,
  ArrowRight,
} from 'lucide-react';

export default function PublicDemoPage() {
  const {
    homeCurrency,
    setHomeCurrency,
    resetDemoData,
    setIsAIModalOpen,
    setIsConnectModalOpen,
    setIsAddTxModalOpen,
    setIsCommandPaletteOpen,
  } = useNexa();

  const currencies: CurrencyCode[] = ['USD', 'EUR', 'GBP', 'NGN', 'CAD', 'JPY', 'BTC'];

  return (
    <div className="flex h-screen overflow-hidden bg-[#080B11] text-slate-100">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />

        {/* Demo Mode Floating Announcement Banner */}
        <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-emerald-950 border-b border-indigo-500/30 px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <span className="font-bold text-white">✨ Recruiter & Public Demo Mode Active</span>
            <span className="text-slate-400 hidden sm:inline">
              — Zero signup required. Explore live multi-currency normalization & AI co-pilot.
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Currency quick buttons in banner */}
            <div className="flex items-center gap-1 bg-slate-950/70 p-1 rounded-lg border border-slate-800">
              <span className="text-[10px] text-slate-400 px-1 font-medium">Home FX:</span>
              {currencies.slice(0, 4).map((c) => (
                <button
                  key={c}
                  onClick={() => setHomeCurrency(c)}
                  className={`px-1.5 py-0.5 rounded text-[11px] font-mono font-bold transition-colors ${
                    homeCurrency === c
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>

            <button
              onClick={resetDemoData}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Data</span>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Quick Demo Action Ribbon */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-900/30 to-purple-900/30 border border-indigo-500/30 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <span className="font-semibold text-white">Try interactive features:</span>
                <span className="text-slate-400">Add transactions, connect banks, or test AI</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsAIModalOpen(true)}
                  className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white shadow-md shadow-indigo-600/20 transition-all flex items-center gap-1.5"
                >
                  <Bot className="w-3.5 h-3.5" />
                  <span>Ask AI Co-Pilot</span>
                </button>
                <button
                  onClick={() => setIsConnectModalOpen(true)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-all flex items-center gap-1.5"
                >
                  <Building2 className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Mock Plaid Link</span>
                </button>
                <button
                  onClick={() => setIsAddTxModalOpen(true)}
                  className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-xs font-bold text-slate-950 shadow-md shadow-emerald-500/20 transition-all flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Record Transaction</span>
                </button>
              </div>
            </div>

            {/* Overview Components */}
            <NetWorthCard />
            <QuickStats />
            <AccountsGrid />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <CashFlowChart />
              </div>
              <div>
                <QuickExchangeCalc />
              </div>
            </div>

            <RecentTransactions />
          </div>
        </main>
      </div>

      {/* Modals */}
      <ConnectAccountModal />
      <AddTransactionModal />
      <AIQueryModal />
      <CommandPalette />
    </div>
  );
}
