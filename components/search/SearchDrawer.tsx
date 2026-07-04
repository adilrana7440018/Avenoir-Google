'use client';

import { useStore } from '@/lib/store';
import { X, Search, ArrowRight, Sparkles } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { searchProducts, getPopularProducts } from '@/app/actions/search';

interface ProductResult {
  id: string;
  name: string;
  slug: string;
  price: number;
  image: string;
  category: string;
  compatibility: string;
}

export default function SearchDrawer() {
  const { isSearchOpen, setSearchOpen } = useStore();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<ProductResult[]>([]);
  const [popular, setPopular] = useState<ProductResult[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input on open
  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      // Fetch popular products
      getPopularProducts().then((res) => {
        setPopular(res as ProductResult[]);
      });
    } else {
      setQuery('');
      setResults([]);
    }
  }, [isSearchOpen]);

  // Debounced search query
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    const delayDebounceFn = setTimeout(async () => {
      const data = await searchProducts(query);
      setResults(data as ProductResult[]);
      setLoading(false);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  if (!isSearchOpen) return null;

  const popularSearches = ['Carbon', 'MagSafe', 'GaN', 'Cable', 'iPhone 16'];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-md transition-opacity duration-300"
        onClick={() => setSearchOpen(false)}
      />

      {/* Search panel */}
      <div className="absolute inset-x-0 top-0 bg-bg-secondary border-b border-white/10 shadow-2xl transition-transform duration-300 ease-out py-8 px-6 md:px-12 max-h-[85vh] overflow-y-auto">
        <div className="max-w-4xl mx-auto flex flex-col space-y-6">
          {/* Input field */}
          <div className="flex items-center gap-4 relative">
            <Search className="absolute left-4 w-6 h-6 text-accent" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search products, materials, devices..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-surface-card border border-white/10 rounded-full py-4 pl-14 pr-16 text-lg text-white focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-premium placeholder:text-text-secondary/50 font-display font-medium"
            />
            <button
              onClick={() => setSearchOpen(false)}
              className="absolute right-4 p-1.5 rounded-full text-text-secondary hover:text-white hover:bg-white/5 transition-colors"
              aria-label="Close search"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
            {/* Quick/Popular Searches */}
            <div className="space-y-4">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-text-secondary flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-accent" />
                Popular Searches
              </h3>
              <div className="flex flex-wrap gap-2">
                {popularSearches.map((s) => (
                  <button
                    key={s}
                    onClick={() => setQuery(s)}
                    className="px-3.5 py-1.5 rounded-full border border-white/5 bg-white/3 hover:bg-accent hover:border-accent hover:text-bg-primary text-sm transition-premium"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Results or Suggestions Grid */}
            <div className="md:col-span-2 space-y-4">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
                {query ? `Search Results (${results.length})` : 'Featured Products'}
              </h3>

              {loading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex gap-4 p-2 animate-pulse">
                      <div className="w-12 h-12 bg-white/5 rounded-lg" />
                      <div className="flex-1 space-y-2 py-1">
                        <div className="h-4 bg-white/5 rounded w-3/4" />
                        <div className="h-3 bg-white/5 rounded w-1/4" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : query && results.length === 0 ? (
                <div className="py-6 text-center text-sm text-text-secondary space-y-2">
                  <p>No products match &ldquo;{query}&rdquo;</p>
                  <p className="text-xs opacity-60">Try searching for &ldquo;Carbon&rdquo;, &ldquo;Case&rdquo;, or &ldquo;GaN&rdquo;</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {(query ? results : popular).map((p) => (
                    <Link
                      key={p.id}
                      href={`/products/${p.category}/${p.slug}`}
                      onClick={() => setSearchOpen(false)}
                      className="flex items-center gap-4 p-2 rounded-xl border border-white/5 bg-white/2 hover:bg-white/5 hover:border-white/10 transition-premium group"
                    >
                      <div className="relative w-14 h-14 bg-surface-card rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={p.image}
                          alt={p.name}
                          fill
                          className="object-cover"
                          sizes="60px"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-white truncate group-hover:text-accent transition-colors">
                          {p.name}
                        </h4>
                        <p className="text-xs text-text-secondary truncate mt-0.5">
                          {p.compatibility}
                        </p>
                        <p className="text-xs font-semibold text-white mt-1 font-mono">
                          ${p.price.toFixed(2)}
                        </p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-text-secondary group-hover:text-accent group-hover:translate-x-1 transition-premium mr-2 flex-shrink-0" />
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
