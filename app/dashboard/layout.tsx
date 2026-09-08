"use client";

import React from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { ConnectAccountModal } from "@/components/modals/ConnectAccountModal";
import { AddTransactionModal } from "@/components/modals/AddTransactionModal";
import { AIQueryModal } from "@/components/modals/AIQueryModal";
import { CommandPalette } from "@/components/modals/CommandPalette";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-white text-slate-100">
      {/* Fixed Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="max-w-7xl mx-auto flex flex-col gap-6">
            {children}
          </div>
        </main>
      </div>

      {/* Global Action Modals */}
      <ConnectAccountModal />
      <AddTransactionModal />
      <AIQueryModal />
      <CommandPalette />
    </div>
  );
}
