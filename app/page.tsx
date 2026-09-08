"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  TrendingUp,
  Globe,
  ShieldCheck,
  Zap,
  Layers,
  Bot,
  CreditCard,
  PieChart,
  CheckCircle2,
  Code2,
} from "lucide-react";
import { CURRENCY_METADATA, formatMoney, toSmallestUnit } from "@/lib/money";
import { CurrencyCode } from "@/types";

export default function LandingPage() {
  const [activeCurrency, setActiveCurrency] = useState<CurrencyCode>("USD");

  const demoBalances: Record<CurrencyCode, number> = {
    USD: 9482000, // $94,820.00
    EUR: 8723400, // €87,234.00
    GBP: 7490700, // £74,907.00
    NGN: 14602280000, // ₦146,022,800.00
    CAD: 12895500, // CA$128,955.00
    AUD: 14412600, // A$144,126.00
    JPY: 1473500000, // ¥14,735,000
    CHF: 8533800,
    BTC: 142000000, // 1.42 BTC
    ETH: 26500000,
    USDT: 9482000,
  };

  return (
    <div className="min-h-screen bg-[#080B11] text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Top Navigation */}
      <header className="border-b border-slate-800/80 bg-slate-950/60 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 via-indigo-500 to-indigo-600 p-[1.5px] shadow-lg shadow-indigo-500/25">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <span className="text-sm font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-indigo-400">
                  N
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-black text-base tracking-tight text-white">
                NEXA
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                v1.0
              </span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-300">
            <a href="#features" className="hover:text-white transition-colors">
              Features
            </a>
            <a
              href="#demo-preview"
              className="hover:text-white transition-colors"
            >
              Interactive Preview
            </a>
            <a
              href="#architecture"
              className="hover:text-white transition-colors"
            >
              Tech Stack
            </a>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-xs font-semibold text-slate-300 hover:text-white px-3 py-2 rounded-xl transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/demo"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-400 hover:to-indigo-500 text-xs font-bold text-white shadow-lg shadow-indigo-500/25 transition-all hover:scale-105 active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Try Live Demo</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="relative overflow-hidden pt-20 pb-16 px-6">
          {/* Ambient Glows */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-indigo-600/15 blur-[120px] rounded-full pointer-events-none" />
          <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none" />

          <div className="max-w-5xl mx-auto text-center space-y-6 relative z-10">
            {/* Pill badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/60 border border-indigo-500/30 text-xs font-semibold text-indigo-300 shadow-inner">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Multi-Currency Cash Flow & Portfolio OS</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
              One Unified Dashboard for{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-indigo-400">
                Every Currency
              </span>{" "}
              You Earn and Spend.
            </h1>

            {/* Subhead */}
            <p className="max-w-2xl mx-auto text-slate-400 text-sm sm:text-base leading-relaxed">
              For freelancers, remote workers, and founders juggling{" "}
              <strong>USD, EUR, GBP, NGN, and Crypto</strong>. Stop guessing
              your real net worth in messy spreadsheets — get live FX
              conversion, cash flow runway, and plain-English AI queries in
              seconds.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
              <Link
                href="/demo"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-extrabold text-sm shadow-xl shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 group"
              >
                <span>Explore Live Demo (No Sign Up)</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/dashboard"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-white font-bold text-sm transition-all flex items-center justify-center gap-2"
              >
                <span>Launch App</span>
              </Link>
            </div>

            {/* Live Ticker Strip */}
            <div className="pt-6 flex flex-wrap items-center justify-center gap-3 text-xs text-slate-400 font-mono">
              <span className="flex items-center gap-1.5 text-slate-300 font-semibold font-sans">
                <Globe className="w-3.5 h-3.5 text-indigo-400" /> Supported FX:
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-slate-900/80 border border-slate-800">
                🇺🇸 USD
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-slate-900/80 border border-slate-800">
                🇪🇺 EUR
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-slate-900/80 border border-slate-800">
                🇬🇧 GBP
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-slate-900/80 border border-slate-800">
                🇳🇬 NGN
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-slate-900/80 border border-slate-800">
                ⚡ BTC / ETH
              </span>
            </div>
          </div>
        </section>

        {/* Interactive Hero Preview Component */}
        <section id="demo-preview" className="max-w-5xl mx-auto px-6 py-12">
          <div className="rounded-3xl glass-panel p-6 sm:p-8 border border-indigo-500/30 shadow-2xl bg-gradient-to-b from-slate-900/90 to-slate-950 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
              <div>
                <p className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                  Live Converted Net Worth Simulator
                </p>
                <p className="text-sm text-slate-300 mt-0.5">
                  Click any home currency to instantly see how Nexa normalizes 6
                  accounts in real time:
                </p>
              </div>

              {/* Currency selector tabs */}
              <div className="flex flex-wrap bg-slate-950 p-1.5 rounded-2xl border border-slate-800 gap-1">
                {(["USD", "EUR", "GBP", "NGN", "CAD", "JPY"] as const).map(
                  (curr) => (
                    <button
                      key={curr}
                      onClick={() => setActiveCurrency(curr)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono transition-all ${
                        activeCurrency === curr
                          ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      {CURRENCY_METADATA[curr].flag} {curr}
                    </button>
                  ),
                )}
              </div>
            </div>

            {/* Simulated Hero Card */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2 p-6 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
                <span className="text-xs font-semibold text-slate-400">
                  Total Unified Valuation in {activeCurrency}
                </span>
                <p className="text-4xl sm:text-5xl font-extrabold text-white font-sans tracking-tight">
                  {formatMoney(demoBalances[activeCurrency], activeCurrency)}
                </p>
                <div className="flex items-center gap-2 text-xs text-emerald-400">
                  <TrendingUp className="w-4 h-4" />
                  <span>
                    +14.2% overall growth across 6 connected institutions
                  </span>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-semibold text-slate-400">
                    Multi-Currency Runway
                  </span>
                  <p className="text-3xl font-extrabold text-indigo-300 mt-1">
                    18.8 Months
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    At current monthly burn
                  </p>
                </div>
                <Link
                  href="/dashboard"
                  className="mt-4 w-full py-2 rounded-xl bg-indigo-600/30 hover:bg-indigo-600 border border-indigo-500/30 text-xs font-bold text-center text-white transition-all"
                >
                  Launch Full Portfolio →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Grid */}
        <section
          id="features"
          className="max-w-6xl mx-auto px-6 py-16 space-y-12"
        >
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <h2 className="text-3xl font-extrabold text-white tracking-tight">
              Engineered for Global Income Realities
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm">
              Standard personal finance apps break the second you earn in USD,
              hold in Wise EUR, pay contractors in NGN, and invest in Bitcoin.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl glass-card border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
                <Globe className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">
                Live FX Normalization
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Automatic real-time conversion rates across 10+ fiat and crypto
                assets. Change your home currency with one click.
              </p>
            </div>

            <div className="p-6 rounded-2xl glass-card border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center">
                <Bot className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">
                Plain English AI Co-Pilot
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Ask &quot;How much did I spend on SaaS this year?&quot; or
                &quot;What&apos;s my runway?&quot; and get instant synthesized
                answers + charts.
              </p>
            </div>

            <div className="p-6 rounded-2xl glass-card border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">
                Zero-Float Precision Math
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Every calculation uses integer smallest-unit money mathematics,
                preventing classic JavaScript IEEE-754 floating point
                inaccuracies.
              </p>
            </div>
          </div>
        </section>

        {/* Portfolio / Senior Engineering Highlights */}
        <section id="architecture" className="max-w-5xl mx-auto px-6 py-12">
          <div className="p-8 rounded-3xl bg-slate-950 border border-slate-800 space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400">
                <Code2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">
                  Portfolio-Ready Architecture
                </h3>
                <p className="text-xs text-slate-400">
                  Built to demonstrate senior frontend mastery to hiring
                  managers and founders
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-300">
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Next.js 16 App Router + TypeScript 5.9:</strong> Clean
                  modular architecture with strict type safety.
                </span>
              </div>
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Cmd+K Command Engine:</strong> Raycast/Linear-grade
                  search across transactions, accounts, and routes.
                </span>
              </div>
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Custom Styled Recharts:</strong> Bespoke dark themed
                  charts (spending donuts, runway area, revenue bars).
                </span>
              </div>
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Mock Plaid/Mono Link:</strong> Realistic 3-step
                  animated OpenBanking authentication experience.
                </span>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/80 py-8 px-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white">NEXA</span>
            <span>— Multi-Currency Cash Flow & Portfolio Dashboard</span>
          </div>
          <div className="flex items-center gap-6">
            <Link
              href="/demo"
              className="hover:text-indigo-400 transition-colors font-semibold"
            >
              Public Demo
            </Link>
            <Link
              href="/dashboard"
              className="hover:text-indigo-400 transition-colors font-semibold"
            >
              App Dashboard
            </Link>
            <Link
              href="/dashboard/settings"
              className="hover:text-indigo-400 transition-colors font-semibold"
            >
              Currency Settings
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
