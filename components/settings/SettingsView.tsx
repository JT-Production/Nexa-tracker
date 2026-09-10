'use client';

import React, { useState } from 'react';
import { useNexa } from '@/context/NexaContext';
import { CURRENCY_METADATA } from '@/lib/money';
import { CurrencyCode } from '@/types';
import {
  Settings,
  Globe,
  User,
  Shield,
  CreditCard,
  RotateCcw,
  Check,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

export function SettingsView() {
  const {
    homeCurrency,
    setHomeCurrency,
    userProfile,
    accounts,
    resetDemoData,
    addToast,
  } = useNexa();

  const [name, setName] = useState(userProfile.name);
  const [email, setEmail] = useState(userProfile.email);
  const [isSaved, setIsSaved] = useState(false);

  const currencies: CurrencyCode[] = ['USD', 'EUR', 'GBP', 'NGN', 'CAD', 'AUD', 'JPY', 'BTC'];

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    addToast('Settings Saved', 'Profile information updated successfully', 'success');
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="max-w-4xl space-y-8">
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">System Preferences & Settings</h2>
        <p className="text-xs text-slate-500 mt-1">
          Customize your default home currency, profile, notifications, and demo workspace
        </p>
      </div>

      {/* 1. Home Currency Configuration */}
      <div className="p-6 rounded-2xl bg-white border border-black/10 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-200">
            <Globe className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">Primary Home Currency</h3>
            <p className="text-xs text-slate-500">
              All multi-currency accounts, transactions, and net worth charts normalize to this currency
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          {currencies.map((code) => {
            const meta = CURRENCY_METADATA[code];
            const isSelected = homeCurrency === code;

            return (
              <button
                key={code}
                onClick={() => setHomeCurrency(code)}
                className={`p-3.5 rounded-xl text-left border transition-all flex flex-col justify-between h-24 cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-50 border-indigo-500 text-slate-900 shadow-xs'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xl">{meta.flag}</span>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 font-mono">{code}</p>
                  <p className="text-[11px] text-slate-500 truncate">{meta.name}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Profile Details */}
      <div className="p-6 rounded-2xl bg-white border border-black/10 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200">
            <User className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">Profile & Identity</h3>
            <p className="text-xs text-slate-500">Manage your workspace operator information</p>
          </div>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4 max-w-lg pt-2">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white"
            />
          </div>

          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white shadow-sm transition-all flex items-center gap-2 cursor-pointer"
          >
            {isSaved ? <Check className="w-3.5 h-3.5" /> : null}
            <span>{isSaved ? 'Changes Saved' : 'Save Changes'}</span>
          </button>
        </form>
      </div>

      {/* 3. Demo & Reset Zone */}
      <div className="p-6 rounded-2xl bg-rose-50/40 border border-rose-200 space-y-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-rose-100 text-rose-600">
            <RotateCcw className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">Demo Dataset Maintenance</h3>
            <p className="text-xs text-slate-500">
              Restore initial pre-seeded multi-currency accounts and sample ledger
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
          <p className="text-xs text-slate-600 max-w-md">
            Resetting clears temporary local transactions and restores default Chase, Wise, Revolut, GTBank, and Binance accounts.
          </p>
          <button
            onClick={resetDemoData}
            className="px-3.5 py-2 rounded-xl bg-rose-100 hover:bg-rose-200 border border-rose-300 text-xs font-semibold text-rose-700 transition-colors cursor-pointer shrink-0"
          >
            Reset All Demo Data
          </button>
        </div>
      </div>
    </div>
  );
}
