'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useNexa } from '@/context/NexaContext';
import { AI_QUERY_PRESETS } from '@/lib/mockData';
import { X, Sparkles, Send, Bot, User, Loader2, ArrowUpRight } from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
} from 'recharts';

export function AIQueryModal() {
  const { isAIModalOpen, setIsAIModalOpen, aiMessages, isAILoading, askAI, homeCurrency } = useNexa();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isAIModalOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [aiMessages, isAIModalOpen]);

  if (!isAIModalOpen) return null;

  const handleSend = (textToSend?: string) => {
    const q = textToSend || input;
    if (!q.trim() || isAILoading) return;
    askAI(q.trim());
    setInput('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl h-[88dvh] sm:h-[640px] rounded-2xl border border-slate-200 shadow-2xl overflow-hidden bg-white flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
              N
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-slate-900">Financial Intelligence</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-200/70 text-slate-700">
                  Assistant
                </span>
              </div>
              <p className="text-[11px] text-slate-500">Query your multi-currency cash flow and ledger</p>
            </div>
          </div>
          <button
            onClick={() => setIsAIModalOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Message feed */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {aiMessages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'assistant' && (
                <div className="w-7 h-7 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                  N
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed space-y-3 ${
                  msg.sender === 'user'
                    ? 'bg-slate-900 text-white font-medium shadow-2xs'
                    : 'bg-slate-50 border border-slate-200 text-slate-800'
                }`}
              >
                <div
                  className="prose prose-slate max-w-none text-xs leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: msg.text
                      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-slate-950">$1</strong>')
                      .replace(/\n/g, '<br/>'),
                  }}
                />

                {/* Inline Visualizations if available */}
                {msg.chartData && (
                  <div className="mt-3 p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
                    <p className="text-[11px] font-semibold text-slate-800 mb-2">
                      {msg.chartData.title}
                    </p>

                    <div className="h-44 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        {msg.chartData.type === 'pie' ? (
                          <PieChart>
                            <Pie
                              data={msg.chartData.data}
                              dataKey="value"
                              nameKey="label"
                              cx="50%"
                              cy="50%"
                              innerRadius={35}
                              outerRadius={65}
                              paddingAngle={4}
                            >
                              {msg.chartData.data.map((entry, index) => (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={entry.color || '#6366F1'}
                                  stroke="#FFFFFF"
                                  strokeWidth={2}
                                />
                              ))}
                            </Pie>
                            <Tooltip
                              content={({ active, payload }) => {
                                if (active && payload && payload.length) {
                                  const d = payload[0].payload;
                                  return (
                                    <div className="p-2 bg-white border border-slate-200 rounded-lg text-xs shadow-xl text-slate-900">
                                      <p className="font-semibold">{d.label}</p>
                                      <p className="text-emerald-600 font-mono mt-0.5">
                                        {homeCurrency} {d.value.toLocaleString()}
                                      </p>
                                    </div>
                                  );
                                }
                                return null;
                              }}
                            />
                          </PieChart>
                        ) : (
                          <BarChart data={msg.chartData.data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <XAxis
                              dataKey="label"
                              stroke="#64748B"
                              fontSize={10}
                              tickLine={false}
                              axisLine={{ stroke: '#E2E8F0' }}
                            />
                            <YAxis
                              stroke="#64748B"
                              fontSize={10}
                              tickLine={false}
                              axisLine={{ stroke: '#E2E8F0' }}
                            />
                            <Tooltip
                              content={({ active, payload }) => {
                                if (active && payload && payload.length) {
                                  const d = payload[0].payload;
                                  return (
                                    <div className="p-2 bg-white border border-slate-200 rounded-lg text-xs shadow-xl text-slate-900">
                                      <p className="font-semibold">{d.label}</p>
                                      <p className="text-indigo-600 font-mono mt-0.5">
                                        {homeCurrency} {d.value.toLocaleString()}
                                      </p>
                                    </div>
                                  );
                                }
                                return null;
                              }}
                            />
                            <Bar dataKey="value" fill="#6366F1" radius={[4, 4, 0, 0]} />
                          </BarChart>
                        )}
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}

                {/* Suggested followups */}
                {msg.suggestedFollowUps && msg.suggestedFollowUps.length > 0 && (
                  <div className="pt-2 border-t border-slate-200 space-y-1.5">
                    <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
                      Suggested Inquiries
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {msg.suggestedFollowUps.map((q, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSend(q)}
                          className="px-2.5 py-1 rounded-lg bg-white hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 text-[11px] text-slate-700 hover:text-indigo-700 transition-all text-left flex items-center gap-1 group cursor-pointer shadow-2xs"
                        >
                          <span>{q}</span>
                          <ArrowUpRight className="w-3 h-3 opacity-60 group-hover:opacity-100" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {msg.sender === 'user' && (
                <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 text-slate-600 flex items-center justify-center shrink-0 mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isAILoading && (
            <div className="flex gap-3 items-center">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-indigo-700">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Nexa is analyzing multi-currency ledger & FX conversions...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Query Presets Chips */}
        <div className="px-4 sm:px-6 py-2 border-t border-slate-100 bg-slate-50/60 overflow-x-auto flex gap-2 no-scrollbar">
          {AI_QUERY_PRESETS.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(preset)}
              className="whitespace-nowrap px-2.5 py-1 rounded-full text-[11px] bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 transition-colors cursor-pointer shadow-2xs"
            >
              {preset}
            </button>
          ))}
        </div>

        {/* Input bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-3 sm:p-4 border-t border-slate-100 bg-white flex gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about cash flow, spending by category, or runway..."
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-400 focus:bg-white"
            disabled={isAILoading}
          />
          <button
            type="submit"
            disabled={isAILoading || !input.trim()}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-xs font-semibold text-white shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <span>Query</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
}
