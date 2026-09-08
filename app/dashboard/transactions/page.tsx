'use client';

import React from 'react';
import { TransactionTable } from '@/components/transactions/TransactionTable';

export default function TransactionsPage() {
  return (
    <div className="animate-in fade-in duration-300">
      <TransactionTable />
    </div>
  );
}
