'use client';

import React, { useState } from 'react';
import { useNexa } from '@/context/NexaContext';
import { CurrencyCode, TransactionCategory, TransactionType } from '@/types';
import { CURRENCY_METADATA, toSmallestUnit } from '@/lib/money';
import { X, PlusCircle, ArrowDownLeft, ArrowUpRight, Calendar, Tag, CreditCard } from 'lucide-react';

const CATEGORIES: TransactionCategory[] = [
  'Client Payment',
  'Salary & Retainer',
  'Contract Work',
  'Software & SaaS',
  'Cloud & Servers',
  'Hardware & Gear',
  'Rent & Living',
  'Food & Dining',
  'Travel & Transport',
  'Crypto Trading',
  'Investment',
  'Miscellaneous',
];

export function AddTransactionModal() {
  const { isAddTxModalOpen, setIsAddTxModalOpen, accounts, addTransaction } = useNexa();
  
  const [type, setType] = useState<TransactionType>('expense');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState<CurrencyCode>('USD');
  const [accountId, setAccountId] = useState(accounts[0]?.id || '');
  const [category, setCategory] = useState<TransactionCategory>('Software & SaaS');
  const [description, setDescription] = useState('');
  const [merchant, setMerchant] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  if (!isAddTxModalOpen) return null;

  const handleAccountChange = (id: string) => {
    setAccountId(id);
    const selectedAcc = accounts.find((a) => a.id === id);
    if (selectedAcc) {
      setCurrency(selectedAcc.currency);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (!numAmount || numAmount <= 0) return;

    const selectedAcc = accounts.find((a) => a.id === accountId);

    addTransaction({
      accountId: accountId || (accounts[0]?.id ?? 'acc_default'),
      accountName: selectedAcc?.name || 'Primary Account',
      amountSmallestUnit: toSmallestUnit(numAmount, currency),
      type,
      currency,
      category,
      description: description || `${category} payment`,
      merchant: merchant || selectedAcc?.institution || 'External Merchant',
      date: new Date(date).toISOString(),
      status: 'completed',
      isDemo: true,
    });

    setIsAddTxModalOpen(false);
    // Reset form
    setAmount('');
    setDescription('');
    setMerchant('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg glass-panel rounded-2xl border border-slate-700/60 shadow-2xl overflow-hidden bg-slate-900/95">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <PlusCircle className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">Record Transaction</h2>
              <p className="text-xs text-slate-400">Add income, expense, or multi-currency spend</p>
            </div>
          </div>
          <button
            onClick={() => setIsAddTxModalOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Type Switcher */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-950/80 rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={() => setType('expense')}
              className={`flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition-all ${
                type === 'expense'
                  ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ArrowDownLeft className="w-3.5 h-3.5" />
              Expense / Outflow
            </button>
            <button
              type="button"
              onClick={() => setType('income')}
              className={`flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition-all ${
                type === 'income'
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ArrowUpRight className="w-3.5 h-3.5" />
              Income / Inflow
            </button>
          </div>

          {/* Amount & Currency */}
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Amount ({CURRENCY_METADATA[currency]?.symbol || '$'})
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="any"
                  required
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-3.5 py-2.5 text-base font-semibold font-mono text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500/60"
                  autoFocus
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Currency</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
                className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-3 py-3 text-xs font-semibold text-white focus:outline-none focus:border-emerald-500/60"
              >
                {Object.keys(CURRENCY_METADATA).map((c) => (
                  <option key={c} value={c} className="bg-slate-900 text-white">
                    {c} ({CURRENCY_METADATA[c as CurrencyCode].symbol})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Target Account */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1 flex items-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5 text-slate-500" />
              Connected Account
            </label>
            <select
              value={accountId}
              onChange={(e) => handleAccountChange(e.target.value)}
              className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-3 py-2.5 text-xs font-medium text-white focus:outline-none focus:border-emerald-500/60"
            >
              {accounts.map((acc) => (
                <option key={acc.id} value={acc.id} className="bg-slate-900 text-white">
                  {acc.name} ({acc.currency})
                </option>
              ))}
            </select>
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-slate-500" />
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as TransactionCategory)}
              className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-3 py-2.5 text-xs font-medium text-white focus:outline-none focus:border-emerald-500/60"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat} className="bg-slate-900 text-white">
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Description & Merchant */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Description / Memo</label>
              <input
                type="text"
                placeholder="e.g. AWS Production hosting"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500/60"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Merchant / Entity</label>
              <input
                type="text"
                placeholder="e.g. Amazon Web Services"
                value={merchant}
                onChange={(e) => setMerchant(e.target.value)}
                className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500/60"
              />
            </div>
          </div>

          {/* Date */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500/60"
            />
          </div>

          {/* Submit */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsAddTxModalOpen(false)}
              className="flex-1 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-xs font-bold text-slate-950 shadow-lg shadow-emerald-500/20 transition-all"
            >
              Record {type === 'income' ? 'Income' : 'Expense'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
