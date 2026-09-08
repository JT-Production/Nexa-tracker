import type { Metadata } from 'next';
import './globals.css';
import { NexaProvider } from '@/context/NexaContext';
import { ToastContainer } from '@/components/ui/Toast';

export const metadata: Metadata = {
  title: 'Nexa — Multi-Currency Cash Flow & Portfolio Dashboard',
  description:
    'Real-time unified net worth, live multi-currency conversions, automated cash flow tracking, and AI financial query co-pilot for global freelancers and founders.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#080B11] text-slate-100 min-h-screen selection:bg-indigo-500 selection:text-white">
        <NexaProvider>
          {children}
          <ToastContainer />
        </NexaProvider>
      </body>
    </html>
  );
}
