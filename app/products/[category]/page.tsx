import db from '@/lib/db';
import ProductCard from '@/components/product/ProductCard';
import FilterSidebar from '@/components/product/FilterSidebar';
import Link from 'next/link';

interface PageProps {
  params: Promise<{ category: string }>;
  searchParams: Promise<{
    device?: string;
    sort?: string;
    priceRange?: string;
    color?: string;
  }>;
}

export async function generateMetadata({ params }: PageProps) {
  const resolvedParams = await params;
  const categoryName = resolvedParams.category.charAt(0).toUpperCase() + resolvedParams.category.slice(1);
  return {
    title: `${categoryName} Division`,
    description: `Browse Avenoir's engineered ${resolvedParams.category} collection. Designed for impact.`,
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
    { label: 'All Catalog', slug: 'all' },
    { label: 'Cases', slug: 'cases' },
    { label: 'Chargers', slug: 'chargers' },
    { label: 'Cables', slug: 'cables' },
    { label: 'AirPods protection', slug: 'audio' },
    { label: 'Screen Glass', slug: 'protectors' },
    { label: 'Accessories', slug: 'accessories' },
  ];

  const currentCategoryLabel =
    categories.find((c) => c.slug === category)?.label || 'Collection';

  return (
    <div className="min-h-screen mesh-bg py-10 md:py-16">
      <div className="max-w-7xl mx-auto px-6 space-y-10">
        {/* Page title / breadcrumb */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs text-text-secondary font-mono">
            <Link href="/" className="hover:text-accent transition-colors">HOME</Link>
            <span>/</span>
            <span className="text-white uppercase">{category}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-display tracking-tight text-white uppercase">
            {currentCategoryLabel} Division
          </h1>
        </div>

        {/* Category strips / links */}
        <div className="flex gap-2 pb-4 overflow-x-auto no-scrollbar border-b border-white/5">
          {categories.map((c) => (
            <Link
              key={c.slug}
              href={`/products/${c.slug}`}
              className={`px-4 py-2 rounded-full border text-xs font-semibold whitespace-nowrap transition-premium ${
                category === c.slug
                  ? 'bg-accent text-bg-primary border-accent'
                  : 'bg-white/2 border-white/5 text-text-secondary hover:text-white hover:border-white/10'
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
            <FilterSidebar currentCategory={category} />
          </aside>

          {/* Product Grid */}
          <main className="lg:col-span-9 space-y-8">
            {products.length === 0 ? (
              <div className="border border-dashed border-white/10 rounded-2xl p-16 flex flex-col items-center justify-center text-center space-y-4">
                <p className="text-white font-medium text-lg">No matching armory found</p>
                <p className="text-sm text-text-secondary max-w-sm">
                  We currently do not stock accessories matching those specific filter variables. Try resetting filters to browse alternative specifications.
                </p>
                <Link
                  href={`/products/${category}`}
                  className="px-5 py-2.5 border border-white/10 hover:border-accent hover:text-accent rounded-xl text-xs font-bold transition-premium mt-2"
                >
                  Clear Current Filters
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
