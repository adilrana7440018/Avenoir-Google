import db from '@/lib/db';
import AnimatedHeroText from '@/components/home/AnimatedHeroText';
import HeroProductShowcase from '@/components/home/HeroProductShowcase';
import FeaturedCategories from '@/components/home/FeaturedCategories';
import TrustSection from '@/components/home/TrustSection';
import ReviewsSection from '@/components/home/ReviewsSection';
import ProductGrid from '@/components/product/ProductGrid';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import ErrorBoundary from '@/components/ErrorBoundary';

export const metadata = {
  title: 'AVENOIR | Premium Tech Accessories',
  description: 'Premium phone cases, chargers, cables, and tech accessories. Minimal, durable, and designed to match your device.',
};

export default async function HomePage() {
  let featuredProducts: any[] = [];
  let newArrivals: any[] = [];
  
  try {
    featuredProducts = await db.product.findMany({
      where: { isFeatured: true },
      take: 4,
    });

    newArrivals = await db.product.findMany({
      orderBy: { id: 'desc' },
      take: 4,
    });
  } catch (e) {
    console.error('Failed to fetch homepage data:', e);
  }

  return (
    <div className="flex-1 flex flex-col bg-bg-base">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto w-full px-6 pt-8 pb-12 md:pt-12 md:pb-20 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        {/* Editorial copy */}
        <div className="space-y-6 order-2 lg:order-1">
          <ErrorBoundary>
            <AnimatedHeroText />
          </ErrorBoundary>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link
              href="/products/all"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-accent-primary hover:bg-accent-primary/90 text-white font-medium rounded-xl text-sm transition-all shadow-sm"
            >
              <span>Shop Collection</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/products/cases"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-bg-surface hover:bg-bg-elevated text-text-primary border border-border-subtle font-medium rounded-xl text-sm transition-all"
            >
              Explore Cases
            </Link>
          </div>
        </div>

        {/* Product showcase */}
        <div className="order-1 lg:order-2 flex justify-center">
          <ErrorBoundary>
            <HeroProductShowcase />
          </ErrorBoundary>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-8 md:py-12">
        <ErrorBoundary>
          <FeaturedCategories />
        </ErrorBoundary>
      </section>

      {/* Trust Section */}
      <TrustSection />

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto w-full px-6 py-12 md:py-16 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h2 className="font-serif-display text-2xl sm:text-3xl text-text-primary">
              Featured Collection
            </h2>
            <p className="text-sm text-text-secondary mt-1">
              Our most popular premium accessories.
            </p>
          </div>
          <Link
            href="/products/all"
            className="text-sm font-medium text-accent-primary hover:text-accent-primary/80 flex items-center gap-1 transition-colors"
          >
            View all
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <ErrorBoundary>
          <ProductGrid products={featuredProducts} />
        </ErrorBoundary>
      </section>

      {/* New Arrivals */}
      <section className="max-w-7xl mx-auto w-full px-6 py-12 md:py-16 space-y-8 border-t border-border-subtle">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h2 className="font-serif-display text-2xl sm:text-3xl text-text-primary">
              Latest Drops
            </h2>
            <p className="text-sm text-text-secondary mt-1">
              Freshly designed and recently added.
            </p>
          </div>
          <span className="text-xs font-medium text-accent-secondary bg-accent-secondary/10 px-3 py-1 rounded-full">
            New In
          </span>
        </div>

        <ErrorBoundary>
          <ProductGrid products={newArrivals} />
        </ErrorBoundary>
      </section>

      {/* Customer Reviews */}
      <ReviewsSection />
    </div>
  );
}
