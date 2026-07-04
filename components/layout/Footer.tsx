'use client';

import { ShieldCheck, Truck, RotateCcw, Send, Command } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
    }
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-bg-primary border-t border-white/10 mt-auto font-mono text-xs">
      {/* Guarantees Blueprint Strip */}
      <div className="border-b border-white/10 bg-bg-secondary/30">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/10">
          <div className="py-6 flex items-center gap-4 md:pr-6">
            <Truck className="w-5 h-5 text-accent flex-shrink-0" />
            <div className="space-y-0.5">
              <h4 className="text-white font-bold tracking-widest text-[10px] uppercase">LOGISTICS // SAME-DAY</h4>
              <p className="text-text-secondary text-[10px]">Orders processed before 14:00 EST dispatch instantly.</p>
            </div>
          </div>
          <div className="py-6 flex items-center gap-4 md:px-6">
            <ShieldCheck className="w-5 h-5 text-accent flex-shrink-0" />
            <div className="space-y-0.5">
              <h4 className="text-white font-bold tracking-widest text-[10px] uppercase">WARRANTY // LIFETIME</h4>
              <p className="text-text-secondary text-[10px]">Aramid shells backed by structural replacement guarantee.</p>
            </div>
          </div>
          <div className="py-6 flex items-center gap-4 md:pl-6">
            <RotateCcw className="w-5 h-5 text-accent flex-shrink-0" />
            <div className="space-y-0.5">
              <h4 className="text-white font-bold tracking-widest text-[10px] uppercase">RETURNS // 30 DAYS</h4>
              <p className="text-text-secondary text-[10px]">Plain-language return protocol. Zero generic hoops.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main BluePrint Matrix */}
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand spec */}
        <div className="space-y-4">
          <div className="flex items-center gap-1 text-white font-bold tracking-widest text-sm uppercase">
            <Command className="w-4 h-4 text-accent" />
            <span>AVENOIR // LABS</span>
          </div>
          <p className="text-text-secondary text-[10px] leading-relaxed">
            SYSTEM_ID: LBS-M5-01 // Architectural shells milled from carbon composites and aramid synthetics. Optimized for maximum heat dispersion and kinetic absorption.
          </p>
          <div className="flex flex-wrap gap-2 text-[9px] pt-2">
            {['TWITTER', 'INSTAGRAM', 'DISCORD', 'YOUTUBE'].map((social) => (
              <a
                key={social}
                href="#"
                className="px-2 py-0.5 rounded border border-white/10 hover:border-accent hover:text-accent transition-colors"
              >
                {social}
              </a>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div className="space-y-4">
          <h4 className="text-white font-bold tracking-widest text-[10px] uppercase border-b border-white/5 pb-2">
            ARMORY_DIVISIONS
          </h4>
          <ul className="space-y-2 text-[10px]">
            <li><Link href="/products/cases" className="text-text-secondary hover:text-white transition-colors">[01] COMPOSITE CASES</Link></li>
            <li><Link href="/products/chargers" className="text-text-secondary hover:text-white transition-colors">[02] GAN FAST CHARGERS</Link></li>
            <li><Link href="/products/cables" className="text-text-secondary hover:text-white transition-colors">[03] QUANTUM NYLON CABLES</Link></li>
            <li><Link href="/products/audio" className="text-text-secondary hover:text-white transition-colors">[04] AIRPODS CASE COVERS</Link></li>
            <li><Link href="/products/protectors" className="text-text-secondary hover:text-white transition-colors">[05] DOUBLE ION SCREEN GLASS</Link></li>
            <li><Link href="/products/accessories" className="text-text-secondary hover:text-white transition-colors">[06] MODULAR STANDS & WALLETS</Link></li>
          </ul>
        </div>

        {/* Support */}
        <div className="space-y-4">
          <h4 className="text-white font-bold tracking-widest text-[10px] uppercase border-b border-white/5 pb-2">
            PROTOCOL_LINKS
          </h4>
          <ul className="space-y-2 text-[10px]">
            <li><Link href="/faq" className="text-text-secondary hover:text-white transition-colors">[SUB] FAQS & DOCUMENTATION</Link></li>
            <li><Link href="/returns" className="text-text-secondary hover:text-white transition-colors">[SUB] WARRANTY & REFUNDS</Link></li>
            <li><Link href="/shipping" className="text-text-secondary hover:text-white transition-colors">[SUB] LOGISTICAL INFO</Link></li>
            <li><Link href="/admin" className="text-accent hover:underline transition-colors font-semibold">[SYS] OPERATOR PANEL</Link></li>
          </ul>
        </div>

        {/* Newsletter Terminal */}
        <div className="space-y-4">
          <h4 className="text-white font-bold tracking-widest text-[10px] uppercase border-b border-white/5 pb-2">
            NEWSLETTER_MANIFEST
          </h4>
          <p className="text-text-secondary text-[10px] leading-relaxed">
            Queue your address to join the feed. Get immediate warnings on aramid milling collaborations.
          </p>
          {!subscribed ? (
            <form onSubmit={handleSubscribe} className="flex border border-white/10 rounded-xl bg-bg-secondary overflow-hidden focus-within:border-accent">
              <input
                type="email"
                required
                placeholder="USER@DOMAIN.COM"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-transparent px-3 py-2 text-[10px] text-white focus:outline-none w-full placeholder:text-text-secondary/30 uppercase"
              />
              <button
                type="submit"
                className="bg-white/5 hover:bg-accent hover:text-bg-primary px-3 transition-colors flex items-center justify-center border-l border-white/10"
                aria-label="Submit"
              >
                <Send className="w-3 h-3" />
              </button>
            </form>
          ) : (
            <div className="bg-accent/15 border border-accent/30 rounded-xl p-2 text-accent text-[10px] font-semibold">
              SYSTEM_QUEUE // EMAIL_REGISTERED
            </div>
          )}
        </div>
      </div>

      {/* BluePrint Footer coordinates */}
      <div className="border-t border-white/10 py-6 bg-bg-secondary/20 text-[9px] text-text-secondary">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap gap-4 items-center justify-center md:justify-start">
            <span>&copy; {currentYear} AVENOIR LABS // ALL RIGHTS RESOLVED.</span>
            <span className="hidden md:inline text-white/20">|</span>
            <span>ZONE // IAD1.EAST</span>
            <span className="hidden md:inline text-white/20">|</span>
            <span>COORDS // 38.9072&deg; N, 77.0369&deg; W</span>
          </div>
          <div className="flex items-center gap-3">
            <span>PCI_COMPLIANT</span>
            <span>&bull;</span>
            <span>SSL_ENCRYPTED</span>
            <span>&bull;</span>
            <span>STRIPE_ACTIVE</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
