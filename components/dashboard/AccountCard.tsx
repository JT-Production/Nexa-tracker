"use client";

import React from "react";
import Link from "next/link";
import { Account } from "@/types";
import { useNexa } from "@/context/NexaContext";
import { convertCurrencySmallestUnit, formatMoney } from "@/lib/money";
import { ArrowRight } from "lucide-react";

interface AccountCardProps {
  account: Account;
}

export function AccountCard({ account }: AccountCardProps) {
  const { homeCurrency, fxRates } = useNexa();

  const convertedSmallestUnit = convertCurrencySmallestUnit(
    account.balanceSmallestUnit,
    account.currency,
    homeCurrency,
    fxRates,
  );

  return (
    <Link
      href={`/dashboard/accounts/${account.id}`}
      className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 shadow-2xs flex flex-col justify-between h-44 transition-colors"
    >
      {/* Top row: institution & currency tag */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0"
            style={{
              backgroundColor: `${account.institutionColor || "#475569"}18`,
              color: account.institutionColor || "#334155",
            }}
          >
            {account.currency}
          </div>
          <div>
            <h4 className="text-xs font-semibold text-slate-900">
              {account.name}
            </h4>
            <p className="text-[11px] text-slate-500 capitalize">
              {account.institution} ({account.accountNumberMasked || "Active"})
            </p>
          </div>
        </div>

        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
          {account.currency}
        </span>
      </div>

      {/* Middle: Native balance + Converted home currency */}
      <div className="my-auto">
        <p className="text-xl font-bold font-sans text-slate-950 tracking-tight">
          {formatMoney(account.balanceSmallestUnit, account.currency)}
        </p>

        {account.currency !== homeCurrency && (
          <p className="text-xs text-slate-500 font-mono mt-0.5">
            ≈ {formatMoney(convertedSmallestUnit, homeCurrency)}{" "}
            <span className="text-[11px] text-slate-400 font-sans">
              in {homeCurrency}
            </span>
          </p>
        )}
      </div>

      {/* Bottom row: Status & Action */}
      <div className="flex items-center justify-between pt-2.5 border-t border-slate-100 text-[11px] text-slate-500">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
          <span>Synced {account.updatedAt || "Just now"}</span>
        </div>
        <div className="flex items-center gap-1 text-slate-600 font-medium">
          <span>View details</span>
          <ArrowRight className="w-3 h-3" />
        </div>
      </div>
    </Link>
  );
}
