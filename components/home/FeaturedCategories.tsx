'use client';

import Link from 'next/link';
import { Smartphone, Headphones, Zap, Cable, BatteryCharging, Shield, Magnet } from 'lucide-react';

const categories = [
  { name: 'Phone Cases', href: '/products/cases', icon: Smartphone },
  { name: 'AirPods Cases', href: '/products/audio', icon: Headphones },
  { name: 'GaN Chargers', href: '/products/chargers', icon: Zap },
  { name: 'Braided Cables', href: '/products/cables', icon: Cable },
  { name: 'Power Banks', href: '/products/accessories', icon: BatteryCharging },
  { name: 'Screen Glass', href: '/products/protectors', icon: Shield },
  { name: 'MagSafe Acc.', href: '/products/accessories', icon: Magnet },
];

export default function FeaturedCategories() {
  return (
    <div className="max-w-7xl mx-auto w-full px-6 space-y-6">
      <h3 className="font-serif-display text-xl sm:text-2xl text-text-primary">
        Shop by Category
      </h3>
      
      <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 -mx-6 px-6 sm:mx-0 sm:px-0">
        {categories.map((cat, idx) => {
          const Icon = cat.icon;
          return (
            <Link
              key={idx}
              href={cat.href}
              className="flex-shrink-0 flex flex-col items-center justify-center w-[120px] rounded-[20px] bg-bg-surface border border-border-subtle p-5 hover:border-accent-primary hover:shadow-sm transition-all duration-300 group"
            >
              <div className="w-10 h-10 bg-bg-elevated rounded-xl flex items-center justify-center text-accent-primary group-hover:bg-accent-primary-soft transition-colors mb-3">
                <Icon size={18} />
              </div>
              <span className="text-[11px] font-medium text-text-primary whitespace-nowrap">
                {cat.name}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
