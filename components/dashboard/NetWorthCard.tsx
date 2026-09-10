"use client";

import React, { useState, useEffect } from "react";
import { useNexa } from "@/context/NexaContext";
import { CURRENCY_METADATA, formatMoney, fromSmallestUnit } from "@/lib/money";
import { ArrowUpRight } from "lucide-react";

export function NetWorthCard() {
  const { totalNetWorthSmallestUnit, homeCurrency, accounts } = useNexa();
  const [displayValue, setDisplayValue] = useState(totalNetWorthSmallestUnit);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDisplayValue(totalNetWorthSmallestUnit);
    }, 120);
    return () => clearTimeout(timeout);
  }, [totalNetWorthSmallestUnit]);

  const meta = CURRENCY_METADATA[homeCurrency] || CURRENCY_METADATA.USD;
  const rawAmount = fromSmallestUnit(displayValue, homeCurrency);

  return (
    <div className="rounded-2xl p-5 sm:p-6 bg-white border border-slate-200 shadow-2xs">
      <div className="flex flex-col gap-5">
        {/* Top Label Row */}
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500">
            Total Net Worth
          </span>
          <span className="text-[11px] font-medium text-slate-500 px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200">
            {accounts.length} connected accounts
          </span>
        </div>

        {/* Headline Number with Ticking Value */}
        <div className="flex flex-col gap-2">
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-950 font-sans transition-all duration-300">
              {meta.symbol}
              {rawAmount.toLocaleString("en-US", {
                minimumFractionDigits: meta.decimals,
                maximumFractionDigits: meta.decimals,
              })}
            </span>
            <span className="text-xl sm:text-2xl font-semibold text-slate-400">
              {homeCurrency}
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <div className="inline-flex items-center gap-0.5 font-semibold text-emerald-700">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+14.2%</span>
            </div>
            <span className="text-slate-500">
              vs last month across all FX positions
            </span>
          </div>
        </div>

        {/* Currency distribution pills */}
        <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
          <div className="flex flex-wrap gap-2">
            {accounts.map((acc) => (
              <div
                key={acc.id}
                className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-xs"
              >
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: acc.institutionColor || "#64748B" }}
                />
                <span className="font-medium text-slate-600">
                  {acc.currency}
                </span>
                <span className="font-mono text-slate-900 font-semibold text-[11px]">
                  {formatMoney(acc.balanceSmallestUnit, acc.currency)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
