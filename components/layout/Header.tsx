'use client';

import { useStore } from '@/lib/store';
import { Search, ShoppingBag, User, Heart, Menu, X, Cpu } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function Header() {
  const { cart, wishlist, setCartOpen, setSearchOpen } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const wishlistCount = wishlist.length;

  const navLinks = [
    { name: 'CASES', href: '/products/cases' },
    { name: 'CHARGERS', href: '/products/chargers' },
    { name: 'CABLES', href: '/products/cables' },
    { name: 'AUDIO', href: '/products/audio' },
    { name: 'GLASS', href: '/products/protectors' },
    { name: 'MODULAR', href: '/products/accessories' },
  ];

  return (
    <>
      {/* Top Technical Status Ticker */}
      <div className="bg-bg-primary border-b border-white/5 py-1 px-6 flex justify-between items-center text-[9px] font-mono tracking-widest text-text-secondary">
        <div className="flex items-center gap-2">
          <Cpu className="w-3 h-3 text-accent animate-pulse-glow" />
          <span>AVN_SYS // CORE ACTIVE [v16.2.10]</span>
        </div>
        <div className="hidden md:flex items-center gap-6">
          <span>LATENCY // 12MS</span>
          <span>CURRENCY // USD</span>
          <span>LOC // C:\\AVENOIR_LABS\\STORE</span>
        </div>
        <div>
          <span>SECURE PROTOCOLS // ONLINE</span>
        </div>
      </div>

      <header className="sticky top-0 z-40 bg-bg-primary/90 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto flex items-stretch h-14">
          {/* Logo block */}
          <div className="px-6 flex items-center border-r border-white/10 flex-shrink-0">
            <Link
              href="/"
              className="text-sm font-black font-mono tracking-tighter text-white hover:text-accent transition-colors flex items-center gap-1.5"
            >
              [AVENOIR // SPEC.01]
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-stretch flex-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="flex items-center px-5 text-[11px] font-bold font-mono tracking-widest text-text-secondary hover:text-white border-r border-white/10 hover:bg-white/3 transition-premium relative group"
              >
                <span>{link.name}</span>
                {/* Thin cyan bar on hover */}
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-accent scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-200" />
              </Link>
            ))}
          </nav>

          {/* Action Blocks */}
          <div className="flex items-stretch ml-auto">
            {/* Search */}
            <button
              onClick={() => setSearchOpen(true)}
              className="px-4 flex items-center justify-center text-text-secondary hover:text-white border-l border-white/10 hover:bg-white/3 transition-colors"
              aria-label="Search"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Wishlist */}
            <Link
              href="/account?tab=wishlist"
              className="px-4 flex items-center justify-center text-text-secondary hover:text-white border-l border-white/10 hover:bg-white/3 transition-colors relative hidden sm:flex"
              aria-label="Wishlist"
            >
              <Heart className="w-4 h-4" />
              {wishlistCount > 0 && (
                <span className="absolute top-3.5 right-3.5 w-1.5 h-1.5 bg-accent rounded-full animate-pulse-glow" />
              )}
            </Link>

            {/* Account */}
            <Link
              href="/account"
              className="px-4 flex items-center justify-center text-text-secondary hover:text-white border-l border-white/10 hover:bg-white/3 transition-colors"
              aria-label="Account"
            >
              <User className="w-4 h-4" />
            </Link>

            {/* Cart Box */}
            <button
              onClick={() => setCartOpen(true)}
              className="px-6 flex items-center gap-2 text-text-secondary hover:text-white border-l border-white/10 hover:bg-accent hover:text-bg-primary transition-premium font-mono font-bold text-[11px] tracking-widest relative"
              aria-label="Cart"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">LOADOUT</span>
              <span className="bg-white/10 px-2 py-0.5 rounded text-[10px] text-white">
                {cartCount}
              </span>
            </button>

            {/* Mobile burger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="px-4 flex items-center justify-center text-text-secondary hover:text-white border-l border-white/10 hover:bg-white/3 transition-colors lg:hidden"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 w-full bg-bg-primary border-b border-white/10 px-6 py-6 space-y-4 shadow-2xl animate-fade-in font-mono text-xs">
            <div className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="py-3 border-b border-white/5 text-white hover:text-accent transition-colors flex items-center justify-between tracking-widest font-bold"
                >
                  <span>{link.name}</span>
                  <span className="text-[10px] text-text-secondary opacity-50">&rarr;</span>
                </Link>
              ))}
              <Link
                href="/account?tab=wishlist"
                className="py-3 border-b border-white/5 text-white hover:text-accent transition-colors flex items-center justify-between tracking-widest font-bold"
              >
                <span>WISHLIST LOCKER</span>
                <span className="bg-white/10 text-[9px] px-2 py-0.5 rounded text-white font-mono">
                  {wishlistCount}
                </span>
              </Link>
              <Link
                href="/admin"
                className="py-3 text-accent hover:text-white transition-colors tracking-widest font-bold"
              >
                SYSTEM CONSOLE &rarr;
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
