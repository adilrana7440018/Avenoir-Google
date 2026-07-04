import db from '@/lib/db';
import Hero3D from '@/components/Hero3D';
import ProductGrid from '@/components/product/ProductGrid';
import Link from 'next/link';
import { ArrowRight, Sparkles, Shield, Cpu, ShieldCheck } from 'lucide-react';
import ErrorBoundary from '@/components/ErrorBoundary';

export const metadata = {
  title: 'AERIS | Soft Aura Premium Storefront',
  description: 'Premium light-themed mobile covers, GaN chargers, and braided cables designed with materials science.',
};

export default async function HomePage() {
  let products: any[] = [];
  try {
    products = await db.product.findMany({
      take: 4,
    });
  } catch (e) {
    console.error('Failed to fetch homepage products:', e);
  }

  return (
    <div className="flex-1 flex flex-col bg-bg-base">
      {/* Dynamic light glowing backgrounds */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full aura-glow pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] rounded-full aura-glow-teal pointer-events-none -z-10" />

      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto px-6 pt-12 pb-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Editorial copy */}
        <div className="lg:col-span-7 space-y-6 sm:space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent-primary-soft border border-accent-primary/10 rounded-full text-accent-primary font-mono text-[10px] font-bold tracking-widest uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Milled From Light &bull; Crafted From Aura</span>
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-text-primary tracking-tight leading-none uppercase">
              The Aeris <br />
              <span className="text-accent-primary">Orbital Shell</span>
            </h1>
            <p className="text-base text-text-secondary max-w-lg leading-relaxed">
              Synthesized composite structures. We blend raw aramid threads and Gallium Nitride blocks with a soft, clean aesthetic, keeping your devices protected without the weight of industrial templates.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <Link
              href="/products/cases"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-text-primary hover:bg-accent-primary text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-all shadow-sm"
            >
              <span>Explore Armory</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/guides"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white hover:bg-bg-elevated text-text-primary border border-border-subtle font-bold rounded-xl text-xs uppercase tracking-wider transition-all"
            >
              Material Science Logs
            </Link>
          </div>
        </div>

        {/* 3D Canvas Box */}
        <div className="lg:col-span-5 w-full h-[350px] md:h-[450px]">
          <ErrorBoundary>
            <Hero3D />
          </ErrorBoundary>
        </div>
      </section>

      {/* Differentiators Grid */}
      <section className="border-y border-border-subtle bg-bg-surface py-12">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-2">
            <div className="w-10 h-10 bg-accent-primary-soft text-accent-primary rounded-xl flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider">Aramid Shielding</h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              Milled from bulletproof polyamides. Extreme puncture resilience wrapped in soft sand textures.
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-10 h-10 bg-accent-secondary-soft text-accent-secondary rounded-xl flex items-center justify-center">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider">GaN Fast Circuits</h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              Gallium Nitride charging hubs. Twice the capacity at half the size, running cool below 45°C.
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-10 h-10 bg-accent-warm-soft text-accent-warm rounded-xl flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider">Secure Checkouts</h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              Integrated merchant processing via Paddle encryption. Lifetime coverage on every component.
            </p>
          </div>
        </div>
      </section>

      {/* Product Catalog Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-text-primary uppercase tracking-tight">
              Featured Hardware
            </h2>
            <p className="text-xs text-text-secondary max-w-md">
              Selected premium loadouts ready for dispatch.
            </p>
          </div>
          <Link
            href="/products/all"
            className="text-xs font-bold text-accent-primary hover:underline flex items-center gap-1 font-mono uppercase tracking-wider"
          >
            Browse Catalog &rarr;
          </Link>
        </div>

        <ErrorBoundary>
          <ProductGrid products={products} />
        </ErrorBoundary>
      </section>

      {/* Technical Footer */}
      <footer className="border-t border-border-subtle bg-bg-surface py-8 text-center text-[10px] text-text-secondary font-mono tracking-wider">
        <p>&copy; {new Date().getFullYear()} AERIS LABS // ALL SPECIFICATIONS DEPLOYED.</p>
      </footer>
    </div>
  );
}
