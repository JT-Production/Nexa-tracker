'use client';

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  Account,
  Transaction,
  CurrencyCode,
  UserProfile,
  ToastMessage,
  AIQueryMessage,
  TransactionCategory,
  TransactionType,
} from '@/types';
import {
  INITIAL_ACCOUNTS,
  INITIAL_TRANSACTIONS,
  INITIAL_USER_PROFILE,
} from '@/lib/mockData';
import {
  convertCurrencySmallestUnit,
  DEFAULT_EXCHANGE_RATES,
  formatMoney,
  fromSmallestUnit,
  toSmallestUnit,
} from '@/lib/money';

interface NexaContextType {
  accounts: Account[];
  transactions: Transaction[];
  userProfile: UserProfile;
  homeCurrency: CurrencyCode;
  fxRates: Record<CurrencyCode, number>;
  toasts: ToastMessage[];
  
  // Modals & UI controls
  isConnectModalOpen: boolean;
  setIsConnectModalOpen: (open: boolean) => void;
  isAddTxModalOpen: boolean;
  setIsAddTxModalOpen: (open: boolean) => void;
  isAIModalOpen: boolean;
  setIsAIModalOpen: (open: boolean) => void;
  isCommandPaletteOpen: boolean;
  setIsCommandPaletteOpen: (open: boolean) => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
  
  // AI Queries
  aiMessages: AIQueryMessage[];
  isAILoading: boolean;
  askAI: (question: string) => Promise<void>;
  
