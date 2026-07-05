import db from '@/lib/db';
import ProductCard from '@/components/product/ProductCard';
import FilterSidebar from '@/components/product/FilterSidebar';
import Link from 'next/link';
import { Suspense } from 'react';

interface PageProps {
  params: Promise<{ category: string }>;
  searchParams: Promise<{
    device?: string;
    sort?: string;
    priceRange?: string;
    color?: string;
  }>;
}

const categoryMap: Record<string, string> = {
  cases: 'Phone Cases',
  chargers: 'GaN Chargers',
  cables: 'Braided Cables',
  audio: 'AirPods Shells',
  protectors: 'Screen Glass',
  accessories: 'MagSafe Accessories',
  all: 'All Hardware',
};

export async function generateMetadata({ params }: PageProps) {
  const resolvedParams = await params;
  const category = resolvedParams.category;
  const categoryName = categoryMap[category] || (category.charAt(0).toUpperCase() + category.slice(1));
  return {
    title: `${categoryName} Division`,
    description: `Browse Avenoir's engineered ${categoryName} collection. Designed for impact.`,
  };
}

export default async function CategoryPage({ params, searchParams }: PageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  const category = resolvedParams.category;
  const { device, sort, priceRange, color } = resolvedSearchParams;

  // Construct database filters
  const whereClause: any = {};

  // Category filter
  if (category !== 'all') {
    whereClause.category = category;
  }

  // Device compatibility filter
  if (device) {
    whereClause.compatibility = {
      contains: device,
    };
  }

  // Price range filter
  if (priceRange) {
    const [min, max] = priceRange.split('-').map(Number);
    whereClause.price = {
      gte: min,
      lte: max || 1000,
    };
  }

  // Color filter via variants relation
  if (color) {
    whereClause.variants = {
      some: {
        color: color,
      },
    };
  }

  // Sorting
  let orderByClause: any = { createdAt: 'desc' };
  if (sort === 'rating') {
    orderByClause = { rating: 'desc' };
  } else if (sort === 'price-asc') {
    orderByClause = { price: 'asc' };
  } else if (sort === 'price-desc') {
    orderByClause = { price: 'desc' };
  }

  // Fetch filtered items
  const products = await db.product.findMany({
    where: whereClause,
    orderBy: orderByClause,
  });

  const categories = [
    { label: 'All Hardware', slug: 'all' },
    { label: 'Phone Cases', slug: 'cases' },
    { label: 'GaN Chargers', slug: 'chargers' },
    { label: 'Braided Cables', slug: 'cables' },
    { label: 'AirPods Shells', slug: 'audio' },
    { label: 'Screen Glass', slug: 'protectors' },
    { label: 'MagSafe Accessories', slug: 'accessories' },
  ];

  const currentCategoryLabel = categoryMap[category] || 'Collection';

  return (
    <div className="min-h-screen bg-bg-base py-10 md:py-16">
      <div className="max-w-7xl mx-auto px-6 space-y-10">
        {/* Page title / breadcrumb */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs text-text-secondary font-mono">
            <Link href="/" className="hover:text-accent-primary transition-colors">HOME</Link>
            <span>/</span>
            <span className="text-text-primary uppercase">{currentCategoryLabel}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-display tracking-tight text-text-primary uppercase">
            {currentCategoryLabel} Division
          </h1>
        </div>

        {/* Category strips / links */}
        <div className="flex gap-2 pb-4 overflow-x-auto no-scrollbar border-b border-border-subtle">
          {categories.map((c) => (
            <Link
              key={c.slug}
              href={`/products/${c.slug}`}
              className={`px-4 py-2 rounded-full border text-xs font-semibold whitespace-nowrap transition-premium ${
                category === c.slug
                  ? 'bg-accent-primary text-white border-accent-primary'
                  : 'bg-bg-surface border-border-subtle text-text-secondary hover:text-text-primary hover:bg-bg-elevated'
              }`}
            >
              {c.label}
            </Link>
          ))}
        </div>

        {/* Main layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Sidebar */}
          <aside className="lg:col-span-3">
            <Suspense fallback={
              <div className="space-y-8 bg-bg-surface border border-border-subtle rounded-2xl p-6 shadow-sm h-72 animate-pulse flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="h-5 bg-bg-elevated rounded w-1/3" />
                  <div className="h-4 bg-bg-elevated rounded w-3/4" />
                </div>
                <div className="space-y-2">
                  <div className="h-8 bg-bg-elevated rounded w-full" />
                  <div className="h-8 bg-bg-elevated rounded w-full" />
                </div>
              </div>
            }>
              <FilterSidebar currentCategory={category} />
            </Suspense>
          </aside>

          {/* Product Grid */}
          <main className="lg:col-span-9 space-y-8">
            {products.length === 0 ? (
              <div className="border border-dashed border-border-subtle rounded-2xl p-16 flex flex-col items-center justify-center text-center space-y-4 bg-bg-surface">
                <p className="text-text-primary font-medium text-lg">No matching armory found</p>
                <p className="text-sm text-text-secondary max-w-sm">
                  We currently do not stock accessories matching those specific filter variables. Try resetting filters to browse alternative specifications.
                </p>
                <Link
                  href={`/products/${category}`}
                  className="px-5 py-2.5 border border-border-subtle hover:border-accent-primary hover:text-accent-primary rounded-xl text-xs font-bold transition-premium mt-2 text-text-primary bg-bg-surface hover:bg-bg-elevated"
                >
                  Clear Current Filters
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {products.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
