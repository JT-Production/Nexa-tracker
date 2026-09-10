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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-200 shadow-2xl overflow-hidden bg-white">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200">
              <PlusCircle className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-900">Record Transaction</h2>
              <p className="text-xs text-slate-500">Add income, expense, or multi-currency spend</p>
            </div>
          </div>
          <button
            onClick={() => setIsAddTxModalOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Type Switcher */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl border border-slate-200">
            <button
              type="button"
              onClick={() => setType('expense')}
              className={`flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                type === 'expense'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ArrowDownLeft className="w-3.5 h-3.5" />
              Expense / Outflow
            </button>
            <button
              type="button"
              onClick={() => setType('income')}
              className={`flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                type === 'income'
                  ? 'bg-emerald-600 text-white font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ArrowUpRight className="w-3.5 h-3.5" />
              Income / Inflow
            </button>
          </div>

          {/* Amount & Currency */}
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <label className="block text-xs font-medium text-slate-600 mb-1">
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
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-base font-semibold font-mono text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white"
                  autoFocus
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Currency</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 text-xs font-semibold text-slate-900 focus:outline-none focus:border-emerald-500 cursor-pointer"
              >
                {Object.keys(CURRENCY_METADATA).map((c) => (
                  <option key={c} value={c} className="bg-white text-slate-900">
                    {c} ({CURRENCY_METADATA[c as CurrencyCode].symbol})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Target Account */}
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1 flex items-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5 text-slate-400" />
              Connected Account
            </label>
            <select
              value={accountId}
              onChange={(e) => handleAccountChange(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-medium text-slate-900 focus:outline-none focus:border-emerald-500 cursor-pointer"
            >
              {accounts.map((acc) => (
                <option key={acc.id} value={acc.id} className="bg-white text-slate-900">
                  {acc.name} ({acc.currency})
                </option>
              ))}
            </select>
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-slate-400" />
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as TransactionCategory)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-medium text-slate-900 focus:outline-none focus:border-emerald-500 cursor-pointer"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat} className="bg-white text-slate-900">
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Description & Merchant */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Description / Memo</label>
              <input
                type="text"
                placeholder="e.g. AWS Production hosting"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Merchant / Entity</label>
              <input
                type="text"
                placeholder="e.g. Amazon Web Services"
                value={merchant}
                onChange={(e) => setMerchant(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white"
              />
            </div>
          </div>

          {/* Date */}
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Submit */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsAddTxModalOpen(false)}
              className="flex-1 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-medium text-slate-700 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white shadow-sm transition-all cursor-pointer"
            >
              Record {type === 'income' ? 'Income' : 'Expense'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
