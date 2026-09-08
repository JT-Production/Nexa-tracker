'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useNexa } from '@/context/NexaContext';
import { formatMoney } from '@/lib/money';
import {
  Search,
  PlusCircle,
  Building2,
  Sparkles,
  BarChart3,
  CreditCard,
  Settings,
  ArrowRight,
  TrendingUp,
  RotateCcw,
} from 'lucide-react';

export function CommandPalette() {
  const {
    isCommandPaletteOpen,
    setIsCommandPaletteOpen,
    setIsConnectModalOpen,
    setIsAddTxModalOpen,
    setIsAIModalOpen,
    setHomeCurrency,
    resetDemoData,
    accounts,
    transactions,
    homeCurrency,
  } = useNexa();

  const router = useRouter();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  if (!isCommandPaletteOpen) return null;

  const actions = [
    {
      id: 'act_add_tx',
      title: 'Record New Transaction',
      subtitle: 'Add income or expense in any currency',
      icon: <PlusCircle className="w-4 h-4 text-emerald-400" />,
      category: 'Actions',
      run: () => {
        setIsCommandPaletteOpen(false);
        setIsAddTxModalOpen(true);
      },
    },
    {
      id: 'act_connect_acc',
      title: 'Connect Bank or Crypto Account',
      subtitle: 'Link Chase, Wise, Revolut, GTBank, Binance',
      icon: <Building2 className="w-4 h-4 text-indigo-400" />,
      category: 'Actions',
      run: () => {
        setIsCommandPaletteOpen(false);
        setIsConnectModalOpen(true);
      },
    },
    {
      id: 'act_ask_ai',
      title: 'Ask Nexa Financial AI',
      subtitle: 'Query net worth, runway, cash flow in plain English',
      icon: <Sparkles className="w-4 h-4 text-purple-400" />,
      category: 'Actions',
      run: () => {
        setIsCommandPaletteOpen(false);
        setIsAIModalOpen(true);
      },
    },
    {
      id: 'nav_overview',
      title: 'Go to Dashboard Overview',
      subtitle: 'Net worth cards, quick stats, cash flow',
      icon: <TrendingUp className="w-4 h-4 text-blue-400" />,
      category: 'Navigation',
      run: () => {
        setIsCommandPaletteOpen(false);
        router.push('/dashboard');
      },
    },
    {
      id: 'nav_accounts',
      title: 'Go to Accounts',
      subtitle: 'Manage connected multi-currency accounts',
      icon: <CreditCard className="w-4 h-4 text-cyan-400" />,
      category: 'Navigation',
      run: () => {
        setIsCommandPaletteOpen(false);
        router.push('/dashboard/accounts');
      },
    },
    {
      id: 'nav_transactions',
      title: 'Go to Transactions',
      subtitle: 'Full searchable multi-currency transaction ledger',
      icon: <PlusCircle className="w-4 h-4 text-amber-400" />,
      category: 'Navigation',
      run: () => {
        setIsCommandPaletteOpen(false);
        router.push('/dashboard/transactions');
      },
    },
    {
      id: 'nav_analytics',
      title: 'Go to Analytics & FX Exposure',
      subtitle: 'Spending breakdown, net worth growth, income by source',
      icon: <BarChart3 className="w-4 h-4 text-rose-400" />,
      category: 'Navigation',
      run: () => {
        setIsCommandPaletteOpen(false);
        router.push('/dashboard/analytics');
      },
    },
    {
      id: 'nav_settings',
      title: 'Go to Settings',
      subtitle: 'Currency preferences, profile, theme',
      icon: <Settings className="w-4 h-4 text-slate-400" />,
      category: 'Navigation',
      run: () => {
        setIsCommandPaletteOpen(false);
        router.push('/dashboard/settings');
      },
    },
    {
      id: 'curr_usd',
      title: 'Switch Home Currency to USD ($)',
      subtitle: 'Display all totals in US Dollar',
      icon: <span className="text-xs font-mono font-bold text-emerald-400">USD</span>,
      category: 'Currencies',
      run: () => {
        setHomeCurrency('USD');
        setIsCommandPaletteOpen(false);
      },
    },
    {
      id: 'curr_eur',
      title: 'Switch Home Currency to EUR (€)',
      subtitle: 'Display all totals in Euro',
      icon: <span className="text-xs font-mono font-bold text-blue-400">EUR</span>,
      category: 'Currencies',
      run: () => {
        setHomeCurrency('EUR');
        setIsCommandPaletteOpen(false);
      },
    },
    {
      id: 'curr_gbp',
      title: 'Switch Home Currency to GBP (£)',
      subtitle: 'Display all totals in British Pound',
      icon: <span className="text-xs font-mono font-bold text-purple-400">GBP</span>,
      category: 'Currencies',
      run: () => {
        setHomeCurrency('GBP');
        setIsCommandPaletteOpen(false);
      },
    },
    {
      id: 'curr_ngn',
      title: 'Switch Home Currency to NGN (₦)',
      subtitle: 'Display all totals in Nigerian Naira',
      icon: <span className="text-xs font-mono font-bold text-emerald-400">NGN</span>,
      category: 'Currencies',
      run: () => {
        setHomeCurrency('NGN');
        setIsCommandPaletteOpen(false);
      },
    },
    {
      id: 'reset_demo',
      title: 'Reset Demo Data',
      subtitle: 'Restore initial accounts and transaction dataset',
      icon: <RotateCcw className="w-4 h-4 text-rose-400" />,
      category: 'System',
      run: () => {
        resetDemoData();
        setIsCommandPaletteOpen(false);
      },
    },
  ];

  // Dynamic search matching across accounts and transactions
  const searchResults = useMemo(() => {
    if (!query.trim()) return actions;

    const q = query.toLowerCase();

    const matchedActions = actions.filter(
      (a) => a.title.toLowerCase().includes(q) || a.subtitle.toLowerCase().includes(q)
    );

    const matchedAccounts = accounts
      .filter((acc) => acc.name.toLowerCase().includes(q) || acc.currency.toLowerCase().includes(q))
      .map((acc) => ({
        id: `acc_${acc.id}`,
        title: `${acc.name} (${acc.currency})`,
        subtitle: `Balance: ${formatMoney(acc.balanceSmallestUnit, acc.currency)}`,
        icon: <CreditCard className="w-4 h-4 text-cyan-400" />,
        category: 'Accounts',
        run: () => {
          setIsCommandPaletteOpen(false);
          router.push(`/dashboard/accounts/${acc.id}`);
        },
      }));

    const matchedTransactions = transactions
      .filter(
        (tx) =>
          tx.description.toLowerCase().includes(q) ||
          tx.category.toLowerCase().includes(q) ||
          tx.merchant?.toLowerCase().includes(q)
      )
      .slice(0, 4)
      .map((tx) => ({
        id: `tx_${tx.id}`,
        title: tx.description,
        subtitle: `${tx.category} · ${formatMoney(tx.amountSmallestUnit, tx.currency)}`,
        icon: <PlusCircle className="w-4 h-4 text-slate-400" />,
        category: 'Transactions',
        run: () => {
          setIsCommandPaletteOpen(false);
          router.push('/dashboard/transactions');
        },
      }));

    return [...matchedActions, ...matchedAccounts, ...matchedTransactions];
  }, [query, actions, accounts, transactions, router]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % searchResults.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + searchResults.length) % searchResults.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (searchResults[selectedIndex]) {
        searchResults[selectedIndex].run();
      }
    } else if (e.key === 'Escape') {
      setIsCommandPaletteOpen(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-150"
      onClick={() => setIsCommandPaletteOpen(false)}
    >
      <div
        className="w-full max-w-xl glass-panel rounded-2xl border border-slate-700/70 shadow-2xl overflow-hidden bg-slate-900/95"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Search Input */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-800">
          <Search className="w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command, account, or search transactions..."
            className="flex-1 bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
            autoFocus
          />
          <div className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 text-[10px] font-mono font-semibold text-slate-400 bg-slate-800 border border-slate-700 rounded">
              ESC
            </kbd>
          </div>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {searchResults.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-500">
              No results found for &quot;{query}&quot;.
            </div>
          ) : (
            searchResults.map((item, index) => (
              <button
                key={item.id}
                onClick={item.run}
                onMouseEnter={() => setSelectedIndex(index)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-all ${
                  index === selectedIndex
                    ? 'bg-indigo-600/30 text-white border border-indigo-500/30'
                    : 'text-slate-300 hover:bg-slate-800/60 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60 shrink-0">
                    {item.icon}
                  </div>
                  <div className="truncate">
                    <p className="text-xs font-semibold text-white truncate">{item.title}</p>
                    <p className="text-[11px] text-slate-400 truncate">{item.subtitle}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0 ml-2">
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                    {item.category}
                  </span>
                  <ArrowRight
                    className={`w-3.5 h-3.5 transition-opacity ${
                      index === selectedIndex ? 'opacity-100 text-indigo-300' : 'opacity-0'
                    }`}
                  />
                </div>
              </button>
            ))
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2 border-t border-slate-800/80 bg-slate-950/60 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-3">
            <span>↑↓ to navigate</span>
            <span>↵ to select</span>
            <span>esc to dismiss</span>
          </div>
          <div className="font-mono text-[10px] text-indigo-400">Nexa Command Engine</div>
        </div>
      </div>
    </div>
  );
}
