'use client';

import React from 'react';
import { AccountList } from '@/components/accounts/AccountList';

export default function AccountsPage() {
  return (
    <div className="animate-in fade-in duration-300">
      <AccountList />
    </div>
  );
}
