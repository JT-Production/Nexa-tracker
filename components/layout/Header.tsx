'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { useNexa } from '@/context/NexaContext';
import { CURRENCY_METADATA } from '@/lib/money';
import { CurrencyCode } from '@/types';
import {
  Sparkles,
  Plus,
  RefreshCw,
  TrendingUp,
  Globe,
  Bell,
  ChevronDown,
} from 'lucide-react';

export function Header() {
  const pathname = usePathname();
  const {
    homeCurrency,
    setHomeCurrency,
    fxRates,
    refreshFXRates,
    setIsAddTxModalOpen,
    setIsAIModalOpen,
  } = useNexa();

  const [isCurrencyDropdownOpen, setIsCurrencyDropdownOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Derive route name for breadcrumbs
  const getPageTitle = () => {
    if (pathname === '/dashboard') return 'Dashboard Overview';
    if (pathname.startsWith('/dashboard/accounts')) return 'Connected Accounts';
    if (pathname.startsWith('/dashboard/transactions')) return 'Transaction Ledger';
    if (pathname.startsWith('/dashboard/analytics')) return 'Analytics & FX Exposure';
    if (pathname.startsWith('/dashboard/settings')) return 'Preferences & Settings';
    if (pathname === '/demo') return 'Public Demo Mode';
    return 'Dashboard';
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    refreshFXRates();
    setTimeout(() => setIsRefreshing(false), 600);
  };

  const currencyOptions: CurrencyCode[] = ['USD', 'EUR', 'GBP', 'NGN', 'CAD', 'AUD', 'JPY', 'BTC'];

  return (
    <header className="h-16 border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-xl px-6 flex items-center justify-between sticky top-0 z-20">
      {/* Left: Breadcrumbs & Page title */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span>Nexa</span>
          <span className="text-slate-600">/</span>
          <span className="font-semibold text-white">{getPageTitle()}</span>
        </div>
      </div>

      {/* Center: Live FX Ticker Strip */}
      <div className="hidden xl:flex items-center gap-3 px-3 py-1 rounded-full bg-slate-900/80 border border-slate-800/80 text-[11px]">
        <div className="flex items-center gap-1.5 text-slate-400 font-medium">
          <Globe className="w-3.5 h-3.5 text-indigo-400" />
          <span>Live FX:</span>
        </div>
        <div className="flex items-center gap-3 font-mono text-slate-300">
          <span>
            EUR/USD <strong className="text-white font-semibold">{(1 / (fxRates.EUR || 0.92)).toFixed(2)}</strong>
          </span>
          <span className="text-slate-700">|</span>
          <span>
            GBP/USD <strong className="text-white font-semibold">{(1 / (fxRates.GBP || 0.79)).toFixed(2)}</strong>
          </span>
          <span className="text-slate-700">|</span>
          <span>
            USD/NGN <strong className="text-white font-semibold">{(fxRates.NGN || 1540).toLocaleString()}</strong>
          </span>
          <span className="text-slate-700">|</span>
          <span>
            BTC <strong className="text-emerald-400 font-semibold">$66.7k</strong>
          </span>
        </div>
        <button
          onClick={handleRefresh}
          className={`p-1 rounded-full text-slate-400 hover:text-white transition-colors ${
            isRefreshing ? 'animate-spin text-indigo-400' : ''
          }`}
          title="Refresh live exchange rates"
        >
          <RefreshCw className="w-3 h-3" />
        </button>
      </div>

      {/* Right: Home Currency Selector + Action buttons */}
      <div className="flex items-center gap-3">
        {/* Home Currency Switcher */}
        <div className="relative">
          <button
            onClick={() => setIsCurrencyDropdownOpen(!isCurrencyDropdownOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-xs font-semibold text-white transition-all shadow-sm"
          >
            <span className="text-sm">{CURRENCY_METADATA[homeCurrency]?.flag}</span>
            <span>{homeCurrency}</span>
            <span className="text-slate-400 font-normal">({CURRENCY_METADATA[homeCurrency]?.symbol})</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {isCurrencyDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 rounded-xl glass-panel border border-slate-700 shadow-2xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150 bg-slate-900">
              <p className="px-2 py-1 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Select Home Currency
              </p>
              {currencyOptions.map((code) => {
                const meta = CURRENCY_METADATA[code];
                const isSelected = homeCurrency === code;
                return (
                  <button
                    key={code}
                    onClick={() => {
                      setHomeCurrency(code);
                      setIsCurrencyDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                      isSelected
                        ? 'bg-indigo-600 text-white font-bold'
                        : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span>{meta?.flag}</span>
                      <span>{code}</span>
                      <span className="text-slate-400 font-mono text-[11px]">{meta?.symbol}</span>
                    </div>
                    {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Ask AI Button */}
        <button
          onClick={() => setIsAIModalOpen(true)}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-indigo-500/20 to-purple-500/20 hover:from-indigo-500/30 hover:to-purple-500/30 border border-indigo-500/40 text-xs font-semibold text-indigo-300 hover:text-white transition-all shadow-sm"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>Ask AI</span>
        </button>

        {/* Record Transaction Button */}
        <button
          onClick={() => setIsAddTxModalOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-xs font-bold text-slate-950 transition-all shadow-lg shadow-emerald-500/20 active:scale-95"
        >
          <Plus className="w-3.5 h-3.5 stroke-[3]" />
          <span>Add Transaction</span>
        </button>
      </div>
    </header>
  );
}
