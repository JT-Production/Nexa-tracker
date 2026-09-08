'use client';

import React from 'react';
import { NetWorthCard } from '@/components/dashboard/NetWorthCard';
import { QuickStats } from '@/components/dashboard/QuickStats';
import { AccountsGrid } from '@/components/dashboard/AccountsGrid';
import { CashFlowChart } from '@/components/dashboard/CashFlowChart';
import { RecentTransactions } from '@/components/dashboard/RecentTransactions';
import { QuickExchangeCalc } from '@/components/dashboard/QuickExchangeCalc';

export default function DashboardOverviewPage() {
  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      {/* 1. Net Worth Hero Card */}
      <NetWorthCard />

      {/* 2. Key Financial Indicators */}
      <QuickStats />

      {/* 3. Connected Accounts Grid */}
      <AccountsGrid />

      {/* 4. Cash Flow Chart & Quick Exchange Calculator */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <CashFlowChart />
        </div>
        <div>
          <QuickExchangeCalc />
        </div>
      </div>

      {/* 5. Recent Transaction Ledger */}
      <RecentTransactions />
    </div>
  );
}
