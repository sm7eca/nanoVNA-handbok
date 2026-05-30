import type { Metadata } from 'next';
import './globals.css';
import { Sidebar } from '@/components/layout/Sidebar';
import { Navbar } from '@/components/layout/Navbar';

export const metadata: Metadata = {
  title: 'Starbright – Investment Management',
  description: 'AI-assisterat investeringsflöde för Starbright Venture Capital',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="sv">
      <body className="min-h-screen bg-gray-50">
        <div className="flex h-screen overflow-hidden">
          <Sidebar />
          {/* ml-60 to offset fixed sidebar */}
          <div className="flex flex-col flex-1 ml-60 overflow-hidden">
            <Navbar />
            <main className="flex-1 overflow-y-auto p-6">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
