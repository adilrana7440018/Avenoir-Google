'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Shield, Sparkles, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

export default function HeroProductShowcase() {
  return (
    <div className="relative w-full h-full min-h-[350px] md:min-h-[420px] flex items-center justify-center p-6 select-none">
      {/* Decorative background gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,#E0E7FF_0%,transparent_70%)] opacity-80" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,#CCFBF1_0%,transparent_70%)] opacity-80" />

      {/* Main overlapping layout */}
      <div className="relative w-full max-w-sm flex items-center justify-center">
        {/* Card 1: GaN Charger (Offset Back) */}
        <motion.div
          initial={{ opacity: 0, x: 20, y: -20, rotate: 6 }}
          animate={{ opacity: 1, x: 20, y: -20, rotate: 6 }}
          whileHover={{ y: -30, rotate: 4, transition: { duration: 0.3 } }}
          className="absolute w-52 aspect-[4/5] bg-white border border-border-subtle rounded-3xl p-4 shadow-sm z-10 origin-bottom-right"
        >
          <div className="relative w-full aspect-[4/3] bg-bg-elevated rounded-2xl overflow-hidden border border-border-subtle">
            <Image
              src="/images/proton-65w-1.webp"
              alt="Fast Charger"
              fill
              className="object-cover"
            />
          </div>
          <div className="mt-3 space-y-1">
            <span className="text-[8px] font-bold uppercase tracking-widest text-text-tertiary font-mono block">
              POWER ARCHITECTURE
            </span>
            <h4 className="text-xs font-bold text-text-primary">Proton 65W GaN</h4>
            <div className="flex justify-between items-center pt-2">
              <span className="text-[10px] font-mono font-bold text-accent-primary">$45.00</span>
              <span className="text-[8px] font-mono font-bold bg-accent-secondary-soft text-accent-secondary px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                <Zap className="w-2 h-2" /> 65W FAST
              </span>
            </div>
          </div>
        </motion.div>

        {/* Card 2: Carbon Case (Main Front) */}
        <motion.div
          initial={{ opacity: 0, x: -20, y: 10, rotate: -6 }}
          animate={{ opacity: 1, x: -20, y: 10, rotate: -6 }}
          whileHover={{ y: 0, rotate: -4, transition: { duration: 0.3 } }}
          className="w-56 aspect-[4/5] bg-white border border-border-subtle rounded-3xl p-4.5 shadow-md z-20 origin-bottom-left"
        >
          <Link href="/products/cases/carbon-monolith-case" className="block relative w-full aspect-[4/3] bg-bg-elevated rounded-2xl overflow-hidden border border-border-subtle">
            <Image
              src="/images/carbon-monolith-1.webp"
              alt="Carbon Case"
              fill
              className="object-cover"
            />
          </Link>
          <div className="mt-4 space-y-1.5">
            <div className="flex justify-between items-center">
              <span className="text-[8px] font-bold uppercase tracking-widest text-text-tertiary font-mono block">
                COMPOSITE LOCKER
              </span>
              <span className="text-[8px] font-mono font-bold bg-accent-primary-soft text-accent-primary px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                <Shield className="w-2 h-2" /> 10M DROP
              </span>
            </div>
            <Link href="/products/cases/carbon-monolith-case" className="block">
              <h4 className="text-xs sm:text-sm font-extrabold text-text-primary hover:text-accent-primary transition-colors">
                Carbon Monolith
              </h4>
            </Link>
            <div className="flex justify-between items-center pt-2">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-mono font-bold text-accent-primary">$55.00</span>
                <span className="text-[10px] text-text-tertiary line-through font-mono">$65.00</span>
              </div>
              <span className="text-[9px] font-mono text-text-secondary">Fits: iPhone 16 Pro</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
