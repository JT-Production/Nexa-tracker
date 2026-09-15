"use client";

import React from "react";
import { useNexa } from "@/context/NexaContext";
import { formatMoney } from "@/lib/money";

type ChangeType = "positive" | "negative" | "neutral";

export function QuickStats() {
  const {
    totalIncomeSmallestUnit,
    totalExpenseSmallestUnit,
    netSavingsRatePercent,
    runwayMonths,
    homeCurrency,
  } = useNexa();

  const stats: Array<{
    title: string;
    value: string;
    change: string;
    changeType: ChangeType;
    subtext: string;
  }> = [
    {
      title: "Monthly Cash Inflow",
      value: formatMoney(totalIncomeSmallestUnit, homeCurrency),
      change: "+18.9%",
      changeType: "positive" as const,
      subtext: "Client retainers & payouts",
    },
    {
      title: "Monthly Burn / Spend",
      value: formatMoney(totalExpenseSmallestUnit, homeCurrency),
      change: "-4.2%",
      changeType: "positive" as const,
      subtext: "Software, servers & living",
    },
    {
      title: "Net Savings Rate",
      value: `${netSavingsRatePercent}%`,
      change: "+6.1%",
      changeType: "positive" as const,
      subtext: "Target is 50%+",
    },
    {
      title: "Estimated Runway",
      value: `${runwayMonths} mo`,
      change: "Safe zone",
      changeType: "neutral" as const,
      subtext: "At current burn rate",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, idx) => (
        <div
          key={idx}
          className="p-5 rounded-2xl border border-slate-200 bg-white shadow-2xs flex flex-col justify-between gap-3"
        >
          <span className="text-xs font-semibold text-slate-500">
            {stat.title}
          </span>

          <div className="flex flex-col gap-2">
            <p className="text-2xl sm:text-3xl font-bold font-sans text-slate-950 tracking-tight leading-none">
              {stat.value}
            </p>
            <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px]">
              <span className="text-slate-500">{stat.subtext}</span>
              <span
                className={`font-semibold ${
                  stat.changeType === "positive"
                    ? "text-emerald-700"
                    : stat.changeType === "negative"
                    ? "text-rose-700"
                    : "text-slate-700"
                }`}
              >
                {stat.change}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
