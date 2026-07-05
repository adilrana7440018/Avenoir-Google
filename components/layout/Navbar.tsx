'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Heart, ShoppingBag, Menu, X, ArrowRight } from 'lucide-react';
import { useStore } from '@/lib/store';

const navLinks = [
  { label: 'Shop All', href: '/products/all' },
  { label: 'Phone Cases', href: '/products/cases' },
  { label: 'Chargers', href: '/products/chargers' },
  { label: 'Accessories', href: '/products/accessories' },
];

export default function Navbar() {
  const pathname = usePathname();
  const { cart, wishlist, setCartOpen, setSearchOpen } = useStore();

  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Scroll listener for shadow + blur
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 bg-bg-base transition-all duration-300 ${
          scrolled ? 'shadow-sm backdrop-blur-md bg-bg-base/90' : ''
        }`}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          {/* Left — mobile hamburger */}
          <div className="flex items-center gap-3">
            <button
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              className="text-text-secondary transition-colors hover:text-text-primary md:hidden"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            {/* Desktop nav links */}
            <nav className="hidden items-center gap-6 md:flex">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`group relative text-xs font-medium transition-colors ${
                    pathname === link.href
                      ? 'text-text-primary'
                      : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  {link.label}
                  <span
                    className={`absolute -bottom-0.5 left-0 h-px bg-text-primary transition-all duration-300 ${
                      pathname === link.href
                        ? 'w-full'
                        : 'w-0 group-hover:w-full'
                    }`}
                  />
                </Link>
              ))}
            </nav>
          </div>

          {/* Center — logo */}
          <Link
            href="/"
            className="absolute left-1/2 -translate-x-1/2 font-serif-display text-lg font-bold tracking-[0.2em] text-text-primary"
          >
            AVENOIR
          </Link>

          {/* Right — action icons */}
          <div className="flex items-center gap-4">
            {/* Search */}
            <button
              aria-label="Search"
              className="text-text-secondary transition-colors hover:text-text-primary"
              onClick={() => setSearchOpen(true)}
            >
              <Search size={18} />
            </button>

            {/* Wishlist */}
            <Link
              href="/account?tab=wishlist"
              aria-label="Wishlist"
              className="relative hidden text-text-secondary transition-colors hover:text-text-primary sm:inline-flex"
            >
              <Heart size={18} />
              {wishlist.length > 0 && (
                <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-accent-primary" />
              )}
            </Link>

            {/* Cart */}
            <button
              aria-label="Open cart"
              className="relative text-text-secondary transition-colors hover:text-text-primary"
              onClick={() => setCartOpen(true)}
            >
              <ShoppingBag size={18} />
              {cartCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-accent-primary text-[10px] font-semibold text-white">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <nav className="border-b border-border-subtle bg-bg-base px-6 pb-4 pt-2 md:hidden">
            <ul className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`group flex items-center justify-between text-sm font-medium transition-colors ${
                      pathname === link.href
                        ? 'text-text-primary'
                        : 'text-text-secondary hover:text-text-primary'
                    }`}
                  >
                    {link.label}
                    <ArrowRight
                      size={14}
                      className="opacity-0 transition-opacity group-hover:opacity-100"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </header>

      {/* Spacer so content isn't hidden behind fixed header */}
      <div className="h-16 w-full" />
    </>
  );
}
