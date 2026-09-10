'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useNexa } from '@/context/NexaContext';
import { ArrowRight, Sparkles, Lock, Mail, ShieldCheck } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { addToast } = useNexa();
  const [email, setEmail] = useState('alex.rivera@trivon.io');
  const [password, setPassword] = useState('••••••••••••');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      addToast('Welcome back, Alex!', 'Signed in to Nexa Portfolio Workspace', 'success');
      router.push('/dashboard');
    }, 600);
  };

  const handleDemoSignIn = () => {
    setLoading(true);
    setTimeout(() => {
      addToast('Demo Mode Activated', 'Loaded pre-seeded multi-currency portfolio', 'info');
      router.push('/demo');
    }, 400);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-6 relative overflow-hidden">
      {/* Glow backgrounds */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md space-y-6 relative z-10">
        {/* Brand */}
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
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Sign in to your portfolio</h1>
          <p className="text-xs text-slate-500">Manage your multi-currency cashflow and assets</p>
        </div>

        {/* Card */}
        <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-xl space-y-5">
          {/* Quick Demo Access Button */}
          <button
            type="button"
            onClick={handleDemoSignIn}
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-50 to-indigo-50 hover:from-emerald-100 hover:to-indigo-100 border border-emerald-200 text-xs font-bold text-emerald-800 flex items-center justify-center gap-2 transition-all shadow-2xs cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>1-Click Instant Demo Login (Recruiter Mode)</span>
          </button>

          <div className="flex items-center gap-3">
            <div className="h-[1px] bg-slate-200 flex-1" />
            <span className="text-[11px] uppercase font-bold text-slate-400">or sign in with email</span>
            <div className="h-[1px] bg-slate-200 flex-1" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <p className="text-center text-xs text-slate-500">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="text-indigo-600 hover:text-indigo-500 font-semibold">
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
