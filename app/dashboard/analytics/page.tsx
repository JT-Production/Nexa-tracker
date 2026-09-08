'use client';

import React from 'react';
import { SpendingCategoryDonut } from '@/components/analytics/SpendingCategoryDonut';
import { NetWorthGrowthChart } from '@/components/analytics/NetWorthGrowthChart';
import { IncomeBySourceBar } from '@/components/analytics/IncomeBySourceBar';
import { CurrencyExposureChart } from '@/components/analytics/CurrencyExposureChart';

export default function AnalyticsPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight">Analytics & FX Intelligence</h2>
        <p className="text-xs text-slate-400 mt-1">
          Deep breakdown of your cash inflows, expenditure categories, and multi-currency portfolio exposure
        </p>
      </div>

      {/* 1. Net Worth Trajectory Area Chart */}
      <NetWorthGrowthChart />

      {/* 2. Spending Category Donut & FX Currency Exposure */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SpendingCategoryDonut />
        <CurrencyExposureChart />
      </div>

      {/* 3. Income By Client/Source Bar Chart */}
      <IncomeBySourceBar />
    </div>
  );
}
