'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useNexa } from '@/context/NexaContext';
import { CURRENCY_METADATA } from '@/lib/money';
import {
  LayoutDashboard,
  CreditCard,
  ArrowLeftRight,
  PieChart,
  Settings,
  Sparkles,
  Plus,
  Search,
  ExternalLink,
} from 'lucide-react';

export function Sidebar() {
  const pathname = usePathname();
  const {
    homeCurrency,
    setIsConnectModalOpen,
    setIsAIModalOpen,
    setIsCommandPaletteOpen,
    userProfile,
  } = useNexa();

  const navItems = [
    { label: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Accounts', href: '/dashboard/accounts', icon: CreditCard },
    { label: 'Transactions', href: '/dashboard/transactions', icon: ArrowLeftRight },
    { label: 'Analytics & FX', href: '/dashboard/analytics', icon: PieChart },
    { label: 'Settings', href: '/dashboard/settings', icon: Settings },
  ];

  return (
    <aside className="w-64 min-w-[16rem] h-screen bg-slate-950/95 border-r border-slate-800/80 flex flex-col justify-between shrink-0 select-none z-30">
      {/* Top Branding & Search */}
      <div className="p-5 flex flex-col gap-5">
        {/* Brand */}
        <div className="flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 via-indigo-500 to-indigo-600 p-[1.5px] shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <span className="text-base font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-indigo-400">
                  N
                </span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base tracking-tight text-white leading-none">NEXA</span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  PRO
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium mt-1">Multi-Currency OS</p>
            </div>
          </Link>
        </div>

        {/* Cmd+K Search Bar button */}
        <button
          onClick={() => setIsCommandPaletteOpen(true)}
          className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800/90 border border-slate-800 text-xs text-slate-400 hover:text-slate-200 transition-all shadow-inner"
        >
          <div className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <span>Search or command...</span>
          </div>
          <kbd className="px-1.5 py-0.5 text-[10px] font-mono font-semibold bg-slate-800 text-slate-400 rounded border border-slate-700/60 shrink-0">
            ⌘K
          </kbd>
        </button>

        {/* AI Co-pilot Callout Card */}
        <button
          onClick={() => setIsAIModalOpen(true)}
          className="w-full p-3.5 rounded-xl bg-gradient-to-br from-indigo-950/60 to-purple-950/60 hover:from-indigo-950/80 hover:to-purple-950/80 border border-indigo-500/30 text-left transition-all group"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400 group-hover:rotate-12 transition-transform shrink-0" />
              <span className="text-xs font-bold text-white">Ask Nexa AI</span>
            </div>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-medium shrink-0">
              Co-Pilot
            </span>
          </div>
          <p className="text-[11px] text-slate-300 mt-1.5 leading-snug">Query finances in plain English</p>
        </button>

        {/* Main Navigation */}
        <nav className="flex flex-col gap-1">
          <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
            Menu
          </p>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-lg shadow-indigo-600/25'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900/80'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Area: Connect Account & User Info */}
      <div className="p-4 border-t border-slate-800/80 flex flex-col gap-3 bg-slate-950">
        {/* Quick Connect Account Button */}
        <button
          onClick={() => setIsConnectModalOpen(true)}
          className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/60 hover:border-emerald-500/40 text-xs font-semibold text-slate-200 hover:text-white transition-all shadow-sm group"
        >
          <Plus className="w-4 h-4 text-emerald-400 group-hover:rotate-90 transition-transform shrink-0" />
          <span>Connect Account</span>
        </button>

        {/* Demo Mode / Recruiter Notice */}
        <Link
          href="/demo"
          className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-emerald-950/30 border border-emerald-500/20 text-[11px] text-emerald-300 hover:bg-emerald-950/50 transition-colors"
        >
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <span className="font-semibold truncate">Public Demo Mode</span>
          </div>
          <ExternalLink className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
        </Link>

        {/* User profile capsule */}
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/60">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-xs font-bold text-white shrink-0">
              AR
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-white truncate leading-snug">{userProfile.name}</p>
              <p className="text-[10px] text-slate-400 truncate leading-snug">
                Home: <span className="text-emerald-400 font-mono font-semibold">{homeCurrency}</span> ({CURRENCY_METADATA[homeCurrency]?.symbol})
              </p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
