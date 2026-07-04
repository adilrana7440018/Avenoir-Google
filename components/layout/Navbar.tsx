'use client';

import { useStore } from '@/lib/store';
import { ShoppingBag, Search, Heart, User, Menu, X, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function Navbar() {
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
    { name: 'Shop All', href: '/products/all' },
    { name: 'Cases', href: '/products/cases' },
    { name: 'Chargers', href: '/products/chargers' },
    { name: 'Cables', href: '/products/cables' },
    { name: 'Guides', href: '/guides' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-40 transition-all duration-300 ${
          scrolled
            ? 'bg-bg-surface/80 backdrop-blur-md border-b border-border-subtle py-3 shadow-sm'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="text-lg font-black tracking-widest text-text-primary hover:text-accent-primary transition-colors flex items-center gap-1.5"
          >
            AERIS
            <span className="w-1.5 h-1.5 bg-accent-primary rounded-full animate-pulse" />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-xs font-semibold uppercase tracking-widest text-text-secondary hover:text-text-primary transition-colors relative group py-1"
              >
                <span>{link.name}</span>
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-accent-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-200" />
              </Link>
            ))}
          </nav>

          {/* Action Icons */}
          <div className="flex items-center gap-4">
            {/* Search Trigger */}
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2 text-text-secondary hover:text-text-primary hover:bg-bg-elevated rounded-xl transition-colors"
              aria-label="Search"
            >
              <Search className="w-4.5 h-4.5" />
            </button>

            {/* Wishlist Link */}
            <Link
              href="/account?tab=wishlist"
              className="p-2 text-text-secondary hover:text-text-primary hover:bg-bg-elevated rounded-xl transition-colors relative hidden sm:inline-flex"
              aria-label="Wishlist"
            >
              <Heart className="w-4.5 h-4.5" />
              {wishlistCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-accent-primary rounded-full" />
              )}
            </Link>

            {/* Account Dashboard */}
            <Link
              href="/account"
              className="p-2 text-text-secondary hover:text-text-primary hover:bg-bg-elevated rounded-xl transition-colors"
              aria-label="Account"
            >
              <User className="w-4.5 h-4.5" />
            </Link>

            {/* Cart Drawer Trigger */}
            <button
              onClick={() => setCartOpen(true)}
              className="px-4 py-2 bg-text-primary hover:bg-accent-primary text-white rounded-xl transition-all duration-300 font-semibold text-xs tracking-wider flex items-center gap-2 relative shadow-sm"
              aria-label="Cart"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>BAG</span>
              {cartCount > 0 && (
                <span className="bg-white/20 px-1.5 py-0.5 rounded text-[10px] text-white">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile menu hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-text-secondary hover:text-text-primary hover:bg-bg-elevated rounded-xl transition-colors md:hidden"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-bg-surface border-b border-border-subtle px-6 py-6 space-y-4 shadow-md animate-fade-in text-xs font-semibold tracking-wider">
            <div className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="py-3 border-b border-border-subtle text-text-secondary hover:text-text-primary transition-colors flex items-center justify-between"
                >
                  <span>{link.name}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-text-tertiary" />
                </Link>
              ))}
              <Link
                href="/account?tab=wishlist"
                className="py-3 border-b border-border-subtle text-text-secondary hover:text-text-primary transition-colors flex items-center justify-between"
              >
                <span>WISHLIST</span>
                <span className="bg-bg-elevated text-text-primary px-2.5 py-0.5 rounded-full font-mono">
                  {wishlistCount}
                </span>
              </Link>
              <Link
                href="/admin"
                className="py-3 text-accent-primary hover:text-accent-primary/80 transition-colors"
              >
                ADMIN PORTAL &rarr;
              </Link>
            </div>
          </div>
        )}
      </header>
      {/* Spacer to prevent layout collapse */}
      <div className="h-16 w-full" />
    </>
  );
}
