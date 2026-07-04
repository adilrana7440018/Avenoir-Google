'use client';

import { useStore } from '@/lib/store';
import { Search, ShoppingBag, User, Menu, X, Heart } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function Header() {
  const { cart, wishlist, setCartOpen, setSearchOpen } = useStore();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const wishlistCount = wishlist.length;

  const navLinks = [
    { name: 'Cases', href: '/products/cases' },
    { name: 'Chargers', href: '/products/chargers' },
    { name: 'Cables', href: '/products/cables' },
    { name: 'AirPods protection', href: '/products/audio' },
    { name: 'Screen Protectors', href: '/products/protectors' },
    { name: 'Accessories', href: '/products/accessories' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-40 transition-all duration-300 ${
          scrolled
            ? 'bg-bg-primary/80 backdrop-blur-md border-b border-white/10 py-3 shadow-lg'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="text-xl font-bold font-display tracking-widest text-white hover:text-accent transition-colors flex items-center gap-1.5"
          >
            AVENOIR<span className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse-glow" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-text-secondary hover:text-white hover:underline decoration-accent decoration-2 underline-offset-4 transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Action Items */}
          <div className="flex items-center gap-3 md:gap-5">
            {/* Search */}
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2 rounded-xl text-text-secondary hover:text-white hover:bg-white/5 transition-colors"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Wishlist */}
            <Link
              href="/account?tab=wishlist"
              className="p-2 rounded-xl text-text-secondary hover:text-white hover:bg-white/5 transition-colors relative hidden sm:inline-flex"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full" />
              )}
            </Link>

            {/* Account */}
            <Link
              href="/account"
              className="p-2 rounded-xl text-text-secondary hover:text-white hover:bg-white/5 transition-colors"
              aria-label="Account"
            >
              <User className="w-5 h-5" />
            </Link>

            {/* Cart */}
            <button
              onClick={() => setCartOpen(true)}
              className="p-2 rounded-xl text-text-secondary hover:text-white hover:bg-white/5 transition-colors relative"
              aria-label="Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-5 h-5 bg-accent text-bg-primary font-bold text-xs flex items-center justify-center rounded-full px-1.5 shadow-md">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-text-secondary hover:text-white hover:bg-white/5 transition-colors lg:hidden"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 w-full bg-bg-secondary border-b border-white/10 px-6 py-6 space-y-4 shadow-2xl animate-fade-in">
            <div className="flex flex-col space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-base font-semibold py-2.5 border-b border-white/5 text-white hover:text-accent transition-colors"
                >
                  {link.name}
                </Link>
              ))}
              <Link
                href="/account?tab=wishlist"
                className="text-base font-semibold py-2.5 border-b border-white/5 text-white hover:text-accent transition-colors flex items-center justify-between"
              >
                <span>Wishlist</span>
                <span className="bg-white/10 text-xs px-2.5 py-1 rounded-full font-mono text-white">
                  {wishlistCount}
                </span>
              </Link>
              <Link
                href="/admin"
                className="text-base font-semibold py-2.5 text-accent hover:underline decoration-accent underline-offset-4 transition-colors"
              >
                Operator Admin Console →
              </Link>
            </div>
          </div>
        )}
      </header>
      {/* Spacer to avoid layout overlap */}
      <div className="h-16 w-full" />
    </>
  );
}
