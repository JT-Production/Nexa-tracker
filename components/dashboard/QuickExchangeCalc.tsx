'use client';

import React, { useState } from 'react';
import { useNexa } from '@/context/NexaContext';
import { CURRENCY_METADATA, convertCurrencySmallestUnit, formatMoney, toSmallestUnit } from '@/lib/money';
import { CurrencyCode } from '@/types';
import { ArrowRightLeft, Sparkles } from 'lucide-react';

export function QuickExchangeCalc() {
  const { fxRates, homeCurrency } = useNexa();
  const [fromCurrency, setFromCurrency] = useState<CurrencyCode>('USD');
  const [toCurrency, setToCurrency] = useState<CurrencyCode>(homeCurrency === 'EUR' ? 'USD' : 'EUR');
  const [amount, setAmount] = useState('1000');

  const currencies: CurrencyCode[] = ['USD', 'EUR', 'GBP', 'NGN', 'CAD', 'JPY', 'BTC', 'ETH'];

  const handleSwap = () => {
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
  };

  const parsedAmount = parseFloat(amount) || 0;
  const smallestFrom = toSmallestUnit(parsedAmount, fromCurrency);
  const convertedSmallest = convertCurrencySmallestUnit(
    smallestFrom,
    fromCurrency,
    toCurrency,
    fxRates
  );

  return (
    <div className="p-6 rounded-2xl glass-card border border-slate-800 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-bold text-white tracking-tight">Live FX Calculator</h3>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 font-semibold border border-indigo-500/30">
            Real-time Spot
          </span>
        </div>
        <span className="text-[10px] text-slate-500 font-mono">No spread markup</span>
      </div>

      <div className="space-y-3">
        {/* From Amount */}
        <div>
          <label className="block text-[11px] font-medium text-slate-400 mb-1">You Convert</label>
          <div className="flex gap-2">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="flex-1 bg-slate-950/70 border border-slate-800 rounded-xl px-3 py-2 text-sm font-bold font-mono text-white focus:outline-none focus:border-indigo-500"
            />
            <select
              value={fromCurrency}
              onChange={(e) => setFromCurrency(e.target.value as CurrencyCode)}
              className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold text-white focus:outline-none"
            >
              {currencies.map((c) => (
                <option key={c} value={c} className="bg-slate-900">
                  {c} ({CURRENCY_METADATA[c]?.symbol})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Swap button */}
        <div className="flex justify-center">
          <button
            onClick={handleSwap}
            className="p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-400 hover:text-white transition-colors"
            title="Swap currencies"
          >
            <ArrowRightLeft className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* To Amount (Result) */}
        <div>
          <label className="block text-[11px] font-medium text-slate-400 mb-1">You Receive (Estimated)</label>
          <div className="flex gap-2 items-center">
            <div className="flex-1 bg-slate-950/90 border border-indigo-500/30 rounded-xl px-3 py-2 text-sm font-black font-mono text-emerald-400">
              {formatMoney(convertedSmallest, toCurrency)}
            </div>
            <select
              value={toCurrency}
              onChange={(e) => setToCurrency(e.target.value as CurrencyCode)}
              className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold text-white focus:outline-none"
            >
              {currencies.map((c) => (
                <option key={c} value={c} className="bg-slate-900">
                  {c} ({CURRENCY_METADATA[c]?.symbol})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-[10px] text-slate-400 flex items-center justify-between font-mono">
          <span>
            1 {fromCurrency} ={' '}
            <strong className="text-white">
              {(
                convertCurrencySmallestUnit(
                  toSmallestUnit(1, fromCurrency),
                  fromCurrency,
                  toCurrency,
                  fxRates
                ) / Math.pow(10, CURRENCY_METADATA[toCurrency]?.decimals || 2)
              ).toFixed(4)}{' '}
              {toCurrency}
            </strong>
          </span>
          <span className="text-emerald-400">0.0% fee</span>
        </div>
      </div>
    </div>
  );
}
