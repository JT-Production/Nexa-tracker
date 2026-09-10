'use client';

import React from 'react';
import { useNexa } from '@/context/NexaContext';
import { CheckCircle2, Info, AlertTriangle, XCircle, X } from 'lucide-react';

export function ToastContainer() {
  const { toasts, removeToast } = useNexa();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full">
      {toasts.map((toast) => {
        const icons = {
          success: <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />,
          info: <Info className="w-5 h-5 text-indigo-600 shrink-0" />,
          warning: <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />,
          error: <XCircle className="w-5 h-5 text-rose-600 shrink-0" />,
        };

        const borderColors = {
          success: 'border-emerald-200 bg-white shadow-lg',
          info: 'border-indigo-200 bg-white shadow-lg',
          warning: 'border-amber-200 bg-white shadow-lg',
          error: 'border-rose-200 bg-white shadow-lg',
        };

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border backdrop-blur-xl shadow-xl transition-all duration-300 animate-in fade-in slide-in-from-bottom-5 ${
              borderColors[toast.type]
            }`}
          >
            {icons[toast.type]}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-900">{toast.title}</p>
              {toast.description && (
                <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                  {toast.description}
                </p>
              )}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-700 transition-colors p-1 rounded-lg hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
