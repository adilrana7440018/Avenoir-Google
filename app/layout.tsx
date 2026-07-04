import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MobileNav from "@/components/layout/MobileNav";
import CartDrawer from "@/components/cart/CartDrawer";
import SearchDrawer from "@/components/search/SearchDrawer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | AVENOIR Premium Tech Accessories",
    default: "AVENOIR | Architectural Protection for Physical Tech",
  },
  description:
    "Explore carbon fiber cases, GaN fast chargers, and premium braided cables designed for iPhone 16 and Galaxy S25. Built with aramid fibers and lifetime warranty.",
  keywords: ["phone case", "magsafe", "iphone 16 pro", "galaxy s25 ultra", "gan charger", "carbon fiber case", "premium tech accessories"],
  metadataBase: new URL("https://avenoir.com"),
  openGraph: {
    title: "AVENOIR | Architectural Protection for Physical Tech",
    description: "Aerospace aramid fiber phone cases, 65W GaN fast chargers, and premium nylon cables.",
    url: "https://avenoir.com",
    siteName: "AVENOIR",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AVENOIR | Premium Tech Accessories",
    description: "Aramid fiber armor for essential tools.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-bg-primary text-text-primary">
        <Header />
        
        {/* Main Content Area */}
        <main className="flex-1 pb-20 lg:pb-0">
          {children}
        </main>
        
        <Footer />
        <MobileNav />
        
        {/* Drawers/Overlays */}
        <CartDrawer />
        <SearchDrawer />
      </body>
    </html>
  );
}
