import Image from 'next/image';
import Link from 'next/link';
import db from '@/lib/db';
import ProductCard from '@/components/product/ProductCard';
import CompatibilityFinder from '@/components/home/CompatibilityFinder';
import { Shield, ShieldAlert, Cpu, Zap, Star, MessageSquareCode, ArrowRight, HelpCircle } from 'lucide-react';

export const revalidate = 60; // Revalidate home page cache every minute

export default async function Home() {
  // Fetch featured products from the SQLite DB
  const products = await db.product.findMany({
    where: { isFeatured: true },
    take: 4,
  });

  const differentiators = [
    {
      icon: <Shield className="w-6 h-6 text-accent" />,
      title: 'Bulletproof Aramid Base',
      desc: 'Woven from custom-spun aerospace aramid yarns 5x stronger than steel on an equal weight basis, resisting physical tears and impacts.',
    },
    {
      icon: <Zap className="w-6 h-6 text-accent" />,
      title: 'Smart GaN Conductivity',
      desc: 'Gallium Nitride charging components that deliver double the speed with half the thermal emission and half the footprint of standard silicon.',
    },
    {
      icon: <ShieldAlert className="w-6 h-6 text-accent" />,
      title: 'Self-Healing Polymers',
      desc: 'Finished with a molecular recovery layer that self-repairs superficial keys and micro-scratches within hours under ambient warmth.',
    },
    {
      icon: <Cpu className="w-6 h-6 text-accent" />,
      title: 'Integrated N52 Magnet Array',
      desc: 'Woven with a matrix of 36 NdFeB rare-earth magnets to produce 1,200g of stable MagSafe lock-on force, preventing dock slippage.',
    },
  ];

  const guides = [
    {
      title: 'How to Spot a Fake Charger: A GaN Fast Engineering Guide',
      category: 'Guides',
      readTime: '4 min read',
      slug: 'how-to-spot-fake-charger',
    },
    {
      title: 'Aramid Fiber vs Carbon Fiber: What Protections Actually Matter?',
      category: 'Engineering',
      readTime: '6 min read',
      slug: 'aramid-vs-carbon-fiber',
    },
    {
      title: 'Is 10m Drop Protection Overkill? The Physics of Accelerometer G-Force',
      category: 'Science',
      readTime: '5 min read',
      slug: 'drop-protection-physics',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen mesh-bg relative overflow-hidden">
      {/* Background grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 md:py-32 max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Content */}
        <div className="lg:col-span-7 space-y-8 animate-fade-in z-10 text-center lg:text-left">
          {/* Trust Strip */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm text-xs text-text-secondary font-medium tracking-wide">
            <span className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse-glow" />
            Same-day Dispatch before 2 PM &bull; Lifetime Warranty
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold font-display tracking-tight leading-[1.05] text-white">
            Architectural armor for <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-accent glow-text">physical tech.</span>
          </h1>

          <p className="text-sm sm:text-base text-text-secondary leading-relaxed max-w-xl mx-auto lg:mx-0">
            Cases milled from carbon-weave composites and bulletproof aramid. Drop-tested to a brutal 10m military specification. Backed by a true lifetime replacement warranty. No filler. Just precise engineering.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
            <Link
              href="/products/cases"
              className="w-full sm:w-auto bg-accent hover:bg-cyan-400 text-bg-primary font-bold px-8 py-4 rounded-xl text-center transition-premium shadow-lg shadow-accent/10"
            >
              Shop Monolith Cases
            </Link>
            <Link
              href="/products/chargers"
              className="w-full sm:w-auto bg-transparent border border-white/10 hover:border-white/30 text-white font-bold px-8 py-4 rounded-xl text-center transition-premium hover:bg-white/5"
            >
              Explore GaN Charging
            </Link>
          </div>

          {/* Guarantees Grid */}
          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/5 text-center lg:text-left max-w-md mx-auto lg:mx-0">
            <div>
              <p className="text-lg font-bold font-mono text-white">10m</p>
              <p className="text-[10px] uppercase font-bold text-text-secondary tracking-wider mt-0.5">Drop Cert</p>
            </div>
            <div>
              <p className="text-lg font-bold font-mono text-white">1.2mm</p>
              <p className="text-[10px] uppercase font-bold text-text-secondary tracking-wider mt-0.5">Ultra Thin</p>
            </div>
            <div>
              <p className="text-lg font-bold font-mono text-white">100%</p>
              <p className="text-[10px] uppercase font-bold text-text-secondary tracking-wider mt-0.5">Aramid Woven</p>
            </div>
          </div>
        </div>

        {/* Right Floating Product Visual */}
        <div className="lg:col-span-5 flex justify-center z-10 animate-float">
          <div className="relative w-80 h-80 sm:w-[420px] sm:h-[420px] bg-gradient-to-tr from-surface-card to-white/5 rounded-3xl border border-white/10 overflow-hidden flex items-center justify-center shadow-2xl p-4">
            <Image
              src="/images/carbon-monolith-1.webp"
              alt="Avenoir Carbon Monolith Premium Phone Case"
              fill
              priority
              className="object-cover"
              sizes="(max-width: 768px) 300px, 420px"
            />
            {/* Soft cyan backing glow */}
            <div className="absolute inset-0 bg-accent/5 pointer-events-none mix-blend-overlay" />
          </div>
        </div>
      </section>

      {/* Category Bento Grid */}
      <section className="py-20 bg-bg-secondary/40 border-y border-white/10 relative">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          <div className="text-center md:text-left">
            <span className="text-[10px] uppercase font-bold text-accent font-mono tracking-widest">
              The Collection
            </span>
            <h2 className="text-2xl md:text-3xl font-bold font-display tracking-tight text-white mt-2">
              Select Your Armory Division
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Cases Card - Double width */}
            <Link
              href="/products/cases"
              className="md:col-span-2 group relative h-80 bg-surface-card border border-white/10 rounded-2xl overflow-hidden transition-premium hover:-translate-y-1 hover:border-accent/40"
            >
              <Image
                src="/images/carbon-monolith-2.webp"
                alt="Carbon Monolith Cases"
                fill
                className="object-cover opacity-80 group-hover:opacity-95 transition-premium group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 500px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-bg-primary via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <span className="text-[9px] uppercase font-bold text-accent font-mono tracking-widest">
                  Mil-spec armor
                </span>
                <h3 className="text-xl font-bold text-white mt-1 group-hover:text-accent transition-colors flex items-center gap-2">
                  Milled Composite Cases <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </h3>
              </div>
            </Link>

            {/* Chargers Card */}
            <Link
              href="/products/chargers"
              className="group relative h-80 bg-surface-card border border-white/10 rounded-2xl overflow-hidden transition-premium hover:-translate-y-1 hover:border-accent/40"
            >
              <Image
                src="/images/proton-65w-1.webp"
                alt="GaN Fast Chargers"
                fill
                className="object-cover opacity-60 group-hover:opacity-85 transition-premium group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 250px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-bg-primary via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <span className="text-[9px] uppercase font-bold text-accent font-mono tracking-widest">
                  Gallium Nitride
                </span>
                <h3 className="text-lg font-bold text-white mt-1 group-hover:text-accent transition-colors flex items-center gap-1.5">
                  GaN Chargers <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </h3>
              </div>
            </Link>

            {/* Cables Card */}
            <Link
              href="/products/cables"
              className="group relative h-80 bg-surface-card border border-white/10 rounded-2xl overflow-hidden transition-premium hover:-translate-y-1 hover:border-accent/40"
            >
              <Image
                src="/images/quantum-cable-1.webp"
                alt="Braided Nylon Cables"
                fill
                className="object-cover opacity-60 group-hover:opacity-85 transition-premium group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 250px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-bg-primary via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <span className="text-[9px] uppercase font-bold text-accent font-mono tracking-widest">
                  High-throughput
                </span>
                <h3 className="text-lg font-bold text-white mt-1 group-hover:text-accent transition-colors flex items-center gap-1.5">
                  Quantum Cables <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </h3>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Interactive Compatibility Finder */}
      <section className="py-20 max-w-7xl mx-auto px-6 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
            <span className="text-[10px] uppercase font-bold text-accent font-mono tracking-widest">
              Live Scanner
            </span>
            <h2 className="text-2xl md:text-4xl font-bold font-display tracking-tight text-white">
              Zero Guesswork. <br />Only Precise Fits.
            </h2>
            <p className="text-sm text-text-secondary leading-relaxed max-w-lg mx-auto lg:mx-0">
              Unlike generic templates, our armory filters listings directly by the device you hold. Configure your exact hardware specs below, and let Avenoir compile your compatible setup.
            </p>
          </div>
          <div className="lg:col-span-6">
            <CompatibilityFinder />
          </div>
        </div>
      </section>

      {/* Trending Products */}
      <section className="py-20 bg-bg-secondary/20 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="text-center md:text-left">
              <span className="text-[10px] uppercase font-bold text-accent font-mono tracking-widest">
                Now Trending
              </span>
              <h2 className="text-2xl md:text-3xl font-bold font-display tracking-tight text-white mt-2">
                Featured Components
              </h2>
            </div>
            <Link
              href="/products/cases"
              className="text-sm font-semibold text-accent hover:text-cyan-400 transition-colors flex items-center justify-center gap-1 group"
            >
              View Full Armory <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* Differentiators Section */}
      <section className="py-20 border-t border-white/10 max-w-7xl mx-auto px-6 space-y-16">
        <div className="text-center max-w-xl mx-auto space-y-3">
          <span className="text-[10px] uppercase font-bold text-accent font-mono tracking-widest">
            Engineering Metrics
          </span>
          <h2 className="text-2xl md:text-3xl font-bold font-display tracking-tight text-white">
            Built for Extremes. Milled for tactile utility.
          </h2>
          <p className="text-sm text-text-secondary leading-relaxed">
            We don&apos;t build cases because competitors do. We build them to push physical materials engineering to its absolute limits.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {differentiators.map((d, i) => (
            <div
              key={i}
              className="glass-card rounded-2xl p-6 border border-white/15 space-y-4 hover:-translate-y-1 transition-premium"
            >
              <div className="p-3 bg-white/5 border border-white/10 rounded-xl w-fit text-accent">
                {d.icon}
              </div>
              <h3 className="font-semibold text-white text-base tracking-tight">{d.title}</h3>
              <p className="text-xs text-text-secondary leading-relaxed">{d.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Reviews Grid */}
      <section className="py-20 bg-bg-secondary/40 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          <div className="text-center max-w-md mx-auto space-y-3">
            <span className="text-[10px] uppercase font-bold text-accent font-mono tracking-widest">
              Verified Feedback
            </span>
            <h2 className="text-2xl md:text-3xl font-bold font-display tracking-tight text-white">
              Tactile Verification
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: 'Sarah K.',
                rating: 5,
                comment: 'The Carbon fiber case is exceptionally rigid yet amazingly thin. Fits the iPhone 16 Pro Max perfectly, no loose margins. The cyan accents match my workspace beautifully.',
                prod: 'Carbon Monolith Case',
              },
              {
                name: 'Marcus V.',
                rating: 5,
                comment: 'The GaN charger is a game-changer for traveling. Powers my MacBook Air and fast charges my Galaxy S25 at the same time, without heating up like Apple standard bricks.',
                prod: 'Proton 65W GaN Charger',
              },
              {
                name: 'Alex M.',
                rating: 4,
                comment: 'Premium thick cables. The cyan braid is highly distinctive, does not fray like basic rubber cords, and the integrated rubber cable organizer is extremely useful.',
                prod: 'Quantum Cyan Cable',
              },
            ].map((r, i) => (
              <div key={i} className="bg-surface-card border border-white/10 rounded-2xl p-6 space-y-4 relative">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-white">{r.name}</span>
                  <span className="bg-accent/15 text-accent text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider font-mono">
                    Verified Buyer
                  </span>
                </div>
                <div className="flex gap-1">
                  {[...Array(r.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 text-accent fill-accent" />
                  ))}
                </div>
                <p className="text-xs text-text-secondary leading-relaxed italic">
                  &ldquo;{r.comment}&rdquo;
                </p>
                <div className="pt-3 border-t border-white/5 text-[10px] text-text-secondary font-mono">
                  Reviewing: <span className="text-white">{r.prod}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SEO Guides Strip */}
      <section className="py-20 border-t border-white/10 max-w-7xl mx-auto px-6 space-y-12">
        <div className="flex justify-between items-end border-b border-white/5 pb-6">
          <div className="space-y-2">
            <span className="text-[10px] uppercase font-bold text-accent font-mono tracking-widest">
              Engineering Logs
            </span>
            <h2 className="text-xl md:text-2xl font-bold font-display tracking-tight text-white">
              The Avenoir Knowledge Base
            </h2>
          </div>
          <span className="text-xs text-text-secondary hover:text-white transition-colors cursor-pointer hidden sm:block">
            View all logs &rarr;
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {guides.map((g, i) => (
            <div
              key={i}
              className="glass-card rounded-2xl p-6 border border-white/10 flex flex-col justify-between h-48 hover:border-accent/30 transition-premium cursor-pointer group"
            >
              <div className="space-y-3">
                <span className="text-[9px] uppercase font-bold text-accent font-mono tracking-widest bg-accent/10 px-2 py-0.5 rounded">
                  {g.category}
                </span>
                <h3 className="text-sm font-semibold text-white group-hover:text-accent transition-colors leading-snug">
                  {g.title}
                </h3>
              </div>
              <div className="flex justify-between items-center text-[10px] text-text-secondary font-mono pt-4 border-t border-white/5">
                <span>{g.readTime}</span>
                <span className="text-accent group-hover:translate-x-1 transition-transform">Read guide &rarr;</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
