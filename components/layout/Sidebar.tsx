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
  Plus,
  Search,
  ExternalLink,
  X,
  MessageSquareText,
} from 'lucide-react';

export function Sidebar() {
  const pathname = usePathname();
  const {
    homeCurrency,
    setIsConnectModalOpen,
    setIsAIModalOpen,
    setIsCommandPaletteOpen,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    userProfile,
  } = useNexa();

  const navItems = [
    { label: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Accounts', href: '/dashboard/accounts', icon: CreditCard },
    { label: 'Transactions', href: '/dashboard/transactions', icon: ArrowLeftRight },
    { label: 'Analytics & FX', href: '/dashboard/analytics', icon: PieChart },
    { label: 'Settings', href: '/dashboard/settings', icon: Settings },
  ];

  const renderContent = (isMobile = false) => (
    <div className="h-full flex flex-col justify-between overflow-y-auto">
      {/* Top Branding & Search */}
      <div className="p-4 sm:p-5 flex flex-col gap-4 sm:gap-5">
        {/* Brand Header */}
        <div className="flex items-center justify-between">
          <Link
            href="/dashboard"
            onClick={() => isMobile && setIsMobileMenuOpen(false)}
            className="flex items-center gap-2.5"
          >
            <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-sm tracking-tight">
              N
            </div>
            <div>
              <span className="font-bold text-base tracking-tight text-slate-900 leading-none">
                Nexa
              </span>
              <p className="text-[11px] text-slate-500 font-medium mt-0.5">Multi-Currency OS</p>
            </div>
          </Link>

          {isMobile && (
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors"
              aria-label="Close navigation menu"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Cmd+K Search trigger */}
        <button
          onClick={() => {
            setIsCommandPaletteOpen(true);
            if (isMobile) setIsMobileMenuOpen(false);
          }}
          className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs text-slate-600 hover:text-slate-900 transition-colors shadow-2xs cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>Search ledger...</span>
          </div>
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono font-semibold bg-white text-slate-500 rounded border border-slate-200 shrink-0">
            ⌘K
          </kbd>
        </button>

        {/* Financial Intelligence trigger */}
        <button
          onClick={() => {
            setIsAIModalOpen(true);
            if (isMobile) setIsMobileMenuOpen(false);
          }}
          className="w-full p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-900">
              <MessageSquareText className="w-4 h-4 text-slate-700 shrink-0" />
              <span className="text-xs font-semibold">Financial Insights</span>
            </div>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-200/70 text-slate-700 font-medium">
              Query
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1 leading-snug">
            Query balances & spend in natural language
          </p>
        </button>

        {/* Navigation */}
        <nav className="flex flex-col gap-1 pt-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => isMobile && setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-slate-900 text-white font-semibold shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
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
      <div className="p-4 border-t border-slate-200 flex flex-col gap-2.5 bg-white">
        {/* Connect Account Button */}
        <button
          onClick={() => {
            setIsConnectModalOpen(true);
            if (isMobile) setIsMobileMenuOpen(false);
          }}
          className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-semibold text-white transition-colors shadow-2xs cursor-pointer"
        >
          <Plus className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Connect account</span>
        </button>

        {/* Demo Mode Link */}
        <Link
          href="/demo"
          onClick={() => isMobile && setIsMobileMenuOpen(false)}
          className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0" />
            <span className="font-medium truncate">Public demo sandbox</span>
          </div>
          <ExternalLink className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        </Link>

        {/* User profile capsule */}
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-xs font-bold shrink-0">
              AR
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-slate-900 truncate leading-snug">
                {userProfile.name}
              </p>
              <p className="text-[11px] text-slate-500 truncate leading-snug">
                Home: <span className="font-mono font-semibold text-slate-700">{homeCurrency}</span> ({CURRENCY_METADATA[homeCurrency]?.symbol})
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden md:flex w-60 h-screen bg-white border-r border-slate-200 flex-col justify-between shrink-0 select-none z-30">
        {renderContent(false)}
      </aside>

      {/* Mobile Drawer Overlay & Sheet */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150"
          />

          {/* Slide-out Drawer */}
          <div className="fixed inset-y-0 left-0 w-72 max-w-[85vw] bg-white border-r border-slate-200 shadow-2xl z-10 flex flex-col animate-in slide-in-from-left duration-200">
            {renderContent(true)}
          </div>
        </div>
      )}
    </>
  );
}
