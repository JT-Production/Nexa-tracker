'use client';

import React, { useState } from 'react';
import { useNexa } from '@/context/NexaContext';
import { CURRENCY_METADATA, convertCurrencySmallestUnit, formatMoney, toSmallestUnit } from '@/lib/money';
import { CurrencyCode } from '@/types';
import { ArrowRightLeft } from 'lucide-react';

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
    <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-bold text-slate-900 tracking-tight">FX Converter</h3>
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200 font-medium">
            Spot rate
          </span>
        </div>
        <span className="text-[11px] text-slate-500 font-medium">Mid-market rate</span>
      </div>

      <div className="space-y-3">
        {/* From Amount */}
        <div>
          <label className="block text-[11px] font-medium text-slate-500 mb-1">You convert</label>
          <div className="flex gap-2">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-bold font-mono text-slate-900 focus:outline-none focus:border-slate-400 focus:bg-white"
            />
            <select
              value={fromCurrency}
              onChange={(e) => setFromCurrency(e.target.value as CurrencyCode)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none cursor-pointer"
            >
              {currencies.map((c) => (
                <option key={c} value={c} className="bg-white text-slate-900">
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
            className="p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
            title="Swap currencies"
          >
            <ArrowRightLeft className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* To Amount (Result) */}
        <div>
          <label className="block text-[11px] font-medium text-slate-500 mb-1">Estimated received</label>
          <div className="flex gap-2 items-center">
            <div className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-bold font-mono text-slate-900">
              {formatMoney(convertedSmallest, toCurrency)}
            </div>
            <select
              value={toCurrency}
              onChange={(e) => setToCurrency(e.target.value as CurrencyCode)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none cursor-pointer"
            >
              {currencies.map((c) => (
                <option key={c} value={c} className="bg-white text-slate-900">
                  {c} ({CURRENCY_METADATA[c]?.symbol})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 flex items-center justify-between font-mono">
          <span>
            1 {fromCurrency} ={' '}
            <strong className="text-slate-900">
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
          <span className="text-slate-500 font-sans font-medium">No markup</span>
        </div>
      </div>
    </div>
  );
}
