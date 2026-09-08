'use client';

import React, { useState } from 'react';
import { useNexa } from '@/context/NexaContext';
import { INSTITUTIONS_LIST } from '@/lib/mockData';
import { toSmallestUnit } from '@/lib/money';
import { CurrencyCode } from '@/types';
import {
  X,
  Search,
  CheckCircle2,
  ShieldCheck,
  Building2,
  Lock,
  ArrowRight,
  Loader2,
  Sparkles,
} from 'lucide-react';

export function ConnectAccountModal() {
  const { isConnectModalOpen, setIsConnectModalOpen, connectAccount } = useNexa();
  const [search, setSearch] = useState('');
  const [selectedInst, setSelectedInst] = useState<typeof INSTITUTIONS_LIST[0] | null>(null);
  const [step, setStep] = useState<'select' | 'auth' | 'connecting' | 'success'>('select');
  const [customBalance, setCustomBalance] = useState('5400.00');

  if (!isConnectModalOpen) return null;

  const filtered = INSTITUTIONS_LIST.filter(
    (inst) =>
      inst.name.toLowerCase().includes(search.toLowerCase()) ||
      inst.currency.toLowerCase().includes(search.toLowerCase()) ||
      inst.type.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelectInstitution = (inst: typeof INSTITUTIONS_LIST[0]) => {
    setSelectedInst(inst);
    setStep('auth');
  };

  const handleStartConnection = () => {
    setStep('connecting');
    setTimeout(() => {
      if (selectedInst) {
        const balanceNum = parseFloat(customBalance) || 5000;
        connectAccount({
          name: `${selectedInst.name} ${selectedInst.type === 'crypto' ? 'Vault' : 'Account'}`,
          institution: selectedInst.name,
          institutionColor: selectedInst.color,
          currency: selectedInst.currency as CurrencyCode,
          balanceSmallestUnit: toSmallestUnit(balanceNum, selectedInst.currency as CurrencyCode),
          type: selectedInst.type,
          accountNumberMasked: '•••• ' + Math.floor(1000 + Math.random() * 9000),
          isDemo: true,
        });
      }
      setStep('success');
    }, 2200);
  };

  const handleClose = () => {
    setIsConnectModalOpen(false);
    setTimeout(() => {
      setStep('select');
      setSelectedInst(null);
      setSearch('');
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg glass-panel rounded-2xl border border-slate-700/60 shadow-2xl overflow-hidden bg-slate-900/95">
        {/* Header bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">Connect Financial Account</h2>
              <p className="text-xs text-slate-400">Secure Plaid & Mono OpenBanking Link</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step 1: Select Institution */}
        {step === 'select' && (
          <div className="p-6 space-y-4">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search banks, crypto exchanges, fintech (e.g. Wise, Chase, Binance)..."
                className="w-full bg-slate-950/60 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/60 transition-all"
                autoFocus
              />
            </div>

            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {filtered.map((inst) => (
                <button
                  key={inst.name}
                  onClick={() => handleSelectInstitution(inst)}
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-800/40 hover:bg-slate-800/80 border border-slate-700/40 hover:border-indigo-500/40 transition-all text-left group"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold border border-white/10 shrink-0"
                      style={{ backgroundColor: `${inst.color}25`, color: inst.color }}
                    >
                      {inst.logo}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white group-hover:text-indigo-300 transition-colors">
                        {inst.name}
                      </p>
                      <p className="text-xs text-slate-400 capitalize">
                        {inst.type} · Native: <span className="font-mono text-slate-300 font-semibold">{inst.currency}</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-slate-500 group-hover:text-indigo-400 transition-colors">
                    <span className="text-xs font-medium">Link</span>
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </button>
              ))}

              {filtered.length === 0 && (
                <div className="py-8 text-center text-slate-400 text-sm">
                  No institution found matching &quot;{search}&quot;. Try searching for &quot;Wise&quot;, &quot;Chase&quot;, or &quot;Binance&quot;.
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 pt-2 text-xs text-slate-500 border-t border-slate-800/80">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>256-bit end-to-end encrypted OpenBanking bridge. Read-only tokenized sync.</span>
            </div>
          </div>
        )}

        {/* Step 2: Auth Simulation */}
        {step === 'auth' && selectedInst && (
          <div className="p-6 space-y-5">
            <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-950/80 border border-slate-800">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold border border-white/10"
                style={{ backgroundColor: `${selectedInst.color}25`, color: selectedInst.color }}
              >
                {selectedInst.logo}
              </div>
              <div>
                <h3 className="text-base font-semibold text-white">Authorize {selectedInst.name}</h3>
                <p className="text-xs text-slate-400">Authenticating read-only balance & transactions</p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Simulation Initial Balance ({selectedInst.currency})
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-sm text-slate-400">
                    {selectedInst.currency}
                  </span>
                  <input
                    type="number"
                    step="any"
                    value={customBalance}
                    onChange={(e) => setCustomBalance(e.target.value)}
                    className="w-full bg-slate-950/60 border border-slate-800 rounded-xl pl-14 pr-4 py-2 text-sm text-white font-mono focus:outline-none focus:border-indigo-500/60"
                  />
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-indigo-950/30 border border-indigo-500/20 text-xs text-indigo-300 flex items-start gap-2.5">
                <Lock className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <span>
                  Demo OpenBanking handshake connects directly via OAuth consent. Realistic multi-currency transactions will be generated automatically.
                </span>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setStep('select')}
                className="flex-1 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-sm font-medium text-slate-300 transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleStartConnection}
                className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-400 hover:to-indigo-500 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center gap-2"
              >
                <span>Authorize & Connect</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Connecting Animation */}
        {step === 'connecting' && selectedInst && (
          <div className="p-10 text-center space-y-4">
            <div className="relative inline-flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
              </div>
              <div className="absolute -top-1 -right-1">
                <Sparkles className="w-5 h-5 text-amber-400 animate-bounce" />
              </div>
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">Syncing with {selectedInst.name}...</h3>
              <p className="text-xs text-slate-400 mt-1">
                Fetching multi-currency ledger, FX rates, and past 30 days transactions
              </p>
            </div>
            <div className="w-48 mx-auto bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div className="bg-indigo-500 h-full w-2/3 animate-pulse rounded-full" />
            </div>
          </div>
        )}

        {/* Step 4: Success State */}
        {step === 'success' && selectedInst && (
          <div className="p-8 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Account Linked Successfully!</h3>
              <p className="text-xs text-slate-300 mt-1 max-w-xs mx-auto">
                {selectedInst.name} has been connected. Your live converted net worth and transaction history have been updated.
              </p>
            </div>
            <button
              onClick={handleClose}
              className="w-full px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-sm font-semibold text-slate-950 transition-all shadow-lg shadow-emerald-500/25"
            >
              View on Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
