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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl h-[680px] max-h-[90vh] glass-panel rounded-2xl border border-indigo-500/30 shadow-2xl overflow-hidden bg-slate-900/95 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/40">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/25">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white">Nexa Financial Intelligence</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  AI Co-Pilot
                </span>
              </div>
              <p className="text-xs text-slate-400">Natural language multi-currency financial analysis</p>
            </div>
          </div>
          <button
            onClick={() => setIsAIModalOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Message feed */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {aiMessages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'assistant' && (
                <div className="w-8 h-8 rounded-lg bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed space-y-3 ${
                  msg.sender === 'user'
                    ? 'bg-indigo-600 text-white font-medium shadow-md shadow-indigo-600/20'
                    : 'bg-slate-800/80 border border-slate-700/60 text-slate-200'
                }`}
              >
                <div
                  className="prose prose-invert max-w-none text-xs leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: msg.text
                      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-emerald-400 font-semibold">$1</strong>')
                      .replace(/\n/g, '<br/>'),
                  }}
                />

                {/* Inline Visualizations if available */}
                {msg.chartData && (
                  <div className="mt-3 p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                    <p className="text-[11px] font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3 text-indigo-400" />
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
                                  stroke="#0F172A"
                                  strokeWidth={2}
                                />
                              ))}
                            </Pie>
                            <Tooltip
                              content={({ active, payload }) => {
                                if (active && payload && payload.length) {
                                  const d = payload[0].payload;
                                  return (
                                    <div className="p-2 bg-slate-900 border border-slate-700 rounded-lg text-xs shadow-xl text-white">
                                      <p className="font-semibold">{d.label}</p>
                                      <p className="text-emerald-400 font-mono mt-0.5">
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
                              axisLine={{ stroke: '#334155' }}
                            />
                            <YAxis
                              stroke="#64748B"
                              fontSize={10}
                              tickLine={false}
                              axisLine={{ stroke: '#334155' }}
                            />
                            <Tooltip
                              content={({ active, payload }) => {
                                if (active && payload && payload.length) {
                                  const d = payload[0].payload;
                                  return (
                                    <div className="p-2 bg-slate-900 border border-slate-700 rounded-lg text-xs shadow-xl text-white">
                                      <p className="font-semibold">{d.label}</p>
                                      <p className="text-indigo-400 font-mono mt-0.5">
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
                  <div className="pt-2 border-t border-slate-700/50 space-y-1.5">
                    <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
                      Suggested Inquiries
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {msg.suggestedFollowUps.map((q, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSend(q)}
                          className="px-2.5 py-1 rounded-lg bg-slate-900/80 hover:bg-indigo-950/60 border border-slate-700 hover:border-indigo-500/40 text-[11px] text-slate-300 hover:text-indigo-300 transition-all text-left flex items-center gap-1 group"
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
                <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 flex items-center justify-center shrink-0 mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isAILoading && (
            <div className="flex gap-3 items-center">
              <div className="w-8 h-8 rounded-lg bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="flex items-center gap-2 p-3 bg-slate-800/60 rounded-xl border border-slate-700/50 text-xs text-indigo-300">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Nexa is analyzing multi-currency ledger & FX conversions...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Query Presets Chips */}
        <div className="px-6 py-2 border-t border-slate-800/80 bg-slate-950/40 overflow-x-auto flex gap-2 no-scrollbar">
          {AI_QUERY_PRESETS.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(preset)}
              className="whitespace-nowrap px-2.5 py-1 rounded-full text-[11px] bg-slate-800/70 hover:bg-indigo-900/40 text-slate-300 hover:text-indigo-200 border border-slate-700/60 hover:border-indigo-500/40 transition-colors"
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
          className="p-4 border-t border-slate-800 bg-slate-950/80 flex gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything about your income, expenses, accounts, or FX rates..."
            className="flex-1 bg-slate-900 border border-slate-700/80 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            disabled={isAILoading}
          />
          <button
            type="submit"
            disabled={isAILoading || !input.trim()}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-xs font-semibold text-white shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-1.5"
          >
            <span>Ask</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
}
