'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, Grid3X3, Heart, ShoppingBag } from 'lucide-react';
import { useStore } from '@/lib/store';

export default function BottomNav() {
  const pathname = usePathname();
  const { wishlist, cart, setCartOpen, setSearchOpen } = useStore();

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 md:hidden bg-bg-base border-t border-border-subtle shadow-lg">
      <div className="flex items-center justify-around py-2.5 pb-[max(0.6rem,env(safe-area-inset-bottom))] px-4">
        {/* Home */}
        <Link
          href="/"
          className={`flex flex-col items-center gap-1 transition-colors ${
            pathname === '/' ? 'text-accent-primary' : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          <Home size={18} />
          <span className="text-[9px] font-medium">Home</span>
        </Link>

        {/* Search */}
        <button
          onClick={() => setSearchOpen(true)}
          className="flex flex-col items-center gap-1 text-text-secondary hover:text-text-primary transition-colors"
        >
          <Search size={18} />
          <span className="text-[9px] font-medium">Search</span>
        </button>

        {/* Shop / Categories */}
        <Link
          href="/products/all"
          className={`flex flex-col items-center gap-1 transition-colors ${
            pathname?.startsWith('/products') ? 'text-accent-primary' : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          <Grid3X3 size={18} />
          <span className="text-[9px] font-medium">Shop</span>
        </Link>

        {/* Wishlist */}
        <Link
          href="/account?tab=wishlist"
          className={`relative flex flex-col items-center gap-1 transition-colors ${
            pathname === '/account' ? 'text-accent-primary' : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          <Heart size={18} />
          <span className="text-[9px] font-medium">Wishlist</span>
          {wishlist.length > 0 && (
            <span className="absolute top-0 right-1.5 w-1.5 h-1.5 bg-accent-primary rounded-full" />
          )}
        </Link>

        {/* Cart */}
        <button
          onClick={() => setCartOpen(true)}
          className="relative flex flex-col items-center gap-1 text-text-secondary hover:text-text-primary transition-colors"
        >
          <ShoppingBag size={18} />
          <span className="text-[9px] font-medium">Cart</span>
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-accent-primary text-white text-[8px] font-semibold w-4 h-4 rounded-full flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
