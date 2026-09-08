export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'NGN' | 'CAD' | 'AUD' | 'JPY' | 'CHF' | 'BTC' | 'ETH' | 'USDT';

export type AccountType = 'bank' | 'fintech' | 'crypto' | 'cash' | 'investment';

export interface CurrencyMeta {
  code: CurrencyCode;
  symbol: string;
  name: string;
  decimals: number; // e.g., 2 for USD/EUR/GBP/NGN, 0 for JPY, 8 for BTC
  flag: string;
  isCrypto?: boolean;
}

export interface Account {
  id: string;
  name: string;
  institution: string;
  institutionLogo?: string;
  institutionColor?: string;
  currency: CurrencyCode;
  balanceSmallestUnit: number; // Integer in smallest unit (e.g. cents, pence, kobo, satoshis)
  type: AccountType;
  accountNumberMasked?: string;
  connectedAt: string;
  isDemo?: boolean;
  historySparkline?: number[]; // percentage or relative trend
  updatedAt?: string;
}

export type TransactionCategory = 
  | 'Client Payment'
  | 'Salary & Retainer'
  | 'Contract Work'
  | 'Software & SaaS'
  | 'Cloud & Servers'
  | 'Hardware & Gear'
  | 'Rent & Living'
  | 'Food & Dining'
  | 'Travel & Transport'
  | 'Crypto Trading'
  | 'Investment'
  | 'Transfer'
  | 'Miscellaneous';

export type TransactionType = 'income' | 'expense' | 'transfer';

export interface Transaction {
  id: string;
  accountId: string;
  accountName?: string;
  amountSmallestUnit: number; // Positive for income, negative for expense (or absolute + type)
  type: TransactionType;
  currency: CurrencyCode;
  category: TransactionCategory;
  description: string;
  merchant?: string;
  date: string; // ISO string
  createdAt: string;
  isDemo?: boolean;
  status?: 'completed' | 'pending';
}

export interface FXRate {
  base: CurrencyCode;
  rates: Record<CurrencyCode, number>; // Rate = 1 Base Currency = X Target Currency
  updatedAt: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  homeCurrency: CurrencyCode;
  trackedCurrencies: CurrencyCode[];
  monthlyBudgetSmallestUnit?: number;
  isDemo?: boolean;
}

export interface AIQueryMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  chartData?: {
    type: 'pie' | 'bar' | 'stat';
    title: string;
    data: Array<{ label: string; value: number; formattedValue?: string; color?: string }>;
  };
  suggestedFollowUps?: string[];
}

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type: 'success' | 'info' | 'warning' | 'error';
  timestamp: number;
}
