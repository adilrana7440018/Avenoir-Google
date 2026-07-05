'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

export default function HeroProductShowcase() {
  return (
    <div className="relative w-full max-w-sm aspect-[3/4] flex items-center justify-center p-4">
      {/* Background Soft Aura Blurs */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_35%_35%,#E8E0D2_0%,transparent_65%)] opacity-60 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_65%_65%,#D8CFC2_0%,transparent_65%)] opacity-40 pointer-events-none" />

      {/* Main floating product frame */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: [0, -8, 0] }}
        transition={{
          y: {
            repeat: Infinity,
            duration: 4,
            ease: 'easeInOut',
          },
          opacity: { duration: 0.6, ease: 'easeOut' },
          scale: { duration: 0.6, ease: 'easeOut' }
        }}
        className="w-full h-full bg-bg-surface border border-border-subtle rounded-3xl p-4 shadow-sm flex flex-col justify-between"
      >
        <div className="relative w-full aspect-[4/3] rounded-[20px] overflow-hidden bg-bg-base border border-border-subtle">
          <Image
            src="/images/carbon-monolith-1.webp"
            alt="Carbon Monolith Case"
            fill
            className="object-cover"
            priority
          />
        </div>
        
        <div className="text-center pb-2">
          <h4 className="font-serif-display text-base font-bold text-text-primary">
            Carbon Monolith Case
          </h4>
          <p className="text-xs text-accent-primary font-medium mt-1">
            Starting at $55.00
          </p>
        </div>
      </motion.div>
    </div>
  );
}
