'use client';

import React, { useState, useMemo } from 'react';
import { useNexa } from '@/context/NexaContext';
import { formatMoney, convertCurrencySmallestUnit } from '@/lib/money';
import { CurrencyCode, TransactionCategory } from '@/types';
import {
  Search,
  Filter,
  Download,
  Plus,
  Trash2,
  ArrowUpRight,
  ArrowDownLeft,
  Calendar,
  Layers,
  ChevronDown,
} from 'lucide-react';

export function TransactionTable() {
  const {
    transactions,
    homeCurrency,
    fxRates,
    deleteTransaction,
    setIsAddTxModalOpen,
    accounts,
  } = useNexa();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedCurrency, setSelectedCurrency] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Filtered & sorted transactions
  const filtered = useMemo(() => {
    return transactions
      .filter((tx) => {
        const matchesSearch =
          tx.description.toLowerCase().includes(search.toLowerCase()) ||
          tx.category.toLowerCase().includes(search.toLowerCase()) ||
          (tx.merchant && tx.merchant.toLowerCase().includes(search.toLowerCase())) ||
          (tx.accountName && tx.accountName.toLowerCase().includes(search.toLowerCase()));

        const matchesCategory =
          selectedCategory === 'all' || tx.category === selectedCategory;
        const matchesCurrency =
          selectedCurrency === 'all' || tx.currency === selectedCurrency;
        const matchesType = selectedType === 'all' || tx.type === selectedType;

        return matchesSearch && matchesCategory && matchesCurrency && matchesType;
      })
      .sort((a, b) => {
        if (sortBy === 'date') {
          const dateA = new Date(a.date).getTime();
          const dateB = new Date(b.date).getTime();
          return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
        } else {
          return sortOrder === 'desc'
            ? b.amountSmallestUnit - a.amountSmallestUnit
            : a.amountSmallestUnit - b.amountSmallestUnit;
        }
      });
  }, [transactions, search, selectedCategory, selectedCurrency, selectedType, sortBy, sortOrder]);

  const handleExportCSV = () => {
    const headers = ['ID', 'Date', 'Description', 'Category', 'Merchant', 'Account', 'Currency', 'Amount', 'Type'];
    const rows = filtered.map((tx) => [
      tx.id,
      new Date(tx.date).toLocaleDateString(),
      `"${tx.description}"`,
      tx.category,
      `"${tx.merchant || ''}"`,
      `"${tx.accountName || ''}"`,
      tx.currency,
      formatMoney(tx.amountSmallestUnit, tx.currency, { showSymbol: false }),
      tx.type,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `nexa_transactions_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const categories = Array.from(new Set(transactions.map((t) => t.category)));
  const currencies: CurrencyCode[] = ['USD', 'EUR', 'GBP', 'NGN', 'BTC', 'ETH'];

  return (
    <div className="space-y-6">
      {/* Top action header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Financial Ledger</h2>
          <p className="text-xs text-slate-400 mt-1">
            Unified multi-currency transaction log with instant normalized conversions
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-xs font-semibold text-slate-300 hover:text-white transition-all shadow-sm"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => setIsAddTxModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Record Transaction</span>
          </button>
        </div>
      </div>

      {/* Filter toolbar */}
      <div className="p-4 rounded-2xl glass-card border border-slate-800 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search description, merchant, client..."
              className="w-full bg-slate-950/70 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Category filter */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-slate-950/70 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="all">All Categories</option>
              {categories.map((c) => (
                <option key={c} value={c} className="bg-slate-900">
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Currency filter */}
          <div>
            <select
              value={selectedCurrency}
              onChange={(e) => setSelectedCurrency(e.target.value)}
              className="w-full bg-slate-950/70 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="all">All Denominations</option>
              {currencies.map((curr) => (
                <option key={curr} value={curr} className="bg-slate-900">
                  {curr}
                </option>
              ))}
            </select>
          </div>

          {/* Type filter */}
          <div>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full bg-slate-950/70 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="all">All Flows (In & Out)</option>
              <option value="income" className="bg-slate-900">
                Income / Inflows Only
              </option>
              <option value="expense" className="bg-slate-900">
                Expenses / Outflows Only
              </option>
            </select>
          </div>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="rounded-2xl glass-card border border-slate-800 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider font-semibold">
              <tr>
                <th className="py-3.5 px-4">Transaction / Memo</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Account</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4 text-right">Native Amount</th>
                <th className="py-3.5 px-4 text-right">In {homeCurrency} (Spot)</th>
                <th className="py-3.5 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium text-slate-300">
              {filtered.map((tx) => {
                const isIncome = tx.type === 'income';
                const converted = convertCurrencySmallestUnit(
                  tx.amountSmallestUnit,
                  tx.currency,
                  homeCurrency,
                  fxRates
                );

                return (
                  <tr key={tx.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border ${
                            isIncome
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                              : 'bg-slate-800 text-slate-400 border-slate-700'
                          }`}
                        >
                          {isIncome ? (
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          ) : (
                            <ArrowDownLeft className="w-3.5 h-3.5" />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-white">{tx.description}</p>
                          <p className="text-[11px] text-slate-500">{tx.merchant || 'General'}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-md bg-slate-800/80 border border-slate-700/60 text-slate-300 text-[11px]">
                        {tx.category}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-slate-400">
                      <span>{tx.accountName || 'Primary'}</span>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-400">
                      {new Date(tx.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono font-bold">
                      <span className={isIncome ? 'text-emerald-400' : 'text-slate-100'}>
                        {isIncome ? '+' : '-'}
                        {formatMoney(tx.amountSmallestUnit, tx.currency)}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono text-slate-400">
                      {formatMoney(converted, homeCurrency)}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => deleteTransaction(tx.id)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                        title="Delete transaction"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500 text-xs">
                    No transactions match your search and filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
