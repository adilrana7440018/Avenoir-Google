'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, ShieldAlert, Cpu } from 'lucide-react';

export default function CompatibilityFinder() {
  const router = useRouter();
  const [brand, setBrand] = useState('apple');
  const [device, setDevice] = useState('iPhone 16 Pro');
  const [category, setCategory] = useState('cases');

  const devicesMap: Record<string, string[]> = {
    apple: ['iPhone 16 Pro', 'iPhone 16 Pro Max', 'iPhone 15 Pro', 'AirPods Pro 2'],
    samsung: ['Galaxy S25 Ultra', 'Galaxy S25'],
  };

  const handleScan = (e: React.FormEvent) => {
    e.preventDefault();
    // Route to category page with search param filters
    router.push(`/products/${category}?device=${encodeURIComponent(device)}`);
  };

  return (
    <div className="glass-card rounded-2xl p-6 md:p-8 max-w-xl mx-auto border border-white/10 hover:border-accent/30 shadow-2xl relative overflow-hidden group">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-2xl group-hover:bg-accent/10 transition-colors pointer-events-none" />

      <div className="flex items-center gap-2.5 mb-4">
        <Cpu className="w-5 h-5 text-accent animate-pulse-glow" />
        <h3 className="text-base font-bold font-display tracking-wider uppercase text-white">
          Tactile Compatibility Scanner
        </h3>
      </div>
      <p className="text-xs text-text-secondary mb-6 leading-relaxed">
        Select your exact hardware specifications to render a dedicated, filtered armory of compatible monolithic shells and GaN fast components.
      </p>

      <form onSubmit={handleScan} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-bold text-text-secondary tracking-wider font-mono">
              Hardware Brand
            </label>
            <select
              value={brand}
              onChange={(e) => {
                const b = e.target.value;
                setBrand(b);
                setDevice(devicesMap[b][0]); // Set default device for that brand
              }}
              className="w-full bg-surface-card border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-accent font-display cursor-pointer"
            >
              <option value="apple">Apple (iOS)</option>
              <option value="samsung">Samsung (Android)</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-bold text-text-secondary tracking-wider font-mono">
              Exact Device Model
            </label>
            <select
              value={device}
              onChange={(e) => setDevice(e.target.value)}
              className="w-full bg-surface-card border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-accent font-display cursor-pointer"
            >
              {devicesMap[brand].map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] uppercase font-bold text-text-secondary tracking-wider font-mono">
            Desired Component
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full bg-surface-card border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-accent font-display cursor-pointer"
          >
            <option value="cases">Milled Composite Cases</option>
            <option value="chargers">Gallium Nitride (GaN) Chargers</option>
            <option value="cables">Ballistic Nylon Cables</option>
            <option value="audio">AirPods Audio Protection</option>
            <option value="protectors">Double-Tempered Screen Glass</option>
            <option value="accessories">Modular MagSafe Accessories</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-accent hover:bg-cyan-400 text-bg-primary font-bold py-3.5 rounded-xl text-sm flex items-center justify-center gap-2 group transition-premium mt-4 shadow-lg shadow-accent/5"
        >
          <Search className="w-4 h-4" />
          <span>Render Compatible Armor</span>
        </button>
      </form>
    </div>
  );
}
