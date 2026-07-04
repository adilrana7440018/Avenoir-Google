import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import ErrorBoundary from '@/components/ErrorBoundary';
import Navbar from '@/components/layout/Navbar';
import CartDrawer from '@/components/cart/CartDrawer';
import { PaddleProvider } from '@/components/cart/PaddleContext';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    template: '%s | AERIS',
    default: 'AERIS | Premium Soft Aura Storefront',
  },
  description:
    'A high-performance light-themed e-commerce platform built with Next.js 16, React 19, and Tailwind CSS v4.',
  keywords: ['aeris', 'e-commerce', 'premium tech', 'light theme', 'soft design'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-bg-base text-text-primary">
        <ErrorBoundary>
          <PaddleProvider>
            <Navbar />
            <div className="flex-1 flex flex-col">
              {children}
            </div>
            <CartDrawer />
          </PaddleProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