  // Actions
  setHomeCurrency: (currency: CurrencyCode) => void;
  addTransaction: (tx: Omit<Transaction, 'id' | 'createdAt'>) => void;
  deleteTransaction: (id: string) => void;
  connectAccount: (acc: Omit<Account, 'id' | 'connectedAt'>) => void;
  disconnectAccount: (id: string) => void;
  addToast: (title: string, description?: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  removeToast: (id: string) => void;
  resetDemoData: () => void;
  refreshFXRates: () => void;
  
  // Computed metrics in home currency
  totalNetWorthSmallestUnit: number;
  totalIncomeSmallestUnit: number;
  totalExpenseSmallestUnit: number;
  netSavingsRatePercent: number;
  runwayMonths: number;
}

const NexaContext = createContext<NexaContextType | undefined>(undefined);

export function NexaProvider({ children }: { children: React.ReactNode }) {
  const [accounts, setAccounts] = useState<Account[]>(INITIAL_ACCOUNTS);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [userProfile, setUserProfile] = useState<UserProfile>(INITIAL_USER_PROFILE);
  const [homeCurrency, setHomeCurrencyState] = useState<CurrencyCode>('USD');
  const [fxRates, setFxRates] = useState<Record<CurrencyCode, number>>(DEFAULT_EXCHANGE_RATES);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  
  // Modals
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [isAddTxModalOpen, setIsAddTxModalOpen] = useState(false);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Messages state
  const [aiMessages, setAiMessages] = useState<AIQueryMessage[]>([
    {
      id: 'msg_welcome',
      sender: 'assistant',
      text: "Hello Alex. Ask any question about your multi-currency cash flow, category spend, runway, or net worth.",
      timestamp: new Date().toISOString(),
      suggestedFollowUps: [
        "What is my total net worth right now?",
        "How much did I spend on Software & Cloud this month?",
        "Compare my cashflow between USD and EUR",
      ],
    },
  ]);
  const [isAILoading, setIsAILoading] = useState(false);

  // Load from local storage if available
  useEffect(() => {
    try {
      const savedAccounts = localStorage.getItem('nexa_accounts');
      const savedTxs = localStorage.getItem('nexa_transactions');
      const savedCurr = localStorage.getItem('nexa_home_currency');
      
      if (savedAccounts) setAccounts(JSON.parse(savedAccounts));
      if (savedTxs) setTransactions(JSON.parse(savedTxs));
      if (savedCurr) setHomeCurrencyState(savedCurr as CurrencyCode);
    } catch {
      // ignore
    }
  }, []);

  // Save to local storage on changes
  useEffect(() => {
    try {
      localStorage.setItem('nexa_accounts', JSON.stringify(accounts));
      localStorage.setItem('nexa_transactions', JSON.stringify(transactions));
      localStorage.setItem('nexa_home_currency', homeCurrency);
    } catch {
      // ignore
    }
  }, [accounts, transactions, homeCurrency]);

  // Global Keyboard shortcut for Command Palette (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Toast system
  const addToast = (
    title: string,
    description?: string,
    type: 'success' | 'info' | 'warning' | 'error' = 'success'
  ) => {
    const id = 'toast_' + Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, title, description, type, timestamp: Date.now() }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const setHomeCurrency = (currency: CurrencyCode) => {
    setHomeCurrencyState(currency);
    setUserProfile((prev) => ({ ...prev, homeCurrency: currency }));
    addToast(
      'Home Currency Updated',
      `Switched display & net worth currency to ${currency}`,
      'info'
    );
  };

  const addTransaction = (txData: Omit<Transaction, 'id' | 'createdAt'>) => {
    const newTx: Transaction = {
      ...txData,
      id: 'tx_' + Date.now(),
      createdAt: new Date().toISOString(),
    };

    setTransactions((prev) => [newTx, ...prev]);

    // Update corresponding account balance
    setAccounts((prev) =>
      prev.map((acc) => {
        if (acc.id === txData.accountId) {
          const delta = txData.type === 'income' ? txData.amountSmallestUnit : -txData.amountSmallestUnit;
          return {
            ...acc,
            balanceSmallestUnit: Math.max(0, acc.balanceSmallestUnit + delta),
            updatedAt: 'Just now',
          };
        }
        return acc;
      })
    );

    addToast(
      'Transaction Recorded',
      `${txData.type === 'income' ? '+' : '-'}${formatMoney(txData.amountSmallestUnit, txData.currency)} in ${txData.category}`,
      'success'
    );
  };

  const deleteTransaction = (id: string) => {
    const target = transactions.find((t) => t.id === id);
    if (!target) return;

    setTransactions((prev) => prev.filter((t) => t.id !== id));

    // Rollback balance
    setAccounts((prev) =>
      prev.map((acc) => {
        if (acc.id === target.accountId) {
          const delta = target.type === 'income' ? -target.amountSmallestUnit : target.amountSmallestUnit;
          return {
            ...acc,
            balanceSmallestUnit: Math.max(0, acc.balanceSmallestUnit + delta),
          };
        }
        return acc;
      })
    );

    addToast('Transaction Deleted', target.description, 'info');
  };

  const connectAccount = (accData: Omit<Account, 'id' | 'connectedAt'>) => {
    const newId = 'acc_' + Date.now();
    const newAccount: Account = {
      ...accData,
      id: newId,
      connectedAt: new Date().toISOString(),
      updatedAt: 'Just now',
      historySparkline: [
        fromSmallestUnit(accData.balanceSmallestUnit * 0.8, accData.currency),
        fromSmallestUnit(accData.balanceSmallestUnit * 0.9, accData.currency),
        fromSmallestUnit(accData.balanceSmallestUnit, accData.currency),
      ],
    };

    // Also auto-generate initial seeded transaction for this account
    const initialTx: Transaction = {
      id: 'tx_seed_' + Date.now(),
      accountId: newId,
      accountName: accData.name,
      amountSmallestUnit: accData.balanceSmallestUnit,
      type: 'income',
      currency: accData.currency,
      category: 'Contract Work',
      description: `Initial verified balance sync (${accData.institution})`,
      merchant: accData.institution,
      date: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      status: 'completed',
    };

    setAccounts((prev) => [...prev, newAccount]);
    setTransactions((prev) => [initialTx, ...prev]);

    addToast(
      'Account Connected',
      `Successfully linked ${accData.name} (${accData.currency})`,
      'success'
    );
  };

  const disconnectAccount = (id: string) => {
    const target = accounts.find((a) => a.id === id);
    if (!target) return;
    setAccounts((prev) => prev.filter((a) => a.id !== id));
    addToast('Account Disconnected', `${target.name} has been removed.`, 'warning');
  };

  const resetDemoData = () => {
    setAccounts(INITIAL_ACCOUNTS);
    setTransactions(INITIAL_TRANSACTIONS);
    setHomeCurrencyState('USD');
    setUserProfile(INITIAL_USER_PROFILE);
    localStorage.removeItem('nexa_accounts');
    localStorage.removeItem('nexa_transactions');
    localStorage.removeItem('nexa_home_currency');
    addToast('Demo Data Reset', 'Reset all accounts and transactions to default demo state', 'info');
  };

  const refreshFXRates = () => {
    // Simulate slight live FX fluctuation
    setFxRates((prev) => ({
      ...prev,
      EUR: Number((0.92 + (Math.random() * 0.01 - 0.005)).toFixed(4)),
      GBP: Number((0.79 + (Math.random() * 0.008 - 0.004)).toFixed(4)),
      NGN: Number((1540 + Math.floor(Math.random() * 20 - 10)).toFixed(1)),
      BTC: Number((0.000015 + (Math.random() * 0.0000005 - 0.00000025)).toFixed(8)),
    }));
    addToast('FX Rates Synced', 'Live exchange rates refreshed via global FX feed', 'info');
  };

  // Compute Total Net Worth in Home Currency (Integer in Smallest Unit)
  const totalNetWorthSmallestUnit = useMemo(() => {
    let total = 0;
    for (const acc of accounts) {
      const converted = convertCurrencySmallestUnit(
        acc.balanceSmallestUnit,
        acc.currency,
        homeCurrency,
        fxRates
      );
      total += converted;
    }
    return total;
  }, [accounts, homeCurrency, fxRates]);

  // Compute Monthly Income & Expenses in Home Currency
  const { totalIncomeSmallestUnit, totalExpenseSmallestUnit } = useMemo(() => {
    let incomeTotal = 0;
    let expenseTotal = 0;

    for (const tx of transactions) {
      const converted = convertCurrencySmallestUnit(
        tx.amountSmallestUnit,
        tx.currency,
        homeCurrency,
        fxRates
      );
      if (tx.type === 'income') {
        incomeTotal += converted;
      } else if (tx.type === 'expense') {
        expenseTotal += converted;
      }
    }

    return { totalIncomeSmallestUnit: incomeTotal, totalExpenseSmallestUnit: expenseTotal };
  }, [transactions, homeCurrency, fxRates]);

  // Savings rate
  const netSavingsRatePercent = useMemo(() => {
    if (totalIncomeSmallestUnit === 0) return 0;
    const savings = totalIncomeSmallestUnit - totalExpenseSmallestUnit;
    return Math.round((savings / totalIncomeSmallestUnit) * 100);
  }, [totalIncomeSmallestUnit, totalExpenseSmallestUnit]);

  // Runway in months (Net Worth / Monthly Expense)
  const runwayMonths = useMemo(() => {
    if (totalExpenseSmallestUnit === 0) return 36;
    const months = totalNetWorthSmallestUnit / totalExpenseSmallestUnit;
    return Number(months.toFixed(1));
  }, [totalNetWorthSmallestUnit, totalExpenseSmallestUnit]);

  // Plain-English AI Financial Assistant query executor
  const askAI = async (question: string) => {
    const userMsg: AIQueryMessage = {
      id: 'usr_' + Date.now(),
      sender: 'user',
      text: question,
      timestamp: new Date().toISOString(),
    };

    setAiMessages((prev) => [...prev, userMsg]);
    setIsAILoading(true);

    // Simulate AI synthesis based on live state data
    setTimeout(() => {
      const lower = question.toLowerCase();
      let responseText = '';
      let chartData: AIQueryMessage['chartData'] | undefined = undefined;
      let followUps: string[] = [];

      const formattedNetWorth = formatMoney(totalNetWorthSmallestUnit, homeCurrency);
      const formattedIncome = formatMoney(totalIncomeSmallestUnit, homeCurrency);
      const formattedExpense = formatMoney(totalExpenseSmallestUnit, homeCurrency);

      if (lower.includes('net worth') || lower.includes('balance') || lower.includes('portfolio')) {
        responseText = `Your current total converted net worth is **${formattedNetWorth}** across ${accounts.length} connected accounts in 5 currencies (USD, EUR, GBP, NGN, BTC). Your highest balance is in **${accounts[0]?.name || 'Chase'}**.`;
        
        chartData = {
          type: 'pie',
          title: `Net Worth Breakdown in ${homeCurrency}`,
          data: accounts.map((acc, idx) => ({
            label: `${acc.name} (${acc.currency})`,
            value: fromSmallestUnit(
              convertCurrencySmallestUnit(acc.balanceSmallestUnit, acc.currency, homeCurrency, fxRates),
              homeCurrency
            ),
            color: acc.institutionColor || ['#10B981', '#6366F1', '#F59E0B', '#EC4899', '#3B82F6'][idx % 5],
          })),
        };

        followUps = [
          "How much is my crypto holding worth?",
          "What is my monthly cash flow burn rate?",
        ];
      } else if (lower.includes('spend') || lower.includes('saas') || lower.includes('subscription') || lower.includes('cloud')) {
        const saasTxs = transactions.filter(
          (t) => t.category === 'Software & SaaS' || t.category === 'Cloud & Servers'
        );
        let saasTotal = 0;
        saasTxs.forEach((t) => {
          saasTotal += convertCurrencySmallestUnit(t.amountSmallestUnit, t.currency, homeCurrency, fxRates);
        });

        responseText = `You spent **${formatMoney(saasTotal, homeCurrency)}** on Software, SaaS, and Cloud Infrastructure across ${saasTxs.length} transactions. Your largest software expenditure was **Cursor + Claude Enterprise** and **Vercel Enterprise**.`;
        
        chartData = {
          type: 'bar',
          title: `SaaS & Tech Breakdown (${homeCurrency})`,
          data: saasTxs.map((t) => ({
            label: t.merchant || t.description,
            value: fromSmallestUnit(
              convertCurrencySmallestUnit(t.amountSmallestUnit, t.currency, homeCurrency, fxRates),
              homeCurrency
            ),
            color: '#6366F1',
          })),
        };

        followUps = [
          "Can I optimize my software spend?",
          "What is my total monthly burn rate?",
        ];
      } else if (lower.includes('runway') || lower.includes('months') || lower.includes('burn')) {
        responseText = `Based on your monthly average burn of **${formattedExpense}** and current net worth of **${formattedNetWorth}**, you have approximately **${runwayMonths} months of runway** with zero additional income. Your savings rate is currently **${netSavingsRatePercent}%**.`;
        
        followUps = [
          "What is my projected income for next quarter?",
          "Show me my EUR & GBP income split",
        ];
      } else if (lower.includes('crypto') || lower.includes('btc') || lower.includes('bitcoin')) {
        const cryptoAccs = accounts.filter((a) => a.type === 'crypto' || a.currency === 'BTC' || a.currency === 'ETH');
        let cryptoTotal = 0;
        cryptoAccs.forEach((a) => {
          cryptoTotal += convertCurrencySmallestUnit(a.balanceSmallestUnit, a.currency, homeCurrency, fxRates);
        });

        responseText = `You currently hold **0.645 BTC** in Binance Cold Vault, valued at approximately **${formatMoney(cryptoTotal, homeCurrency)}**. This represents **${Math.round((cryptoTotal / totalNetWorthSmallestUnit) * 100)}%** of your total portfolio.`;
        
        followUps = [
          "How has BTC exchange rate moved this week?",
          "What is my total fiat vs crypto ratio?",
        ];
      } else {
        responseText = `Here is your high-level financial summary: Converted Net Worth is **${formattedNetWorth}**, with **${formattedIncome}** in total income and **${formattedExpense}** in total expenses recorded. You have a healthy savings rate of **${netSavingsRatePercent}%** across your multi-currency accounts.`;
        
        chartData = {
          type: 'bar',
          title: `Cashflow Summary in ${homeCurrency}`,
          data: [
            { label: 'Total Inflow', value: fromSmallestUnit(totalIncomeSmallestUnit, homeCurrency), color: '#10B981' },
            { label: 'Total Outflow', value: fromSmallestUnit(totalExpenseSmallestUnit, homeCurrency), color: '#EF4444' },
          ],
        };

        followUps = [
          "How much did I earn from clients in EUR?",
          "What are my biggest expenses this month?",
        ];
      }

      const assistantMsg: AIQueryMessage = {
        id: 'ai_' + Date.now(),
        sender: 'assistant',
        text: responseText,
        timestamp: new Date().toISOString(),
        chartData,
        suggestedFollowUps: followUps,
      };

      setAiMessages((prev) => [...prev, assistantMsg]);
      setIsAILoading(false);
    }, 600);
  };

  return (
    <NexaContext.Provider
      value={{
        accounts,
        transactions,
        userProfile,
        homeCurrency,
        fxRates,
        toasts,
        isConnectModalOpen,
        setIsConnectModalOpen,
        isAddTxModalOpen,
        setIsAddTxModalOpen,
        isAIModalOpen,
        setIsAIModalOpen,
        isCommandPaletteOpen,
        setIsCommandPaletteOpen,
        isMobileMenuOpen,
        setIsMobileMenuOpen,
        aiMessages,
        isAILoading,
        askAI,
        setHomeCurrency,
        addTransaction,
        deleteTransaction,
        connectAccount,
        disconnectAccount,
        addToast,
        removeToast,
        resetDemoData,
        refreshFXRates,
        totalNetWorthSmallestUnit,
        totalIncomeSmallestUnit,
        totalExpenseSmallestUnit,
        netSavingsRatePercent,
        runwayMonths,
      }}
    >
      {children}
    </NexaContext.Provider>
  );
}

export function useNexa() {
  const context = useContext(NexaContext);
  if (!context) {
    throw new Error('useNexa must be used within a NexaProvider');
  }
  return context;
}
