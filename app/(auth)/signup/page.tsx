'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useNexa } from '@/context/NexaContext';
import { CURRENCY_METADATA } from '@/lib/money';
import { CurrencyCode } from '@/types';
import { ArrowRight, Lock, Mail, User, Globe } from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();
  const { setHomeCurrency, addToast } = useNexa();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [homeCurr, setHomeCurr] = useState<CurrencyCode>('USD');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setHomeCurrency(homeCurr);
    setTimeout(() => {
      addToast('Account Created', `Welcome to Nexa! Home currency set to ${homeCurr}`, 'success');
      router.push('/dashboard');
    }, 600);
  };

  const currencies: CurrencyCode[] = ['USD', 'EUR', 'GBP', 'NGN', 'CAD', 'AUD', 'JPY'];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-6 relative overflow-hidden">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md space-y-6 relative z-10">
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 via-indigo-500 to-indigo-600 p-[1.5px] shadow-md shadow-indigo-500/20">
              <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center">
                <span className="text-sm font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-indigo-400">
                  N
                </span>
              </div>
            </div>
            <span className="font-extrabold text-xl tracking-tight text-slate-900">NEXA</span>
          </Link>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Create your account</h1>
          <p className="text-xs text-slate-500">Start consolidating your global cash flow in one currency</p>
        </div>

        <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-xl space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="e.g. Alex Rivera"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  placeholder="alex@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Primary Home Currency
              </label>
              <div className="relative">
                <Globe className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <select
                  value={homeCurr}
                  onChange={(e) => setHomeCurr(e.target.value as CurrencyCode)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-indigo-500 cursor-pointer"
                >
                  {currencies.map((c) => (
                    <option key={c} value={c} className="bg-white text-slate-900">
                      {c} - {CURRENCY_METADATA[c]?.name} ({CURRENCY_METADATA[c]?.symbol})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{loading ? 'Creating...' : 'Create Free Account'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <p className="text-center text-xs text-slate-500 pt-2">
            Already have an account?{' '}
            <Link href="/login" className="text-indigo-600 hover:text-indigo-500 font-semibold">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
