'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { SlidersHorizontal, Check, RefreshCw } from 'lucide-react';
import { useState, useEffect } from 'react';

interface FilterSidebarProps {
  currentCategory: string;
}

export default function FilterSidebar({ currentCategory }: FilterSidebarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // Extract current values from search params
  const activeDevice = searchParams.get('device') || '';
  const activeSort = searchParams.get('sort') || 'newest';
  const activePriceRange = searchParams.get('priceRange') || '';
  const activeColor = searchParams.get('color') || '';

  const devices = [
    { name: 'All Devices', value: '' },
    { name: 'iPhone 16 Pro', value: 'iPhone 16 Pro' },
    { name: 'iPhone 16 Pro Max', value: 'iPhone 16 Pro Max' },
    { name: 'Galaxy S25 Ultra', value: 'Galaxy S25 Ultra' },
    { name: 'iPhone 15 Pro', value: 'iPhone 15 Pro' },
    { name: 'AirPods Pro 2', value: 'AirPods Pro 2' },
  ];

  const priceRanges = [
    { label: 'All Prices', value: '' },
    { label: 'Under $30', value: '0-30' },
    { label: '$30 - $50', value: '30-50' },
    { label: 'Over $50', value: '50-1000' },
  ];

  const colors = [
    { label: 'All Colors', value: '', hex: '' },
    { label: 'Obsidian Black', value: 'Obsidian Black', hex: '#0D0D0D' },
    { label: 'Electric Cyan', value: 'Electric Cyan', hex: '#22D3EE' },
  ];

  const sorts = [
    { label: 'Newest Arrivals', value: 'newest' },
    { label: 'Highest Rated', value: 'rating' },
    { label: 'Price: Low to High', value: 'price-asc' },
    { label: 'Price: High to Low', value: 'price-desc' },
  ];

  // Helper to build URL search parameters
  const updateQuery = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleClearFilters = () => {
    router.push(pathname);
  };

  return (
    <div className="space-y-8 bg-bg-secondary/40 border border-white/10 rounded-2xl p-6 h-fit">
      {/* Title */}
      <div className="flex items-center justify-between border-b border-white/5 pb-4">
        <div className="flex items-center gap-2 font-display font-semibold text-white">
          <SlidersHorizontal className="w-4 h-4 text-accent" />
          <span>Filters</span>
        </div>
        {(activeDevice || activePriceRange || activeColor || activeSort !== 'newest') && (
          <button
            onClick={handleClearFilters}
            className="text-xs text-accent hover:underline flex items-center gap-1 font-medium"
          >
            <RefreshCw className="w-3 h-3" />
            Reset
          </button>
        )}
      </div>

      {/* Sorting */}
      <div className="space-y-3">
        <h4 className="text-[10px] uppercase font-bold text-text-secondary tracking-wider font-mono">
          Sort by
        </h4>
        <div className="space-y-2">
          {sorts.map((s) => (
            <button
              key={s.value}
              onClick={() => updateQuery('sort', s.value)}
              className={`w-full text-left text-xs py-2 px-3 rounded-lg border transition-premium flex items-center justify-between ${
                activeSort === s.value
                  ? 'bg-accent/10 border-accent/30 text-accent font-semibold'
                  : 'bg-white/2 border-white/5 text-text-secondary hover:text-white hover:border-white/10'
              }`}
            >
              <span>{s.label}</span>
              {activeSort === s.value && <Check className="w-3.5 h-3.5 text-accent" />}
            </button>
          ))}
        </div>
      </div>

      {/* Device Filter */}
      <div className="space-y-3">
        <h4 className="text-[10px] uppercase font-bold text-text-secondary tracking-wider font-mono">
          Device Compatibility
        </h4>
        <div className="space-y-1">
          {devices.map((d) => (
            <button
              key={d.name}
              onClick={() => updateQuery('device', d.value)}
              className={`w-full text-left text-xs py-2 px-3 rounded-lg border transition-premium flex items-center justify-between ${
                activeDevice === d.value
                  ? 'bg-accent/10 border-accent/30 text-accent font-semibold'
                  : 'bg-transparent border-transparent text-text-secondary hover:text-white hover:bg-white/3'
              }`}
            >
              <span>{d.name}</span>
              {activeDevice === d.value && <Check className="w-3.5 h-3.5 text-accent" />}
            </button>
          ))}
        </div>
      </div>

      {/* Price filter */}
      <div className="space-y-3">
        <h4 className="text-[10px] uppercase font-bold text-text-secondary tracking-wider font-mono">
          Price Range
        </h4>
        <div className="space-y-1">
          {priceRanges.map((r) => (
            <button
              key={r.label}
              onClick={() => updateQuery('priceRange', r.value)}
              className={`w-full text-left text-xs py-2 px-3 rounded-lg border transition-premium flex items-center justify-between ${
                activePriceRange === r.value
                  ? 'bg-accent/10 border-accent/30 text-accent font-semibold'
                  : 'bg-transparent border-transparent text-text-secondary hover:text-white hover:bg-white/3'
              }`}
            >
              <span>{r.label}</span>
              {activePriceRange === r.value && <Check className="w-3.5 h-3.5 text-accent" />}
            </button>
          ))}
        </div>
      </div>

      {/* Color Filter */}
      <div className="space-y-3">
        <h4 className="text-[10px] uppercase font-bold text-text-secondary tracking-wider font-mono">
          Colorway
        </h4>
        <div className="flex flex-wrap gap-2.5">
          {colors.map((c) => (
            <button
              key={c.label}
              onClick={() => updateQuery('color', c.value)}
              className={`px-3 py-1.5 rounded-full border text-xs font-semibold flex items-center gap-1.5 transition-premium ${
                activeColor === c.value
                  ? 'bg-accent/10 border-accent/40 text-accent'
                  : 'bg-white/3 border-white/5 text-text-secondary hover:text-white hover:border-white/10'
              }`}
            >
              {c.hex && (
                <span
                  className="w-2.5 h-2.5 rounded-full border border-white/10"
                  style={{ backgroundColor: c.hex }}
                />
              )}
              <span>{c.label === 'All Colors' ? 'All' : c.label.split(' ')[1]}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
