import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import ErrorBoundary from '@/components/ErrorBoundary';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CartDrawer from '@/components/cart/CartDrawer';
import { PaddleProvider } from '@/components/cart/PaddleContext';
import BottomNav from '@/components/layout/BottomNav';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});

const playfair = Playfair_Display({
  variable: '--font-playfair',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    template: '%s | AVENOIR',
    default: 'AVENOIR | Premium Tech Accessories',
  },
  description:
    'Premium phone cases, chargers, cables, and tech accessories. Minimal, durable, and designed to match your device.',
  keywords: ['avenoir', 'phone cases', 'tech accessories', 'chargers', 'premium', 'iPhone cases', 'AirPods cases'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-bg-base text-text-primary">
        <ErrorBoundary>
          <PaddleProvider>
            <Navbar />
            <div className="flex-1 flex flex-col pb-16 md:pb-0">
              {children}
            </div>
            <Footer />
            <CartDrawer />
            <BottomNav />
          </PaddleProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
