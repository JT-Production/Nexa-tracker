'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { useNexa } from '@/context/NexaContext';
import { CURRENCY_METADATA } from '@/lib/money';
import { CurrencyCode } from '@/types';
import {
  Menu,
  Plus,
  RefreshCw,
  Globe,
  Search,
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
    setIsCommandPaletteOpen,
    setIsMobileMenuOpen,
  } = useNexa();

  const [isCurrencyDropdownOpen, setIsCurrencyDropdownOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Derive route name for breadcrumbs
  const getPageTitle = () => {
    if (pathname === '/dashboard') return 'Overview';
    if (pathname.startsWith('/dashboard/accounts')) return 'Accounts';
    if (pathname.startsWith('/dashboard/transactions')) return 'Transactions';
    if (pathname.startsWith('/dashboard/analytics')) return 'Analytics & FX';
    if (pathname.startsWith('/dashboard/settings')) return 'Settings';
    if (pathname === '/demo') return 'Demo';
    return 'Dashboard';
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    refreshFXRates();
    setTimeout(() => setIsRefreshing(false), 600);
  };

  const currencyOptions: CurrencyCode[] = ['USD', 'EUR', 'GBP', 'NGN', 'CAD', 'AUD', 'JPY', 'BTC'];

  return (
    <header className="h-16 border-b border-slate-200 bg-white/90 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between sticky top-0 z-20">
      {/* Left: Mobile menu toggle + Page title */}
      <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="md:hidden p-2 -ml-1.5 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-xs text-slate-500 truncate">
          <span className="hidden sm:inline">Nexa</span>
          <span className="hidden sm:inline text-slate-300">/</span>
          <h1 className="font-semibold text-slate-900 truncate text-sm sm:text-xs">
            {getPageTitle()}
          </h1>
        </div>
      </div>

      {/* Center: Live FX Ticker Strip */}
      <div className="hidden xl:flex items-center gap-3 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-[11px]">
        <div className="flex items-center gap-1.5 text-slate-600 font-medium">
          <Globe className="w-3.5 h-3.5 text-slate-700" />
          <span>Live FX:</span>
        </div>
        <div className="flex items-center gap-3 font-mono text-slate-600">
          <span>
            EUR/USD <strong className="text-slate-900 font-semibold">{(1 / (fxRates.EUR || 0.92)).toFixed(2)}</strong>
          </span>
          <span className="text-slate-300">|</span>
          <span>
            GBP/USD <strong className="text-slate-900 font-semibold">{(1 / (fxRates.GBP || 0.79)).toFixed(2)}</strong>
          </span>
          <span className="text-slate-300">|</span>
          <span>
            USD/NGN <strong className="text-slate-900 font-semibold">{(fxRates.NGN || 1540).toLocaleString()}</strong>
          </span>
          <span className="text-slate-300">|</span>
          <span>
            BTC <strong className="text-emerald-700 font-semibold">$66.7k</strong>
          </span>
        </div>
        <button
          onClick={handleRefresh}
          className={`p-1 rounded-full text-slate-400 hover:text-slate-800 transition-colors cursor-pointer ${
            isRefreshing ? 'animate-spin text-slate-900' : ''
          }`}
          title="Refresh exchange rates"
        >
          <RefreshCw className="w-3 h-3" />
        </button>
      </div>

      {/* Right: Home Currency Selector + Search + Record Transaction */}
      <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
        {/* Search button trigger */}
        <button
          onClick={() => setIsCommandPaletteOpen(true)}
          className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 border border-transparent hover:border-slate-200 transition-colors cursor-pointer"
          title="Search transactions and accounts (Cmd+K)"
          aria-label="Search"
        >
          <Search className="w-4 h-4" />
        </button>

        {/* Home Currency Switcher */}
        <div className="relative">
          <button
            onClick={() => setIsCurrencyDropdownOpen(!isCurrencyDropdownOpen)}
            className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 transition-colors shadow-2xs cursor-pointer"
            aria-label="Select home currency"
          >
            <span className="text-sm">{CURRENCY_METADATA[homeCurrency]?.flag}</span>
            <span className="hidden xs:inline">{homeCurrency}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {isCurrencyDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 rounded-xl border border-slate-200 shadow-xl p-1.5 z-50 animate-in fade-in duration-100 bg-white">
              <p className="px-2 py-1 text-[11px] font-semibold text-slate-500">
                Home currency
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
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-slate-900 text-white font-semibold'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span>{meta?.flag}</span>
                      <span>{code}</span>
                      <span className={`font-mono text-[11px] ${isSelected ? 'text-slate-300' : 'text-slate-400'}`}>
                        {meta?.symbol}
                      </span>
                    </div>
                    {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Record Transaction Button */}
        <button
          onClick={() => setIsAddTxModalOpen(true)}
          className="flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-semibold text-white transition-colors shadow-2xs active:scale-95 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          <span className="hidden sm:inline">Record transaction</span>
          <span className="sm:hidden">Add</span>
        </button>
      </div>
    </header>
  );
}
