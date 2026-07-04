'use client';

import { ShieldCheck, Truck, RotateCcw, Heart, Send } from 'lucide-react';
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
    <footer className="bg-bg-secondary border-t border-white/10 mt-auto">
      {/* Guarantees strip */}
      <div className="border-b border-white/10 bg-bg-primary/50 py-8">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-accent/10 rounded-xl text-accent">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm">Same-Day Dispatch</h4>
              <p className="text-text-secondary text-xs mt-0.5">Order before 2 PM for instant dispatch.</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-accent/10 rounded-xl text-accent">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm">Monolithic Warranty</h4>
              <p className="text-text-secondary text-xs mt-0.5">True lifetime replacement guarantee.</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-accent/10 rounded-xl text-accent">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm">30-Day Physical Trials</h4>
              <p className="text-text-secondary text-xs mt-0.5">Hassle-free, plain-language returns.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand details */}
        <div className="space-y-4">
          <Link
            href="/"
            className="text-lg font-bold font-display tracking-widest text-white hover:text-accent transition-colors"
          >
            AVENOIR
          </Link>
          <p className="text-text-secondary text-xs leading-relaxed max-w-xs">
            Architectural protection for physical technology. Milled from carbon composites and aramid fibers to secure your essential digital tools.
          </p>
          {/* Social icons */}
          <div className="flex items-center gap-3 pt-2">
            {['Twitter', 'Instagram', 'Discord', 'YouTube'].map((social) => (
              <a
                key={social}
                href="#"
                className="text-text-secondary hover:text-white text-xs px-2.5 py-1 rounded-lg border border-white/5 bg-white/2 hover:bg-white/5 transition-colors"
              >
                {social}
              </a>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div className="space-y-4">
          <h4 className="text-white font-semibold text-sm tracking-wider uppercase">Products</h4>
          <ul className="space-y-2 text-xs">
            <li><Link href="/products/cases" className="text-text-secondary hover:text-white transition-colors">Composite Cases</Link></li>
            <li><Link href="/products/chargers" className="text-text-secondary hover:text-white transition-colors">GaN Chargers</Link></li>
            <li><Link href="/products/cables" className="text-text-secondary hover:text-white transition-colors">Nylon Cables</Link></li>
            <li><Link href="/products/audio" className="text-text-secondary hover:text-white transition-colors">AirPods Protection</Link></li>
            <li><Link href="/products/protectors" className="text-text-secondary hover:text-white transition-colors">Screen Glass</Link></li>
            <li><Link href="/products/accessories" className="text-text-secondary hover:text-white transition-colors">MagSafe Accessories</Link></li>
          </ul>
        </div>

        {/* Support & Policies */}
        <div className="space-y-4">
          <h4 className="text-white font-semibold text-sm tracking-wider uppercase">Support</h4>
          <ul className="space-y-2 text-xs">
            <li><Link href="/faq" className="text-text-secondary hover:text-white transition-colors">FAQs & Guides</Link></li>
            <li><Link href="/returns" className="text-text-secondary hover:text-white transition-colors">Warranty & Returns</Link></li>
            <li><Link href="/shipping" className="text-text-secondary hover:text-white transition-colors">Shipping Information</Link></li>
            <li><Link href="/contact" className="text-text-secondary hover:text-white transition-colors">Submit Support Ticket</Link></li>
            <li><Link href="/admin" className="text-accent hover:underline transition-colors font-medium">Operator Panel (Admin)</Link></li>
          </ul>
        </div>

        {/* Newsletter */}
        <div className="space-y-4">
          <h4 className="text-white font-semibold text-sm tracking-wider uppercase">Join The Feed</h4>
          <p className="text-text-secondary text-xs leading-relaxed">
            Get first access to limited edition milling collabs and new materials drops.
          </p>
          {!subscribed ? (
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <input
                type="email"
                required
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-surface-card border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-accent w-full placeholder:text-text-secondary/50"
              />
              <button
                type="submit"
                className="bg-accent hover:bg-cyan-400 text-bg-primary p-2.5 rounded-xl flex items-center justify-center transition-colors"
                aria-label="Subscribe"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          ) : (
            <p className="text-accent font-semibold text-xs py-2">
              ✓ Subscribed. Welcome to the Monolith.
            </p>
          )}
        </div>
      </div>

      {/* Sub-footer */}
      <div className="border-t border-white/5 py-6 bg-bg-primary/30">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-text-secondary text-xs">
            &copy; {currentYear} AVENOIR Labs. All rights reserved.
          </p>
          <div className="flex items-center gap-3 text-text-secondary text-xs font-mono">
            <span>Stripe Secured</span>
            <span>&bull;</span>
            <span>PCI-Compliant</span>
            <span>&bull;</span>
            <span>PayPal Encrypted</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
