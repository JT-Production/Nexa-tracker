'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { AccountDetailView } from '@/components/accounts/AccountDetailView';

export default function AccountDetailPage() {
  const params = useParams();
  const accountId = params?.id as string;

  return (
    <div className="animate-in fade-in duration-300">
      <AccountDetailView accountId={accountId} />
    </div>
  );
}
