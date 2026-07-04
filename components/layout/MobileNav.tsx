'use client';

import { useStore } from '@/lib/store';
import { Home, Grid, Search, ShoppingBag, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function MobileNav() {
  const { cart, setCartOpen, setSearchOpen } = useStore();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="lg:hidden fixed bottom-0 inset-x-0 z-30 bg-bg-secondary/90 backdrop-blur-md border-t border-white/10 px-4 py-2 flex items-center justify-around pb-safe-bottom shadow-xl">
      <Link
        href="/"
        className={`flex flex-col items-center justify-center p-2 rounded-xl transition-colors ${
          pathname === '/' ? 'text-accent' : 'text-text-secondary hover:text-white'
        }`}
      >
        <Home className="w-5 h-5" />
        <span className="text-[10px] font-medium mt-1">Home</span>
      </Link>

      <Link
        href="/products/cases"
        className={`flex flex-col items-center justify-center p-2 rounded-xl transition-colors ${
          pathname.startsWith('/products') ? 'text-accent' : 'text-text-secondary hover:text-white'
        }`}
      >
        <Grid className="w-5 h-5" />
        <span className="text-[10px] font-medium mt-1">Catalog</span>
      </Link>

      <button
        onClick={() => setSearchOpen(true)}
        className="flex flex-col items-center justify-center p-2 rounded-xl text-text-secondary hover:text-white transition-colors"
      >
        <Search className="w-5 h-5" />
        <span className="text-[10px] font-medium mt-1">Search</span>
      </button>

      <button
        onClick={() => setCartOpen(true)}
        className="flex flex-col items-center justify-center p-2 rounded-xl text-text-secondary hover:text-white transition-colors relative"
      >
        <ShoppingBag className="w-5 h-5" />
        {cartCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-accent text-bg-primary font-bold text-[9px] flex items-center justify-center rounded-full">
            {cartCount}
          </span>
        )}
        <span className="text-[10px] font-medium mt-1">Cart</span>
      </button>

      <Link
        href="/account"
        className={`flex flex-col items-center justify-center p-2 rounded-xl transition-colors ${
          pathname.startsWith('/account') ? 'text-accent' : 'text-text-secondary hover:text-white'
        }`}
      >
        <User className="w-5 h-5" />
        <span className="text-[10px] font-medium mt-1">Account</span>
      </Link>
    </div>
  );
}
